const express = require('express')
const router = express.Router()
const mssql = require('mssql')

// GET / — danh sách ca
router.get('/', async (req, res) => {
    try {
        const { recordset } = await new mssql.Request()
            .query('SELECT * FROM [prod].[CA_LAM_VIEC] ORDER BY id')
        res.api.sendData(recordset)
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

// POST / — thêm ca mới
router.post('/', async (req, res) => {
    try {
        const d = req.body
        if (!d.ma || !d.ma.trim()) return res.api.sendFail({ number: 4900, message: 'Mã ca không được để trống' })
        const check = await new mssql.Request().input('ma', d.ma.trim())
            .query("SELECT id FROM [prod].[CA_LAM_VIEC] WHERE LTRIM(RTRIM(ma)) = @ma")
        if (check.recordset.length) return res.api.sendFail({ number: 420, message: 'Mã ca "' + d.ma + '" đã tồn tại' })
        const { recordset } = await new mssql.Request()
            .input('giovao', d.giovao)
            .input('gionghi', d.gionghi || null)
            .input('gionghi1', d.gionghi1 || null)
            .input('giora', d.giora)
            .input('mealtime', d.mealtime || 0)
            .input('thoigianlamviec', d.thoigianlamviec)
            .input('ma', d.ma)
            .input('ten', d.ten)
            .query(`INSERT INTO [prod].[CA_LAM_VIEC]
                    (giovao, gionghi, gionghi1, giora, mealtime, thoigianlamviec, ma, ten)
                    OUTPUT INSERTED.*
                    VALUES (@giovao, @gionghi, @gionghi1, @giora, @mealtime, @thoigianlamviec, @ma, @ten)`)
        res.api.sendData(recordset[0])
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

// PUT /:id — sửa ca
router.put('/:id', async (req, res) => {
    try {
        const d = req.body
        if (!d.ma || !d.ma.trim()) return res.api.sendFail({ number: 4900, message: 'Mã ca không được để trống' })
        const check = await new mssql.Request().input('ma', d.ma.trim()).input('id', req.params.id)
            .query("SELECT id FROM [prod].[CA_LAM_VIEC] WHERE LTRIM(RTRIM(ma)) = @ma AND id != @id")
        if (check.recordset.length) return res.api.sendFail({ number: 420, message: 'Mã ca "' + d.ma + '" đã tồn tại' })
        const { recordset } = await new mssql.Request()
            .input('id', req.params.id)
            .input('giovao', d.giovao)
            .input('gionghi', d.gionghi || null)
            .input('gionghi1', d.gionghi1 || null)
            .input('giora', d.giora)
            .input('mealtime', d.mealtime || 0)
            .input('thoigianlamviec', d.thoigianlamviec)
            .input('ma', d.ma)
            .input('ten', d.ten)
            .query(`UPDATE [prod].[CA_LAM_VIEC]
                    SET giovao=@giovao, gionghi=@gionghi, gionghi1=@gionghi1,
                        giora=@giora, mealtime=@mealtime, thoigianlamviec=@thoigianlamviec,
                        ma=@ma, ten=@ten
                    OUTPUT INSERTED.*
                    WHERE id=@id`)
        res.api.sendData(recordset[0])
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

// DELETE /:id — xóa ca
router.delete('/:id', async (req, res) => {
    try {
        await new mssql.Request()
            .input('id', req.params.id)
            .query('DELETE FROM [prod].[CA_LAM_VIEC] WHERE id=@id')
        res.api.sendData({ deleted: true })
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

module.exports = router
