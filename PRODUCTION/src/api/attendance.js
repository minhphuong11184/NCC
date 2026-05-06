const express = require('express')
const router  = express.Router()
const mssql   = require('mssql')
const { syncMachine, syncAll, syncMachineByDateRange } = require('../services/zkteco.service')

// ── Danh sách máy chấm công ──────────────────────────────────────────────────
router.get('/machines', async (req, res) => {
    try {
        const result = await new mssql.Request()
            .query(`SELECT id, name, ip, port, factoryId, active, lastSync
                    FROM prod.CHAMCONG_MACHINES ORDER BY factoryId, name`)
        res.api.sendData(result.recordset)
    } catch (err) {
        res.api.sendFail(err.message, 500)
    }
})

// ── Thêm / sửa máy chấm công ─────────────────────────────────────────────────
router.post('/machines', async (req, res) => {
    const { name, ip, port, factoryId } = req.body
    if (!ip) return res.api.sendFail('Thiếu IP máy chấm công', 400)
    try {
        await new mssql.Request()
            .input('name',      name || '')
            .input('ip',        ip)
            .input('port',      port || 4370)
            .input('factoryId', factoryId || null)
            .query(`INSERT INTO prod.CHAMCONG_MACHINES (name, ip, port, factoryId)
                    VALUES (@name, @ip, @port, @factoryId)`)
        res.api.sendData({ message: 'Thêm máy thành công' })
    } catch (err) {
        res.api.sendFail(err.message, 500)
    }
})

router.put('/machines/:id', async (req, res) => {
    const { name, ip, port, factoryId, active } = req.body
    try {
        await new mssql.Request()
            .input('id',        req.params.id)
            .input('name',      name)
            .input('ip',        ip)
            .input('port',      port || 4370)
            .input('factoryId', factoryId || null)
            .input('active',    active ?? 1)
            .query(`UPDATE prod.CHAMCONG_MACHINES
                    SET name=@name, ip=@ip, port=@port, factoryId=@factoryId, active=@active
                    WHERE id=@id`)
        res.api.sendData({ message: 'Cập nhật thành công' })
    } catch (err) {
        res.api.sendFail(err.message, 500)
    }
})

// ── Test kết nối ─────────────────────────────────────────────────────────────
// POST /attendance/test/:id
router.post('/test/:id', async (req, res) => {
    try {
        const result = await new mssql.Request()
            .input('id', req.params.id)
            .query(`SELECT id, name, ip, port FROM prod.CHAMCONG_MACHINES WHERE id=@id`)
        const machine = result.recordset[0]
        if (!machine) return res.api.sendFail('Không tìm thấy máy', 404)

        const ZKLib = require('node-zklib')
        const zk = new ZKLib(machine.ip, machine.port || 4370, 5000, 4000)
        try {
            await zk.createSocket()
            const info = await zk.getInfo()
            await zk.disconnect()
            res.api.sendData({
                connected: true,
                ip: machine.ip,
                port: machine.port,
                serialNumber: info?.serialNumber || '',
                firmwareVersion: info?.firmwareVersion || ''
            })
        } catch (connErr) {
            try { await zk.disconnect() } catch (_) {}
            res.api.sendData({ connected: false, ip: machine.ip, error: connErr.message })
        }
    } catch (err) {
        res.api.sendFail(err.message, 500)
    }
})

// ── Debug: kéo thử và xem raw data ──────────────────────────────────────────
// POST /attendance/debug/:id
router.post('/debug/:id', async (req, res) => {
    try {
        const result = await new mssql.Request()
            .input('id', req.params.id)
            .query(`SELECT id, name, ip, port FROM prod.CHAMCONG_MACHINES WHERE id=@id`)
        const machine = result.recordset[0]
        if (!machine) return res.api.sendFail('Không tìm thấy máy', 404)

        const ZKLib = require('node-zklib')
        const zk = new ZKLib(machine.ip, machine.port || 4370, 60000, 4000)
        let info = null, attendance = null
        try {
            await zk.createSocket()
            info = await zk.getInfo()
            // Bắt lỗi timeout riêng để vẫn lấy được data nếu có
            try {
                attendance = await zk.getAttendances()
            } catch (attErr) {
                // node-zklib đôi khi throw "TIME OUT !! X PACKETS REMAIN" thay vì resolve
                // Lấy data từ error object nếu có
                attendance = { data: attErr?.data || [], err: attErr }
            }
            try { await zk.disconnect() } catch (_) {}

            const records = attendance?.data || []
            const dates = records.map(r => r.recordTime).filter(Boolean).sort()
            res.api.sendData({
                connectionType:     zk.connectionType,
                logCountsOnMachine: info?.logCounts  ?? '?',
                logCapacity:        info?.logCapacity ?? '?',
                recordCount:        records.length,
                missingRecords:     typeof info?.logCounts === 'number'
                                        ? info.logCounts - records.length : '?',
                hasError:           !!attendance?.err,
                error:              attendance?.err ? String(attendance.err) : null,
                oldestRecord:       dates[0]             || null,
                newestRecord:       dates[dates.length-1] || null,
                sample:             records.slice(0, 3)
            })
        } catch (connErr) {
            try { await zk.disconnect() } catch (_) {}
            res.api.sendData({
                connectionType: zk.connectionType,
                recordCount:    0,
                error:          connErr.message,
                stack:          connErr.stack
            })
        }
    } catch (err) {
        res.api.sendFail(err.message, 500)
    }
})

