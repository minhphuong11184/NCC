/**
 * Goxe API client — gọi đến API ngoài (do bên thứ 3 viết) để lấy dữ liệu
 * phiếu nhập kho gỗ xẻ thay cho việc kết nối trực tiếp DB Woodsland.
 *
 * Cấu hình bằng env:
 *   GOXE_API_URL      — base URL của API ngoài (vd: https://app.woodsland.com.vn:2002/api/v2/tantrao2026)
 *   GOXE_API_KEY      — (tuỳ chọn) bearer token gửi kèm header Authorization
 *   GOXE_API_TIMEOUT  — timeout ms (mặc định 30000)
 *   GOXE_API_INSECURE — 'true' để bỏ qua verify cert HTTPS (server self-signed)
 *
 * Hợp đồng API ngoài cần expose:
 *
 *   GET  {BASE}/phieu-nhap-kho-mancc?thang=&nam=&mancc=
 *        → trả về mảng các dòng (1 dòng = 1 chi tiết phiếu) với các field:
 *          pnk_id, SOPHIEU, MAKHO, NHOMSP, BIENSOXE, CREATED_AT, MANCC,
 *          MALOGONHAP, dt_id, dt_day, dt_rong, dt_cao, SOBO, SOTHANH_BO,
 *          MANVL, CODE, CODENHOM, dt_note,
 *          DONGIA_CTY, DONGIA_LOAI, DONGIA_TB,
 *          kl_m3 (đã tính = dt_day*dt_rong*dt_cao*SOBO*SOTHANH_BO/1e9)
 *
 *   GET  {BASE}/nha-cung-cap
 *        → mảng { code, name }
 *
 *   GET  {BASE}/phieu-nhap-kho?from=&to=
 *        → mảng phiếu + chi tiết theo khoảng ngày (CREATED_AT BETWEEN from..to)
 *          các field: pnk_id, SOPHIEU, MAKHO, NHOMSP, MALOGONHAP, BIENSOXE,
 *          ngay_tao, nguoi_tao, MANCC, DONGIATB, QC_STAFF, XUONGXENANG, ACTUALDATE,
 *          dt_id, dt_day, dt_rong, dt_cao, SOBO, SOTHANH_BO, QTY,
 *          MANVL, CODE, CODENHOM, DONGIA_CTY, DONGIA_LOAI, DONGIA_TB,
 *          KLQC, dt_note, QC_INSPECTOR, SAMPLEQTY, dt_ngay_tao, PALLET, dt_malogonhap
 *
 *   GET  {BASE}/phieu-nhap-kho/header?from=&to=
 *        → chỉ header phiếu (ID, SOPHIEU, MAKHO, NHOMSP, MALOGONHAP, BIENSOXE,
 *          ngay_tao, nguoi_tao, MANCC, DONGIATB, QC_STAFF, XUONGXENANG, ACTUALDATE)
 *
 *   GET  {BASE}/phieu-nhap-kho/chi-tiet?sophieu=
 *        → tất cả chi tiết của 1 phiếu (toàn bộ field PHIEUNHAPKHO_DT)
 *
 * Response chấp nhận 1 trong 3 dạng:
 *   1. Mảng trực tiếp:   [ {...}, {...} ]
 *   2. REST envelope:    { data: [...] }   (recommended)
 *   3. mssql-style:      { recordset: [...] }
 */

const url = require('url')
const http = require('http')
const https = require('https')

const BASE_URL = process.env.GOXE_API_URL || ''
const API_KEY = process.env.GOXE_API_KEY || ''
const TIMEOUT = parseInt(process.env.GOXE_API_TIMEOUT) || 30000
// 'true' để bỏ qua verify cert HTTPS (dùng khi server self-signed)
const INSECURE = (process.env.GOXE_API_INSECURE || 'false').toLowerCase() === 'true'

if (!BASE_URL) {
    console.warn('[goxeApi] GOXE_API_URL chưa được cấu hình trong env')
}

/**
 * Gọi GET HTTP/HTTPS, parse JSON, trả về body.
 */
function httpGet(targetUrl) {
    return new Promise((resolve, reject) => {
        const u = url.parse(targetUrl)
        const lib = u.protocol === 'https:' ? https : http
        const opts = {
            hostname: u.hostname,
            port: u.port || (u.protocol === 'https:' ? 443 : 80),
            path: u.path,
            method: 'GET',
            timeout: TIMEOUT,
            headers: {
                'Accept': 'application/json',
                ...(API_KEY ? {
                    'Authorization': `Bearer ${API_KEY}`,
                    'x-api-key': API_KEY,
                } : {}),
            },
            ...(u.protocol === 'https:' && INSECURE ? { rejectUnauthorized: false } : {}),
        }
        const req = lib.request(opts, res => {
            let chunks = []
            res.on('data', c => chunks.push(c))
            res.on('end', () => {
                const body = Buffer.concat(chunks).toString('utf8')
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 500)}`))
                }
                try {
                    resolve(body ? JSON.parse(body) : null)
                } catch (e) {
                    reject(new Error('Invalid JSON from Goxe API: ' + e.message))
                }
            })
        })
        req.on('timeout', () => {
            req.destroy()
            reject(new Error(`Goxe API timeout sau ${TIMEOUT}ms: ${targetUrl}`))
        })
        req.on('error', reject)
        req.end()
    })
}

/**
 * Build URL đầy đủ với query params.
 */
function buildUrl(path, params) {
    const qs = Object.entries(params || {})
        .filter(([, v]) => v !== null && v !== undefined && v !== '')
        .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
        .join('&')
    const sep = path.startsWith('http') ? path : (BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\//, ''))
    return qs ? sep + (sep.includes('?') ? '&' : '?') + qs : sep
}

/**
 * Unwrap response sang mảng dù API trả format nào.
 */
function unwrap(resp) {
    if (Array.isArray(resp)) return resp
    if (resp && Array.isArray(resp.data)) return resp.data
    if (resp && Array.isArray(resp.recordset)) return resp.recordset
    if (resp && resp.meta && resp.meta.success === false) {
        throw new Error('Goxe API error: ' + (resp.meta.message || JSON.stringify(resp.meta)))
    }
    return []
}

async function callGet(path, params) {
    if (!BASE_URL) throw new Error('GOXE_API_URL chưa cấu hình')
    const target = buildUrl(path, params)
    const resp = await httpGet(target)
    return unwrap(resp)
}

module.exports = {
    /**
     * Lấy phiếu nhập kho + chi tiết theo MANCC + tháng/năm.
     * Dùng cho /api/v1/ghep-lo-go/ghep (source=woodsland).
     */
    getPhieuByMancc({ thang, nam, mancc }) {
        return callGet('/phieu-nhap-kho-mancc', { thang, nam, mancc })
    },

    /** Danh sách NCC. */
    getNhaCungCap() {
        return callGet('/nha-cung-cap')
    },

    /** Phiếu + chi tiết theo khoảng ngày. */
    getPhieuNhapKho({ from, to }) {
        return callGet('/phieu-nhap-kho', { from, to })
    },

    /** Chỉ header phiếu. */
    getPhieuNhapKhoHeader({ from, to }) {
        return callGet('/phieu-nhap-kho/header', { from, to })
    },

    /** Chi tiết 1 phiếu theo SOPHIEU. */
    getPhieuChiTiet({ sophieu }) {
        return callGet('/phieu-nhap-kho/chi-tiet', { sophieu })
    },
}
