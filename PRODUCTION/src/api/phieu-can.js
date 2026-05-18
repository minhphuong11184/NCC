const express = require('express')
const router = express.Router()
const mssql = require('mssql')

/**
 * GET /list?thang=&nam=&xuong_xe=
 * Lấy danh sách phiếu nhập gỗ tròn đã chia của (thang_chia, nam_chia, xuong_xe).
 * Sắp xếp theo Ngay_nhap rồi So_phieu để phục vụ in phiếu cân.
 */
router.get('/list', async (req, res) => {
    try {
        const thang = parseInt(req.query.thang)
        const nam = parseInt(req.query.nam)
        const xuong = (req.query.xuong_xe || '').toString().trim()
        if (!thang || !nam || !xuong) {
            return res.api.sendFail({ number: 4900, message: 'Thiếu tháng/năm/xưởng xẻ' })
        }
        const { recordset } = await new mssql.Request()
            .input('thang', thang).input('nam', nam).input('xuong', xuong)
            .query(`
                SELECT *
                FROM [prod].[NHAP_GO_TRON]
                WHERE thang_chia = @thang AND nam_chia = @nam
                  AND LTRIM(RTRIM(ISNULL(Xuong_xe, ''))) = @xuong
                ORDER BY Ngay_nhap, So_phieu
            `)
        res.api.sendData(recordset)
    } catch (err) {
        console.error('[phieu-can/list]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

/**
 * POST /update-bi
 * Body: { rows: [{ID, Trong_luong_bi}] }
 * Cập nhật cột Trong_luong_bi cho danh sách phiếu theo ID.
 */
router.post('/update-bi', async (req, res) => {
    try {
        const rows = Array.isArray(req.body.rows) ? req.body.rows : []
        if (!rows.length) return res.api.sendFail({ number: 4900, message: 'Không có dữ liệu' })

        // Validate: ID + Trong_luong_bi phải có
        const valid = rows.filter(r => r && r.ID && r.Trong_luong_bi != null && !isNaN(Number(r.Trong_luong_bi)))
        if (!valid.length) return res.api.sendFail({ number: 4900, message: 'Không có dòng hợp lệ' })

        let updated = 0
        // Dùng transaction để rollback nếu lỗi giữa chừng
        const tx = new mssql.Transaction()
        await tx.begin()
        try {
            for (const r of valid) {
                const reqUpd = new mssql.Request(tx)
                    .input('id', parseInt(r.ID))
                    .input('bi', Math.round(Number(r.Trong_luong_bi) * 100) / 100)
                const result = await reqUpd.query(`
                    UPDATE [prod].[NHAP_GO_TRON]
                    SET Trong_luong_bi = @bi
                    WHERE ID = @id
                `)
                updated += result.rowsAffected[0] || 0
            }
            await tx.commit()
        } catch (err) {
            await tx.rollback()
            throw err
        }

        res.api.sendData({ updated, total_input: rows.length })
    } catch (err) {
        console.error('[phieu-can/update-bi]', err)
        res.api.sendFail({ number: 4907, message: String(err.message || err) })
    }
})

module.exports = router
