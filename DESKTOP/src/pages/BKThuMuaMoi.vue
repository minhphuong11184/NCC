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
        <q-btn icon="print" label="In" color="primary" @click="printPage" :disable="!phieu" />
      </div>
    </div>

    <!-- Biểu mẫu 02/TNDN -->
    <div v-if="phieu" class="print-area">
      <div class="bk-form">
        <div class="mau-so">Mẫu số: 02/TNDN<br/><span class="italic">(Ban hành kèm theo Thông tư số 20/2026/TT-BTC của Bộ trưởng Bộ Tài chính)</span></div>

        <div class="title">BẢNG KÊ THU MUA HÀNG HÓA, DỊCH VỤ<br/>KHÔNG CÓ HÓA ĐƠN</div>
        <div class="date-line">(Ngày {{ ngay }} tháng {{ thang }} năm {{ nam }})</div>

        <table class="info-table">
          <tr><td class="lbl">- Tên doanh nghiệp:</td><td class="val">{{ TEN_CTY }}</td></tr>
          <tr><td class="lbl">- Mã số thuế:</td><td class="val">{{ MA_SO_THUE }}</td></tr>
          <tr><td class="lbl">- Địa chỉ:</td><td class="val">{{ DIA_CHI_CTY }}</td></tr>
          <tr><td class="lbl">- Số điện thoại:</td><td class="val">{{ SDT_CTY }}</td></tr>
          <tr><td class="lbl">- Địa chỉ nơi tổ chức thu mua:</td><td class="val">{{ diaChiChuRung }}</td></tr>
          <tr><td class="lbl">- Số phiếu BB nghiệm thu gỗ keo tai tượng (Acacia Mangium) FSC100%:</td><td class="val">{{ phieu.So_phieu }}&nbsp;&nbsp;&nbsp;&nbsp;Lô gỗ tròn: {{ phieu.Lo_go }}</td></tr>
          <tr><td class="lbl">- Số chứng chỉ FM/COC:</td><td class="val">{{ phieu.So_chung_chi }}</td></tr>
          <tr><td class="lbl">- Nhóm SP:</td><td class="val">W1.1</td></tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th rowspan="2">Ngày tháng<br/>năm mua hàng</th>
              <th colspan="4">Người bán</th>
              <th colspan="4">Hàng hóa, dịch vụ mua vào</th>
              <th rowspan="2">Ghi chú</th>
            </tr>
            <tr>
              <th>Tên người bán</th>
              <th>Địa chỉ</th>
              <th>Số căn cước</th>
              <th>Số điện thoại<br/>(nếu có)</th>
              <th>Tên hàng hóa,<br/>dịch vụ</th>
              <th>Số lượng,<br/>trọng lượng</th>
              <th>Đơn giá</th>
              <th>Tổng giá<br/>thanh toán</th>
            </tr>
            <tr class="col-num">
              <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ formatDate(phieu.Ngay_nhap) }}</td>
              <td>{{ phieu.Chu_rung }}</td>
              <td class="small-text">{{ diaChiChuRung }}</td>
              <td class="small-text">{{ phieu.cccd }}</td>
              <td></td>
              <td>Gỗ tròn keo tai tượng ({{ phieu.Loai_go || 'Acacia mangium' }}) FSC 100%</td>
              <td class="num">{{ fmtNum(phieu.Khoi_luong) }} m³</td>
              <td class="num">{{ fmtMoney(phieu.Don_gia) }}</td>
              <td class="num">{{ fmtMoney(tongGiaTri) }}</td>
              <td></td>
            </tr>
            <tr class="total-row">
              <td colspan="6">Tổng</td>
              <td class="num">{{ fmtNum(phieu.Khoi_luong) }} m³</td>
              <td></td>
              <td class="num">{{ fmtMoney(tongGiaTri) }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div class="total-text">- Tổng giá trị hàng hóa, dịch vụ mua vào: <b>{{ tongGiaTriText }}</b></div>

        <div class="sign-area">
          <div class="sign-col">
            <div class="sign-title">Người lập bảng kê</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ UQ }}</div>
          </div>
          <div class="sign-col">
            <div class="sign-date">Ngày {{ ngay }} tháng {{ thang }} năm {{ nam }}</div>
            <div class="sign-title">Người đại diện hoặc người được ủy quyền của doanh nghiệp</div>
            <div class="sign-sub">(Ký tên, đóng dấu)</div>
            <div class="sign-space"></div>
            <div class="sign-name">{{ NGUOI_NHAN }}</div>
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
      TEN_CTY: "", UQ: "", DIA_CHI_CTY: "", NGUOI_NHAN: "", MA_SO_THUE: "", SDT_CTY: "",
    };
  },
  computed: {
    diaChiChuRung() {
      if (!this.phieu) return "";
      return [this.phieu.Thon, this.phieu.Xa, this.phieu.Huyen].filter(Boolean).join(", ");
    },
    tongGiaTri() {
      if (!this.phieu || !this.phieu.Khoi_luong || !this.phieu.Don_gia) return 0;
      return Math.round(this.phieu.Khoi_luong * this.phieu.Don_gia);
    },
    tongGiaTriText() {
      const n = this.tongGiaTri;
      return n ? n.toLocaleString("vi-VN") + " VNĐ" : "";
    },
    ngay() { return this.phieu && this.phieu.Ngay_nhap ? new Date(this.phieu.Ngay_nhap).getDate() : "__"; },
    thang() { return this.phieu && this.phieu.Ngay_nhap ? new Date(this.phieu.Ngay_nhap).getMonth() + 1 : "__"; },
    nam() { return this.phieu && this.phieu.Ngay_nhap ? new Date(this.phieu.Ngay_nhap).getFullYear() : "____"; },
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
      this.UQ = cfg.nguoi_dai_dien || "";
      this.DIA_CHI_CTY = cfg.dia_chi || "";
      this.NGUOI_NHAN = cfg.nguoi_nhan || "";
      this.MA_SO_THUE = cfg.mst || "";
      this.SDT_CTY = cfg.sdt || "";
    },
    formatDate(d) {
      if (!d) return "";
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      return String(dt.getDate()).padStart(2, "0") + "/" + String(dt.getMonth() + 1).padStart(2, "0") + "/" + dt.getFullYear();
    },
    fmtNum(v) { return v == null ? "" : Number(v).toFixed(2); },
    fmtMoney(v) { return v == null ? "" : Math.round(Number(v)).toLocaleString("vi-VN"); },
    printPage() { window.print(); },
  },
};
</script>