// ── Đồng bộ thủ công ─────────────────────────────────────────────────────────
// POST /attendance/sync         → sync tất cả máy
// POST /attendance/sync/:id     → sync 1 máy cụ thể
router.post('/sync', async (req, res) => {
    try {
        const results = await syncAll()
        res.api.sendData(results)
    } catch (err) {
        res.api.sendFail(err.message, 500)
    }
})

router.post('/sync/:id', async (req, res) => {
    try {
        const result = await new mssql.Request()
            .input('id', req.params.id)
            .query(`SELECT id, name, ip, port FROM prod.CHAMCONG_MACHINES WHERE id=@id`)
        const machine = result.recordset[0]
        if (!machine) return res.api.sendFail('Không tìm thấy máy', 404)

        const r = await syncMachine(machine)
        res.api.sendData({ machine: machine.name, ...r })
    } catch (err) {
        res.api.sendFail(err.message, 500)
    }
})

// ── Đồng bộ theo khoảng ngày ─────────────────────────────────────────────────
// POST /attendance/sync-range/:id   body: { fromDate, toDate }  (YYYY-MM-DD)
router.post('/sync-range/:id', async (req, res) => {
    const { fromDate, toDate } = req.body
    if (!fromDate || !toDate) return res.api.sendFail('Thiếu fromDate hoặc toDate', 400)
    try {
        const result = await new mssql.Request()
            .input('id', req.params.id)
            .query(`SELECT id, name, ip, port FROM prod.CHAMCONG_MACHINES WHERE id=@id`)
        const machine = result.recordset[0]
        if (!machine) return res.api.sendFail('Không tìm thấy máy', 404)

        const r = await syncMachineByDateRange(machine, fromDate, toDate)
        res.api.sendData({ machine: machine.name, fromDate, toDate, ...r })
    } catch (err) {
        res.api.sendFail(err.message, 500)
    }
})

// ── Xem log chấm công ────────────────────────────────────────────────────────
// GET /attendance/logs?factoryId=&date=2024-03-01&userId=
router.get('/logs', async (req, res) => {
    const { factoryId, date, userId, machineId } = req.query
    try {
        const request = new mssql.Request()
        let where = 'WHERE 1=1'

        if (machineId) {
            request.input('machineId', machineId)
            where += ' AND L.machineId = @machineId'
        }
        if (factoryId) {
            request.input('factoryId', factoryId)
            where += ' AND M.factoryId = @factoryId'
        }
        if (date) {
            request.input('date', date)
            where += ' AND CAST(L.punchTime AS DATE) = @date'
        }
        if (userId) {
            request.input('userId', userId)
            where += ' AND L.userId = @userId'
        }

        const result = await request.query(`
            SELECT TOP 5000
                L.id, L.userId, L.punchTime, L.punchType,
                M.name AS machineName, M.factoryId
            FROM prod.CHAMCONG_LOGS L
            JOIN prod.CHAMCONG_MACHINES M ON M.id = L.machineId
            ${where}
            ORDER BY L.punchTime DESC
        `)
        res.api.sendData(result.recordset)
    } catch (err) {
        res.api.sendFail(err.message, 500)
    }
})

