const express = require('express')
const router = express.Router()
const mssql = require('mssql')

/**
 * API quản lý TỒN gỗ tròn của lô (bảng prod.LO_GO_TON_TRON).
 * Tồn được gắn nhãn (thang, nam) = KỲ SẼ TIÊU THỤ phần tồn này khi ghép lô gỗ.
 *
 *   GET  /list?thang=&nam=&mancc=   → liệt kê tồn của 1 kỳ + xưởng
 *   POST /import                    → nhập/ghi đè tồn (upsert theo lô)
 */

const num = v => {
    if (v === null || v === undefined || v === '') return null
    const n = parseFloat(String(v).replace(/,/g, '').trim())
    return isNaN(n) ? null : n
}
const str = v => (v === null || v === undefined ? null : String(v).trim() || null)

/**
 * GET /list?thang=&nam=&mancc=
 * Liệt kê tồn gỗ tròn của kỳ (thang, nam) cho 1 xưởng.
 */
router.get('/list', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang)
        const nam = parseInt(req.query.nam)
        const mancc = (req.query.mancc || '').toString().trim()
        if (!thang || !nam) return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm' })

        const request = new mssql.Request()
            .input('thang', thang).input('nam', nam)
        let where = 'thang = @thang AND nam = @nam'
        if (mancc) {
            request.input('mancc', mancc)
            where += ' AND LTRIM(RTRIM(mancc)) = @mancc'
        }
        const { recordset } = await request.query(`
            SELECT id, lo_go, mancc, thang, nam,
                   kl_tron_goc, kl_con_lai_tron, he_so, updated_at
            FROM [prod].[LO_GO_TON_TRON]
            WHERE ${where}
            ORDER BY lo_go
        `)

        res.api.sendData({
            rows: recordset.map((r, i) => ({
                _idx: i + 1,
                lo_go: r.lo_go ? r.lo_go.trim() : null,
                mancc: r.mancc ? r.mancc.trim() : null,
                thang: r.thang,
                nam: r.nam,
                kl_tron_goc: r.kl_tron_goc,
                kl_con_lai_tron: r.kl_con_lai_tron,
                he_so: r.he_so,
                updated_at: r.updated_at,
            })),
            tong: recordset.length,
            thang, nam, mancc,
        })
    } catch (err) {
        console.error('[ton-lo-go/list]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * POST /import
 * Body: { thang, nam, mancc, truncate, rows: [{ lo_go, kl_con_lai_tron, he_so, kl_tron_goc }] }
 * - truncate = true: xóa toàn bộ tồn của (thang, nam, mancc) trước khi nhập.
 * - Mỗi dòng UPSERT theo khóa (lo_go, mancc, thang, nam).
 */
router.post('/import', async (req, res) => {
    try {
        const thang = parseInt(req.body.thang)
        const nam = parseInt(req.body.nam)
        const mancc = (req.body.mancc || '').toString().trim()
        const truncate = !!req.body.truncate
        const rows = Array.isArray(req.body.rows) ? req.body.rows : []
        if (!thang || !nam) return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm' })
        if (!mancc) return res.api.sendFail({ number: 4900, message: 'Thiếu mã xưởng (mancc)' })

        // Chuẩn hóa + lọc dòng hợp lệ (có lô + tồn > 0)
        const valid = rows
            .map(r => ({
                lo_go: str(r.lo_go),
                kl_con_lai_tron: num(r.kl_con_lai_tron) || 0,
                he_so: num(r.he_so) || 2,
                kl_tron_goc: num(r.kl_tron_goc),
            }))
            .filter(r => r.lo_go && r.kl_con_lai_tron > 0.001)

        let deleted = 0
        if (truncate) {
            const del = await new mssql.Request()
                .input('thang', thang).input('nam', nam).input('mancc', mancc)
                .query(`
                    DELETE FROM [prod].[LO_GO_TON_TRON]
                    WHERE thang = @thang AND nam = @nam
                        AND LTRIM(RTRIM(mancc)) = @mancc
                `)
            deleted = del.rowsAffected[0] || 0
        }

        let upserted = 0
        for (const r of valid) {
            await new mssql.Request()
                .input('lo_go', r.lo_go)
                .input('mancc', mancc)
                .input('thang', thang)
                .input('nam', nam)
                .input('kl_tron_goc', r.kl_tron_goc)
                .input('kl_con_lai_tron', r.kl_con_lai_tron)
                .input('he_so', r.he_so)
                .query(`
                    MERGE [prod].[LO_GO_TON_TRON] AS t
                    USING (SELECT @lo_go AS lo_go, @mancc AS mancc,
                                  @thang AS thang, @nam AS nam) AS s
                    ON  LTRIM(RTRIM(t.lo_go)) = LTRIM(RTRIM(s.lo_go))
                    AND LTRIM(RTRIM(t.mancc)) = LTRIM(RTRIM(s.mancc))
                    AND t.thang = s.thang AND t.nam = s.nam
                    WHEN MATCHED THEN UPDATE SET
                        kl_tron_goc = @kl_tron_goc,
                        kl_con_lai_tron = @kl_con_lai_tron,
                        he_so = @he_so,
                        updated_at = GETDATE()
                    WHEN NOT MATCHED THEN INSERT
                        (lo_go, mancc, thang, nam, kl_tron_goc, kl_con_lai_tron, he_so)
                        VALUES (@lo_go, @mancc, @thang, @nam,
                                @kl_tron_goc, @kl_con_lai_tron, @he_so);
                `)
            upserted++
        }

        res.api.sendData({ upserted, deleted, thang, nam, mancc })
    } catch (err) {
        console.error('[ton-lo-go/import]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

module.exports = router
