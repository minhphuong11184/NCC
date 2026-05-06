import axios from "axios";

/**
 * Mixin dùng chung cho các trang cần thông tin xưởng xẻ.
 * Provides: danhSachXuong, xuongByTen, xuongByMa, loadXuongXe(), getXuongConfig(ten)
 */
export default {
  data() {
    return {
      danhSachXuong: [],
    };
  },
  computed: {
    xuongByTen() {
      const map = {};
      this.danhSachXuong.forEach(x => { map[x.ten] = x; });
      return map;
    },
    xuongByMa() {
      const map = {};
      this.danhSachXuong.forEach(x => { map[x.ma] = x; });
      return map;
    },
    xuongSelectOptions() {
      return this.danhSachXuong.map(x => ({
        label: x.ma + " — " + x.ten,
        value: x.ten,
        ...x,
      }));
    },
  },
  methods: {
    async loadXuongXe() {
      try {
        const host = window.location.hostname || "127.0.0.1";
        const { data } = await axios.get(`http://${host}:2003/api/v1/xuong-xe`);
        this.danhSachXuong = data && data.meta && data.meta.success ? data.data : [];
      } catch (err) {
        console.error("Load xưởng xẻ failed:", err);
      }
    },
    getXuongConfig(tenOrMa) {
      if (!tenOrMa) return {};
      const key = tenOrMa.trim();
      return this.xuongByTen[key] || this.xuongByMa[key] || {};
    },
  },
};