// ── Bảng tổng hợp vào/ra theo ngày ──────────────────────────────────────────
// GET /attendance/summary?date=2026-04-14&fromDate=&toDate=&userId=&machineId=
router.get('/summary', async (req, res) => {
    const { date, fromDate, toDate, userId, machineId } = req.query
    try {
        const request = new mssql.Request()
        let where = 'WHERE 1=1'

        if (date) {
            request.input('date', date)
            where += ' AND CAST(L.punchTime AS DATE) = @date'
        } else {
            if (fromDate) {
                request.input('fromDate', fromDate)
                where += ' AND CAST(L.punchTime AS DATE) >= @fromDate'
            }
            if (toDate) {
                request.input('toDate', toDate)
                where += ' AND CAST(L.punchTime AS DATE) <= @toDate'
            }
        }
        if (userId) {
            request.input('userId', userId)
            where += ' AND L.userId = @userId'
        }
        if (machineId) {
            request.input('machineId', machineId)
            where += ' AND L.machineId = @machineId'
        }

        const result = await request.query(`
            SELECT
                T.userId, T.workDate, T.checkIn,
                CASE WHEN T.workMinutes >= 5 THEN T.checkOut ELSE NULL END AS checkOut,
                T.punchCount,
                CASE WHEN T.workMinutes >= 5 THEN T.workMinutes ELSE 0 END AS workMinutes,
                T.fullName, T.attendanceCode
            FROM (
                SELECT
                    L.userId,
                    CAST(L.punchTime AS DATE) AS workDate,
                    MIN(L.punchTime) AS checkIn,
                    MAX(L.punchTime) AS checkOut,
                    COUNT(*) AS punchCount,
                    DATEDIFF(MINUTE, MIN(L.punchTime), MAX(L.punchTime)) AS workMinutes,
                    A.LAST_NAME AS fullName,
                    A.ATTENDANCE_CODE AS attendanceCode
                FROM prod.CHAMCONG_LOGS L
                LEFT JOIN base.ACCOUNT A ON A.ATTENDANCE_CODE = L.userId
                ${where}
                GROUP BY L.userId, CAST(L.punchTime AS DATE), A.LAST_NAME, A.ATTENDANCE_CODE
            ) T
            ORDER BY T.workDate DESC, T.checkIn ASC
        `)
        res.api.sendData(result.recordset)
    } catch (err) {
        res.api.sendFail(err.message, 500)
    }
})

