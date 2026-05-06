/**
 * Import file "KH khai thác T10.2025- Hùng Đức-Tân Trào.xls"
 * → bảng [prod].[KH_KHAI_THAC]
 *
 * Usage: node _import_kh.js [--truncate]
 */
const path = require('path')
const X = require(path.join('C:', 'TanTrao', 'DESKTOP', 'node_modules', 'xlsx'))
const sql = require(path.join('C:', 'TanTrao', 'BASE', 'node_modules', 'mssql'))

const FILE = 'C:/WL2020/import_go_tron/KH khai thác T10.2025- Hùng Đức-Tân Trào.xls'
const TRUNCATE = process.argv.includes('--truncate')

const config = {
    user: 'sa', password: '988969', server: '127.0.0.1',
    database: 'TanTrao2026_DB', port: 1433,
    options: { trustServerCertificate: true, enableArithAbort: true }
}

const toStr = v => { if (v == null) return null; const s = String(v).trim(); return s === '' ? null : s }
const toFloat = v => { if (v == null || v === '') return null; const n = parseFloat(String(v).replace(/,/g, '').trim()); return isNaN(n) ? null : n }
const toInt = v => { const n = toFloat(v); return n == null ? null : Math.round(n) }

function parseSheet(ws, sheetName, thang, nam) {
    const rows = X.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false })
    const data = []
    // Header tại dòng 3 (index 2), data từ dòng 4 (index 3)
    for (let i = 3; i < rows.length; i++) {
        const r = rows[i]
        if (!r) continue
        const tenHo = toStr(r[1])
        if (!tenHo) continue
        // Bỏ dòng tổng
        if (tenHo.toLowerCase().includes('tổng') || tenHo.toLowerCase().includes('cộng')) continue

        data.push({
            thang, nam,
            xa: toStr(r[0]),
            ten_ho: tenHo,
            thon: toStr(r[2]),
            cccd: toStr(r[3]),
            chung_chi: toStr(r[4]),
            khoanh: toStr(r[5]),
            lo: toStr(r[6]),
            dien_tich: toFloat(r[7]),
            loai_cay: toStr(r[8]),
            nam_trong: toInt(r[9]),
            kl_bang_ke: toFloat(r[10]),
            kl_go: toFloat(r[11]),
            noi_xe: toStr(r[12]),
            ngay_lam_hs: toStr(r[13]),
            thoi_gian_kt: toStr(r[14]),
            so_bkls: toStr(r[15]),
            ngay_bkls: toStr(r[16]),
            KD: toStr(r[17]),
            VD: toStr(r[18]),
            source_sheet: sheetName,
            source_file: path.basename(FILE)
        })
    }
    return data
}

