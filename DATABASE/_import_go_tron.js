/**
 * Import sheet "TH GỖ TRÒN T10" (Phieu_BKLS_PNK BKTM MẪU.xlsx)
 * → bảng [prod].[NHAP_GO_TRON] trong TanTrao2026_DB
 *
 * Usage: node _import_go_tron.js
 */
const path = require('path')
const XLSX = require(path.join('C:', 'TanTrao', 'DESKTOP', 'node_modules', 'xlsx'))
const sql = require(path.join('C:', 'TanTrao', 'BASE', 'node_modules', 'mssql'))

const FILE = 'C:/WL2020/import_go_tron/Phieu_BKLS_PNK BKTM MẪU.xlsx'
const SHEET = 'TH GỖ TRÒN T10'
const TRUNCATE = process.argv.includes('--truncate')

const config = {
    user: 'sa',
    password: '988969',
    server: '127.0.0.1',
    database: 'TanTrao2026_DB',
    port: 1433,
    options: { trustServerCertificate: true, enableArithAbort: true }
}

// Cột trong sheet (index 0-based) → tên field trong DB
const MAP = {
    TT: 0,
    Xuong_xe: 1,
    Chu_rung: 2,
    So_hop_dong: 3,
    Xa: 4,
    Huyen: 5,
    Loai_go: 6,
    Lo_go: 7,
    Thang: 8,           // text "Tháng 10/2025" → parse
    So_phieu: 9,
    Ngay_nhap: 10,      // text "10/1/25" hoặc Date
    Khoi_luong: 11,
    Xe: 12,
    So_BKLS: 13,
    Ngay_BKLS: 14,
    So_chung_chi: 15,
    Hinh_thuc_xe: 16,
    Khoang: 17,
    Lo: 18,
    Dien_tich: 19,
    Nam: 20,
    Go_xe_giao: 21,
    UQ: 22,
    Don_gia: 23,
    Thon: 25,
    cccd: 26,
    mst: 28
}

function toFloat(v) {
    if (v === null || v === undefined || v === '') return null
    const n = parseFloat(String(v).replace(/,/g, '').trim())
    return isNaN(n) ? null : n
}
function toInt(v) {
    const n = toFloat(v)
    return n === null ? null : Math.round(n)
}
function toStr(v) {
    if (v === null || v === undefined) return null
    const s = String(v).trim()
    return s === '' ? null : s
}
/** "Tháng 10/2025" → 10 ; "10" → 10 */
function parseThang(v) {
    if (v === null || v === undefined) return null
    const s = String(v).trim()
    const m = s.match(/(\d+)/)
    return m ? parseInt(m[1], 10) : null
}
/**
 * Parse ngày → Date object (hoặc null).
 * Excel file này dùng locale US cho cột Ngày_nhap ("10/1/25" = 1/10/2025).
 * Nếu a>12 → bắt buộc dd/mm, còn lại default mm/dd.
 */
function parseNgay(v) {
    if (v === null || v === undefined || v === '') return null
    if (v instanceof Date && !isNaN(v)) return v
    const s = String(v).trim()
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
    if (!m) return null
    let [, a, b, y] = m
    a = parseInt(a, 10); b = parseInt(b, 10); y = parseInt(y, 10)
    if (y < 100) y += 2000
    let dd, mm
    if (a > 12) { dd = a; mm = b }          // chắc chắn dd/mm
    else if (b > 12) { mm = a; dd = b }     // chắc chắn mm/dd
    else { mm = a; dd = b }                 // Excel US: mm/dd
    const d = new Date(Date.UTC(y, mm - 1, dd))
    return isNaN(d) ? null : d
}