// ── Tự động nhận ca từ giờ chấm công ──────────────────────────────────────
// GET /attendance/auto-ca?fromDate=2026-04-01&toDate=2026-04-20&userId=
// Logic: dựa vào checkIn, so sánh với nhóm ca đã gán cho user, chọn ca gần nhất
router.get('/auto-ca', async (req, res) => {
    const { fromDate, toDate, userId } = req.query
    try {
        const request = new mssql.Request()
        let where = 'WHERE 1=1'
        if (fromDate) { request.input('fromDate', fromDate); where += ' AND CAST(L.punchTime AS DATE) >= @fromDate' }
        if (toDate) { request.input('toDate', toDate); where += ' AND CAST(L.punchTime AS DATE) <= @toDate' }
        if (userId) { request.input('userId', userId); where += ' AND L.userId = @userId' }

        // 1. Lấy summary chấm công (checkIn, checkOut theo ngày)
        const summaryResult = await request.query(`
            SELECT
                L.userId,
                CAST(L.punchTime AS DATE) AS workDate,
                MIN(L.punchTime) AS checkIn,
                MAX(L.punchTime) AS checkOut,
                COUNT(*) AS punchCount,
                DATEDIFF(MINUTE, MIN(L.punchTime), MAX(L.punchTime)) AS workMinutes,
                A.LAST_NAME AS fullName,
                A.ATTENDANCE_CODE AS attendanceCode,
                A.ID AS accountId
            FROM prod.CHAMCONG_LOGS L
            LEFT JOIN base.ACCOUNT A ON A.ATTENDANCE_CODE = L.userId
            ${where}
            GROUP BY L.userId, CAST(L.punchTime AS DATE), A.LAST_NAME, A.ATTENDANCE_CODE, A.ID
            ORDER BY CAST(L.punchTime AS DATE) DESC, MIN(L.punchTime) ASC
        `)

        // 2. Lấy tất cả ca làm việc
        const caResult = await new mssql.Request().query(`
            SELECT id AS ca_id, ma, ten, giovao, giora,
                   gionghi, gionghi1, mealtime, thoigianlamviec
            FROM prod.CA_LAM_VIEC
            ORDER BY giovao
        `)
        const allCas = caResult.recordset

        // 3. Lấy nhóm ca đã gán cho từng user
        const accCaResult = await new mssql.Request().query(`
            SELECT AC.account_id, C.id AS ca_id, C.ma, C.ten, C.giovao, C.giora,
                   C.gionghi, C.gionghi1, C.mealtime, C.thoigianlamviec
            FROM prod.ACCOUNT_CA AC
            INNER JOIN prod.CA_LAM_VIEC C ON C.id = AC.ca_id
        `)
        const caByAccount = {}
        accCaResult.recordset.forEach(r => {
            if (!caByAccount[r.account_id]) caByAccount[r.account_id] = []
            caByAccount[r.account_id].push(r)
        })

        // 4. Với mỗi ngày/user: ưu tiên nhóm ca đã gán, nếu không có → dùng tất cả ca
        const result = summaryResult.recordset.map(row => {
            if (!row.checkIn) {
                return { ...row, ca_id: null, ca_ma: null, ca_ten: null, ca_giovao: null, ca_giora: null }
            }

            const userCas = caByAccount[row.accountId]
            const danhSachCa = (userCas && userCas.length) ? userCas : allCas

            // checkIn phút trong ngày (dùng UTC vì DB lưu giờ local dạng UTC)
            const checkInDate = new Date(row.checkIn)
            const checkInMin = checkInDate.getUTCHours() * 60 + checkInDate.getUTCMinutes()

            // Tìm ca có giovao gần checkIn nhất
            let bestCa = null
            let bestDiff = Infinity
            for (const ca of danhSachCa) {
                let diff = Math.abs(checkInMin - ca.giovao)
                // Xử lý ca qua ngày (vd: ca 22:00, checkIn 22:15 → diff = 15)
                if (diff > 720) diff = 1440 - diff
                if (diff < bestDiff) {
                    bestDiff = diff
                    bestCa = ca
                }
            }

            // Chỉ gán ca nếu checkIn cách giovao không quá 90 phút
            if (bestCa && bestDiff <= 90) {
                const mealtime = bestCa.mealtime || 0
                const checkOutDate = row.checkOut ? new Date(row.checkOut) : null
                const checkOutMin = checkOutDate ? checkOutDate.getUTCHours() * 60 + checkOutDate.getUTCMinutes() : null

                // Tính giờ ra ca (xử lý ca qua ngày)
                let caGioRa = bestCa.giora
                if (caGioRa < bestCa.giovao) caGioRa += 1440 // ca qua ngày

                let checkOutAdj = checkOutMin
                if (checkOutAdj !== null && checkOutAdj < bestCa.giovao) checkOutAdj += 1440

                // Tính phần vượt quá giờ ra ca
                const vuotGioRa = (checkOutAdj !== null && row.workMinutes >= 5)
                    ? Math.max(0, checkOutAdj - caGioRa)
                    : 0

                let lamThem = 0
                let workMinutesNet = 0

                if (row.workMinutes >= 5) {
                    if (vuotGioRa > 30) {
                        // Quá 30 phút → tính làm thêm
                        lamThem = vuotGioRa
                        workMinutesNet = Math.max(0, (row.workMinutes || 0) - mealtime - lamThem)
                    } else {
                        // Dưới 30 phút → không tính làm thêm, giờ LV tính đến giờ ra ca
                        const workToCaEnd = Math.max(0, caGioRa - checkInMin - mealtime)
                        workMinutesNet = Math.min(row.workMinutes - mealtime, workToCaEnd)
                        workMinutesNet = Math.max(0, workMinutesNet)
                    }
                }

                return {
                    ...row,
                    workMinutes: workMinutesNet,
                    workMinutesGross: row.workMinutes,
                    lamThem: lamThem,
                    mealtime: mealtime,
                    ca_id: bestCa.ca_id,
                    ca_ma: bestCa.ma,
                    ca_ten: bestCa.ten,
                    ca_giovao: bestCa.giovao,
                    ca_giora: bestCa.giora,
                    ca_thoigianlamviec: bestCa.thoigianlamviec,
                    tre_phut: Math.max(0, checkInMin - bestCa.giovao),
                }
            }

            return { ...row, ca_id: null, ca_ma: null, ca_ten: null, ca_giovao: null, ca_giora: null }
        })

        res.api.sendData(result)
    } catch (err) {
        console.error(err)
        res.api.sendFail(err.message, 500)
    }
})

module.exports = router