<style scoped>
.bk-form {
  border: 1px solid #333;
  padding: 20px 28px;
  font-size: 12px;
  font-family: "Times New Roman", serif;
  line-height: 1.6;
  max-width: 960px;
}
.mau-so { font-size: 10px; }
.mau-so .italic { font-style: italic; }
.title { text-align: center; font-weight: bold; font-size: 14px; text-transform: uppercase; margin: 12px 0 4px; }
.date-line { text-align: center; font-style: italic; margin-bottom: 12px; }
.info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
.info-table td { padding: 2px 4px; vertical-align: top; }
.info-table .lbl { font-weight: bold; white-space: nowrap; }
.data-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
.data-table th, .data-table td { border: 1px solid #333; padding: 4px 6px; text-align: center; font-size: 10px; }
.data-table th { background: #f0f0f0; font-weight: bold; }
.data-table .num { text-align: right; }
.data-table .total-row td { font-weight: bold; }
.data-table .col-num th { font-weight: normal; font-style: italic; font-size: 9px; }
.data-table .small-text { font-size: 9px; }
.total-text { margin: 8px 0; font-size: 12px; }
.sign-area { display: flex; justify-content: space-between; margin-top: 20px; }
.sign-col { text-align: center; width: 45%; }
.sign-title { font-weight: bold; font-style: italic; }
.sign-sub { font-style: italic; font-size: 10px; }
.sign-date { font-style: italic; font-size: 11px; margin-bottom: 4px; }
.sign-space { height: 60px; }
.sign-name { font-weight: bold; }

@media print {
  .no-print { display: none !important; }
  .bk-form { border: 1px solid #000; }
  @page { size: landscape A4; margin: 10mm; }
}
</style>