async function main() {
    console.log('Reading Excel:', FILE)
    const wb = XLSX.readFile(FILE, { cellDates: true })
    const ws = wb.Sheets[SHEET]
    if (!ws) throw new Error(`Sheet "${SHEET}" not found`)
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false })

    // Dòng 0: tiêu đề bự. Dòng 1: header. Dữ liệu từ dòng 2.
    // Các cột "theo hợp đồng" bị merged trong Excel — forward-fill từ dòng trên.
    const FORWARD_FILL = [
        'Xuong_xe', 'Chu_rung', 'So_hop_dong', 'Xa', 'Huyen', 'Loai_go', 'Lo_go',
        'Thang', 'So_BKLS', 'Ngay_BKLS', 'So_chung_chi', 'Hinh_thuc_xe',
        'Khoang', 'Lo', 'Dien_tich', 'Nam', 'UQ', 'Don_gia', 'Thon', 'cccd', 'mst'
    ]
    const last = {}
    const data = []
    for (let i = 2; i < rows.length; i++) {
        const r = rows[i]
        if (!r) continue
        const soPhieu = toStr(r[MAP.So_phieu])
        if (!soPhieu) { continue } // không có số phiếu → bỏ qua (dòng tổng, rỗng)

        // Lấy value trực tiếp từ excel trước, fallback sang last nếu rỗng
        const pick = (key, parser) => {
            const raw = r[MAP[key]]
            let val = parser(raw)
            if ((val === null || val === '') && FORWARD_FILL.includes(key)) {
                val = last[key] !== undefined ? last[key] : null
            }
            if (val !== null) last[key] = val
            return val
        }
        data.push({
            TT: toFloat(r[MAP.TT]),
            Xuong_xe: pick('Xuong_xe', toStr),
            Chu_rung: pick('Chu_rung', toStr),
            So_hop_dong: pick('So_hop_dong', toStr),
            Xa: pick('Xa', toStr),
            Huyen: pick('Huyen', toStr),
            Loai_go: pick('Loai_go', toStr),
            Lo_go: pick('Lo_go', toStr),
            Thang: pick('Thang', parseThang),
            So_phieu: soPhieu,
            Ngay_nhap: parseNgay(r[MAP.Ngay_nhap]),                 // per-row
            Khoi_luong: toFloat(r[MAP.Khoi_luong]),                 // per-row
            Xe: toStr(r[MAP.Xe]),                                   // per-row
            So_BKLS: pick('So_BKLS', toStr),
            Ngay_BKLS: pick('Ngay_BKLS', toStr),
            So_chung_chi: pick('So_chung_chi', toStr),
            Hinh_thuc_xe: pick('Hinh_thuc_xe', toStr),
            Khoang: pick('Khoang', toStr),
            Lo: pick('Lo', toStr),
            Dien_tich: pick('Dien_tich', toFloat),
            Nam: pick('Nam', toInt),
            Go_xe_giao: toFloat(r[MAP.Go_xe_giao]),                 // per-row
            UQ: pick('UQ', toStr),
            Don_gia: pick('Don_gia', toFloat),
            Thon: pick('Thon', toStr),
            cccd: pick('cccd', toStr),
            mst: pick('mst', toStr)
        })
    }
    console.log('Rows to import:', data.length)
    if (data.length) console.log('First row:', data[0])

    await sql.connect(config)

    if (TRUNCATE) {
        console.log('Truncating [prod].[NHAP_GO_TRON] ...')
        await sql.query('DELETE FROM [prod].[NHAP_GO_TRON]')
        await sql.query('DBCC CHECKIDENT (\'[prod].[NHAP_GO_TRON]\', RESEED, 0)')
    }

    const table = new sql.Table('[prod].[NHAP_GO_TRON]')
    table.create = false
    table.columns.add('TT', sql.Float, { nullable: true })
    table.columns.add('Xuong_xe', sql.NVarChar(100), { nullable: true })
    table.columns.add('Chu_rung', sql.NVarChar(100), { nullable: true })
    table.columns.add('So_hop_dong', sql.NVarChar(255), { nullable: true })
    table.columns.add('Xa', sql.NVarChar(100), { nullable: true })
    table.columns.add('Huyen', sql.NVarChar(100), { nullable: true })
    table.columns.add('Loai_go', sql.NVarChar(50), { nullable: true })
    table.columns.add('Lo_go', sql.NVarChar(50), { nullable: true })
    table.columns.add('Thang', sql.Int, { nullable: true })
    table.columns.add('So_phieu', sql.NVarChar(50), { nullable: true })
    table.columns.add('Ngay_nhap', sql.DateTime, { nullable: true })
    table.columns.add('Khoi_luong', sql.Float, { nullable: true })
    table.columns.add('Xe', sql.NVarChar(50), { nullable: true })
    table.columns.add('So_BKLS', sql.NVarChar(50), { nullable: true })
    table.columns.add('Ngay_BKLS', sql.NVarChar(255), { nullable: true })
    table.columns.add('So_chung_chi', sql.NVarChar(255), { nullable: true })
    table.columns.add('Hinh_thuc_xe', sql.NVarChar(50), { nullable: true })
    table.columns.add('Khoang', sql.NVarChar(50), { nullable: true })
    table.columns.add('Lo', sql.NVarChar(50), { nullable: true })
    table.columns.add('Dien_tich', sql.Float, { nullable: true })
    table.columns.add('Nam', sql.Int, { nullable: true })
    table.columns.add('Go_xe_giao', sql.Float, { nullable: true })
    table.columns.add('UQ', sql.NVarChar(50), { nullable: true })
    table.columns.add('Don_gia', sql.Float, { nullable: true })
    table.columns.add('Thon', sql.NVarChar(255), { nullable: true })
    table.columns.add('cccd', sql.NVarChar(255), { nullable: true })
    table.columns.add('mst', sql.NVarChar(50), { nullable: true })

    data.forEach(d => table.rows.add(
        d.TT, d.Xuong_xe, d.Chu_rung, d.So_hop_dong, d.Xa, d.Huyen, d.Loai_go, d.Lo_go,
        d.Thang, d.So_phieu, d.Ngay_nhap, d.Khoi_luong, d.Xe, d.So_BKLS, d.Ngay_BKLS,
        d.So_chung_chi, d.Hinh_thuc_xe, d.Khoang, d.Lo, d.Dien_tich, d.Nam, d.Go_xe_giao,
        d.UQ, d.Don_gia, d.Thon, d.cccd, d.mst
    ))

    const request = new sql.Request()
    const result = await request.bulk(table)
    console.log('Inserted rows:', result.rowsAffected)

    const { recordset } = await sql.query(`
        SELECT COUNT(*) AS total, SUM(Khoi_luong) AS tong_khoi_luong
        FROM [prod].[NHAP_GO_TRON]`)
    console.log('Summary:', recordset[0])

    await sql.close()
}

main().catch(err => { console.error(err); process.exit(1) })
