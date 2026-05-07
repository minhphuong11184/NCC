const express = require('express')
const router = express.Router()
const mssql = require('mssql')
const { getErrorMessage } = require('./../core/config')

/**
 * POST /phan-bo
 * Body: { thang, nam, xe: [{bien_so, m3}], dung_sai, so_chuyen_max }
 * so_chuyen_max: giới hạn số chuyến xe. Nếu không set = chia hết.
 * Trả về: { phieu: [...], ton: [...], ... }
 *   - phieu: các chuyến xe đã chia
 *   - ton: các hộ còn tồn KL chưa chia hết
 */
router.post('/phan-bo', async (req, res) => {
    try {
        const thang = req.body.thang || null
        const nam = req.body.nam || null
        const xuongXe = (req.body.xuong_xe || '').toString().trim() || null
        const phanTram = req.body.dung_sai || 10
        const soChuyen_max = req.body.so_chuyen_max || null // null = chia hết
        const minKlChuyen = parseFloat(req.body.min_kl_chuyen) || 20

        let rawXe = req.body.xe || [{ bien_so: '19C-16601', m3: 30 }, { bien_so: '19C-05899', m3: 30 }, { bien_so: '19C-06609', m3: 30 }, { bien_so: '20C05925', m3: 28 }]
        const danhSachXe = rawXe.map(x => typeof x === 'string' ? { bien_so: x, m3: 30 } : { bien_so: x.bien_so, m3: x.m3 || 30 })

        if (!danhSachXe.length) return res.api.sendFail({ number: 4900, message: 'Chưa có danh sách xe' })
        if (!xuongXe) return res.api.sendFail({ number: 4900, message: 'Chưa chọn xưởng xẻ' })

        // Chặn: nếu (thang, nam, xưởng) đã có data chia xe trước đó → không cho chia lại
        if (thang && nam) {
            const checkReq = new mssql.Request()
                .input('thang', thang).input('nam', nam).input('xuong', xuongXe)
            const checkRes = await checkReq.query(`
                SELECT COUNT(*) AS so_dong, COUNT(DISTINCT So_phieu) AS so_phieu
                FROM [prod].[NHAP_GO_TRON]
                WHERE thang_chia = @thang AND nam_chia = @nam
                  AND LTRIM(RTRIM(ISNULL(Xuong_xe, ''))) = @xuong
            `)
            const r0 = checkRes.recordset[0]
            if (r0 && r0.so_dong > 0) {
                return res.api.sendFail({
                    number: 4900,
                    message: `Tháng ${thang}/${nam} - xưởng "${xuongXe}" đã chia xe rồi (${r0.so_phieu} phiếu / ${r0.so_dong} dòng). Không cho chia lại.`,
                })
            }
        }

        // Lấy KH đúng tháng + xưởng đang chia (đã bao gồm tồn từ chia tháng trước —
        // tồn được lưu vào KH_KHAI_THAC với thang = tháng_sau + source_sheet='TON')
        const request = new mssql.Request().input('xuong', xuongXe)
        if (nam) request.input('nam', nam)
        const where = []
        if (thang) {
            request.input('thang', thang)
            where.push('thang = @thang')
        }
        if (nam) where.push('nam = @nam')
        where.push('(kl_go > 0 OR kl_bang_ke > 0)')
        where.push('LTRIM(RTRIM(ISNULL(xuong_xe, \'\'))) = @xuong')
        const q = `SELECT * FROM [prod].[KH_KHAI_THAC] WHERE ${where.join(' AND ')} ORDER BY thang, ten_ho`
        const { recordset } = await request.query(q)
        if (!recordset.length) {
            return res.api.sendFail({
                number: 4900,
                message: `Không có KH nào của xưởng "${xuongXe}" trong tháng ${thang || '*'}/${nam || '*'}.`,
            })
        }

        const result = []
        const ton = []
        let xeIdx = 0
        let sttPhieu = 0
        let daDuChuyen = false // đã đạt giới hạn số chuyến

        for (const ho of recordset) {
            const klTong = ho.kl_go || ho.kl_bang_ke || 0
            if (klTong <= 0) continue

            if (daDuChuyen) {
                ton.push({
                    ten_ho: ho.ten_ho, xa: ho.xa, thon: ho.thon,
                    kl_kh: klTong, kl_da_chia: 0, kl_ton: klTong,
                    khoanh: ho.khoanh, lo: ho.lo, dien_tich: ho.dien_tich,
                    loai_cay: ho.loai_cay, nam_trong: ho.nam_trong,
                    cccd: ho.cccd, chung_chi: ho.chung_chi, so_bkls: ho.so_bkls,
                    ngay_bkls: ho.ngay_bkls, thang_goc: ho.thang, nam: ho.nam,
                    lo_go_tron: ho.lo_go_tron, lo_go_xe: ho.lo_go_xe,
                    dia_chi_cccd: ho.dia_chi_cccd, don_gia: ho.don_gia,
                    KD: ho.KD, VD: ho.VD,
                    xuong_xe: ho.xuong_xe,
                    nhom_chung_chi: ho.nhom_chung_chi,
                })
                continue
            }

            const klCacChuyen = []
            const xeCacChuyen = []
            let klConLai = klTong

            while (klConLai > 0.01) {
                if (soChuyen_max && (sttPhieu + klCacChuyen.length + 1) > soChuyen_max) {
                    // Đạt giới hạn chuyến → phần còn lại thành tồn
                    daDuChuyen = true
                    break
                }

                const xeHienTai = danhSachXe[xeIdx % danhSachXe.length]
                xeIdx++
                const xeMax = xeHienTai.m3 * (1 + phanTram / 100)
                const xeMin = xeHienTai.m3 * (1 - phanTram / 100)

                if (klConLai <= xeMax) {
                    klCacChuyen.push(Math.round(klConLai * 100) / 100)
                    xeCacChuyen.push(xeHienTai)
                    klConLai = 0
                } else {
                    const kl = Math.round((xeMin + Math.random() * (xeMax - xeMin)) * 100) / 100
                    klCacChuyen.push(kl)
                    xeCacChuyen.push(xeHienTai)
                    klConLai -= kl
                }
            }

            // === Cân chuyến: chia max trước; nếu chuyến cuối < min thì redistribute ===
            // Quy tắc:
            //   1. Stage A (đã làm trong vòng while ở trên): mỗi chuyến random trong
            //      [xeMin, xeMax] — gần xeMax (chia max).
            //   2. Stage B: nếu chuyến cuối < minKlChuyen → tổng hợp lại, tìm N tối ưu
            //      (smallest N s.t. avg ≤ xeMax) rồi gen KL ngẫu nhiên trong [min, xeMax]
            //      sao cho sum = tổng KL — các chuyến KHÁC NHAU (không giống hệt).
            const lastIdx = klCacChuyen.length - 1
            if (klCacChuyen.length > 1
                && klCacChuyen[lastIdx] < minKlChuyen - 0.01) {
                const tongHoChia = klCacChuyen.reduce((s, k) => s + k, 0)
                const N_orig = klCacChuyen.length
                // Smallest N: avg = tongHoChia/N ≤ xeMax mọi xe[0..N-1]
                let n_opt = N_orig
                for (let n = 1; n <= N_orig; n++) {
                    const avg = tongHoChia / n
                    const fitAll = xeCacChuyen.slice(0, n).every(
                        x => avg <= x.m3 * (1 + phanTram / 100) + 0.01
                    )
                    if (fitAll) { n_opt = n; break }
                }
                const xeArr = xeCacChuyen.slice(0, n_opt)
                const maxes = xeArr.map(x => x.m3 * (1 + phanTram / 100))
                // effMin: nếu tổng quá nhỏ, ko ép được min (avg < min)
                const effMin = Math.min(minKlChuyen, tongHoChia / n_opt - 0.01)

                // Sinh KL ngẫu nhiên trong [effMin, maxes[i]], tổng = tongHoChia
                const newKl = []
                let remaining = tongHoChia
                for (let i = 0; i < n_opt - 1; i++) {
                    const remN = n_opt - i - 1
                    const remMin = effMin * remN
                    const remMax = maxes.slice(i + 1).reduce((s, m) => s + m, 0)
                    const lower = Math.max(effMin, remaining - remMax)
                    const upper = Math.min(maxes[i], remaining - remMin)
                    let kl
                    if (upper - lower < 0.01) {
                        kl = (lower + upper) / 2
                    } else {
                        kl = lower + Math.random() * (upper - lower)
                    }
                    kl = Math.round(kl * 100) / 100
                    newKl.push(kl)
                    remaining = Math.round((remaining - kl) * 100) / 100
                }
                newKl.push(Math.round(remaining * 100) / 100)
                klCacChuyen = newKl
                xeCacChuyen = xeArr
            }

            const soChuyen = klCacChuyen.length
            const klDaChia = klCacChuyen.reduce((s, k) => s + k, 0)

            for (let c = 0; c < soChuyen; c++) {
                sttPhieu++
                result.push({
                    stt: sttPhieu,
                    so_phieu_du_kien: `${sttPhieu}/${thang || ''}-TT`,
                    ten_ho: ho.ten_ho,
                    xa: ho.xa,
                    thon: ho.thon,
                    khoi_luong: klCacChuyen[c],
                    xe: xeCacChuyen[c].bien_so,
                    xe_m3: xeCacChuyen[c].m3,
                    kl_tong_ho: klTong,
                    so_chuyen_ho: soChuyen,
                    chuyen_thu: c + 1,
                    khoanh: ho.khoanh,
                    lo: ho.lo,
                    dien_tich: ho.dien_tich,
                    loai_cay: ho.loai_cay,
                    nam_trong: ho.nam_trong,
                    cccd: ho.cccd,
                    chung_chi: ho.chung_chi,
                    so_bkls: ho.so_bkls,
                    ngay_bkls: ho.ngay_bkls,
                    thang: ho.thang,
                    nam: ho.nam,
                    lo_go_tron: ho.lo_go_tron,
                    lo_go_xe: ho.lo_go_xe,
                    dia_chi_cccd: ho.dia_chi_cccd,
                    don_gia: ho.don_gia,
                    KD: ho.KD,
                    VD: ho.VD,
                    xuong_xe: ho.xuong_xe,
                    nhom_chung_chi: ho.nhom_chung_chi,
                })
            }

            // Nếu còn tồn (chia dở giữa chừng)
            const klTon = Math.round((klTong - klDaChia) * 100) / 100
            if (klTon > 0.01) {
                ton.push({
                    ten_ho: ho.ten_ho, xa: ho.xa, thon: ho.thon,
                    kl_kh: klTong, kl_da_chia: Math.round(klDaChia * 100) / 100, kl_ton: klTon,
                    khoanh: ho.khoanh, lo: ho.lo, dien_tich: ho.dien_tich,
                    loai_cay: ho.loai_cay, nam_trong: ho.nam_trong,
                    cccd: ho.cccd, chung_chi: ho.chung_chi, so_bkls: ho.so_bkls,
                    ngay_bkls: ho.ngay_bkls, thang_goc: ho.thang, nam: ho.nam,
                    lo_go_tron: ho.lo_go_tron, lo_go_xe: ho.lo_go_xe,
                    dia_chi_cccd: ho.dia_chi_cccd, don_gia: ho.don_gia,
                    KD: ho.KD, VD: ho.VD,
                    xuong_xe: ho.xuong_xe,
                    nhom_chung_chi: ho.nhom_chung_chi,
                })
            }
        }

        res.api.sendData({
            so_ho: recordset.length,
            so_phieu: result.length,
            tong_kl: Math.round(result.reduce((s, r) => s + r.khoi_luong, 0) * 100) / 100,
            xe: danhSachXe,
            dung_sai: phanTram,
            phieu: result,
            ton: ton,
            tong_ton: Math.round(ton.reduce((s, t) => s + t.kl_ton, 0) * 100) / 100,
            so_ho_ton: ton.length,
        })
    } catch (err) {
        console.error(err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * POST /luu
 * Body: { phieu: [...], truncate }
 * Lưu kết quả chia xe vào bảng NHAP_GO_TRON
 */
router.post('/luu', async (req, res) => {
    try {
        const rows = Array.isArray(req.body.phieu) ? req.body.phieu : []
        const thangChia = parseInt(req.body.thang_chia) || null
        const namChia = parseInt(req.body.nam_chia) || null
        const xuongChia = (req.body.xuong_xe || '').toString().trim() || null
        if (!rows.length) return res.api.sendFail({ number: 4900, message: 'Không có dữ liệu để lưu' })
        if (!thangChia || !namChia) return res.api.sendFail({
            number: 4900, message: 'Thiếu tháng/năm chia (thang_chia, nam_chia)'
        })
        if (!xuongChia) return res.api.sendFail({
            number: 4900, message: 'Thiếu xưởng xẻ (xuong_xe)'
        })

        // Chặn defensive: nếu đã có data chia xe của (thang, nam, xưởng) → không cho lưu
        const checkRes = await new mssql.Request()
            .input('thang', thangChia).input('nam', namChia).input('xuong', xuongChia)
            .query(`
                SELECT COUNT(*) AS so_dong
                FROM [prod].[NHAP_GO_TRON]
                WHERE thang_chia = @thang AND nam_chia = @nam
                  AND LTRIM(RTRIM(ISNULL(Xuong_xe, ''))) = @xuong
            `)
        if (checkRes.recordset[0].so_dong > 0) {
            return res.api.sendFail({
                number: 4900,
                message: `Tháng ${thangChia}/${namChia} - xưởng "${xuongChia}" đã chia xe rồi. Không cho lưu lại.`,
            })
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
        table.columns.add('Ngay_BKLS', mssql.NVarChar(200), { nullable: true })
        table.columns.add('cccd', mssql.NVarChar(500), { nullable: true })
        table.columns.add('dia_chi_cccd', mssql.NVarChar(500), { nullable: true })
        table.columns.add('Thon', mssql.NVarChar(255), { nullable: true })
        table.columns.add('KD', mssql.NVarChar(50), { nullable: true })
        table.columns.add('VD', mssql.NVarChar(50), { nullable: true })
        table.columns.add('thang_chia', mssql.Int, { nullable: true })
        table.columns.add('nam_chia', mssql.Int, { nullable: true })
        table.columns.add('Nam_trong', mssql.Int, { nullable: true })
        table.columns.add('nhom_chung_chi', mssql.NVarChar(255), { nullable: true })

        rows.forEach(d => table.rows.add(
            d.stt || null,
            d.xuong_xe || null,
            d.ten_ho || null,
            d.xa || null,
            d.huyen || null,
            'Acacia Mangium',
            d.lo_go_tron || null,
            d.thang || null,
            d.so_phieu_du_kien || null,
            d.ngay_nhap ? new Date(d.ngay_nhap) : null,
            d.khoi_luong || null,
            d.xe || null,
            d.chung_chi || null,
            d.hinh_thuc_xe || null,
            d.khoanh || null,
            d.lo || null,
            d.dien_tich || null,
            d.nam || null,
            d.don_gia || null,
            d.so_bkls || null,
            d.go_xe_giao || null,
            d.ngay_bkls || null,
            d.cccd || null,
            d.dia_chi_cccd || null,
            d.thon || null,
            d.KD || null,
            d.VD || null,
            thangChia,
            namChia,
            d.nam_trong || null,
            d.nhom_chung_chi || null
        ))

        const result = await new mssql.Request().bulk(table)
        res.api.sendData({
            inserted: result.rowsAffected,
            thang_chia: thangChia, nam_chia: namChia,
        })
    } catch (err) {
        console.error(err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * GET /da-chia?thang=&nam=
 * Kiểm tra (thang, nam) đã được chia xe chưa.
 * Trả về số phiếu/dòng trong NHAP_GO_TRON + số dòng tồn đã chuyển sang tháng sau.
 */
router.get('/da-chia', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang)
        const nam = parseInt(req.query.nam)
        const xuong = (req.query.xuong_xe || '').toString().trim() || null
        if (!thang || !nam) return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm' })

        const phieuReq = new mssql.Request().input('thang', thang).input('nam', nam)
        let phieuWhere = 'thang_chia = @thang AND nam_chia = @nam'
        if (xuong) {
            phieuReq.input('xuong', xuong)
            phieuWhere += " AND LTRIM(RTRIM(ISNULL(Xuong_xe, ''))) = @xuong"
        }
        const phieuRes = await phieuReq.query(`
            SELECT COUNT(*) AS so_dong, COUNT(DISTINCT So_phieu) AS so_phieu
            FROM [prod].[NHAP_GO_TRON]
            WHERE ${phieuWhere}
        `)

        const tonReq = new mssql.Request().input('thang', thang).input('nam', nam)
        let tonWhere = "chia_thang = @thang AND chia_nam = @nam AND source_sheet = 'TON'"
        if (xuong) {
            tonReq.input('xuong', xuong)
            tonWhere += " AND LTRIM(RTRIM(ISNULL(xuong_xe, ''))) = @xuong"
        }
        const tonRes = await tonReq.query(`
            SELECT COUNT(*) AS so_ton, ISNULL(SUM(kl_go), 0) AS tong_kl_ton
            FROM [prod].[KH_KHAI_THAC]
            WHERE ${tonWhere}
        `)
        const p = phieuRes.recordset[0] || { so_dong: 0, so_phieu: 0 }
        const t = tonRes.recordset[0] || { so_ton: 0, tong_kl_ton: 0 }
        res.api.sendData({
            da_chia: p.so_dong > 0 || t.so_ton > 0,
            so_dong: p.so_dong,
            so_phieu: p.so_phieu,
            so_ton: t.so_ton,
            tong_kl_ton: t.tong_kl_ton,
            thang, nam, xuong_xe: xuong,
        })
    } catch (err) {
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * POST /reset
 * Body: { thang, nam }
 * Xóa toàn bộ data của lần chia (thang, nam):
 *   - NHAP_GO_TRON WHERE thang_chia=X AND nam_chia=Y
 *   - KH_KHAI_THAC WHERE chia_thang=X AND chia_nam=Y AND source_sheet='TON'
 * Sau khi reset có thể chia lại tháng đó.
 */
router.post('/reset', async (req, res) => {
    try {
        const thang = parseInt(req.body.thang)
        const nam = parseInt(req.body.nam)
        const xuong = (req.body.xuong_xe || '').toString().trim() || null
        if (!thang || !nam) return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm' })

        const phieuReq = new mssql.Request().input('thang', thang).input('nam', nam)
        let phieuWhere = 'thang_chia = @thang AND nam_chia = @nam'
        if (xuong) {
            phieuReq.input('xuong', xuong)
            phieuWhere += " AND LTRIM(RTRIM(ISNULL(Xuong_xe, ''))) = @xuong"
        }
        const phieuDel = await phieuReq.query(`
            DELETE FROM [prod].[NHAP_GO_TRON]
            WHERE ${phieuWhere}
        `)

        const tonReq = new mssql.Request().input('thang', thang).input('nam', nam)
        let tonWhere = "chia_thang = @thang AND chia_nam = @nam AND source_sheet = 'TON'"
        if (xuong) {
            tonReq.input('xuong', xuong)
            tonWhere += " AND LTRIM(RTRIM(ISNULL(xuong_xe, ''))) = @xuong"
        }
        const tonDel = await tonReq.query(`
            DELETE FROM [prod].[KH_KHAI_THAC]
            WHERE ${tonWhere}
        `)

        res.api.sendData({
            deleted_phieu: phieuDel.rowsAffected[0] || 0,
            deleted_ton: tonDel.rowsAffected[0] || 0,
            thang, nam, xuong_xe: xuong,
        })
    } catch (err) {
        console.error('[reset chia-xe]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * GET /list-da-chia
 * Liệt kê các (thang, nam) đã chia xe
 */
router.get('/list-da-chia', async (req, res) => {
    try {
        const { recordset } = await new mssql.Request().query(`
            SELECT thang_chia AS thang, nam_chia AS nam,
                   COUNT(*) AS so_dong,
                   COUNT(DISTINCT So_phieu) AS so_phieu,
                   MAX(Ngay_nhap) AS ngay_chia
            FROM [prod].[NHAP_GO_TRON]
            WHERE thang_chia IS NOT NULL AND nam_chia IS NOT NULL
            GROUP BY thang_chia, nam_chia
            ORDER BY nam_chia DESC, thang_chia DESC
        `)
        res.api.sendData(recordset)
    } catch (err) {
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * POST /luu-ton
 * Body: { ton: [...], thang_moi, nam }
 * Lưu KH tồn chưa chia hết vào KH_KHAI_THAC cho tháng sau để gộp chia tiếp.
 * Xóa tồn cũ của tháng đích trước khi insert (chỉ xóa record có source_sheet = 'TON').
 */
router.post('/luu-ton', async (req, res) => {
    try {
        const tonRows = Array.isArray(req.body.ton) ? req.body.ton : []
        const thangMoi = req.body.thang_moi
        const nam = req.body.nam
        const chiaThang = parseInt(req.body.chia_thang) || null
        const chiaNam = parseInt(req.body.chia_nam) || null
        if (!tonRows.length) return res.api.sendFail({ number: 4900, message: 'Không có tồn để lưu' })
        if (!thangMoi || !nam) return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm đích' })
        if (!chiaThang || !chiaNam) return res.api.sendFail({
            number: 4900, message: 'Thiếu tháng/năm chia (chia_thang, chia_nam)'
        })

        const table = new mssql.Table('[prod].[KH_KHAI_THAC]')
        table.create = false
        table.columns.add('thang', mssql.Int, { nullable: true })
        table.columns.add('nam', mssql.Int, { nullable: true })
        table.columns.add('xa', mssql.NVarChar(100), { nullable: true })
        table.columns.add('ten_ho', mssql.NVarChar(200), { nullable: true })
        table.columns.add('thon', mssql.NVarChar(500), { nullable: true })
        table.columns.add('cccd', mssql.NVarChar(500), { nullable: true })
        table.columns.add('chung_chi', mssql.NVarChar(500), { nullable: true })
        table.columns.add('khoanh', mssql.NVarChar(50), { nullable: true })
        table.columns.add('lo', mssql.NVarChar(50), { nullable: true })
        table.columns.add('dien_tich', mssql.Float, { nullable: true })
        table.columns.add('loai_cay', mssql.NVarChar(100), { nullable: true })
        table.columns.add('nam_trong', mssql.Int, { nullable: true })
        table.columns.add('kl_bang_ke', mssql.Float, { nullable: true })
        table.columns.add('kl_go', mssql.Float, { nullable: true })
        table.columns.add('so_bkls', mssql.NVarChar(100), { nullable: true })
        table.columns.add('source_sheet', mssql.NVarChar(100), { nullable: true })
        table.columns.add('source_file', mssql.NVarChar(500), { nullable: true })
        table.columns.add('chia_thang', mssql.Int, { nullable: true })
        table.columns.add('chia_nam', mssql.Int, { nullable: true })
        table.columns.add('xuong_xe', mssql.NVarChar(255), { nullable: true })
        table.columns.add('nhom_chung_chi', mssql.NVarChar(255), { nullable: true })

        tonRows.forEach(d => table.rows.add(
            thangMoi,
            nam,
            d.xa || null,
            d.ten_ho || null,
            d.thon || null,
            d.cccd || null,
            d.chung_chi || null,
            d.khoanh || null,
            d.lo || null,
            d.dien_tich || null,
            d.loai_cay || null,
            d.nam_trong || null,
            d.kl_ton || null,  // kl_bang_ke = kl tồn
            d.kl_ton || null,  // kl_go = kl tồn
            d.so_bkls || null,
            'TON',             // đánh dấu đây là tồn
            'Tồn từ chia ' + chiaThang + '/' + chiaNam,
            chiaThang,
            chiaNam,
            d.xuong_xe || null,
            d.nhom_chung_chi || null
        ))

        const result = await new mssql.Request().bulk(table)
        res.api.sendData({
            inserted: result.rowsAffected,
            thang_moi: thangMoi, nam,
            chia_thang: chiaThang, chia_nam: chiaNam,
        })
    } catch (err) {
        console.error(err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

module.exports = router
