const express = require('express')
const router = express.Router()
const mssql = require('mssql')
const { getErrorMessage } = require('./../core/config')

/**
 * GET /so-sanh?thang=&nam=
 * So sánh KH khai thác vs thực nhập (NHAP_GO_TRON) theo tháng/năm.
 * Liên kết bằng tên chủ rừng (normalize).
 */
router.get('/so-sanh', (req, res) => {
    const thang = req.query.thang || null
    const nam = req.query.nam || null

    new mssql.Request()
        .input('thang', thang)
        .input('nam', nam)
        .query(`
            ;WITH kh AS (
                SELECT
                    ten_ho,
                    xa,
                    thon,
                    khoanh,
                    lo,
                    dien_tich,
                    kl_bang_ke,
                    kl_go,
                    thang,
                    nam,
                    source_sheet,
                    LTRIM(RTRIM(LOWER(ten_ho))) AS ten_norm
                FROM [prod].[KH_KHAI_THAC]
                WHERE (@thang IS NULL OR thang = @thang)
                  AND (@nam IS NULL OR nam = @nam)
            ),
            tt AS (
                SELECT
                    Chu_rung,
                    LTRIM(RTRIM(LOWER(Chu_rung))) AS ten_norm,
                    COUNT(*) AS so_phieu,
                    SUM(CASE WHEN Khoi_luong > 0 THEN 1 ELSE 0 END) AS so_phieu_co_kl,
                    SUM(ISNULL(Khoi_luong, 0)) AS tong_kl_nhap,
                    MIN(Ngay_nhap) AS ngay_nhap_dau,
                    MAX(Ngay_nhap) AS ngay_nhap_cuoi
                FROM [prod].[NHAP_GO_TRON]
                WHERE Chu_rung IS NOT NULL
                GROUP BY Chu_rung, LTRIM(RTRIM(LOWER(Chu_rung)))
            )
            SELECT
                ROW_NUMBER() OVER (ORDER BY kh.ten_ho) AS stt,
                kh.ten_ho,
                kh.xa,
                kh.khoanh,
                kh.lo,
                kh.dien_tich,
                kh.kl_bang_ke AS kl_ke_hoach_bk,
                kh.kl_go AS kl_ke_hoach,
                kh.thang,
                kh.nam,
                kh.source_sheet,
                ISNULL(tt.tong_kl_nhap, 0) AS kl_thuc_nhap,
                ISNULL(tt.so_phieu, 0) AS so_phieu,
                ISNULL(tt.so_phieu_co_kl, 0) AS so_phieu_co_kl,
                tt.ngay_nhap_dau,
                tt.ngay_nhap_cuoi,
                ISNULL(tt.tong_kl_nhap, 0) - ISNULL(kh.kl_go, 0) AS chenh_lech,
                CASE
                    WHEN tt.tong_kl_nhap IS NULL OR tt.tong_kl_nhap = 0 THEN N'Chưa nhập'
                    WHEN ABS(ISNULL(tt.tong_kl_nhap, 0) - ISNULL(kh.kl_go, 0)) < 0.1 THEN N'Đúng KH'
                    WHEN tt.tong_kl_nhap < kh.kl_go THEN N'Nhập thiếu'
                    ELSE N'Nhập đủ/thừa'
                END AS trang_thai
            FROM kh
            LEFT JOIN tt ON kh.ten_norm = tt.ten_norm
            ORDER BY kh.thang, kh.nam, kh.ten_ho
        `, (err, record) => {
            if (err) return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

/**
 * GET /tong-hop
 * Tổng hợp nhanh theo tháng/năm
 */
router.get('/tong-hop', (req, res) => {
    new mssql.Request().query(`
        SELECT
            kh.thang, kh.nam,
            COUNT(DISTINCT kh.ten_ho) AS so_ho_kh,
            SUM(ISNULL(kh.kl_go, 0)) AS tong_kl_kh,
            (SELECT COUNT(DISTINCT Chu_rung) FROM [prod].[NHAP_GO_TRON] WHERE Khoi_luong > 0) AS so_chu_rung_nhap,
            (SELECT SUM(Khoi_luong) FROM [prod].[NHAP_GO_TRON] WHERE Khoi_luong > 0) AS tong_kl_nhap,
            kh.source_sheet
        FROM [prod].[KH_KHAI_THAC] kh
        GROUP BY kh.thang, kh.nam, kh.source_sheet
        ORDER BY kh.nam, kh.thang
    `, (err, record) => {
        if (err) return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})

/**
 * GET /ngoai-kh
 * Chủ rừng có phiếu nhập nhưng không có trong KH
 */
router.get('/ngoai-kh', (req, res) => {
    new mssql.Request().query(`
        SELECT
            Chu_rung AS ten_ho,
            COUNT(*) AS so_phieu,
            SUM(ISNULL(Khoi_luong, 0)) AS tong_kl,
            MIN(Ngay_nhap) AS ngay_nhap_dau,
            MAX(Ngay_nhap) AS ngay_nhap_cuoi
        FROM [prod].[NHAP_GO_TRON]
        WHERE Khoi_luong > 0
          AND LTRIM(RTRIM(LOWER(Chu_rung))) NOT IN (
              SELECT LTRIM(RTRIM(LOWER(ten_ho))) FROM [prod].[KH_KHAI_THAC]
          )
        GROUP BY Chu_rung
        ORDER BY Chu_rung
    `, (err, record) => {
        if (err) return res.api.sendFail(getErrorMessage(4907))
        res.api.sendData(record.recordset)
    })
})

/**
 * GET /nhap-xuat-ton?nam=2026&xuong_xe=...
 * Báo cáo Nhập-Xuất-Tồn theo tháng.
 *   - Nhập: KL gỗ kế hoạch tháng (KH_KHAI_THAC, không tính tồn carry-over)
 *   - Xuất: KL gỗ đã chia trong tháng (NHAP_GO_TRON, theo thang_chia/nam_chia)
 *   - Tồn đầu kỳ: KL tồn được chuyển VÀO tháng đó (KH_KHAI_THAC source_sheet='TON')
 *   - Tồn cuối kỳ = tồn đầu kỳ + nhập - xuất
 *   (Tồn cuối kỳ tháng X = tồn đầu kỳ tháng X+1)
 */
router.get('/nhap-xuat-ton', async (req, res) => {
    try {
        const nam = parseInt(req.query.nam) || null
        const xuong = (req.query.xuong_xe || '').toString().trim() || null

        const r = new mssql.Request()
        if (nam) r.input('nam', nam)
        if (xuong) r.input('xuong', xuong)

        const filterKH = (alias) => {
            const conds = []
            if (nam) conds.push(`${alias}.nam = @nam`)
            if (xuong) conds.push(`LTRIM(RTRIM(ISNULL(${alias}.xuong_xe, ''))) = @xuong`)
            return conds.length ? ' AND ' + conds.join(' AND ') : ''
        }
        const filterNGT = (alias) => {
            const conds = []
            if (nam) conds.push(`${alias}.nam_chia = @nam`)
            if (xuong) conds.push(`LTRIM(RTRIM(ISNULL(${alias}.Xuong_xe, ''))) = @xuong`)
            return conds.length ? ' AND ' + conds.join(' AND ') : ''
        }

        const sql = `
            ;WITH nhap AS (
                SELECT thang, nam, SUM(ISNULL(kl_go, kl_bang_ke)) AS kl
                FROM [prod].[KH_KHAI_THAC] kh
                WHERE (source_sheet IS NULL OR source_sheet <> 'TON')
                  ${filterKH('kh')}
                GROUP BY thang, nam
            ),
            ton_dau AS (
                SELECT thang, nam, SUM(ISNULL(kl_go, kl_bang_ke)) AS kl
                FROM [prod].[KH_KHAI_THAC] kh
                WHERE source_sheet = 'TON'
                  ${filterKH('kh')}
                GROUP BY thang, nam
            ),
            xuat AS (
                SELECT thang_chia AS thang, nam_chia AS nam, SUM(ISNULL(Khoi_luong, 0)) AS kl
                FROM [prod].[NHAP_GO_TRON] ng
                WHERE thang_chia IS NOT NULL AND nam_chia IS NOT NULL
                  ${filterNGT('ng')}
                GROUP BY thang_chia, nam_chia
            ),
            keys AS (
                SELECT thang, nam FROM nhap
                UNION SELECT thang, nam FROM ton_dau
                UNION SELECT thang, nam FROM xuat
            )
            SELECT
                k.thang, k.nam,
                ISNULL(td.kl, 0) AS ton_dau_ky,
                ISNULL(n.kl, 0)  AS nhap,
                ISNULL(x.kl, 0)  AS xuat,
                ISNULL(td.kl, 0) + ISNULL(n.kl, 0) - ISNULL(x.kl, 0) AS ton_cuoi_ky
            FROM keys k
            LEFT JOIN nhap    n  ON n.thang  = k.thang AND n.nam  = k.nam
            LEFT JOIN ton_dau td ON td.thang = k.thang AND td.nam = k.nam
            LEFT JOIN xuat    x  ON x.thang  = k.thang AND x.nam  = k.nam
            ORDER BY k.nam, k.thang
        `
        const { recordset } = await r.query(sql)
        res.api.sendData(recordset)
    } catch (err) {
        console.error('[nhap-xuat-ton]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

module.exports = router
