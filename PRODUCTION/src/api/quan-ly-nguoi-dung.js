const express = require('express')
const router = express.Router()
const mssql = require('mssql')

/**
 * GET / — danh sách người dùng kèm ca làm việc
 */
router.get('/', async (req, res) => {
    try {
        const { recordset: users } = await new mssql.Request().query(`
            SELECT ID, ACCOUNT, FIRST_NAME, LAST_NAME, EMAIL, PHONE,
                   POSITION, ACTIVE, ATTENDANCE_CODE
            FROM [base].[ACCOUNT]
            ORDER BY ID
        `)
        const { recordset: accCa } = await new mssql.Request().query(`
            SELECT AC.account_id, AC.ca_id, C.ma, C.ten
            FROM [prod].[ACCOUNT_CA] AC
            INNER JOIN [prod].[CA_LAM_VIEC] C ON C.id = AC.ca_id
            ORDER BY AC.account_id, C.id
        `)

        const caMap = {}
        accCa.forEach(r => {
            if (!caMap[r.account_id]) caMap[r.account_id] = []
            caMap[r.account_id].push({ ca_id: r.ca_id, ma: r.ma, ten: r.ten })
        })

        const result = users.map(u => ({
            ...u,
            ca_lam_viec: caMap[u.ID] || []
        }))

        res.api.sendData(result)
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

/**
 * PUT /:id/ca — cập nhật ca làm việc cho 1 user
 * Body: { ca_ids: [1, 4, 7] }
 */
router.put('/:id/ca', async (req, res) => {
    try {
        const accountId = parseInt(req.params.id)
        const caIds = Array.isArray(req.body.ca_ids) ? req.body.ca_ids : []

        // Xóa ca cũ
        await new mssql.Request()
            .input('account_id', accountId)
            .query('DELETE FROM [prod].[ACCOUNT_CA] WHERE account_id = @account_id')

        // Insert ca mới
        if (caIds.length) {
            const values = caIds.map((id, i) => `(@account_id, @ca${i})`).join(',')
            const request = new mssql.Request().input('account_id', accountId)
            caIds.forEach((id, i) => request.input(`ca${i}`, id))
            await request.query(`INSERT INTO [prod].[ACCOUNT_CA] (account_id, ca_id) VALUES ${values}`)
        }

        res.api.sendData({ account_id: accountId, ca_ids: caIds })
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

/**
 * PUT /:id — cập nhật thông tin user
 * Body: { FIRST_NAME, LAST_NAME, EMAIL, PHONE, POSITION, ATTENDANCE_CODE, ca_ids }
 */
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const d = req.body

        await new mssql.Request()
            .input('id', id)
            .input('FIRST_NAME', d.FIRST_NAME || null)
            .input('LAST_NAME', d.LAST_NAME || null)
            .input('EMAIL', d.EMAIL || null)
            .input('PHONE', d.PHONE || null)
            .input('POSITION', d.POSITION || null)
            .input('ATTENDANCE_CODE', d.ATTENDANCE_CODE || null)
            .query(`UPDATE [base].[ACCOUNT] SET
                    FIRST_NAME=@FIRST_NAME, LAST_NAME=@LAST_NAME,
                    EMAIL=@EMAIL, PHONE=@PHONE, POSITION=@POSITION,
                    ATTENDANCE_CODE=@ATTENDANCE_CODE
                    WHERE ID=@id`)

        // Cập nhật ca nếu có
        if (Array.isArray(d.ca_ids)) {
            await new mssql.Request()
                .input('account_id', id)
                .query('DELETE FROM [prod].[ACCOUNT_CA] WHERE account_id = @account_id')

            if (d.ca_ids.length) {
                const values = d.ca_ids.map((cid, i) => `(@account_id, @ca${i})`).join(',')
                const request = new mssql.Request().input('account_id', id)
                d.ca_ids.forEach((cid, i) => request.input(`ca${i}`, cid))
                await request.query(`INSERT INTO [prod].[ACCOUNT_CA] (account_id, ca_id) VALUES ${values}`)
            }
        }

        res.api.sendData({ id })
    } catch (err) {
        res.api.sendFail({ number: 4907, message: err.message })
    }
})

module.exports = router
