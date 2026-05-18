/**
 * Chuyển số sang chữ tiếng Việt.
 * Dùng chung cho BKTM (tiền) và BKLS (khối lượng/thể tích).
 */

const DIGITS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
const UNITS = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ"];

/**
 * Đọc 1 nhóm 3 chữ số sang chữ. `full` = true khi nhóm đứng sau nhóm khác
 * → buộc đọc đủ "X trăm" để nối ngữ điệu.
 */
function readGroup(g, full) {
  const tr = Math.floor(g / 100);
  const ch = Math.floor((g % 100) / 10);
  const dv = g % 10;
  let s = "";
  if (tr > 0 || full) {
    s += DIGITS[tr] + " trăm";
  }
  if (ch > 1) {
    s += (s ? " " : "") + DIGITS[ch] + " mươi";
    if (dv === 1) s += " mốt";
    else if (dv === 4) s += " tư";
    else if (dv === 5) s += " lăm";
    else if (dv > 0) s += " " + DIGITS[dv];
  } else if (ch === 1) {
    s += (s ? " " : "") + "mười";
    if (dv === 5) s += " lăm";
    else if (dv > 0) s += " " + DIGITS[dv];
  } else if (ch === 0 && dv > 0) {
    if (tr > 0 || full) s += " linh " + DIGITS[dv];
    else s += DIGITS[dv];
  }
  return s.trim();
}

/**
 * Đọc 1 số nguyên không âm sang chữ tiếng Việt (chữ thường, không đơn vị).
 */
export function readIntegerVN(num) {
  let n = Math.abs(Math.round(Number(num) || 0));
  if (n === 0) return "không";

  const groups = [];
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }

  const parts = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g === 0) continue;
    const isFirst = parts.length === 0;
    const text = readGroup(g, !isFirst);
    if (text) parts.push(text + (UNITS[i] ? " " + UNITS[i] : ""));
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Chuyển số tiền sang chữ tiếng Việt — viết hoa chữ đầu, kết thúc " đồng".
 * Ví dụ: 69564000 → "Sáu mươi chín triệu năm trăm sáu mươi tư nghìn đồng".
 */
export function numberToWordsVN(num) {
  if (num == null || isNaN(num)) return "";
  const n = Math.round(Number(num));
  if (n === 0) return "Không đồng";
  const negative = n < 0;
  let text = readIntegerVN(Math.abs(n));
  text = text.charAt(0).toUpperCase() + text.slice(1);
  return (negative ? "Âm " + text.toLowerCase() : text) + " đồng";
}

/**
 * Chuyển khối lượng/thể tích (m³) sang chữ tiếng Việt — kết thúc " mét khối".
 * Phần thập phân đọc từng chữ số sau "phẩy", bỏ trailing zero.
 * Ví dụ: 29.52 → "Hai mươi chín phẩy năm hai mét khối".
 *         29.05 → "Hai mươi chín phẩy không năm mét khối".
 *         30.00 → "Ba mươi mét khối".
 */
export function volumeToWordsVN(num) {
  if (num == null || isNaN(num)) return "";
  const sign = Number(num) < 0 ? "Âm " : "";
  const abs = Math.abs(Number(num));
  const intPart = Math.floor(abs);
  const decRaw = Math.round((abs - intPart) * 100);

  let combined = readIntegerVN(intPart);
  if (decRaw > 0) {
    // 2 chữ số thập phân, bỏ trailing zero (29.50 → "năm", 29.05 → "không năm")
    let decStr = String(decRaw).padStart(2, "0").replace(/0+$/, "");
    if (!decStr) decStr = "0";
    const decText = decStr.split("").map(d => DIGITS[+d]).join(" ");
    combined += " phẩy " + decText;
  }
  combined = combined.charAt(0).toUpperCase() + combined.slice(1);
  return sign + combined + " mét khối";
}

export default { readIntegerVN, numberToWordsVN, volumeToWordsVN };