async function main() {
    console.log('Reading:', FILE)
    const wb = X.readFile(FILE, { cellDates: true })
    console.log('Sheets:', wb.SheetNames)

    let allData = []

    // Sheet "KH " → tháng 9/2025 (tiêu đề: "THÁNG 9.2025")
    const ws1 = wb.Sheets['KH ']
    if (ws1) {
        const d1 = parseSheet(ws1, 'KH', 9, 2025)
        console.log(`  Sheet "KH ": ${d1.length} hộ`)
        allData = allData.concat(d1)
    }

    // Sheet "kh t10" → tháng 10/2025
    const ws2 = wb.Sheets['kh t10']
    if (ws2) {
        // Sheet này có layout khác: header dòng 3, data từ dòng 4
        // Cột: xa(0), ten_ho(1), khoanh(2), lo(3), dien_tich(4), nam_trong(5), ghi_chu(6), ...
        const rows = X.utils.sheet_to_json(ws2, { header: 1, defval: null, raw: false })
        const d2 = []
        for (let i = 3; i < rows.length; i++) {
            const r = rows[i]
            if (!r) continue
            const tenHo = toStr(r[1])
            if (!tenHo) continue
            if (tenHo.toLowerCase().includes('tổng') || tenHo.toLowerCase().includes('cộng')) continue
            d2.push({
                thang: 10, nam: 2025,
                xa: toStr(r[0]),
                ten_ho: tenHo,
                thon: null,
                cccd: null,
                chung_chi: null,
                khoanh: toStr(r[2]),
                lo: toStr(r[3]),
                dien_tich: toFloat(r[4]),
                loai_cay: null,
                nam_trong: toInt(r[5]),
                kl_bang_ke: null,
                kl_go: null,
                noi_xe: toStr(r[6]),
                ngay_lam_hs: toStr(r[7]),
                thoi_gian_kt: toStr(r[8]),
                so_bkls: toStr(r[9]),
                ngay_bkls: toStr(r[10]),
                KD: toStr(r[11]),
                VD: toStr(r[12]),
                source_sheet: 'kh t10',
                source_file: path.basename(FILE)
            })
        }
        console.log(`  Sheet "kh t10": ${d2.length} hộ`)
        allData = allData.concat(d2)
    }

    console.log(`Total: ${allData.length} rows`)

    await sql.connect(config)

    if (TRUNCATE) {
        console.log('Truncating [prod].[KH_KHAI_THAC]...')
        await sql.query('DELETE FROM [prod].[KH_KHAI_THAC]')
        await sql.query("DBCC CHECKIDENT ('[prod].[KH_KHAI_THAC]', RESEED, 0)")
    }

    const table = new sql.Table('[prod].[KH_KHAI_THAC]')
    table.create = false
    table.columns.add('thang', sql.Int, { nullable: true })
    table.columns.add('nam', sql.Int, { nullable: true })
    table.columns.add('xa', sql.NVarChar(100), { nullable: true })
    table.columns.add('ten_ho', sql.NVarChar(200), { nullable: true })
    table.columns.add('thon', sql.NVarChar(500), { nullable: true })
    table.columns.add('cccd', sql.NVarChar(500), { nullable: true })
    table.columns.add('chung_chi', sql.NVarChar(500), { nullable: true })
    table.columns.add('khoanh', sql.NVarChar(50), { nullable: true })
    table.columns.add('lo', sql.NVarChar(50), { nullable: true })
    table.columns.add('dien_tich', sql.Float, { nullable: true })
    table.columns.add('loai_cay', sql.NVarChar(100), { nullable: true })
    table.columns.add('nam_trong', sql.Int, { nullable: true })
    table.columns.add('kl_bang_ke', sql.Float, { nullable: true })
    table.columns.add('kl_go', sql.Float, { nullable: true })
    table.columns.add('noi_xe', sql.NVarChar(200), { nullable: true })
    table.columns.add('ngay_lam_hs', sql.NVarChar(200), { nullable: true })
    table.columns.add('thoi_gian_kt', sql.NVarChar(500), { nullable: true })
    table.columns.add('so_bkls', sql.NVarChar(100), { nullable: true })
    table.columns.add('ngay_bkls', sql.NVarChar(200), { nullable: true })
    table.columns.add('KD', sql.NVarChar(50), { nullable: true })
    table.columns.add('VD', sql.NVarChar(50), { nullable: true })
    table.columns.add('source_sheet', sql.NVarChar(100), { nullable: true })
    table.columns.add('source_file', sql.NVarChar(500), { nullable: true })

    allData.forEach(d => table.rows.add(
        d.thang, d.nam, d.xa, d.ten_ho, d.thon, d.cccd, d.chung_chi,
        d.khoanh, d.lo, d.dien_tich, d.loai_cay, d.nam_trong,
        d.kl_bang_ke, d.kl_go, d.noi_xe, d.ngay_lam_hs, d.thoi_gian_kt,
        d.so_bkls, d.ngay_bkls, d.KD, d.VD, d.source_sheet, d.source_file
    ))

    const result = await new sql.Request().bulk(table)
    console.log('Inserted:', result.rowsAffected)

    const { recordset } = await sql.query(`
        SELECT thang, nam, COUNT(*) AS so_ho, SUM(kl_go) AS tong_kl_go
        FROM [prod].[KH_KHAI_THAC] GROUP BY thang, nam ORDER BY nam, thang`)
    console.log('Summary:', recordset)

    await sql.close()
}
main().catch(e => { console.error(e); process.exit(1) })
