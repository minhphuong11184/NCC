const express = require('express')
const router = express.Router()
const mssql = require('mssql')
const goxeApi = require('../data/goxeApi')

/**
 * GET /ghep?thang=1&nam=2026&mancc=CTTT&source=woodsland|import|result
 * - source=woodsland: gọi Goxe API (mặc định) — xem goxeApi.js
 * - source=import:    đọc từ PNK_WOODSLAND_IMPORT (đã import Excel)
 * - source=result:    load lại biên bản đã lưu trong GHEP_LO_GO_RESULT (KHÔNG chia lại)
 *
 * Với 2 source đầu, thuật toán:
 *   1. Lấy phiếu từ nguồn tương ứng
 *   2. Lấy Lo_go từ local NHAP_GO_TRON (cùng tháng)
 *   3. Chia Lo_go vào từng chi tiết phiếu theo khối lượng
 */
router.get('/ghep', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang)
        const nam = parseInt(req.query.nam)
        const mancc = req.query.mancc || 'CTTT'
        const source = (req.query.source || 'woodsland').toLowerCase()
        const heSo = parseFloat(req.query.he_so) || 2  // KL gỗ tròn / heSo = KL gỗ xẻ tương đương
        if (!thang || !nam) return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm' })

        // === source=result: load lại biên bản đã lưu (không chia lại) ===
        if (source === 'result') {
            const { recordset } = await new mssql.Request()
                .input('thang', thang).input('nam', nam).input('mancc', mancc)
                .query(`
                    SELECT SOPHIEU, MAKHO, NHOMSP, BIENSOXE, CREATED_AT,
                           mancc AS MANCC,
                           [DAY] AS dt_day, RONG AS dt_rong, CAO AS dt_cao,
                           SOBO, SOTHANH_BO, TONG_THANH AS tong_thanh,
                           KL_M3 AS kl_m3,
                           LO_GO_GAN AS lo_go, CHUNG_CHI_GAN AS chung_chi,
                           saved_at, source AS saved_source, he_so AS saved_he_so
                    FROM [prod].[GHEP_LO_GO_RESULT]
                    WHERE thang = @thang AND nam = @nam
                        AND LTRIM(RTRIM(mancc)) = @mancc
                    ORDER BY CREATED_AT, SOPHIEU, id
                `)
            const phieuMap = {}
            recordset.forEach(d => {
                if (!phieuMap[d.SOPHIEU]) {
                    phieuMap[d.SOPHIEU] = {
                        SOPHIEU: d.SOPHIEU,
                        MAKHO: d.MAKHO ? d.MAKHO.trim() : null,
                        NHOMSP: d.NHOMSP ? d.NHOMSP.trim() : null,
                        BIENSOXE: d.BIENSOXE ? d.BIENSOXE.trim() : null,
                        CREATED_AT: d.CREATED_AT,
                        MANCC: d.MANCC ? d.MANCC.trim() : null,
                        chi_tiet: [],
                        tong_kl: 0,
                    }
                }
                phieuMap[d.SOPHIEU].chi_tiet.push(d)
                phieuMap[d.SOPHIEU].tong_kl += (d.kl_m3 || 0)
            })
            const phieu = Object.values(phieuMap)
            const saved_at = recordset.length ? recordset[0].saved_at : null
            return res.api.sendData({
                phieu,
                lo_go: [],
                tong_phieu: phieu.length,
                tong_detail: recordset.length,
                tong_lo: new Set(recordset.map(r => r.lo_go).filter(Boolean)).size,
                from_saved: true,
                saved_at,
            })
        }

        // 1. Lấy phiếu - từ Woodsland hoặc từ bảng import
        let wsResult
        if (source === 'import') {
            wsResult = await new mssql.Request()
                .input('mancc', mancc)
                .input('thang', thang)
                .input('nam', nam)
                .query(`
                    SELECT
                        SOPHIEU, MAKHO, NHOMSP, BIENSOXE, CREATED_AT,
                        mancc AS MANCC,
                        [DAY] AS dt_day, RONG AS dt_rong, CAO AS dt_cao,
                        SOBO, SOTHANH_BO,
                        CASE
                            WHEN KL_M3 IS NOT NULL THEN KL_M3
                            WHEN SOBO > 0 AND SOTHANH_BO > 0
                                THEN CAST([DAY] AS FLOAT) * RONG * CAO * SOBO * SOTHANH_BO / 1000000000.0
                            ELSE 0
                        END AS kl_m3
                    FROM [prod].[PNK_WOODSLAND_IMPORT]
                    WHERE thang = @thang AND nam = @nam
                        AND LTRIM(RTRIM(mancc)) = @mancc
                    ORDER BY CREATED_AT, SOPHIEU, id
                `)
        } else {
            // source=woodsland: lấy qua HTTP API
            const rows = await goxeApi.getPhieuByMancc({ thang, nam, mancc })
            // Bù tính kl_m3 nếu API trả thiếu
            rows.forEach(r => {
                if (r.kl_m3 === undefined || r.kl_m3 === null) {
                    if (r.dt_day > 0 && r.dt_rong > 0 && r.dt_cao > 0
                        && r.SOBO > 0 && r.SOTHANH_BO > 0) {
                        r.kl_m3 = r.dt_day * r.dt_rong * r.dt_cao * r.SOBO * r.SOTHANH_BO / 1e9
                    } else {
                        r.kl_m3 = 0
                    }
                }
            })
            wsResult = { recordset: rows }
        }

        // 2. Lấy Lo_go từ local NHAP_GO_TRON (LEFT JOIN bảng hệ số)
        const loGoResult = await new mssql.Request()
            .input('thang', thang)
            .input('nam', nam)
            .query(`
                SELECT N.Lo_go, SUM(N.Khoi_luong) AS kl_tong,
                       MIN(N.So_chung_chi) AS chung_chi,
                       MAX(H.he_so) AS he_so_lo
                FROM [prod].[NHAP_GO_TRON] N
                LEFT JOIN [prod].[LO_GO_HE_SO] H ON H.lo_go = N.Lo_go
                WHERE MONTH(N.Ngay_nhap) = @thang AND YEAR(N.Ngay_nhap) = @nam
                    AND N.Lo_go IS NOT NULL
                GROUP BY N.Lo_go
                ORDER BY N.Lo_go
            `)

        // 3. Ghép Lo_go vào chi tiết theo khối lượng
        // Mỗi lô gỗ có kl_tong m3. Duyệt từng detail, trừ dần kl_tong.
        // Khi hết lô này → sang lô tiếp theo.
        // Hệ số quy đổi theo từng lô (nếu có) hoặc dùng heSo chung từ query
        const loGos = loGoResult.recordset.map(l => {
            const heSoLo = l.he_so_lo || heSo
            return {
                lo_go: l.Lo_go ? l.Lo_go.trim() : null,
                kl_tron: l.kl_tong,
                he_so: heSoLo,
                kl_tong: Math.round(l.kl_tong / heSoLo * 10000) / 10000,
                kl_con_lai: Math.round(l.kl_tong / heSoLo * 10000) / 10000,
                chung_chi: l.chung_chi ? l.chung_chi.trim() : null,
            }
        })

        let loIdx = 0
        const details = wsResult.recordset.map(row => {
            const kl = Math.round((row.kl_m3 || 0) * 10000) / 10000
            let lo_go = null
            let chung_chi = null

            // Tìm lô gỗ còn khối lượng
            if (loIdx < loGos.length && kl > 0) {
                lo_go = loGos[loIdx].lo_go
                chung_chi = loGos[loIdx].chung_chi
                loGos[loIdx].kl_con_lai -= kl
                // Nếu lô này hết → sang lô tiếp
                if (loGos[loIdx].kl_con_lai <= 0.01) {
                    loIdx++
                }
            }

            return {
                ...row,
                SOPHIEU: row.SOPHIEU ? row.SOPHIEU.trim() : null,
                MAKHO: row.MAKHO ? row.MAKHO.trim() : null,
                NHOMSP: row.NHOMSP ? row.NHOMSP.trim() : null,
                BIENSOXE: row.BIENSOXE ? row.BIENSOXE.trim() : null,
                MANCC: row.MANCC ? row.MANCC.trim() : null,
                kl_m3: kl,
                lo_go: lo_go,
                chung_chi: chung_chi,
                tong_thanh: row.SOBO > 0 && row.SOTHANH_BO > 0 ? row.SOBO * row.SOTHANH_BO : 0,
            }
        })

        // Group theo phiếu
        const phieuMap = {}
        details.forEach(d => {
            if (!phieuMap[d.SOPHIEU]) {
                phieuMap[d.SOPHIEU] = {
                    pnk_id: d.pnk_id,
                    SOPHIEU: d.SOPHIEU,
                    MAKHO: d.MAKHO,
                    NHOMSP: d.NHOMSP,
                    BIENSOXE: d.BIENSOXE,
                    CREATED_AT: d.CREATED_AT,
                    MANCC: d.MANCC,
                    chi_tiet: [],
                    tong_kl: 0,
                }
            }
            phieuMap[d.SOPHIEU].chi_tiet.push(d)
            phieuMap[d.SOPHIEU].tong_kl += d.kl_m3
        })

        res.api.sendData({
            phieu: Object.values(phieuMap),
            lo_go: loGos.map(l => ({ ...l, kl_con_lai: Math.round(l.kl_con_lai * 100) / 100 })),
            tong_phieu: Object.keys(phieuMap).length,
            tong_detail: details.length,
            tong_lo: loGos.length,
        })
    } catch (err) {
        console.error('[ghep-lo-go]', err)
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

/**
 * GET /he-so?thang=&nam=
 * Lấy danh sách lô gỗ + hệ số quy đổi
 */
router.get('/he-so', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang) || null
        const nam = parseInt(req.query.nam) || null
        const request = new mssql.Request()
        let where = 'N.Lo_go IS NOT NULL'
        if (thang) { request.input('thang', thang); where += ' AND MONTH(N.Ngay_nhap) = @thang' }
        if (nam) { request.input('nam', nam); where += ' AND YEAR(N.Ngay_nhap) = @nam' }

        const { recordset } = await request.query(`
            SELECT N.Lo_go, SUM(N.Khoi_luong) AS kl_tron,
                   ISNULL(MAX(H.he_so), 2) AS he_so,
                   MAX(H.id) AS he_so_id, MAX(H.ghi_chu) AS ghi_chu
            FROM [prod].[NHAP_GO_TRON] N
            LEFT JOIN [prod].[LO_GO_HE_SO] H ON H.lo_go = N.Lo_go
            WHERE ${where}
            GROUP BY N.Lo_go
            ORDER BY N.Lo_go
        `)
        res.api.sendData(recordset)
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

/**
 * POST /he-so
 * Body: { lo_go, he_so, ghi_chu }
 * Insert hoặc update hệ số cho 1 lô
 */
router.post('/he-so', async (req, res) => {
    try {
        const { lo_go, he_so, ghi_chu } = req.body
        if (!lo_go) return res.api.sendFail({ number: 4900, message: 'Thiếu mã lô gỗ' })
        await new mssql.Request()
            .input('lo_go', lo_go).input('he_so', he_so || 2).input('ghi_chu', ghi_chu || null)
            .query(`
                MERGE [prod].[LO_GO_HE_SO] AS target
                USING (SELECT @lo_go AS lo_go) AS src ON target.lo_go = src.lo_go
                WHEN MATCHED THEN UPDATE SET he_so = @he_so, ghi_chu = @ghi_chu, updated_at = GETDATE()
                WHEN NOT MATCHED THEN INSERT (lo_go, he_so, ghi_chu) VALUES (@lo_go, @he_so, @ghi_chu);
            `)
        res.api.sendData({ lo_go, he_so })
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

/**
 * POST /he-so/bulk
 * Body: { items: [{lo_go, he_so}, ...] }
 * Cập nhật nhiều lô cùng lúc
 */
router.post('/he-so/bulk', async (req, res) => {
    try {
        const items = Array.isArray(req.body.items) ? req.body.items : []
        for (const it of items) {
            if (!it.lo_go) continue
            await new mssql.Request()
                .input('lo_go', it.lo_go).input('he_so', it.he_so || 2)
                .query(`
                    MERGE [prod].[LO_GO_HE_SO] AS target
                    USING (SELECT @lo_go AS lo_go) AS src ON target.lo_go = src.lo_go
                    WHEN MATCHED THEN UPDATE SET he_so = @he_so, updated_at = GETDATE()
                    WHEN NOT MATCHED THEN INSERT (lo_go, he_so) VALUES (@lo_go, @he_so);
                `)
        }
        res.api.sendData({ updated: items.length })
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

/**
 * GET /nha-cung-cap — lấy danh sách NCC qua HTTP API.
 */
router.get('/nha-cung-cap', async (req, res) => {
    try {
        const data = await goxeApi.getNhaCungCap()
        res.api.sendData(data)
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

/**
 * POST /import-pnk
 * Body: { thang, nam, mancc, rows }
 * - Xóa toàn bộ data cũ trùng (thang, nam, mancc) trong PNK_WOODSLAND_IMPORT
 * - Bulk insert các dòng mới
 */
router.post('/import-pnk', async (req, res) => {
    try {
        const thang = parseInt(req.body.thang)
        const nam = parseInt(req.body.nam)
        const mancc = req.body.mancc ? String(req.body.mancc).trim() : null
        const rows = Array.isArray(req.body.rows) ? req.body.rows : []
        if (!thang || !nam) return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm' })
        if (!mancc) return res.api.sendFail({ number: 4900, message: 'Thiếu mã NCC' })
        if (!rows.length) return res.api.sendFail({ number: 4900, message: 'Không có dữ liệu' })

        // 1. Xóa data cũ cùng (thang, nam, mancc)
        const delResult = await new mssql.Request()
            .input('thang', thang).input('nam', nam).input('mancc', mancc)
            .query(`
                DELETE FROM [prod].[PNK_WOODSLAND_IMPORT]
                WHERE thang = @thang AND nam = @nam
                    AND LTRIM(RTRIM(mancc)) = @mancc
            `)

        // 2. Bulk insert
        const table = new mssql.Table('[prod].[PNK_WOODSLAND_IMPORT]')
        table.create = false
        table.columns.add('thang', mssql.Int, { nullable: true })
        table.columns.add('nam', mssql.Int, { nullable: true })
        table.columns.add('mancc', mssql.NVarChar(50), { nullable: true })
        table.columns.add('SOPHIEU', mssql.NVarChar(50), { nullable: true })
        table.columns.add('MAKHO', mssql.NVarChar(50), { nullable: true })
        table.columns.add('NHOMSP', mssql.NVarChar(50), { nullable: true })
        table.columns.add('BIENSOXE', mssql.NVarChar(50), { nullable: true })
        table.columns.add('CREATED_AT', mssql.DateTime, { nullable: true })
        table.columns.add('DAY', mssql.Float, { nullable: true })
        table.columns.add('RONG', mssql.Float, { nullable: true })
        table.columns.add('CAO', mssql.Float, { nullable: true })
        table.columns.add('SOBO', mssql.Float, { nullable: true })
        table.columns.add('SOTHANH_BO', mssql.Float, { nullable: true })
        table.columns.add('KL_M3', mssql.Float, { nullable: true })

        const num = v => (v === null || v === undefined || v === '' ? null : (isNaN(+v) ? null : +v))
        const str = v => (v === null || v === undefined ? null : String(v).trim() || null)
        const dt = v => {
            if (!v) return null
            const d = v instanceof Date ? v : new Date(v)
            return isNaN(d) ? null : d
        }

        rows.forEach(r => table.rows.add(
            thang, nam, mancc,
            str(r.SOPHIEU),
            str(r.MAKHO),
            str(r.NHOMSP),
            str(r.BIENSOXE),
            dt(r.CREATED_AT),
            num(r.DAY),
            num(r.RONG),
            num(r.CAO),
            num(r.SOBO),
            num(r.SOTHANH_BO),
            num(r.KL_M3)
        ))

        const result = await new mssql.Request().bulk(table)
        res.api.sendData({
            inserted: result.rowsAffected,
            deleted: delResult.rowsAffected[0] || 0,
            thang, nam, mancc,
        })
    } catch (err) {
        console.error('[import-pnk]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * POST /save-result
 * Body: { thang, nam, mancc, source, he_so, phieu: [{ ...header, chi_tiet: [...] }] }
 * - Xóa toàn bộ snapshot cũ trùng (thang, nam, mancc) trong GHEP_LO_GO_RESULT
 * - Bulk insert flatten chi_tiet (1 dòng / 1 chi tiết)
 */
router.post('/save-result', async (req, res) => {
    try {
        const thang = parseInt(req.body.thang)
        const nam = parseInt(req.body.nam)
        const mancc = req.body.mancc ? String(req.body.mancc).trim() : null
        const sourceVal = req.body.source ? String(req.body.source).trim() : null
        const heSo = parseFloat(req.body.he_so) || null
        const phieu = Array.isArray(req.body.phieu) ? req.body.phieu : []
        if (!thang || !nam) return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm' })
        if (!mancc) return res.api.sendFail({ number: 4900, message: 'Thiếu mã NCC' })
        if (!phieu.length) return res.api.sendFail({ number: 4900, message: 'Không có phiếu để lưu' })

        // 1. Xóa snapshot cũ
        const delResult = await new mssql.Request()
            .input('thang', thang).input('nam', nam).input('mancc', mancc)
            .query(`
                DELETE FROM [prod].[GHEP_LO_GO_RESULT]
                WHERE thang = @thang AND nam = @nam
                    AND LTRIM(RTRIM(mancc)) = @mancc
            `)

        // 2. Bulk insert
        const table = new mssql.Table('[prod].[GHEP_LO_GO_RESULT]')
        table.create = false
        table.columns.add('thang', mssql.Int, { nullable: true })
        table.columns.add('nam', mssql.Int, { nullable: true })
        table.columns.add('mancc', mssql.NVarChar(50), { nullable: true })
        table.columns.add('source', mssql.NVarChar(20), { nullable: true })
        table.columns.add('he_so', mssql.Float, { nullable: true })
        table.columns.add('SOPHIEU', mssql.NVarChar(50), { nullable: true })
        table.columns.add('MAKHO', mssql.NVarChar(50), { nullable: true })
        table.columns.add('NHOMSP', mssql.NVarChar(50), { nullable: true })
        table.columns.add('BIENSOXE', mssql.NVarChar(50), { nullable: true })
        table.columns.add('CREATED_AT', mssql.DateTime, { nullable: true })
        table.columns.add('DAY', mssql.Float, { nullable: true })
        table.columns.add('RONG', mssql.Float, { nullable: true })
        table.columns.add('CAO', mssql.Float, { nullable: true })
        table.columns.add('SOBO', mssql.Float, { nullable: true })
        table.columns.add('SOTHANH_BO', mssql.Float, { nullable: true })
        table.columns.add('TONG_THANH', mssql.Float, { nullable: true })
        table.columns.add('KL_M3', mssql.Float, { nullable: true })
        table.columns.add('LO_GO_GAN', mssql.NVarChar(50), { nullable: true })
        table.columns.add('CHUNG_CHI_GAN', mssql.NVarChar(255), { nullable: true })

        const num = v => (v === null || v === undefined || v === '' ? null : (isNaN(+v) ? null : +v))
        const str = v => (v === null || v === undefined ? null : String(v).trim() || null)
        const dt = v => {
            if (!v) return null
            const d = v instanceof Date ? v : new Date(v)
            return isNaN(d) ? null : d
        }

        let totalDt = 0
        phieu.forEach(p => {
            const chiTiet = Array.isArray(p.chi_tiet) ? p.chi_tiet : []
            chiTiet.forEach(d => {
                table.rows.add(
                    thang, nam, mancc,
                    sourceVal, heSo,
                    str(p.SOPHIEU),
                    str(p.MAKHO),
                    str(p.NHOMSP),
                    str(p.BIENSOXE),
                    dt(p.CREATED_AT),
                    num(d.dt_day),
                    num(d.dt_rong),
                    num(d.dt_cao),
                    num(d.SOBO),
                    num(d.SOTHANH_BO),
                    num(d.tong_thanh),
                    num(d.kl_m3),
                    str(d.lo_go),
                    str(d.chung_chi)
                )
                totalDt++
            })
        })

        if (!totalDt) return res.api.sendFail({ number: 4900, message: 'Không có chi tiết để lưu' })

        const result = await new mssql.Request().bulk(table)
        res.api.sendData({
            inserted: result.rowsAffected,
            deleted: delResult.rowsAffected[0] || 0,
            so_phieu: phieu.length,
            so_chi_tiet: totalDt,
            thang, nam, mancc,
        })
    } catch (err) {
        console.error('[save-result]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * GET /result-summary?thang=&nam=
 * Liệt kê các (thang, nam, mancc) đã lưu biên bản
 */
router.get('/result-summary', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang) || null
        const nam = parseInt(req.query.nam) || null
        const request = new mssql.Request()
        let where = '1 = 1'
        if (thang) { request.input('thang', thang); where += ' AND thang = @thang' }
        if (nam) { request.input('nam', nam); where += ' AND nam = @nam' }
        const { recordset } = await request.query(`
            SELECT thang, nam, mancc, source,
                   COUNT(*) AS so_chi_tiet,
                   COUNT(DISTINCT SOPHIEU) AS so_phieu,
                   MAX(saved_at) AS saved_at
            FROM [prod].[GHEP_LO_GO_RESULT]
            WHERE ${where}
            GROUP BY thang, nam, mancc, source
            ORDER BY nam DESC, thang DESC, mancc
        `)
        res.api.sendData(recordset)
    } catch (err) {
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * GET /import-pnk-summary?thang=&nam=
 * Liệt kê các (thang, nam, mancc) đã import + số dòng
 */
router.get('/import-pnk-summary', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang) || null
        const nam = parseInt(req.query.nam) || null
        const request = new mssql.Request()
        let where = '1 = 1'
        if (thang) { request.input('thang', thang); where += ' AND thang = @thang' }
        if (nam) { request.input('nam', nam); where += ' AND nam = @nam' }

        const { recordset } = await request.query(`
            SELECT thang, nam, mancc,
                   COUNT(*) AS so_dong,
                   COUNT(DISTINCT SOPHIEU) AS so_phieu,
                   MAX(imported_at) AS imported_at
            FROM [prod].[PNK_WOODSLAND_IMPORT]
            WHERE ${where}
            GROUP BY thang, nam, mancc
            ORDER BY nam DESC, thang DESC, mancc
        `)
        res.api.sendData(recordset)
    } catch (err) {
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

module.exports = router
