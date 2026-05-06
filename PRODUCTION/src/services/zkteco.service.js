/**
 * ZKTeco Attendance Pull Service
 * Kéo dữ liệu chấm công từ máy ZKTeco về qua TCP/IP (port 4370)
 */

const ZKLib = require('node-zklib')
const mssql  = require('mssql')

/**
 * Chuyển Date (local time từ máy ZKTeco) sang Date mà mssql sẽ lưu đúng giờ VN vào SQL Server.
 */
function toSQLDateTime(punchTime) {
    const dt = punchTime instanceof Date
        ? punchTime
        : new Date(String(punchTime).replace(' ', 'T'))
    if (isNaN(dt.getTime())) return dt
    return new Date(Date.UTC(
        dt.getFullYear(), dt.getMonth(), dt.getDate(),
        dt.getHours(), dt.getMinutes(), dt.getSeconds()
    ))
}

function toDateStr(log) {
    const raw = log.recordTime || log.timestamp
    const t = raw instanceof Date ? raw : new Date(String(raw).replace(' ', 'T'))
    if (isNaN(t.getTime())) return null
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`
}

async function _readAttendances(machine) {
    const zk = new ZKLib(machine.ip, machine.port || 4370, 120000, 4000)
    try {
        await zk.createSocket()
        try { await zk.disableDevice() } catch (_) {}

        let attendance
        try {
            attendance = await zk.getAttendances()
        } catch (attErr) {
            // node-zklib đôi khi throw timeout nhưng vẫn có data
            attendance = { data: attErr?.data || [], err: attErr }
        }

        try { await zk.enableDevice() } catch (_) {}
        try { await zk.disconnect() } catch (_) {}

        const logs = attendance?.data || []
        console.log(`[zkteco] ${machine.name}: đọc được ${logs.length} bản ghi${attendance?.err ? ' (có lỗi: ' + String(attendance.err).substring(0, 80) + ')' : ''}`)
        return logs
    } catch (err) {
        try { const zk2 = new ZKLib(machine.ip, machine.port || 4370, 5000, 4000); await zk2.disconnect() } catch (_) {}
        throw err
    }
}

async function _insertLogs(machine, logs) {
    let inserted = 0
    for (const log of logs) {
        const userId    = log.deviceUserId || log.id
        const punchTime = log.recordTime   || log.timestamp
        if (!userId || !punchTime) continue
        try {
            const r = await new mssql.Request()
                .input('machineId',  machine.id)
                .input('userId',     String(userId))
                .input('punchTime',  toSQLDateTime(punchTime))
                .input('punchType',  log.type ?? 0)
                .query(`
                    IF NOT EXISTS (
                        SELECT 1 FROM prod.CHAMCONG_LOGS
                        WHERE machineId=@machineId AND userId=@userId AND punchTime=@punchTime
                    )
                    INSERT INTO prod.CHAMCONG_LOGS (machineId, userId, punchTime, punchType)
                    VALUES (@machineId, @userId, @punchTime, @punchType)
                `)
            if (r.rowsAffected[0] > 0) inserted++
        } catch (_) {}
    }
    return inserted
}

async function _updateLastSync(machineId) {
    try {
        await new mssql.Request()
            .input('id', machineId)
            .query(`UPDATE prod.CHAMCONG_MACHINES SET lastSync = GETDATE() WHERE id = @id`)
    } catch (_) {}
}

/**
 * Kéo dữ liệu từ 1 máy — insert tất cả bản ghi đọc được (bỏ qua trùng)
 */
async function syncMachine(machine) {
    try {
        const logs = await _readAttendances(machine)

        if (!logs.length) {
            await _updateLastSync(machine.id)
            return { success: true, inserted: 0, total: 0 }
        }

        const inserted = await _insertLogs(machine, logs)
        await _updateLastSync(machine.id)
        return { success: true, inserted, total: logs.length }

    } catch (err) {
        return { success: false, inserted: 0, total: 0, error: err.message }
    }
}

/**
 * Kéo dữ liệu từ tất cả máy đang active
 */
async function syncAll() {
    let machines = []
    try {
        const result = await new mssql.Request()
            .query(`SELECT id, name, ip, port FROM prod.CHAMCONG_MACHINES WHERE active = 1`)
        machines = result.recordset
    } catch (err) {
        console.error('[zkteco] Lỗi lấy danh sách máy:', err.message)
        return []
    }

    const results = []
    for (const m of machines) {
        console.log(`[zkteco] Đang đồng bộ: ${m.name} (${m.ip})`)
        const r = await syncMachine(m)
        results.push({ machine: m.name, ip: m.ip, ...r })
        console.log(`[zkteco] ${m.name}: inserted=${r.inserted}/${r.total}${r.error ? ' ERR=' + r.error : ''}`)
    }
    return results
}

/**
 * Kéo dữ liệu từ 1 máy theo khoảng ngày
 */
async function syncMachineByDateRange(machine, fromDate, toDate) {
    try {
        const logs = await _readAttendances(machine)

        if (!logs.length) {
            await _updateLastSync(machine.id)
            return { success: true, inserted: 0, total: 0, filtered: 0 }
        }

        const allDates = logs.map(toDateStr).filter(Boolean).sort()
        const machineMinDate = allDates[0] || null
        const machineMaxDate = allDates[allDates.length - 1] || null

        const filtered = logs.filter(log => {
            const ds = toDateStr(log)
            if (!ds) return false
            if (fromDate && ds < fromDate) return false
            if (toDate   && ds > toDate)   return false
            return true
        })

        const inserted = await _insertLogs(machine, filtered)
        await _updateLastSync(machine.id)
        return {
            success: true, inserted, total: logs.length, filtered: filtered.length,
            machineMinDate, machineMaxDate
        }

    } catch (err) {
        return { success: false, inserted: 0, total: 0, filtered: 0, error: err.message }
    }
}

module.exports = { syncMachine, syncAll, syncMachineByDateRange }
