<template>
  <q-page padding>
    <!-- Toolbar -->
    <div class="row q-col-gutter-md items-center q-mb-md no-print">
      <div class="col-auto">
        <q-input v-model="fromDate" type="date" label="Từ ngày" filled dense style="width:160px" @input="loadCodes" />
      </div>
      <div class="col-auto">
        <q-input v-model="toDate" type="date" label="Đến ngày" filled dense style="width:160px" @input="loadCodes" />
      </div>
      <div class="col-auto">
        <q-select v-model="selectedCode" :options="codes" option-label="label" option-value="value" label="Mã phiếu" filled dense style="min-width:280px" @input="loadPhieu" />
      </div>
      <div class="col-auto">
        <q-select v-model="buyerXuong" :options="xuongSelectOptions" emit-value map-options
                  label="Xưởng xẻ (Bên mua)" filled dense style="min-width:280px"
                  clearable @input="applyBuyerXuong" />
      </div>
      <div class="col-auto">
        <q-btn icon="print" label="In" color="primary" @click="printPage" :disable="!phieu" />
      </div>
    </div>

    <!-- Biểu mẫu BKLS -->
    <div v-if="phieu" class="print-area">
      <div class="bkls-form">
        <!-- Header -->
        <div class="header-row">
          <div class="left-header">
            <div class="company-name">{{ chuRungTen }}</div>
            <div class="separator">-------</div>
          </div>
          <div class="right-header">
            <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div class="bold">Độc lập - Tự do - Hạnh phúc</div>
            <div class="separator">---------------</div>
          </div>
        </div>

        <!-- Số BKLS -->
        <div class="header-row q-mt-sm">
          <div>Số(1): {{ phieu.So_BKLS || '___' }}-BKLS</div>
          <div>Tờ số(2): 01 Tổng số tờ: 01</div>
        </div>

        <div class="title">BẢNG KÊ LÂM SẢN</div>

        <!-- 1. Thông tin chủ lâm sản (chủ rừng) -->
        <div class="section-title">1. Thông tin chủ lâm sản:</div>
        <div class="info-line">- Tên chủ lâm sản(4): <b>{{ chuRungTen || '………………………………………………..' }}</b></div>
        <div class="info-line">- Số GCN/MSDN/GPTL/ĐKHĐ/CCCD/CMND/HC(5): <b>{{ chuRungCCCD || '…………………' }}</b></div>
        <div class="info-line">- Địa chỉ(6): <b>{{ chuRungDiaChi || '………………………………………………………………' }}</b></div>
        <div class="info-line">- Số điện thoại: ………………, Địa chỉ Email: …………………………</div>
        <div class="info-line">- Số chứng chỉ FM/COC: <b>{{ chuRungChungChi || '…………………………' }}</b> Hiệu lực: <b>{{ chuRungHieuLuc || '……………………….' }}</b></div>

        <!-- 2. Thông tin tổ chức, cá nhân mua -->
        <div class="section-title">2. Thông tin tổ chức, cá nhân mua/nhận chuyển giao quyền sở hữu:</div>
        <div class="info-line">- Tên tổ chức, cá nhân(4): <b>{{ BUYER_TEN || '………………………………………………..' }}</b></div>
        <div class="info-line">- Số GCN/MSDN/GPTL/ĐKHĐ/CCCD/CMND/HC(5): <b>{{ BUYER_MST || '…………………' }}</b></div>
        <div class="info-line">- Địa chỉ(6): <b>{{ BUYER_DIA_CHI || '………………………………………………………………' }}</b></div>
        <div class="info-line">- Số điện thoại: {{ BUYER_SDT || '………………' }}, Địa chỉ Email: …………………………</div>
        <div class="info-line">- Số chứng chỉ FM/COC: <b>{{ BUYER_CC || '…………………………' }}</b> Hiệu lực: <b>{{ BUYER_HL || '……………………….' }}</b></div>

        <!-- 3. Thông tin về lâm sản -->
        <div class="section-title">3. Thông tin về lâm sản:</div>
        <div class="info-line">- Tên loài: <b>Gỗ tròn Keo tai tượng FSC 100% ({{ phieu.Loai_go || 'Acacia mangium' }})</b></div>
        <div class="info-line">- Nhóm loài: Thông thường</div>
        <div class="info-line">- Nguồn gốc(7): <b>{{ phieu.So_BKLS }}</b>&nbsp;&nbsp;&nbsp;&nbsp;Địa chỉ: <b>{{ diaChiChuRung }}</b></div>
        <div class="info-line">- Mã HS (áp dụng đối với lâm sản nhập khẩu, xuất khẩu): …………………</div>
        <div class="info-line">- Giá trị (nếu có): ……………………………………………………………</div>
        <div class="info-line">- Khối lượng/trọng lượng: <b>{{ fmtNum(phieu.Khoi_luong) }}</b> m³&nbsp;&nbsp;&nbsp;&nbsp;Bằng chữ: <b>{{ soThanhChu }} mét khối.</b></div>
        <div class="info-line">- Số lượng: ….....................; đơn vị tính (lóng, khúc; thanh, tấm, hộp, viên, ...): ......................</div>
        <div class="info-line">- Thông tin về lô khai thác(8):&nbsp;&nbsp;&nbsp;&nbsp;Khoảnh: <b>{{ phieu.Khoang }}</b>&nbsp;&nbsp;&nbsp;&nbsp;Lô: <b>{{ phieu.Lo }}</b>&nbsp;&nbsp;&nbsp;&nbsp;Diện tích: <b>{{ fmtNum(phieu.Dien_tich) }} ha</b></div>
        <div class="info-line">- Thông tin khác có liên quan (nếu có):&nbsp;&nbsp;Địa danh khai thác: <b>{{ diaChiChuRung }}</b></div>

        <!-- 4. Bảng kê khai kèm theo -->
        <div class="section-title">4. Thông tin chi tiết tại Bảng kê khai kèm theo:</div>
        <div class="info-line italic">(Áp dụng đối với gỗ nguyên liệu, sản phẩm gỗ: khai thác từ rừng tự nhiên trong nước...)</div>

        <!-- 5. Thông tin vận chuyển -->
        <div class="section-title">5. Thông tin vận chuyển (nếu có):</div>
        <div class="info-line">Biển kiểm soát/số hiệu phương tiện: <b>{{ phieu.Xe }}</b></div>
        <div class="info-line">- Thời gian vận chuyển: 01 ngày</div>
        <div class="info-line">- Từ ngày: <b>{{ formatDate(phieu.Ngay_nhap) }}</b>&nbsp;&nbsp;&nbsp;&nbsp;Đến ngày: <b>{{ formatDate(phieu.Ngay_nhap) }}</b></div>
        <div class="info-line">- Vận chuyển từ: <b>bãi 1 {{ phieu.Chu_rung }}</b>&nbsp;&nbsp;&nbsp;&nbsp;đến: <b>{{ TEN_CTY }}</b></div>
        <div class="info-line">Địa chỉ: <b>{{ diaChiChuRung }}</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{{ DIA_CHI_CTY }}</b></div>

        <!-- 6. Hồ sơ kèm theo -->
        <div class="section-title">6. Hồ sơ kèm theo (nếu có):</div>

        <!-- Cam kết -->
        <div class="cam-ket">Chúng tôi/Tôi cam kết những nội dung kê khai trong bảng kê này là đúng sự thật và chịu trách nhiệm trước pháp luật về sự trung thực của thông tin đã kê khai.</div>

        <div class="date-right">Ngày {{ ngay }} tháng {{ thang }} năm {{ nam }}</div>

        <!-- Ký tên -->
        <div class="sign-area">
          <div class="sign-col">
            <div class="sign-title">XÁC NHẬN CỦA CƠ QUAN CÓ THẨM QUYỀN (9)</div>
            <div class="sign-sub">Vào sổ số: …/…</div>
            <div class="sign-sub">(Người có thẩm quyền ký, ghi rõ họ tên, đóng dấu)</div>
            <div class="sign-space"></div>
          </div>
          <div class="sign-col">
            <div class="sign-title">TỔ CHỨC/CÁ NHÂN LẬP BẢNG KÊ</div>
            <div class="sign-sub">(Ký, ghi rõ họ tên, đóng dấu đối với tổ chức)</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ chuRungTen }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-grey-6 q-mt-xl">Chọn nhà máy → khoảng ngày → mã phiếu để xem biểu mẫu</div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import xuongXeMixin from "../mixins/xuongXeMixin";

