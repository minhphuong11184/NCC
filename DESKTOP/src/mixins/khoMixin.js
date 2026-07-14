/**
 * Mixin map mã kho Woodsland (MAKHO) → tên + địa chỉ kho.
 * Dùng chung cho GhepLoGo, ImportPNKWoodsland, v.v.
 */
const KHO_MAP = {
  YS1: { ten: "Kho Yên Sơn",   dia_chi: "Cụm CN Thắng Quân, Xã Yên Sơn, Tỉnh Tuyên Quang" },
  TB:  { ten: "Kho Thái Bình", dia_chi: "Thôn Chanh 1, Phường Nông Tiến, Tỉnh Tuyên Quang" },
};
// Alias các mã kho Woodsland tương đương
KHO_MAP.YS         = KHO_MAP.YS1;
KHO_MAP["WY1.NL01"] = KHO_MAP.YS1;   // Woodsland Yên Sơn kho NL01 → YS1
KHO_MAP["WTB.NL01"] = KHO_MAP.TB;    // Woodsland Thái Bình kho NL01 → TB

export default {
  computed: {
    khoMap() { return KHO_MAP; },
  },
  methods: {
    /** Lookup kho theo MAKHO. Trả về object {ten, dia_chi} hoặc {}. */
    getKhoConfig(code) {
      if (!code) return {};
      const c = String(code).trim().toUpperCase();
      return KHO_MAP[c] || {};
    },
    /** Tên kho từ MAKHO (fallback = MAKHO thô). */
    khoTenFromCode(code) {
      const k = this.getKhoConfig(code);
      return k.ten || (code ? String(code).trim() : "");
    },
  },
};
