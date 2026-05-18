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
                    N.Chu_rung AS chu_rung,
                    N.So_chung_chi AS chung_chi_cr,
                    N.Khoang, N.Lo AS lo_kt, N.Dien_tich AS dien_tich,
                    N.Thon, N.Xa, N.Huyen, N.cccd, N.dia_chi_cccd,
                    N.So_BKLS AS so_bkls, N.KD AS kd, N.VD AS vd,
                    H.he_so AS he_so_lo
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
                        MIN(VD) AS VD
                    FROM [prod].[NHAP_GO_TRON]
                    WHERE Lo_go IS NOT NULL
                    GROUP BY Lo_go
                ) N ON LTRIM(RTRIM(G.LO_GO_GAN)) = LTRIM(RTRIM(N.Lo_go))
                LEFT JOIN [prod].[LO_GO_HE_SO] H
                    ON LTRIM(RTRIM(G.LO_GO_GAN)) = LTRIM(RTRIM(H.lo_go))
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
                cccd: d.cccd, dia_chi_cccd: d.dia_chi_cccd,
                so_bkls: d.so_bkls ? d.so_bkls.trim() : null,
                kd: d.kd ? String(d.kd).trim() : null,
                vd: d.vd ? String(d.vd).trim() : null,
                // Ưu tiên hệ số riêng theo lô (LO_GO_HE_SO);
                // fallback saved_he_so (giá trị global lúc save biên bản)
                he_so: d.he_so_lo != null ? d.he_so_lo : (d.saved_he_so || null),
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

module.exports = router
