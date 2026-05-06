const X = require('C:/TanTrao/DESKTOP/node_modules/xlsx')

const F1 = 'C:/WL2020/import_go_tron/KH khai thác T10.2025- Hùng Đức-Tân Trào.xls'
const F2 = 'C:/WL2020/import_go_tron/Phieu_BKLS_PNK BKTM MẪU.xlsx'

const norm = s => (s || '').toString().trim().replace(/\s+/g, ' ').toLowerCase()
const toFloat = v => {
    if (v === null || v === undefined || v === '') return null
    const n = parseFloat(String(v).replace(/,/g, '').trim())
    return isNaN(n) ? null : n
}

/* ---------- File 1: KH khai thác ---------- */
console.log('===== F1: KH khai thác T10.2025 =====')
const wb1 = X.readFile(F1, { cellDates: true })

// Sheet "KH ": header dòng 3, data từ dòng 4
//   col1=Tên hộ, col10=KL kế hoạch (khoảng), col11=KL thực
const planKL = {}      // by chủ rừng → KL kế hoạch
const planKLthuc = {}  // by chủ rừng → KL thực (đã khai thác trong file KH)
const ws1 = wb1.Sheets['KH ']
const r1 = X.utils.sheet_to_json(ws1, { header: 1, defval: null, raw: false })
for (let i = 3; i < r1.length; i++) {
    const r = r1[i]; if (!r) continue
    const ten = r[1]; if (!ten) continue
    const klDk = toFloat(r[11])     // "khối lượng gỗ" (col L)
    if (klDk !== null) {
        planKL[norm(ten)] = (planKL[norm(ten)] || 0) + klDk
    }
}
console.log(`  Sheet "KH ": ${Object.keys(planKL).length} hộ có KL kế hoạch`)

/* ---------- File 2: Phiếu BKLS ---------- */
console.log('\n===== F2: Phieu_BKLS — sheet "TH GỖ TRÒN T10" =====')
const wb2 = X.readFile(F2, { cellDates: true })
const ws2 = wb2.Sheets['TH GỖ TRÒN T10']
const r2 = X.utils.sheet_to_json(ws2, { header: 1, defval: null, raw: false })

const realKL = {}      // by chủ rừng → tổng KL nhập thực tế
const realPhieuCount = {}
let lastChuRung = null
for (let i = 2; i < r2.length; i++) {
    const r = r2[i]; if (!r) continue
    const sp = r[9]; if (!sp) continue
    const cr = r[2] || lastChuRung
    if (r[2]) lastChuRung = r[2]
    if (!cr) continue
    const kl = toFloat(r[11])
    realPhieuCount[norm(cr)] = (realPhieuCount[norm(cr)] || 0) + 1
    if (kl !== null) realKL[norm(cr)] = (realKL[norm(cr)] || 0) + kl
}
console.log(`  ${Object.keys(realKL).length} chủ rừng có nhập thực tế`)

/* ---------- So sánh ---------- */
console.log('\n===== SO SÁNH (chỉ xét hộ có trong KH) =====')
console.log('STT | Tên hộ                             | KL plan |  KL thực | Số phiếu | Chênh lệch')
console.log('----|------------------------------------|---------|----------|----------|------------')
let stt = 0, tongPlan = 0, tongReal = 0
const dictKH = {}
for (let i = 3; i < r1.length; i++) {
    const r = r1[i]; if (!r) continue
    const ten = r[1]; if (!ten) continue
    const klDk = toFloat(r[11])
    if (klDk === null) continue
    const k = norm(ten)
    dictKH[k] = ten
    const real = realKL[k] || 0
    const phieu = realPhieuCount[k] || 0
    const diff = real - klDk
    tongPlan += klDk
    tongReal += real
    stt++
    console.log(
        String(stt).padStart(3) + ' | '
        + ten.padEnd(34).slice(0, 34) + ' | '
        + klDk.toFixed(2).padStart(7) + ' | '
        + real.toFixed(2).padStart(8) + ' | '
        + String(phieu).padStart(8) + ' | '
        + (diff >= 0 ? '+' : '') + diff.toFixed(2)
    )
}
console.log('----+------------------------------------+---------+----------+----------+------------')
console.log(
    'TỔNG'.padEnd(40) + '| '
    + tongPlan.toFixed(2).padStart(7) + ' | '
    + tongReal.toFixed(2).padStart(8) + ' |          | '
    + (tongReal - tongPlan).toFixed(2)
)

console.log('\n===== Chủ rừng CÓ trong PHIẾU BKLS nhưng KHÔNG trong KH =====')
let extra = 0
Object.keys(realKL).forEach(k => {
    if (!dictKH[k]) {
        extra++
        const ten = Object.values(realKL).indexOf(realKL[k]) // dummy
        // Lấy lại tên gốc từ r2
        for (let i = 2; i < r2.length; i++) {
            if (r2[i] && r2[i][2] && norm(r2[i][2]) === k) {
                console.log(`  - ${r2[i][2]}: ${realKL[k].toFixed(2)} m³ (${realPhieuCount[k]} phiếu)`)
                break
            }
        }
    }
})
if (!extra) console.log('  (không có)')

console.log('\n===== Chủ rừng CÓ trong KH nhưng CHƯA nhập (KL thực = 0) =====')
let pending = 0
for (let i = 3; i < r1.length; i++) {
    const r = r1[i]; if (!r) continue
    const ten = r[1]; if (!ten) continue
    const klDk = toFloat(r[11])
    if (klDk === null) continue
    const k = norm(ten)
    if (!realKL[k]) {
        pending++
        console.log(`  - ${ten}: kế hoạch ${klDk.toFixed(2)} m³ — chưa nhập`)
    }
}
if (!pending) console.log('  (tất cả hộ trong KH đều đã nhập)')
