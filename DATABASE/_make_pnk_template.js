/**
 * Tạo file Excel mẫu cho trang Import PNK Woodsland.
 * Chạy: cd PRODUCTION && node ../DATABASE/_make_pnk_template.js
 * Output: ../DATABASE/PNK_Woodsland_Template.xlsx
 */
const path = require('path')
const XLSX = require(path.join(__dirname, '..', 'PRODUCTION', 'node_modules', 'xlsx'))

const HEADERS = [
    'SOPHIEU', 'MAKHO', 'NHOMSP', 'BIENSOXE', 'CREATED_AT',
    'DAY', 'RONG', 'CAO', 'SOBO', 'SOTHANH_BO', 'KL_M3'
]

// Vài dòng dữ liệu mẫu — 2 phiếu, mỗi phiếu vài chi tiết
const SAMPLE_ROWS = [
    // Phiếu 1: 2 chi tiết
    ['PNK-2026-001', 'KHO01', 'GX', '29C-12345', '15/01/2026',
        25, 100, 2400, 10, 50, 3.0],
    ['PNK-2026-001', 'KHO01', 'GX', '29C-12345', '15/01/2026',
        25, 120, 2400, 8, 40, 2.304],
    // Phiếu 2: 1 chi tiết, KL_M3 trống → tự tính khi import
    ['PNK-2026-002', 'KHO01', 'GX', '29C-67890', '16/01/2026',
        30, 150, 2200, 12, 30, '']
]

const aoa = [HEADERS, ...SAMPLE_ROWS]

const wb = XLSX.utils.book_new()
const ws = XLSX.utils.aoa_to_sheet(aoa)

// Set độ rộng cột cho dễ đọc
ws['!cols'] = HEADERS.map(h => ({ wch: Math.max(h.length + 2, 12) }))
// Bôi đậm header (xlsx free version chỉ set giá trị, không format được — bỏ qua)

XLSX.utils.book_append_sheet(wb, ws, 'PNK_Woodsland')

// Sheet thứ 2: hướng dẫn
const guide = [
    ['HƯỚNG DẪN ĐIỀN FILE'],
    [''],
    ['1. Header phải nằm ở dòng đầu (dòng 1).'],
    ['2. Mỗi dòng tiếp theo = 1 chi tiết của 1 phiếu nhập kho. Cùng SOPHIEU thì lặp lại.'],
    ['3. CREATED_AT định dạng dd/mm/yyyy (vd: 15/01/2026) hoặc yyyy-mm-dd.'],
    ['4. DAY/RONG/CAO đơn vị mm như Woodsland gốc.'],
    ['5. KL_M3 có thể để trống — hệ thống sẽ tự tính DAY*RONG*CAO*SOBO*SOTHANH_BO/1e9.'],
    ['6. Khi lưu, hệ thống sẽ XÓA toàn bộ dữ liệu cùng (tháng, năm, mã NCC) trước khi insert mới.'],
    [''],
    ['Cột bắt buộc (nếu thiếu sẽ có cảnh báo):'],
    ['  - SOPHIEU, BIENSOXE, CREATED_AT, DAY, RONG, CAO, SOBO, SOTHANH_BO'],
    [''],
    ['Cột tuỳ chọn:'],
    ['  - MAKHO, NHOMSP, KL_M3'],
]
const wsGuide = XLSX.utils.aoa_to_sheet(guide)
wsGuide['!cols'] = [{ wch: 90 }]
XLSX.utils.book_append_sheet(wb, wsGuide, 'Huong dan')

const outPath = path.join(__dirname, 'PNK_Woodsland_Template.xlsx')
XLSX.writeFile(wb, outPath)
console.log('Đã tạo:', outPath)
