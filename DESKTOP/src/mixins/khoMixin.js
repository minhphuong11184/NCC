/**
 * Mixin map mã kho Woodsland (MAKHO) → tên + địa chỉ kho.
 * Dùng chung cho GhepLoGo, ImportPNKWoodsland, v.v.
 */
const KHO_MAP = {
  YS:  { ten: "Kho Yên Sơn",   dia_chi: "Xã Yên Sơn - Tỉnh Tuyên Quang" },
  YS1: { ten: "Kho Yên Sơn",   dia_chi: "Xã Yên Sơn - Tỉnh Tuyên Quang" },
  TB:  { ten: "Kho Thái Bình", dia_chi: "Xã Thái Bình - Tỉnh Tuyên Quang" },
};

export default {
  computed: {
    khoMap() { return KHO_MAP; },
  },
  methods: {
    /** Lookup kho theo MAKHO. Trả về object {ten, dia_chi} hoặc {}. */
    getKhoConfig(code) {
      if (!code) return {};
      return KHO_MAP[String(code).trim()] || {};
    },
    /** Tên kho từ MAKHO (fallback = MAKHO thô). */
    khoTenFromCode(code) {
      const k = this.getKhoConfig(code);
      return k.ten || (code ? String(code).trim() : "");
    },
  },
};