export default {
  mixins: [xuongXeMixin],
  data() {
    return {
      fromDate: "2025-08-01",
      toDate: "2026-04-01",
      codes: [],
      selectedCode: null,
      phieu: null,
      TEN_CTY: "", DIA_CHI_CTY: "", MA_SO_THUE: "", SDT_CTY: "",
      CHUNG_CHI_CTY: "", HIEU_LUC_CTY: "", NGUOI_LAP: "",
      buyerXuong: null,
      BUYER_TEN: "", BUYER_MST: "", BUYER_DIA_CHI: "", BUYER_SDT: "",
      BUYER_CC: "", BUYER_HL: "",
    };
  },
  computed: {
    diaChiChuRung() {
      if (!this.phieu) return "";
      return [this.phieu.Xa, this.phieu.Huyen].filter(Boolean).join(", ");
    },
    /** Mục 1 — Chủ lâm sản (chính là chủ rừng) lấy từ phiếu hiện tại. */
    chuRungTen() { return (this.phieu && this.phieu.Chu_rung) || ""; },
    chuRungCCCD() { return (this.phieu && (this.phieu.cccd || this.phieu.mst)) || ""; },
    chuRungDiaChi() {
      if (!this.phieu) return "";
      return this.phieu.dia_chi_cccd
        || [this.phieu.Thon, this.phieu.Xa, this.phieu.Huyen].filter(Boolean).join(", ");
    },
    chuRungChungChi() { return (this.phieu && this.phieu.So_chung_chi) || ""; },
    chuRungHieuLuc() { return (this.phieu && this.phieu.Ngay_hieu_luc) || ""; },
    /** Ngày của BKLS: ưu tiên Ngay_BKLS từ KH, fallback Ngay_nhap */
    ngayBKLS() {
      const raw = (this.phieu && this.phieu.Ngay_BKLS) || (this.phieu && this.phieu.Ngay_nhap) || null;
      if (!raw) return null;
      const d1 = new Date(raw);
      if (!isNaN(d1.getTime())) return d1;
      const m = String(raw).match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
      if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
      return null;
    },
    ngay() { return this.ngayBKLS ? this.ngayBKLS.getDate() : "___"; },
    thang() { return this.ngayBKLS ? this.ngayBKLS.getMonth() + 1 : "___"; },
    nam() { return this.ngayBKLS ? this.ngayBKLS.getFullYear() : "____"; },
    soThanhChu() {
      if (!this.phieu || !this.phieu.Khoi_luong) return "___";
      return this.fmtNum(this.phieu.Khoi_luong);
    },
  },
  async created() { await this.loadXuongXe(); this.loadCodes(); },
  methods: {
    ...mapActions("prod", ["getCodebangiaogotron", "getBBgiaogotron"]),
    async loadCodes() {
      if (!this.fromDate || !this.toDate) return;
      const data = await this.getCodebangiaogotron({
        fromDate: this.fromDate + " 00:00:00",
        toDate: this.toDate + " 00:00:00",
      });
      this.codes = (data && data.data) || [];
      this.selectedCode = null;
      this.phieu = null;
    },
    async loadPhieu() {
      if (!this.selectedCode) return;
      const data = await this.getBBgiaogotron({ code: this.selectedCode.value });
      this.phieu = data && data.data && data.data[0] ? data.data[0] : null;
      this.applyXuongConfig();
    },
    applyXuongConfig() {
      if (!this.phieu) return;
      const xuong = this.phieu.Xuong_xe ? this.phieu.Xuong_xe.trim() : "";
      const cfg = this.getXuongConfig(xuong);
      this.TEN_CTY = cfg.ten || "";
      this.DIA_CHI_CTY = cfg.dia_chi || "";
      this.MA_SO_THUE = cfg.mst || "";
      this.SDT_CTY = cfg.sdt || "";
      this.CHUNG_CHI_CTY = cfg.chung_chi || "";
      this.HIEU_LUC_CTY = cfg.hieu_luc_cc || "";
      this.NGUOI_LAP = cfg.nguoi_dai_dien || "";
    },
    /** Điền mục 2 (Bên mua) từ xưởng xẻ được chọn. */
    applyBuyerXuong() {
      const cfg = this.getXuongConfig(this.buyerXuong);
      this.BUYER_TEN = cfg.ten || "";
      this.BUYER_MST = cfg.mst || "";
      this.BUYER_DIA_CHI = cfg.dia_chi || "";
      this.BUYER_SDT = cfg.sdt || "";
      this.BUYER_CC = cfg.chung_chi || "";
      this.BUYER_HL = cfg.hieu_luc_cc || "";
    },
    formatDate(d) {
      if (!d) return "";
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return String(dt.getDate()).padStart(2, "0") + "/" + String(dt.getMonth() + 1).padStart(2, "0") + "/" + dt.getFullYear();
    },
    fmtNum(v) { return v == null ? "" : Number(v).toFixed(2); },
    printPage() { window.print(); },
  },
};
</script>

