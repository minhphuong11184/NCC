const express = require('express')
const router = express.Router()
const mssql = require('mssql')

/**
 * GET /list?thang=&nam=&mancc=
 * Load biên bản đã lưu trong GHEP_LO_GO_RESULT, JOIN sang NHAP_GO_TRON
 * để lấy thêm Lo_go_tron + Chu_rung + So_chung_chi cho từng chi tiết.
 *
 * Output cho mỗi `phieu`:
 *   { SOPHIEU, MAKHO, NHOMSP, BIENSOXE, CREATED_AT, MANCC, tong_kl,
 *     chi_tiet: [{ dt_day, dt_rong, dt_cao, SOBO, SOTHANH_BO, tong_thanh, kl_m3,
 *                  lo_go_xe, lo_go_tron, chu_rung, chung_chi_cr }] }
 */
router.get('/list', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang)
        const nam = parseInt(req.query.nam)
        const mancc = (req.query.mancc || '').toString().trim()
        if (!thang || !nam || !mancc) {
            return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm/mã NCC' })
        }

        const { recordset } = await new mssql.Request()
            .input('thang', thang).input('nam', nam).input('mancc', mancc)
            .query(`
                SELECT
                    G.SOPHIEU, G.MAKHO, G.NHOMSP, G.BIENSOXE, G.CREATED_AT,
                    G.mancc AS MANCC,
                    G.[DAY] AS dt_day, G.RONG AS dt_rong, G.CAO AS dt_cao,
                    G.SOBO, G.SOTHANH_BO, G.TONG_THANH AS tong_thanh,
                    G.KL_M3 AS kl_m3,
                    G.LO_GO_GAN AS lo_go_xe,
                    G.CHUNG_CHI_GAN AS chung_chi_gan,
                    G.saved_at, G.source AS saved_source, G.he_so AS saved_he_so,
                    N.Lo_go_tron AS lo_go_tron,
                    COALESCE(N.Chu_rung, T.chu_rung) AS chu_rung,
                    COALESCE(N.So_chung_chi, T.chung_chi) AS chung_chi_cr,
                    COALESCE(N.Khoang, T.khoang) AS Khoang,
                    COALESCE(N.Lo, T.lo) AS lo_kt,
                    N.Dien_tich AS dien_tich,
                    N.Thon, N.Xa, N.Huyen, N.cccd, N.dia_chi_cccd,
                    T.dia_chi AS ton_dia_chi,
                    COALESCE(N.So_BKLS, T.so_bkls) AS so_bkls,
                    COALESCE(N.KD, T.kd) AS kd,
                    COALESCE(N.VD, T.vd) AS vd,
                    COALESCE(N.nhom_chung_chi, T.nhom_chung_chi) AS nhom_chung_chi,
                    COALESCE(N.Kl_tron_lo, T.kl_tron_goc) AS kl_tron_lo,
                    H.he_so AS he_so_lo,
                    G.so_phieu_xe, G.so_bkls_xe
                FROM [prod].[GHEP_LO_GO_RESULT] G
                LEFT JOIN (
                    SELECT
                        Lo_go,
                        MIN(Lo_go_tron) AS Lo_go_tron,
                        MIN(Chu_rung) AS Chu_rung,
                        MIN(So_chung_chi) AS So_chung_chi,
                        MIN(Khoang) AS Khoang,
                        MIN(Lo) AS Lo,
                        AVG(Dien_tich) AS Dien_tich,
                        MIN(Thon) AS Thon,
                        MIN(Xa) AS Xa,
                        MIN(Huyen) AS Huyen,
                        MIN(cccd) AS cccd,
                        MIN(dia_chi_cccd) AS dia_chi_cccd,
                        MIN(So_BKLS) AS So_BKLS,
                        MIN(KD) AS KD,
                        MIN(VD) AS VD,
                        MIN(nhom_chung_chi) AS nhom_chung_chi,
                        SUM(Khoi_luong) AS Kl_tron_lo
                    FROM [prod].[NHAP_GO_TRON]
                    WHERE Lo_go IS NOT NULL
                    GROUP BY Lo_go
                ) N ON LTRIM(RTRIM(G.LO_GO_GAN)) = LTRIM(RTRIM(N.Lo_go))
                LEFT JOIN [prod].[LO_GO_HE_SO] H
                    ON LTRIM(RTRIM(G.LO_GO_GAN)) = LTRIM(RTRIM(H.lo_go))
                LEFT JOIN [prod].[LO_GO_TON_TRON] T
                    ON LTRIM(RTRIM(G.LO_GO_GAN)) = LTRIM(RTRIM(T.lo_go))
                    AND T.thang = @thang AND T.nam = @nam
                    AND LTRIM(RTRIM(T.mancc)) = @mancc
                WHERE G.thang = @thang AND G.nam = @nam
                    AND LTRIM(RTRIM(G.mancc)) = @mancc
                ORDER BY G.CREATED_AT, G.SOPHIEU, G.id
            `)

        // Group thành phiếu theo SOPHIEU
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
                    so_phieu_xe: d.so_phieu_xe ? d.so_phieu_xe.trim() : null,
                    so_bkls_xe: d.so_bkls_xe ? d.so_bkls_xe.trim() : null,
                    chi_tiet: [],
                    tong_kl: 0,
                }
            }
            phieuMap[d.SOPHIEU].chi_tiet.push({
                dt_day: d.dt_day,
                dt_rong: d.dt_rong,
                dt_cao: d.dt_cao,
                SOBO: d.SOBO,
                SOTHANH_BO: d.SOTHANH_BO,
                tong_thanh: d.tong_thanh,
                kl_m3: d.kl_m3,
                lo_go_xe: d.lo_go_xe ? d.lo_go_xe.trim() : null,
                lo_go_tron: d.lo_go_tron ? d.lo_go_tron.trim() : null,
                chu_rung: d.chu_rung ? d.chu_rung.trim() : null,
                chung_chi_cr: d.chung_chi_cr ? d.chung_chi_cr.trim() : null,
                chung_chi_gan: d.chung_chi_gan ? d.chung_chi_gan.trim() : null,
                khoang: d.Khoang, lo: d.lo_kt, dien_tich: d.dien_tich,
                thon: d.Thon, xa: d.Xa, huyen: d.Huyen,
                ton_dia_chi: d.ton_dia_chi ? String(d.ton_dia_chi).trim() : null,
                cccd: d.cccd, dia_chi_cccd: d.dia_chi_cccd,
                so_bkls: d.so_bkls ? d.so_bkls.trim() : null,
                kd: d.kd ? String(d.kd).trim() : null,
                vd: d.vd ? String(d.vd).trim() : null,
                nhom_chung_chi: d.nhom_chung_chi ? d.nhom_chung_chi.trim() : null,
                // Ưu tiên hệ số riêng theo lô (LO_GO_HE_SO);
                // fallback saved_he_so (giá trị global lúc save biên bản)
                he_so: d.he_so_lo != null ? d.he_so_lo : (d.saved_he_so || null),
                kl_tron_lo: d.kl_tron_lo != null ? Number(d.kl_tron_lo) : null,
            })
            phieuMap[d.SOPHIEU].tong_kl += (d.kl_m3 || 0)
        })

        const phieu = Object.values(phieuMap)
        const saved_at = recordset.length ? recordset[0].saved_at : null
        res.api.sendData({
            phieu,
            tong_phieu: phieu.length,
            tong_chi_tiet: recordset.length,
            saved_at,
            thang, nam, mancc,
        })
    } catch (err) {
        console.error('[phieu-go-xe/list]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * POST /save-so-phieu
 * Body: { thang, nam, mancc, items: [{ SOPHIEU, so_phieu_xe, so_bkls_xe }] }
 * Update so_phieu_xe + so_bkls_xe cho tất cả các dòng cùng (thang, nam, mancc, SOPHIEU).
 */
router.post('/save-so-phieu', async (req, res) => {
    try {
        const thang = parseInt(req.body.thang)
        const nam = parseInt(req.body.nam)
        const mancc = (req.body.mancc || '').toString().trim()
        const items = Array.isArray(req.body.items) ? req.body.items : []
        if (!thang || !nam || !mancc) {
            return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm/mã NCC' })
        }
        if (!items.length) {
            return res.api.sendFail({ number: 4900, message: 'Không có dòng nào để lưu' })
        }

        const tx = new mssql.Transaction()
        await tx.begin()
        let updatedPhieu = 0
        let updatedRows = 0
        try {
            for (const it of items) {
                if (!it || !it.SOPHIEU) continue
                const result = await new mssql.Request(tx)
                    .input('thang', thang)
                    .input('nam', nam)
                    .input('mancc', mancc)
                    .input('sophieu', String(it.SOPHIEU))
                    .input('so_phieu_xe', it.so_phieu_xe || null)
                    .input('so_bkls_xe', it.so_bkls_xe || null)
                    .query(`
                        UPDATE [prod].[GHEP_LO_GO_RESULT]
                        SET so_phieu_xe = @so_phieu_xe,
                            so_bkls_xe  = @so_bkls_xe
                        WHERE thang = @thang AND nam = @nam
                          AND LTRIM(RTRIM(mancc)) = @mancc
                          AND SOPHIEU = @sophieu
                    `)
                const n = result.rowsAffected[0] || 0
                if (n > 0) { updatedPhieu++; updatedRows += n }
            }
            await tx.commit()
        } catch (err) {
            await tx.rollback()
            throw err
        }

        res.api.sendData({
            updated_phieu: updatedPhieu,
            updated_rows: updatedRows,
            total_input: items.length,
            thang, nam, mancc,
        })
    } catch (err) {
        console.error('[phieu-go-xe/save-so-phieu]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * GET /last-bkls?thang=&nam=&mancc=
 * Lấy số BKLS lớn nhất đã lưu (so_bkls_xe) cho (nam, mancc) ở các tháng < thang.
 * Dùng để auto đề xuất bklsStart cho tháng đang xem (= max + 1).
 *
 * Số BKLS có format "<n>/<year>/BKLS" → parse "<n>" làm số nguyên.
 */
router.get('/last-bkls', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang)
        const nam = parseInt(req.query.nam)
        const mancc = (req.query.mancc || '').toString().trim()
        if (!thang || !nam || !mancc) {
            return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm/mã NCC' })
        }
        const { recordset } = await new mssql.Request()
            .input('thang', thang).input('nam', nam).input('mancc', mancc)
            .query(`
                SELECT MAX(TRY_CAST(LEFT(so_bkls_xe, CHARINDEX('/', so_bkls_xe + '/') - 1) AS INT)) AS max_bkls
                FROM [prod].[GHEP_LO_GO_RESULT]
                WHERE nam = @nam AND thang < @thang
                  AND LTRIM(RTRIM(mancc)) = @mancc
                  AND so_bkls_xe IS NOT NULL
                  AND so_bkls_xe LIKE '%/%'
            `)
        const maxBkls = (recordset[0] && recordset[0].max_bkls) || null
        res.api.sendData({ max_bkls: maxBkls, thang, nam, mancc })
    } catch (err) {
        console.error('[phieu-go-xe/last-bkls]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * GET /count-prev?thang=&nam=&mancc=
 * Đếm số phiếu (DISTINCT SOPHIEU) đã lưu trong GHEP_LO_GO_RESULT cho
 * (nam, mancc) ở các tháng < thang. Dùng để tính tiếp số BKLS qua các tháng.
 */
router.get('/count-prev', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang)
        const nam = parseInt(req.query.nam)
        const mancc = (req.query.mancc || '').toString().trim()
        if (!thang || !nam || !mancc) {
            return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm/mã NCC' })
        }
        const { recordset } = await new mssql.Request()
            .input('thang', thang).input('nam', nam).input('mancc', mancc)
            .query(`
                SELECT COUNT(DISTINCT SOPHIEU) AS so_phieu_truoc
                FROM [prod].[GHEP_LO_GO_RESULT]
                WHERE nam = @nam AND thang < @thang
                  AND LTRIM(RTRIM(mancc)) = @mancc
            `)
        const count = (recordset[0] && recordset[0].so_phieu_truoc) || 0
        res.api.sendData({ so_phieu_truoc: count, thang, nam, mancc })
    } catch (err) {
        console.error('[phieu-go-xe/count-prev]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

module.exports = router
