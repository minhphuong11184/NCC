const express = require('express')
const api = express.Router()

/**
 * Đăng ký các router nghiệp vụ vào đây.
 * Ví dụ:
 *   api.use('/san-luong', require('./san-luong'))
 *   api.use('/lenh-san-xuat', require('./lenh-san-xuat'))
 */

// Demo endpoint để kiểm tra service đã lên
api.use('/hello', require('./hello'))

// BB nghiệm thu gỗ keo tròn / phiếu nhập gỗ tròn
api.use('/packages', require('./packages'))

// Import Excel gỗ tròn
api.use('/import-go-tron', require('./import-go-tron'))

// Phân tích so sánh KH vs thực nhập
api.use('/phan-tich', require('./phan-tich'))
// Import Excel KH khai thác
api.use('/import-kh', require('./import-kh'))
// Chia xe tự động từ KH
api.use('/chia-xe', require('./chia-xe'))

// Phiếu cân hàng — random trọng lượng bì + in phiếu
api.use('/phieu-can', require('./phieu-can'))

// Phiếu gỗ xẻ (NKTP / XK / BKLS) sau khi đã ghép lô gỗ
api.use('/phieu-go-xe', require('./phieu-go-xe'))

// Chấm công ZKTeco
api.use('/attendance', require('./attendance'))

// Dữ liệu từ Woodsland server (123.27.2.58)
api.use('/woodsland', require('./woodsland'))

// Ca làm việc
api.use('/ca-lam-viec', require('./ca-lam-viec'))

// Quản lý người dùng + ca làm việc
api.use('/quan-ly-nguoi-dung', require('./quan-ly-nguoi-dung'))

// Ghép lô gỗ vào phiếu Woodsland
api.use('/ghep-lo-go', require('./ghep-lo-go'))

// Quản lý xưởng xẻ
api.use('/xuong-xe', require('./xuong-xe'))

// Hợp đồng + phụ lục
api.use('/hop-dong', require('./hop-dong'))

module.exports = api
