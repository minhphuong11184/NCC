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

        // 1. Lấy TOÀN BỘ lượt quẹt (không gộp) để có thể tách theo từng ca
        const punchResult = await request.query(`
            SELECT
                L.userId,
                L.punchTime,
                CAST(L.punchTime AS DATE) AS workDate,
                A.LAST_NAME AS fullName,
                A.ATTENDANCE_CODE AS attendanceCode,
                A.ID AS accountId
            FROM prod.CHAMCONG_LOGS L
            LEFT JOIN base.ACCOUNT A ON A.ATTENDANCE_CODE = L.userId
            ${where}
            ORDER BY L.userId, L.punchTime ASC
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

        // ── Helpers ───────────────────────────────────────────────────────
        // Phút trong ngày (dùng UTC vì DB lưu giờ local dạng UTC)
        const minuteOfDay = dt => {
            const d = new Date(dt)
            return d.getUTCHours() * 60 + d.getUTCMinutes()
        }
        // Khoảng cách (phút) từ 1 lượt quẹt tới khung giờ [giovao, giora] của ca
        // (0 nếu nằm trong khung; xử lý cả ca qua đêm)
        const caDistance = (min, ca) => {
            let lo = ca.giovao, hi = ca.giora
            if (hi < lo) hi += 1440 // ca qua đêm
            let best = Infinity
            for (const m of [min, min + 1440]) {
                const d = m < lo ? lo - m : (m > hi ? m - hi : 0)
                if (d < best) best = d
            }
            return best
        }
        // Phần giao nhau (phút) giữa 2 khoảng [aS,aE] và [bS,bE]
        const overlap = (aS, aE, bS, bE) => Math.max(0, Math.min(aE, bE) - Math.max(aS, bS))
        // Tính các trường dẫn xuất (giờ LV, làm thêm, trễ...) cho 1 ca
        const buildRow = (base, ca, checkIn, checkOut, punchCount) => {
            if (!ca) {
                const ci = minuteOfDay(checkIn)
                let gross = 0
                if (checkOut) { let co = minuteOfDay(checkOut); if (co < ci) co += 1440; gross = co - ci }
                return {
                    ...base, checkIn, checkOut, punchCount, workMinutes: 0,
                    workMinutesGross: gross, lamThem: 0, mealtime: 0, tre_phut: 0,
                    ca_id: null, ca_ma: null, ca_ten: null, ca_giovao: null, ca_giora: null
                }
            }
            const checkInMin = minuteOfDay(checkIn)
            const checkOutMin = checkOut ? minuteOfDay(checkOut) : null
            const tre_phut = Math.max(0, checkInMin - ca.giovao)

            let workMinutes = 0, lamThem = 0, mealtime = 0, workMinutesGross = 0
            if (checkOutMin !== null) {
                let caGioRa = ca.giora
                let co = checkOutMin
                if (caGioRa < ca.giovao) caGioRa += 1440 // ca qua đêm
                if (co < checkInMin) co += 1440
                workMinutesGross = co - checkInMin

                // Giờ làm chính thức = phần nằm trong khung ca [giờ vào, giờ ra]
                // → đến sớm trước giờ vào KHÔNG được cộng; về muộn cắt tại giờ ra ca.
                const regStart = Math.max(checkInMin, ca.giovao)
                const regEnd = Math.min(co, caGioRa)
                const regular = Math.max(0, regEnd - regStart)

                // Trừ giờ nghỉ: theo khung nghỉ [gionghi, gionghi1] nếu có,
                // nếu không có thì trừ mealtime khi làm tới hết ca.
                if (ca.gionghi != null && ca.gionghi1 != null) {
                    mealtime = overlap(regStart, regEnd, ca.gionghi, ca.gionghi1)
                } else if (ca.mealtime && regEnd >= caGioRa) {
                    mealtime = Math.min(ca.mealtime, regular)
                }
                workMinutes = Math.max(0, regular - mealtime)

                // Làm thêm = phần GIỜ RA vượt quá giờ ra ca trên 30 phút
                // (chỉ dựa vào giờ ra, không liên quan giờ vào).
                const vuotGioRa = Math.max(0, co - caGioRa)
                if (vuotGioRa > 30) lamThem = vuotGioRa
            }

            return {
                ...base, checkIn, checkOut, punchCount,
                workMinutes,
                workMinutesGross,
                lamThem,
                mealtime,
                ca_id: ca.ca_id,
                ca_ma: ca.ma,
                ca_ten: ca.ten,
                ca_giovao: ca.giovao,
                ca_giora: ca.giora,
                ca_thoigianlamviec: ca.thoigianlamviec,
                tre_phut,
            }
        }

        // Gộp các ca trong cùng 1 ngày thành 1 DÒNG (ca1_*, ca2_*) + cộng dồn tổng
        const combineRow = (base, segs) => {
            segs = segs.filter(Boolean)
            const sum = k => segs.reduce((s, x) => s + (x[k] || 0), 0)
            const flat = (seg, i) => seg ? {
                [`ca${i}_ma`]:       seg.ca_ma,
                [`ca${i}_ten`]:      seg.ca_ten,
                [`ca${i}_giovao`]:   seg.ca_giovao,
                [`ca${i}_giora`]:    seg.ca_giora,
                [`ca${i}_checkIn`]:  seg.checkIn,
                [`ca${i}_checkOut`]: seg.workMinutesGross >= 5 ? seg.checkOut : null,
                [`ca${i}_tre`]:      seg.tre_phut || 0,
                [`ca${i}_workMinutes`]: seg.workMinutes || 0,
            } : {}
            const last = segs[segs.length - 1]
            return {
                ...base,
                punchCount:       sum('punchCount'),
                workMinutes:      sum('workMinutes'),
                workMinutesGross: sum('workMinutesGross'),
                lamThem:          sum('lamThem'),
                mealtime:         sum('mealtime'),
                tre_phut:         sum('tre_phut'),
                ca_ma:  segs.map(s => s.ca_ma).filter(Boolean).join(', ') || null,
                ca_ten: segs.map(s => s.ca_ten).filter(Boolean).join(', ') || null,
                checkIn:  segs.length ? segs[0].checkIn : null,
                checkOut: last ? (last.workMinutesGross >= 5 ? last.checkOut : null) : null,
                shiftCount: segs.length,
                ...flat(segs[0], 1),
                ...flat(segs[1], 2),
            }
        }

        // 4. Gộp lượt quẹt theo (user + ngày)
        const groups = new Map()
        for (const p of punchResult.recordset) {
            const wd = new Date(p.workDate)
            const dateKey = `${wd.getUTCFullYear()}-${wd.getUTCMonth() + 1}-${wd.getUTCDate()}`
            const key = p.userId + '|' + dateKey
            let g = groups.get(key)
            if (!g) {
                g = {
                    userId: p.userId, workDate: p.workDate, fullName: p.fullName,
                    attendanceCode: p.attendanceCode, accountId: p.accountId, punches: []
                }
                groups.set(key, g)
            }
            g.punches.push(p.punchTime)
        }

        // 5. Với mỗi nhóm: tách lượt quẹt theo ca đã gán
        const result = []
        for (const g of groups.values()) {
            const base = {
                userId: g.userId, workDate: g.workDate,
                fullName: g.fullName, attendanceCode: g.attendanceCode,
            }
            const punches = g.punches.slice().sort((a, b) => new Date(a) - new Date(b))
            const userCas = caByAccount[g.accountId]

            if (userCas && userCas.length > 1) {
                // Người làm NHIỀU ca → phân mỗi lượt quẹt vào ca gần nhất
                const buckets = new Map() // ca_id → { ca, pts[] }
                for (const pt of punches) {
                    const min = minuteOfDay(pt)
                    let bestCa = null, bestDiff = Infinity
                    for (const ca of userCas) {
                        const d = caDistance(min, ca)
                        if (d < bestDiff) { bestDiff = d; bestCa = ca }
                    }
                    if (!buckets.has(bestCa.ca_id)) buckets.set(bestCa.ca_id, { ca: bestCa, pts: [] })
                    buckets.get(bestCa.ca_id).pts.push(pt)
                }
                // Mỗi ca có quẹt → 1 phân đoạn (giờ vào = quẹt đầu, giờ ra = quẹt cuối)
                const segs = []
                for (const { ca, pts } of buckets.values()) {
                    const checkOut = pts.length > 1 ? pts[pts.length - 1] : null
                    segs.push(buildRow(base, ca, pts[0], checkOut, pts.length))
                }
                segs.sort((a, b) => (a.ca_giovao || 0) - (b.ca_giovao || 0))
                // Gộp tất cả ca trong ngày thành 1 dòng (ca1_*, ca2_*)
                const row = combineRow(base, segs)
                // Người đi 2 ca: làm tròn XUỐNG bội số 30 cho tổng phút làm thêm
                // (vd 36→30, 59→30, 60→60, 65→60, 91→90)
                row.lamThem = Math.floor((row.lamThem || 0) / 30) * 30
                result.push(row)
            } else {
                // 0 hoặc 1 ca gán → 1 dòng/ngày, khớp ca gần giờ vào nhất (như cũ)
                const checkIn = punches[0]
                const checkOut = punches.length > 1 ? punches[punches.length - 1] : null
                const danhSachCa = (userCas && userCas.length) ? userCas : allCas
                const checkInMin = minuteOfDay(checkIn)
                let bestCa = null, bestDiff = Infinity
                for (const ca of danhSachCa) {
                    let diff = Math.abs(checkInMin - ca.giovao)
                    if (diff > 720) diff = 1440 - diff // ca qua đêm
                    if (diff < bestDiff) { bestDiff = diff; bestCa = ca }
                }
                // Chỉ gán ca nếu checkIn cách giovao không quá 90 phút
                const seg = buildRow(base, (bestCa && bestDiff <= 90) ? bestCa : null,
                    checkIn, checkOut, punches.length)
                result.push(combineRow(base, [seg]))
            }
        }

        // Sắp xếp: ngày giảm dần, trong ngày theo giờ vào tăng dần
        result.sort((a, b) => {
            const diff = new Date(b.workDate) - new Date(a.workDate)
            if (diff !== 0) return diff
            return new Date(a.checkIn) - new Date(b.checkIn)
        })

        res.api.sendData(result)
    } catch (err) {
        console.error(err)
        res.api.sendFail(err.message, 500)
    }
})

module.exports = router
