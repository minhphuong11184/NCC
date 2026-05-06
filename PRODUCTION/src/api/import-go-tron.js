const express = require('express')
const router = express.Router()
const multer = require('multer')
const XLSX = require('xlsx')
const mssql = require('mssql')

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 } // 20MB
})

/* ---------- Helpers: parse các kiểu dữ liệu ---------- */
const toStr = v => {
    if (v === null || v === undefined) return null
    const s = String(v).trim()
    return s === '' ? null : s
}
const toFloat = v => {
    if (v === null || v === undefined || v === '') return null
    const n = parseFloat(String(v).replace(/,/g, '').trim())
    return isNaN(n) ? null : n
}
const toInt = v => {
    const n = toFloat(v)
    return n === null ? null : Math.round(n)
}
const parseThang = v => {
    if (v === null || v === undefined) return null
    const m = String(v).match(/(\d+)/)
    return m ? parseInt(m[1], 10) : null
}
/** Excel US locale: mm/dd/yy. Nếu a>12 thì dd/mm. */
const parseNgay = v => {
    if (v === null || v === undefined || v === '') return null
    if (v instanceof Date && !isNaN(v)) return v
    const s = String(v).trim()
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
    if (!m) return null
    let [, a, b, y] = m
    a = +a; b = +b; y = +y
    if (y < 100) y += 2000
    let dd, mm
    if (a > 12) { dd = a; mm = b }
    else if (b > 12) { mm = a; dd = b }
    else { mm = a; dd = b } // Excel US
    const d = new Date(Date.UTC(y, mm - 1, dd))
    return isNaN(d) ? null : d
}

/** Map cột Excel (index trong header) → field DB
 *  Theo file "Chia gỗ Tròn": header ở row 2, data từ row 3
 */
const COL_MAP = {
    TT: 0, Xuong_xe: 1, Chu_rung: 2, Xa: 3, Huyen: 4,
    Loai_go: 5, Lo_go: 6, Thang: 7, So_phieu: 8, Ngay_nhap: 9,
    Khoi_luong: 10, Xe: 11, So_chung_chi: 12, Hinh_thuc_xe: 13,
    Khoang: 14, Lo: 15, Dien_tich: 16, Nam: 17, Don_gia: 18,
    So_BKLS: 19, Go_xe_giao: 20
}

/** Các cột "theo hợp đồng" cần forward-fill khi Excel merge cells */
const FORWARD_FILL = [
    'Xuong_xe', 'Chu_rung', 'Xa', 'Huyen', 'Loai_go', 'Lo_go',
    'Thang', 'So_chung_chi', 'Hinh_thuc_xe',
    'Khoang', 'Lo', 'Dien_tich', 'Nam', 'Don_gia', 'So_BKLS'
]

/**
 * Parse 1 sheet thành mảng row sạch.
 * Row 0: trống, Row 1: title, Row 2: header, data từ row 3
 */
function parseSheet(ws) {
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false })
    const data = []
    const last = {}
    for (let i = 3; i < rows.length; i++) {
        const r = rows[i]
        if (!r) continue
        const soPhieu = toStr(r[COL_MAP.So_phieu])
        if (!soPhieu) continue
        const pick = (key, parser) => {
            let val = parser(r[COL_MAP[key]])
            if ((val === null || val === '') && FORWARD_FILL.includes(key)) {
                val = last[key] !== undefined ? last[key] : null
            }
            if (val !== null) last[key] = val
            return val
        }
        data.push({
            TT: toFloat(r[COL_MAP.TT]),
            Xuong_xe: pick('Xuong_xe', toStr),
            Chu_rung: pick('Chu_rung', toStr),
            Xa: pick('Xa', toStr),
            Huyen: pick('Huyen', toStr),
            Loai_go: pick('Loai_go', toStr),
            Lo_go: pick('Lo_go', toStr),
            Thang: pick('Thang', parseThang),
            So_phieu: soPhieu,
            Ngay_nhap: parseNgay(r[COL_MAP.Ngay_nhap]),
            Khoi_luong: toFloat(r[COL_MAP.Khoi_luong]),
            Xe: toStr(r[COL_MAP.Xe]),
            So_chung_chi: pick('So_chung_chi', toStr),
            Hinh_thuc_xe: pick('Hinh_thuc_xe', toStr),
            Khoang: pick('Khoang', toStr),
            Lo: pick('Lo', toStr),
            Dien_tich: pick('Dien_tich', toFloat),
            Nam: pick('Nam', toInt),
            Don_gia: pick('Don_gia', toFloat),
            So_BKLS: pick('So_BKLS', toStr),
            Go_xe_giao: toFloat(r[COL_MAP.Go_xe_giao])
        })
    }
    return data
}