<style scoped>
.bkls-form {
  border: 1px solid #333;
  padding: 20px 28px;
  font-size: 12px;
  font-family: "Times New Roman", serif;
  line-height: 1.7;
  max-width: 800px;
}
.header-row { display: flex; justify-content: space-between; }
.left-header { width: 40%; }
.right-header { width: 55%; text-align: center; }
.company-name { font-weight: bold; font-size: 13px; }
.separator { text-align: center; }
.bold { font-weight: bold; }
.title { text-align: center; font-weight: bold; font-size: 16px; text-transform: uppercase; margin: 16px 0 12px; }
.section-title { font-weight: bold; margin-top: 10px; }
.info-line { margin-left: 4px; }
.info-line.italic { font-style: italic; font-size: 10px; }
.cam-ket { margin-top: 12px; font-style: italic; }
.date-right { text-align: right; font-style: italic; margin-top: 12px; }
.sign-area { display: flex; justify-content: space-between; margin-top: 12px; }
.sign-col { text-align: center; width: 45%; }
.sign-title { font-weight: bold; font-size: 11px; text-transform: uppercase; }
.sign-sub { font-style: italic; font-size: 10px; }
.sign-space { height: 60px; }
.sign-name { font-weight: bold; }

@media print {
  .no-print { display: none !important; }
  .bkls-form { border: 1px solid #000; }
  @page { size: portrait A4; margin: 10mm; }
}
</style>
