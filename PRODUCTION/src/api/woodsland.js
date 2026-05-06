const express = require('express')
const router = express.Router()
const goxeApi = require('../data/goxeApi')

/**
 * Toàn bộ endpoint dưới đây proxy sang Goxe API (xem goxeApi.js).
 * Không kết nối DB Woodsland trực tiếp.
 */

router.get('/phieu-nhap-kho', async (req, res) => {
    try {
        const data = await goxeApi.getPhieuNhapKho({
            from: req.query.from || null,
            to: req.query.to || null,
        })
        res.api.sendData(data)
    } catch (err) {
        console.error('[Woodsland]', err)
        res.api.sendFail({ number: 4907, message: 'Lỗi gọi Goxe API: ' + (err.message || err) })
    }
})

router.get('/phieu-nhap-kho/header', async (req, res) => {
    try {
        const data = await goxeApi.getPhieuNhapKhoHeader({
            from: req.query.from || null,
            to: req.query.to || null,
        })
        res.api.sendData(data)
    } catch (err) {
        console.error('[Woodsland]', err)
        res.api.sendFail({ number: 4907, message: 'Lỗi gọi Goxe API: ' + (err.message || err) })
    }
})

router.get('/phieu-nhap-kho/chi-tiet', async (req, res) => {
    try {
        const sophieu = req.query.sophieu
        if (!sophieu) return res.api.sendFail({ number: 4900, message: 'Thiếu số phiếu' })
        const data = await goxeApi.getPhieuChiTiet({ sophieu })
        res.api.sendData(data)
    } catch (err) {
        console.error('[Woodsland]', err)
        res.api.sendFail({ number: 4907, message: 'Lỗi gọi Goxe API: ' + (err.message || err) })
    }
})

module.exports = router
