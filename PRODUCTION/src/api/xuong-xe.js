const express = require('express')
const router = express.Router()
const mssql = require('mssql')

// GET / — danh sách xưởng
router.get('/', async (req, res) => {
    try {
        const { recordset } = await new mssql.Request()
            .query('SELECT * FROM [prod].[XUONG_XE] ORDER BY ma')
        res.api.sendData(recordset)
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

// POST / — thêm
router.post('/', async (req, res) => {
    try {
        const d = req.body
        const { recordset } = await new mssql.Request()
            .input('ma', d.ma).input('ten', d.ten).input('dia_chi', d.dia_chi || null)
            .input('mst', d.mst || null).input('sdt', d.sdt || null)
            .input('chung_chi', d.chung_chi || null).input('hieu_luc_cc', d.hieu_luc_cc || null)
            .input('nguoi_dai_dien', d.nguoi_dai_dien || null).input('chuc_vu', d.chuc_vu || null)
            .input('nguoi_nhan', d.nguoi_nhan || null).input('mancc_woodsland', d.mancc_woodsland || null)
            .input('bm_nghiem_thu', d.bm_nghiem_thu || null)
            .input('bm_nhap_kho', d.bm_nhap_kho || null)
            .input('ngay_ban_hanh', d.ngay_ban_hanh || null)
            .input('lan_ban_hanh', d.lan_ban_hanh || null)
            .query(`INSERT INTO [prod].[XUONG_XE]
                    (ma, ten, dia_chi, mst, sdt, chung_chi, hieu_luc_cc, nguoi_dai_dien, chuc_vu, nguoi_nhan, mancc_woodsland, bm_nghiem_thu, bm_nhap_kho, ngay_ban_hanh, lan_ban_hanh)
                    OUTPUT INSERTED.*
                    VALUES (@ma, @ten, @dia_chi, @mst, @sdt, @chung_chi, @hieu_luc_cc, @nguoi_dai_dien, @chuc_vu, @nguoi_nhan, @mancc_woodsland, @bm_nghiem_thu, @bm_nhap_kho, @ngay_ban_hanh, @lan_ban_hanh)`)
        res.api.sendData(recordset[0])
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

// PUT /:id — sửa
router.put('/:id', async (req, res) => {
    try {
        const d = req.body
        const { recordset } = await new mssql.Request()
            .input('id', req.params.id)
            .input('ma', d.ma).input('ten', d.ten).input('dia_chi', d.dia_chi || null)
            .input('mst', d.mst || null).input('sdt', d.sdt || null)
            .input('chung_chi', d.chung_chi || null).input('hieu_luc_cc', d.hieu_luc_cc || null)
            .input('nguoi_dai_dien', d.nguoi_dai_dien || null).input('chuc_vu', d.chuc_vu || null)
            .input('nguoi_nhan', d.nguoi_nhan || null).input('mancc_woodsland', d.mancc_woodsland || null)
            .input('bm_nghiem_thu', d.bm_nghiem_thu || null)
            .input('bm_nhap_kho', d.bm_nhap_kho || null)
            .input('ngay_ban_hanh', d.ngay_ban_hanh || null)
            .input('lan_ban_hanh', d.lan_ban_hanh || null)
            .query(`UPDATE [prod].[XUONG_XE] SET
                    ma=@ma, ten=@ten, dia_chi=@dia_chi, mst=@mst, sdt=@sdt,
                    chung_chi=@chung_chi, hieu_luc_cc=@hieu_luc_cc,
                    nguoi_dai_dien=@nguoi_dai_dien, chuc_vu=@chuc_vu,
                    nguoi_nhan=@nguoi_nhan, mancc_woodsland=@mancc_woodsland,
                    bm_nghiem_thu=@bm_nghiem_thu, bm_nhap_kho=@bm_nhap_kho,
                    ngay_ban_hanh=@ngay_ban_hanh, lan_ban_hanh=@lan_ban_hanh
                    OUTPUT INSERTED.*
                    WHERE id=@id`)
        res.api.sendData(recordset[0])
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

// DELETE /:id — xóa
router.delete('/:id', async (req, res) => {
    try {
        await new mssql.Request().input('id', req.params.id)
            .query('DELETE FROM [prod].[XUONG_XE] WHERE id=@id')
        res.api.sendData({ deleted: true })
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

module.exports = router