/* =========================================================
 * POST /preview  — upload file, trả về list row + sheet names
 *   multipart: file=<xlsx>, sheet=<optional sheet name>
 * ========================================================= */
router.post('/preview', upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.api.sendFail({ number: 4900, message: 'Chưa chọn file' })
        const wb = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true })
        const sheetName = req.body.sheet || wb.SheetNames[0]
        const ws = wb.Sheets[sheetName]
        if (!ws) return res.api.sendFail({ number: 4931, message: `Không tìm thấy sheet "${sheetName}"` })
        const rows = parseSheet(ws)
        res.api.sendData({
            sheets: wb.SheetNames,
            sheet: sheetName,
            total: rows.length,
            rows
        })
    } catch (err) {
        console.error(err)
        res.api.sendFail({ number: 4931, message: String(err.message || err) })
    }
})

/* =========================================================
 * POST /import  — nhận JSON { rows, truncate } → bulk insert
 * ========================================================= */
router.post('/import', async (req, res) => {
    try {
        const rows = Array.isArray(req.body.rows) ? req.body.rows : []
        const truncate = !!req.body.truncate
        if (!rows.length) return res.api.sendFail({ number: 4900, message: 'Không có dữ liệu để import' })

        if (truncate) {
            await new mssql.Request().query('DELETE FROM [prod].[NHAP_GO_TRON]')
            await new mssql.Request().query("DBCC CHECKIDENT ('[prod].[NHAP_GO_TRON]', RESEED, 0)")
        }

        const table = new mssql.Table('[prod].[NHAP_GO_TRON]')
        table.create = false
        table.columns.add('TT', mssql.Float, { nullable: true })
        table.columns.add('Xuong_xe', mssql.NVarChar(100), { nullable: true })
        table.columns.add('Chu_rung', mssql.NVarChar(100), { nullable: true })
        table.columns.add('Xa', mssql.NVarChar(100), { nullable: true })
        table.columns.add('Huyen', mssql.NVarChar(255), { nullable: true })
        table.columns.add('Loai_go', mssql.NVarChar(100), { nullable: true })
        table.columns.add('Lo_go', mssql.NVarChar(100), { nullable: true })
        table.columns.add('Thang', mssql.Int, { nullable: true })
        table.columns.add('So_phieu', mssql.NVarChar(100), { nullable: true })
        table.columns.add('Ngay_nhap', mssql.DateTime, { nullable: true })
        table.columns.add('Khoi_luong', mssql.Float, { nullable: true })
        table.columns.add('Xe', mssql.NVarChar(50), { nullable: true })
        table.columns.add('So_chung_chi', mssql.NVarChar(255), { nullable: true })
        table.columns.add('Hinh_thuc_xe', mssql.NVarChar(50), { nullable: true })
        table.columns.add('Khoang', mssql.NVarChar(50), { nullable: true })
        table.columns.add('Lo', mssql.NVarChar(50), { nullable: true })
        table.columns.add('Dien_tich', mssql.Float, { nullable: true })
        table.columns.add('Nam', mssql.Int, { nullable: true })
        table.columns.add('Don_gia', mssql.Float, { nullable: true })
        table.columns.add('So_BKLS', mssql.NVarChar(100), { nullable: true })
        table.columns.add('Go_xe_giao', mssql.Float, { nullable: true })

        rows.forEach(d => table.rows.add(
            d.TT, d.Xuong_xe, d.Chu_rung, d.Xa, d.Huyen, d.Loai_go, d.Lo_go,
            d.Thang, d.So_phieu,
            d.Ngay_nhap ? new Date(d.Ngay_nhap) : null,
            d.Khoi_luong, d.Xe, d.So_chung_chi, d.Hinh_thuc_xe,
            d.Khoang, d.Lo, d.Dien_tich, d.Nam, d.Don_gia,
            d.So_BKLS, d.Go_xe_giao
        ))

        const result = await new mssql.Request().bulk(table)
        res.api.sendData({ inserted: result.rowsAffected, truncated: truncate })
    } catch (err) {
        console.error(err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

module.exports = router
