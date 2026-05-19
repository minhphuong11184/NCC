<template>
  <q-page padding>
    <!-- ===== Toolbar: chọn phiếu + in ===== -->
    <div class="row q-col-gutter-md items-center q-mb-md no-print">
      <div class="col-auto">
        <q-input v-model="fromDate" type="date" label="Từ ngày" filled dense style="width:160px" @input="loadCodes" />
      </div>
      <div class="col-auto">
        <q-input v-model="toDate" type="date" label="Đến ngày" filled dense style="width:160px" @input="loadCodes" />
      </div>
      <div class="col-auto">
        <q-select
          v-model="selectedCode"
          :options="codes"
          option-label="label"
          option-value="value"
          label="Mã phiếu"
          filled dense style="min-width: 280px"
          @input="loadPhieu"
        />
      </div>
      <div class="col-auto">
        <q-select
          v-model="manualXuong"
          :options="xuongSelectOptions"
          emit-value map-options
          label="Xưởng xẻ (override)"
          filled dense clearable
          style="min-width: 220px"
          @input="onXuongChange"
        />
      </div>
      <div class="col-auto">
        <q-btn icon="print" label="In phiếu" color="primary" @click="printPage" :disable="!phieu" />
      </div>
      <div class="col-auto">
        <q-btn icon="file_download" label="Xuất Excel tất cả" color="secondary" @click="exportAllExcel" :loading="exporting" />
      </div>
      <div class="col-auto">
        <q-btn icon="description" label="Xuất Word tất cả" color="blue-7" @click="exportAllWord" :loading="exporting" />
      </div>
    </div>

    <!-- ===== Nội dung 2 biểu mẫu song song ===== -->
    <div v-if="phieu" class="print-area">
      <div class="bieu-mau-container">
        <!-- ========== BM.COC.01-a: Biên bản nghiệm thu ========== -->
        <div class="bieu-mau bm-01a">
          <div class="header-row">
            <span class="company">{{ TEN_CTY }}</span>
          </div>
          <div class="header-row">
            <span>SỔ TAY COC</span>
            <span class="right">{{ BM_NGHIEM_THU }}</span>
          </div>
          <div class="header-row small">
            <span></span>
            <span class="right">Ngày ban hành: {{ NGAY_BAN_HANH }}</span>
          </div>
          <div class="title">BIÊN BẢN NGHIỆM THU VÀ GIAO NHẬN<br/>GỖ KEO TRÒN FSC100%</div>
          <div class="header-row small right">Lần ban hành: {{ LAN_BAN_HANH }}</div>

          <table class="info-table">
            <tr><td class="lbl">Đơn vị giao hàng:</td><td class="val">{{ phieu.Chu_rung }}</td><td class="lbl">Số phiếu:</td><td class="val">{{ phieu.So_phieu }}</td></tr>
            <tr><td class="lbl">Địa chỉ:</td><td class="val" colspan="1">{{ phieu.Thon || '' }} {{ phieu.Xa || '' }} {{ phieu.Huyen || '' }}</td><td class="lbl">Biển số xe:</td><td class="val">{{ phieu.Xe }}</td></tr>
            <tr><td class="lbl">Số chứng chỉ FM/COC:</td><td class="val">{{ phieu.So_chung_chi }}</td><td class="lbl">Nơi giao nhận</td><td class="val">tại bãi 1: {{ phieu.Chu_rung }}</td></tr>
            <tr><td class="lbl">Đơn vị nhận hàng:</td><td class="val">{{ UQ }} ({{ TEN_CTY }})</td><td class="lbl">Ngày nghiệm thu:</td><td class="val">{{ formatDate(phieu.Ngay_nhap) }}</td></tr>
            <tr><td class="lbl">Địa chỉ:</td><td class="val">{{ DIA_CHI_CTY }}</td><td class="lbl">Trạng thái MT:</td><td class="val">FSC 100%</td></tr>
            <tr><td class="lbl">Số chứng chỉ FM/COC:</td><td class="val">{{ CHUNG_CHI_CTY }}</td><td class="lbl">Nhóm SP:</td><td class="val">W1.1</td></tr>
            <tr><td></td><td></td><td class="lbl">Hiệu lực đến:</td><td class="val">{{ HIEU_LUC_CTY }}</td></tr>
            <tr><td></td><td></td><td class="lbl">Mã lô gỗ nhập:</td><td class="val">{{ phieu.Lo_go_tron }}</td></tr>
          </table>

          <table class="data-table">
            <thead>
              <tr>
                <th>STT</th>
                <th colspan="2">Quy cách</th>
                <th>KL thực nhập (M3)</th>
                <th>Loài gỗ</th>
                <th>Khoảnh</th>
                <th>Lô</th>
                <th>Diện tích (Ha)</th>
              </tr>
              <tr>
                <th></th>
                <th>Dài (m)</th>
                <th>Đường kính (cm)</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>Từ 13cm trở lên</td>
                <td class="num">{{ fmtNum(phieu.Khoi_luong) }}</td>
                <td>{{ phieu.Loai_go ? 'Gỗ keo tròn FSC 100% (' + phieu.Loai_go + ')' : '' }}</td>
                <td>{{ phieu.Khoang }}</td>
                <td>{{ phieu.Lo }}</td>
                <td class="num">{{ fmtNum(phieu.Dien_tich) }}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">TỔNG</td>
                <td class="num">{{ fmtNum(phieu.Khoi_luong) }}</td>
                <td colspan="4"></td>
              </tr>
            </tbody>
          </table>

          <div class="sign-area">
            <div class="sign-col">
              <div class="sign-title">Đại diện giao hàng</div>
              <div class="sign-space"></div>
              <div class="sign-name">{{ phieu.Chu_rung }}</div>
            </div>
            <div class="sign-col">
              <div class="sign-title">Đại diện nhận hàng</div>
              <div class="sign-space"></div>
              <div class="sign-name">{{ UQ }}</div>
            </div>
          </div>
        </div>

        <!-- ========== BM.COC.01-b: Phiếu nhập kho ========== -->
        <div class="bieu-mau bm-01b">
          <div class="header-row">
            <span class="company">{{ TEN_CTY }}</span>
          </div>
          <div class="header-row">
            <span>SỔ TAY COC</span>
            <span class="right">{{ BM_NHAP_KHO }}</span>
          </div>
          <div class="header-row small">
            <span></span>
            <span class="right">Ngày ban hành: {{ NGAY_BAN_HANH }}</span>
          </div>
          <div class="title">PHIẾU NHẬP KHO GỖ KEO TRÒN FSC100%</div>
          <div class="header-row small right">Lần ban hành: {{ LAN_BAN_HANH }}</div>

          <table class="info-table">
            <tr><td class="lbl">Người giao hàng:</td><td class="val">{{ UQ }}</td><td class="lbl">Số phiếu:</td><td class="val">{{ phieu.So_phieu }}</td></tr>
            <tr><td class="lbl">Kho nhập:</td><td class="val">{{ TEN_CTY }}</td><td class="lbl">Biển số xe:</td><td class="val">{{ phieu.Xe }}</td></tr>
            <tr><td class="lbl">Địa chỉ:</td><td class="val">{{ DIA_CHI_CTY }}</td><td class="lbl">Ngày nhập:</td><td class="val">{{ formatDate(phieu.Ngay_nhap) }}</td></tr>
            <tr><td class="lbl">Trạng thái MT:</td><td class="val">FSC 100%</td><td class="lbl">Nhóm SP:</td><td class="val">W1.1</td></tr>
            <tr><td class="lbl">Mã lô gỗ nhập:</td><td class="val">{{ phieu.Lo_go_tron }}</td><td></td><td></td></tr>
            <tr><td class="lbl">Số chứng chỉ FM/COC:</td><td class="val">{{ CHUNG_CHI_CTY }}</td><td class="lbl">Hiệu lực đến:</td><td class="val">{{ HIEU_LUC_CTY }}</td></tr>
          </table>

          <table class="data-table">
            <thead>
              <tr>
                <th>STT</th>
                <th colspan="2">Quy cách</th>
                <th>KL thực nhập (M3)</th>
                <th>Loài gỗ</th>
                <th>Khoảnh</th>
                <th>Lô</th>
                <th>Diện tích (Ha)</th>
              </tr>
              <tr>
                <th></th>
                <th>Dài (m)</th>
                <th>Đường kính (cm)</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>Từ 13cm trở lên</td>
                <td class="num">{{ fmtNum(phieu.Khoi_luong) }}</td>
                <td>{{ phieu.Loai_go ? 'Gỗ keo tròn FSC 100% (' + phieu.Loai_go + ')' : '' }}</td>
                <td>{{ phieu.Khoang }}</td>
                <td>{{ phieu.Lo }}</td>
                <td class="num">{{ fmtNum(phieu.Dien_tich) }}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">TỔNG</td>
                <td class="num">{{ fmtNum(phieu.Khoi_luong) }}</td>
                <td colspan="4"></td>
              </tr>
            </tbody>
          </table>

          <div class="sign-area">
            <div class="sign-col">
              <div class="sign-title">Đại diện bên giao</div>
              <div class="sign-space"></div>
              <div class="sign-name">{{ UQ }}</div>
            </div>
            <div class="sign-col">
              <div class="sign-title">Đại diện bên nhận</div>
              <div class="sign-space"></div>
              <div class="sign-name">{{ NGUOI_NHAN }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== BKTM: Bảng kê thu mua không có hóa đơn (Mẫu 02/TNDN) ========== -->
      <div class="bktm-page">
        <div class="bktm">
          <div class="bktm-header-box">
            <div>Mẫu số: <b>02/TNDN</b></div>
            <div class="italic">(Ban hành kèm theo Thông tư số 20/2026/TT-BTC<br/>của Bộ trưởng Bộ Tài chính)</div>
          </div>

          <div class="bktm-title">BẢNG KÊ THU MUA HÀNG HÓA, DỊCH VỤ</div>
          <div class="bktm-title sub">KHÔNG CÓ HÓA ĐƠN</div>
          <div class="bktm-date-line">(Ngày {{ ngay }} tháng {{ thang }} năm {{ nam }})</div>

          <table class="info-table q-mt-sm">
            <tr><td class="lbl">- Tên doanh nghiệp:</td><td class="val">{{ TEN_CTY }}</td></tr>
            <tr><td class="lbl">- Mã số thuế:</td><td class="val">{{ MA_SO_THUE }}</td></tr>
            <tr><td class="lbl">- Địa chỉ:</td><td class="val">{{ DIA_CHI_CTY }}</td></tr>
            <tr><td class="lbl">- Số điện thoại:</td><td class="val">{{ SDT_CTY }}</td></tr>
            <tr><td class="lbl">- Địa chỉ nơi tổ chức thu mua:</td><td class="val">{{ diaChiChuRung }}</td></tr>
            <tr>
              <td class="lbl">- Số phiếu của biên bản nghiệm thu gỗ keo tai tượng (Acacia Mangium) FSC100%:</td>
              <td class="val">{{ phieu.So_phieu }} &nbsp;&nbsp;&nbsp; Lô gỗ tròn: <b>{{ phieu.Lo_go_tron }}</b></td>
            </tr>
            <tr><td class="lbl">- Số chứng chỉ FM/COC:</td><td class="val">{{ phieu.So_chung_chi }}</td></tr>
            <tr><td class="lbl">- Nhóm Sp:</td><td class="val">W1.1</td></tr>
            <tr>
              <td class="lbl"></td>
              <td class="val"><span class="hd-highlight">Theo HĐ số: {{ phieu.So_hop_dong || '' }}<span v-if="phieu.Ngay_hop_dong"> ngày {{ phieu.Ngay_hop_dong }}</span></span></td>
            </tr>
          </table>

          <table class="data-table bktm-data q-mt-sm">
            <thead>
              <tr>
                <th rowspan="2">Ngày tháng năm<br/>mua hàng</th>
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
                <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th>
                <th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ formatDate(phieu.Ngay_nhap) }}</td>
                <td>{{ phieu.Chu_rung }}</td>
                <td class="small-text">{{ diaChiChuRung }}</td>
                <td class="small-text">{{ phieu.cccd }}</td>
                <td></td>
                <td>Gỗ tròn keo tai tượng (Acacia Mangium) FSC 100%</td>
                <td class="num">{{ fmtNum(phieu.Khoi_luong) }}</td>
                <td class="num">{{ fmtMoney(phieu.Don_gia) }}</td>
                <td class="num">{{ fmtMoney(tongGiaTri) }}</td>
                <td></td>
              </tr>
              <tr class="total-row">
                <td colspan="6">Tổng</td>
                <td class="num">{{ fmtNum(phieu.Khoi_luong) }}</td>
                <td></td>
                <td class="num">{{ fmtMoney(tongGiaTri) }}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div class="bktm-total-text">
            - Tổng giá trị hàng hóa, dịch vụ mua vào: <b>{{ tongGiaTriText }}</b>
            <span class="italic">(Số tiền bằng chữ: <b>{{ tongGiaTriBangChu }}</b>)</span>
          </div>

          <div class="bktm-date q-mt-md">
            Ngày {{ ngay }} tháng {{ thang }} năm {{ nam }}
          </div>

          <div class="sign-area">
            <div class="sign-col">
              <div class="sign-title">Người lập bảng kê</div>
              <div class="sign-sub">(Ký, ghi rõ họ tên)</div>
              <div class="sign-space"></div>
              <div class="sign-name"></div>
            </div>
            <div class="sign-col">
              <div class="sign-title">Người đại diện hoặc người được<br/>ủy quyền của doanh nghiệp</div>
              <div class="sign-sub">(Ký tên, đóng dấu)</div>
              <div class="sign-space"></div>
              <div class="sign-name">{{ UQ }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-grey-6 q-mt-xl">
      Chọn nhà máy → khoảng ngày → mã phiếu để xem biểu mẫu
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import xuongXeMixin from "../mixins/xuongXeMixin";

export default {
  mixins: [xuongXeMixin],
  data() {
    return {
      fromDate: "2025-08-01",
      toDate: "2025-11-01",
      codes: [],
      selectedCode: null,
      phieu: null,
      exporting: false,
      TEN_CTY: "",
      UQ: "",
      DIA_CHI_CTY: "",
      SDT_CTY: "",
      CHUNG_CHI_CTY: "",
      HIEU_LUC_CTY: "",
      NGUOI_NHAN: "",
      MA_SO_THUE: "",
      BM_NGHIEM_THU: "BM.COC.01-a",
      BM_NHAP_KHO: "BM.COC.01-b",
      NGAY_BAN_HANH: "10.2.2022",
      LAN_BAN_HANH: "02",
      manualXuong: null,
    };
  },
  computed: {
    diaChiChuRung() {
      if (!this.phieu) return "";
      return [this.phieu.Thon, this.phieu.Xa, this.phieu.Huyen]
        .filter(Boolean).join(", ");
    },
    tongGiaTri() {
      if (!this.phieu || !this.phieu.Khoi_luong || !this.phieu.Don_gia) return 0;
      return Math.round(this.phieu.Khoi_luong * this.phieu.Don_gia);
    },
    tongGiaTriText() {
      const n = this.tongGiaTri;
      if (!n) return "";
      return n.toLocaleString("vi-VN") + " VNĐ";
    },
    tongGiaTriBangChu() {
      return this.numberToWordsVN(this.tongGiaTri);
    },
    ngay() {
      if (!this.phieu || !this.phieu.Ngay_nhap) return "__";
      return new Date(this.phieu.Ngay_nhap).getDate();
    },
    thang() {
      if (!this.phieu || !this.phieu.Ngay_nhap) return "__";
      return new Date(this.phieu.Ngay_nhap).getMonth() + 1;
    },
    nam() {
      if (!this.phieu || !this.phieu.Ngay_nhap) return "____";
      return new Date(this.phieu.Ngay_nhap).getFullYear();
    },
  },
  async created() {
    await this.loadXuongXe();
    this.loadCodes();
  },
  methods: {
    ...mapActions("prod", ["getCodebangiaogotron", "getBBgiaogotron", "getAllPhieuGoTron"]),

    /**
     * Đọc 1 số nguyên không âm sang chữ tiếng Việt (chữ thường, không đơn vị).
     * Dùng làm khối cơ bản cho numberToWordsVN (tiền) và volumeToWordsVN (khối lượng).
     */
    readIntegerVN(num) {
      let n = Math.abs(Math.round(Number(num) || 0));
      if (n === 0) return "không";

      const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
      const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ"];

      // Đọc 1 nhóm 3 chữ số. `full` = true khi nhóm đứng sau nhóm khác → buộc đọc đủ "X trăm"
      const readGroup = (g, full) => {
        const tr = Math.floor(g / 100);
        const ch = Math.floor((g % 100) / 10);
        const dv = g % 10;
        let s = "";
        if (tr > 0 || full) {
          s += digits[tr] + " trăm";
        }
        if (ch > 1) {
          s += (s ? " " : "") + digits[ch] + " mươi";
          if (dv === 1) s += " mốt";
          else if (dv === 4) s += " tư";
          else if (dv === 5) s += " lăm";
          else if (dv > 0) s += " " + digits[dv];
        } else if (ch === 1) {
          s += (s ? " " : "") + "mười";
          if (dv === 5) s += " lăm";
          else if (dv > 0) s += " " + digits[dv];
        } else if (ch === 0 && dv > 0) {
          if (tr > 0 || full) s += " linh " + digits[dv];
          else s += digits[dv];
        }
        return s.trim();
      };

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
        if (text) parts.push(text + (units[i] ? " " + units[i] : ""));
      }
      return parts.join(" ").replace(/\s+/g, " ").trim();
    },

    /**
     * Chuyển số tiền sang chữ tiếng Việt — viết hoa chữ đầu, kết thúc " đồng".
     */
    numberToWordsVN(num) {
      if (num == null || isNaN(num)) return "";
      const n = Math.round(Number(num));
      if (n === 0) return "Không đồng";
      const negative = n < 0;
      let text = this.readIntegerVN(Math.abs(n));
      text = text.charAt(0).toUpperCase() + text.slice(1);
      return (negative ? "Âm " + text.toLowerCase() : text) + " đồng";
    },

    /**
     * Chuyển khối lượng/thể tích (m³) sang chữ tiếng Việt — kết thúc " mét khối".
     * Phần thập phân đọc từng chữ số sau "phẩy" (vd 29.52 → "hai mươi chín phẩy năm hai mét khối").
     */
    volumeToWordsVN(num) {
      if (num == null || isNaN(num)) return "";
      const sign = Number(num) < 0 ? "Âm " : "";
      const abs = Math.abs(Number(num));
      const intPart = Math.floor(abs);
      const decRaw = Math.round((abs - intPart) * 100);

      let combined = this.readIntegerVN(intPart);
      if (decRaw > 0) {
        // Đọc 2 chữ số thập phân, bỏ trailing zero (29.50 → "năm", 29.05 → "không năm")
        let decStr = String(decRaw).padStart(2, "0").replace(/0+$/, "");
        if (!decStr) decStr = "0";
        const decDigits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
        const decText = decStr.split("").map(d => decDigits[+d]).join(" ");
        combined += " phẩy " + decText;
      }
      combined = combined.charAt(0).toUpperCase() + combined.slice(1);
      return sign + combined + " mét khối";
    },

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
      const data = await this.getBBgiaogotron({
        code: this.selectedCode.value,
      });
      this.phieu = data && data.data && data.data[0] ? data.data[0] : null;
      this.applyXuongConfig();
    },
    applyXuongConfig() {
      if (!this.phieu) return;
      // Ưu tiên xưởng user chọn manual; fallback xưởng gắn theo phiếu.
      const xuong = this.manualXuong || (this.phieu.Xuong_xe ? this.phieu.Xuong_xe.trim() : "");
      const cfg = this.getXuongConfig(xuong);
      this.TEN_CTY = cfg.ten || "";
      this.UQ = cfg.nguoi_dai_dien || "";
      this.DIA_CHI_CTY = cfg.dia_chi || "";
      this.SDT_CTY = cfg.sdt || "";
      this.CHUNG_CHI_CTY = cfg.chung_chi || "";
      this.HIEU_LUC_CTY = cfg.hieu_luc_cc || "";
      this.NGUOI_NHAN = cfg.nguoi_nhan || "";
      this.MA_SO_THUE = cfg.mst || "";
      this.BM_NGHIEM_THU = cfg.bm_nghiem_thu || "BM.COC.01-a";
      this.BM_NHAP_KHO = cfg.bm_nhap_kho || "BM.COC.01-b";
      this.NGAY_BAN_HANH = cfg.ngay_ban_hanh || "10.2.2022";
      this.LAN_BAN_HANH = cfg.lan_ban_hanh || "02";
    },
    /** Gọi khi đổi dropdown xưởng manual — load lại config. */
    onXuongChange() {
      this.applyXuongConfig();
    },
    /** Parse chuỗi ngày Vietnamese: ISO, "DD/MM/YYYY", "D-M-YYYY", v.v. → Date hoặc null. */
    parseDateString(s) {
      if (!s) return null;
      const d1 = new Date(s);
      if (!isNaN(d1.getTime())) return d1;
      const m = String(s).match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
      if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
      return null;
    },
    formatDate(d) {
      if (!d) return "";
      const dt = new Date(d);
      if (isNaN(dt)) return d;
      const dd = String(dt.getDate()).padStart(2, "0");
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const yy = dt.getFullYear();
      return `${dd}/${mm}/${yy}`;
    },
    fmtNum(v) {
      if (v === null || v === undefined) return "";
      return Number(v).toFixed(2);
    },
    fmtMoney(v) {
      if (v === null || v === undefined) return "";
      return Math.round(Number(v)).toLocaleString("vi-VN");
    },
    printPage() {
      window.print();
    },

    /* ===== Xuất Excel toàn bộ phiếu (in đẹp, có border + page setup) ===== */
    async exportAllExcel() {
      this.exporting = true;
      try {
        const res = await this.getAllPhieuGoTron();
        const allPhieu = (res && res.data) || [];
        if (!allPhieu.length) {
          this.$q.notify({ type: "warning", message: "Không có phiếu nào có khối lượng > 0" });
          return;
        }

        const wb = new ExcelJS.Workbook();

        // ===== Sheet Tổng hợp =====
        this.buildTongHopSheet(wb, allPhieu);

        // ===== Mỗi phiếu = 1 sheet (3 trang in: 01-a, 01-b, BKTM) =====
        for (let idx = 0; idx < allPhieu.length; idx++) {
          const p = allPhieu[idx];
          const cfg = this.cfgForPhieu(p);
          const sName = ((p.So_phieu || `P${idx + 1}`) + "")
            .replace(/[\\/?*[\]:]/g, "-").slice(0, 31);
          const ws = wb.addWorksheet(sName, {
            pageSetup: {
              paperSize: 9, orientation: "portrait",
              fitToPage: true, fitToWidth: 1, fitToHeight: 0,
              margins: { left: 0.4, right: 0.4, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 },
            },
          });
          // 10 cột A-J, vừa A4 portrait — dùng cho cả 01-a, 01-b, BKTM
          // (rộng hơn trước để giảm wrap headers; print fit-to-width sẽ nén)
          ws.columns = [
            { width: 9 },  // A: STT / Ngày tháng năm mua hàng
            { width: 13 }, // B: Dài / Tên người bán
            { width: 18 }, // C: Đường kính / Địa chỉ
            { width: 15 }, // D: KL / Số căn cước
            { width: 12 }, // E: Loài gỗ phần 1 / SĐT
            { width: 22 }, // F: Loài gỗ phần 2 / Tên hàng hóa, dịch vụ
            { width: 12 }, // G: Loài gỗ phần 3 / Số lượng, trọng lượng
            { width: 12 }, // H: Khoảnh / Đơn giá
            { width: 14 }, // I: Lô / Tổng giá thanh toán
            { width: 10 }, // J: DT (Ha) / Ghi chú
          ];
          let row = 1;
          row = this.buildSec01a(ws, p, cfg, row);
          ws.getRow(row - 1).addPageBreak();
          row = this.buildSec01b(ws, p, cfg, row);
          ws.getRow(row - 1).addPageBreak();
          row = this.buildSecBKTM(ws, p, cfg, row);
          ws.getRow(row - 1).addPageBreak();
          row = this.buildSecBKLS(ws, p, cfg, row);
        }

        const buf = await wb.xlsx.writeBuffer();
        const tenFile = (this.TEN_CTY || "NhaCungCap").replace(/[^\p{L}\p{N}]+/gu, "_");
        saveAs(
          new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
          "Phieu_NK_Go_Tron_" + tenFile + ".xlsx"
        );

        this.$q.notify({
          type: "positive",
          message: `Đã xuất ${allPhieu.length} phiếu (${allPhieu.length + 1} sheet)`,
          timeout: 4000,
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Lỗi xuất Excel: " + (err.message || err), timeout: 6000 });
      } finally {
        this.exporting = false;
      }
    },

    /* ===== Excel helpers ===== */

    /** Border thin cho 1 ô. */
    bThin() {
      return {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" },
      };
    },

    /** Lấy config xưởng cho 1 phiếu (không mutate state). */
    cfgForPhieu(p) {
      // Ưu tiên xưởng user chọn manual; fallback xưởng gắn theo phiếu.
      const x = this.manualXuong || (p && p.Xuong_xe ? p.Xuong_xe.trim() : "");
      const c = this.getXuongConfig(x);
      return {
        TEN_CTY: c.ten || "",
        UQ: c.nguoi_dai_dien || "",
        DIA_CHI_CTY: c.dia_chi || "",
        SDT_CTY: c.sdt || "",
        CHUNG_CHI_CTY: c.chung_chi || "",
        HIEU_LUC_CTY: c.hieu_luc_cc || "",
        NGUOI_NHAN: c.nguoi_nhan || "",
        MA_SO_THUE: c.mst || "",
        BM_NGHIEM_THU: c.bm_nghiem_thu || "BM.COC.01-a",
        BM_NHAP_KHO: c.bm_nhap_kho || "BM.COC.01-b",
        NGAY_BAN_HANH: c.ngay_ban_hanh || "10.2.2022",
        LAN_BAN_HANH: c.lan_ban_hanh || "02",
      };
    },

    /**
     * Set ô (có thể merge), trả về cell.
     * opts: { merge:'D1', bold, italic, size, center, right, wrap, border, fill, numFmt }
     */
    setCell(ws, addr, value, opts = {}) {
      if (opts.merge) ws.mergeCells(`${addr}:${opts.merge}`);
      const cell = ws.getCell(addr);
      cell.value = value;
      const font = { name: "Times New Roman", size: opts.size || 11 };
      if (opts.bold) font.bold = true;
      if (opts.italic) font.italic = true;
      cell.font = font;
      cell.alignment = {
        horizontal: opts.center ? "center" : (opts.right ? "right" : "left"),
        vertical: "middle",
        wrapText: opts.wrap !== false,
      };
      if (opts.border) cell.border = this.bThin();
      if (opts.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.fill } };
      if (opts.numFmt) cell.numFmt = opts.numFmt;
      return cell;
    },

    /** Apply border lên dải ô A:B. */
    applyBorder(ws, range) {
      const [start, end] = range.split(":");
      const m1 = start.match(/([A-Z]+)(\d+)/);
      const m2 = end.match(/([A-Z]+)(\d+)/);
      const c1 = this.colToNum(m1[1]), c2 = this.colToNum(m2[1]);
      const r1 = +m1[2], r2 = +m2[2];
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          ws.getCell(r, c).border = this.bThin();
        }
      }
    },
    colToNum(col) {
      let n = 0;
      for (let i = 0; i < col.length; i++) n = n * 26 + (col.charCodeAt(i) - 64);
      return n;
    },

    /* ===== Sheet Tổng hợp gỗ tròn các xưởng COC ===== */
    buildTongHopSheet(wb, allPhieu) {
      const ws = wb.addWorksheet("Tổng hợp", {
        pageSetup: {
          paperSize: 9, orientation: "landscape",
          fitToPage: true, fitToWidth: 1,
          margins: { left: 0.3, right: 0.3, top: 0.3, bottom: 0.3, header: 0.2, footer: 0.2 },
        },
      });

      // Định nghĩa 16 cột A-P
      const cols = [
        { key: "xuong",    header: "Xưởng xẻ",                  width: 14 },
        { key: "chu",      header: "Chủ rừng",                  width: 22 },
        { key: "xa",       header: "Xã",                        width: 12 },
        { key: "huyen",    header: "Huyện, Tỉnh",               width: 14 },
        { key: "loai",     header: "Loài gỗ",                   width: 14 },
        { key: "lo_go",    header: "Lô gỗ",                     width: 12 },
        { key: "sp",       header: "Số phiếu",                  width: 12 },
        { key: "ngay",     header: "Ngày",                      width: 11 },
        { key: "kl",       header: "khối lượng gỗ tròn",        width: 13 },
        { key: "xe",       header: "Xe vận chuyển",             width: 14 },
        { key: "scc",      header: "Số chứng chỉ Rừng",         width: 18 },
        { key: "tencty",   header: "Tên cty đại diện Chứng chỉ", width: 26 },
        { key: "khoang",   header: "Khoảnh",                    width: 8 },
        { key: "lo",       header: "Lô",                        width: 6 },
        { key: "dt",       header: "Diện tích",                 width: 9 },
        { key: "namt",     header: "Năm trồng",                 width: 9 },
      ];
      ws.columns = cols.map(c => ({ key: c.key, width: c.width }));
      const lastCol = String.fromCharCode(64 + cols.length); // 'P'

      // Row 1: Title merge A1:P1
      ws.mergeCells(`A1:${lastCol}1`);
      const t = ws.getCell("A1");
      t.value = "TỔNG HỢP GỖ TRÒN CÁC XƯỞNG COC";
      t.font = { name: "Times New Roman", size: 16, bold: true };
      t.alignment = { horizontal: "center", vertical: "middle" };
      ws.getRow(1).height = 32;
      // Row 2: blank spacer
      ws.getRow(2).height = 8;

      // Row 3: header (peach background)
      const hdr = ws.getRow(3);
      cols.forEach((c, i) => {
        const cell = hdr.getCell(i + 1);
        cell.value = c.header;
        cell.font = { name: "Times New Roman", size: 11, bold: true };
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFD7AB" } };
        cell.border = this.bThin();
      });
      hdr.height = 42;

      // Data rows từ row 4
      allPhieu.forEach((p, i) => {
        const r = ws.getRow(4 + i);
        r.getCell("xuong").value  = p.Xuong_xe || "";
        r.getCell("chu").value    = p.Chu_rung || "";
        r.getCell("xa").value     = p.Xa || "";
        r.getCell("huyen").value  = p.Huyen || "";
        r.getCell("loai").value   = p.Loai_go || "";
        r.getCell("lo_go").value  = p.Lo_go || "";
        r.getCell("sp").value     = p.So_phieu || "";
        r.getCell("ngay").value   = this.formatDate(p.Ngay_nhap);
        r.getCell("kl").value     = p.Khoi_luong || 0;
        r.getCell("xe").value     = p.Xe || "";
        r.getCell("scc").value    = p.So_chung_chi || "";
        r.getCell("tencty").value = p.nhom_chung_chi || "";
        r.getCell("khoang").value = p.Khoang || "";
        r.getCell("lo").value     = p.Lo || "";
        r.getCell("dt").value     = p.Dien_tich || "";
        r.getCell("namt").value   = p.Nam_trong || "";

        r.font = { name: "Times New Roman", size: 10 };
        r.alignment = { vertical: "middle", wrapText: true };
        cols.forEach((c, idx) => {
          const cell = r.getCell(idx + 1);
          cell.border = this.bThin();
          // Số liệu căn phải, text căn trái (tên/địa danh) hoặc giữa
          if (["kl", "dt"].includes(c.key)) cell.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
          else if (["xa", "huyen", "loai", "sp", "ngay", "xe", "scc", "khoang", "lo", "namt", "lo_go", "xuong"].includes(c.key))
            cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        });
        r.getCell("kl").numFmt = "#,##0.00";
        r.getCell("dt").numFmt = "#,##0.00";
        r.height = 30;
      });

      // Freeze 3 hàng đầu (title + spacer + header)
      ws.views = [{ state: "frozen", ySplit: 3 }];
    },

    /* ===== Section: BIÊN BẢN NGHIỆM THU (BM.COC.01-a) ===== */
    buildSec01a(ws, p, cfg, startRow) {
      const r = startRow;
      const diaChiCR = [p.Thon, p.Xa, p.Huyen].filter(Boolean).join(", ");

      this.setCell(ws, `A${r}`, cfg.TEN_CTY, { merge: `J${r}`, bold: true, center: true, size: 12 });
      this.setCell(ws, `A${r + 1}`, "SỔ TAY COC", { merge: `E${r + 1}`, bold: true });
      this.setCell(ws, `F${r + 1}`, cfg.BM_NGHIEM_THU || "BM.COC.01-a", { merge: `J${r + 1}`, bold: true, right: true });
      this.setCell(ws, `F${r + 2}`, `Ngày ban hành: ${cfg.NGAY_BAN_HANH || "10.2.2022"}`, { merge: `J${r + 2}`, italic: true, size: 9, right: true });
      this.setCell(ws, `A${r + 3}`, "BIÊN BẢN NGHIỆM THU VÀ GIAO NHẬN GỖ KEO TRÒN FSC100%",
        { merge: `J${r + 3}`, bold: true, center: true, size: 13 });
      ws.getRow(r + 3).height = 28;
      this.setCell(ws, `F${r + 4}`, `Lần ban hành: ${cfg.LAN_BAN_HANH || "02"}`, { merge: `J${r + 4}`, italic: true, size: 9, right: true });

      // Info table — A-B label, C-E value, F-G label, H-J value (mở rộng A4)
      const info = [
        ["Đơn vị giao hàng:", p.Chu_rung || "", "Số phiếu:", p.So_phieu || ""],
        ["Địa chỉ:", diaChiCR, "Biển số xe:", p.Xe || ""],
        ["Số chứng chỉ FM/COC:", p.So_chung_chi || "", "Nơi giao nhận:", "tại bãi 1: " + (p.Chu_rung || "")],
        ["Đơn vị nhận hàng:", `${cfg.UQ} (${cfg.TEN_CTY})`, "Ngày nghiệm thu:", this.formatDate(p.Ngay_nhap)],
        ["Địa chỉ:", cfg.DIA_CHI_CTY, "Trạng thái MT:", "FSC 100%"],
        ["Số chứng chỉ FM/COC:", cfg.CHUNG_CHI_CTY, "Nhóm SP:", "W1.1"],
        ["", "", "Hiệu lực đến:", cfg.HIEU_LUC_CTY],
        ["", "", "Mã lô gỗ nhập:", p.Lo_go_tron || ""],
      ];
      let cur = r + 6;
      info.forEach(([la, va, lb, vb]) => {
        this.setCell(ws, `A${cur}`, la, { merge: `B${cur}`, bold: !!la });
        this.setCell(ws, `C${cur}`, va, { merge: `E${cur}` });
        this.setCell(ws, `F${cur}`, lb, { merge: `G${cur}`, bold: !!lb });
        this.setCell(ws, `H${cur}`, vb, { merge: `J${cur}`, bold: lb === "Số phiếu:" });
        cur++;
      });

      cur += 1;
      // Data table 10 cột: STT(A) | Quy cách(B-C) | KL(D) | Loài gỗ(E-G) | Khoảnh(H) | Lô(I) | DT(J)
      this.setCell(ws, `A${cur}`, "STT", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `B${cur}`, "Quy cách", { merge: `C${cur}`, center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `D${cur}`, "KL thực nhập (m³)", { center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      this.setCell(ws, `E${cur}`, "Loài gỗ", { merge: `G${cur}`, center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `H${cur}`, "Khoảnh", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `I${cur}`, "Lô", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `J${cur}`, "Diện tích (Ha)", { center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      ws.getRow(cur).height = 32;
      cur++;
      this.setCell(ws, `B${cur}`, "Dài (m)", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `C${cur}`, "Đường kính (cm)", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      ["A", "D", "E", "F", "G", "H", "I", "J"].forEach(c => (ws.getCell(`${c}${cur}`).border = this.bThin()));
      ws.getRow(cur).height = 22;
      cur++;
      // Data row
      this.setCell(ws, `A${cur}`, 1, { center: true, border: true });
      this.setCell(ws, `B${cur}`, 2, { center: true, border: true });
      this.setCell(ws, `C${cur}`, "Từ 13cm trở lên", { center: true, border: true });
      this.setCell(ws, `D${cur}`, p.Khoi_luong || 0, { center: true, border: true, numFmt: "#,##0.00" });
      this.setCell(ws, `E${cur}`, "Gỗ keo tròn FSC 100% (Acacia Mangium)",
        { merge: `G${cur}`, center: true, border: true, wrap: true });
      this.setCell(ws, `H${cur}`, p.Khoang || "", { center: true, border: true });
      this.setCell(ws, `I${cur}`, p.Lo || "", { center: true, border: true });
      this.setCell(ws, `J${cur}`, p.Dien_tich || "", { center: true, border: true, numFmt: "#,##0.00" });
      cur++;
      // Tổng
      this.setCell(ws, `A${cur}`, "TỔNG", { merge: `C${cur}`, center: true, bold: true, border: true });
      this.setCell(ws, `D${cur}`, p.Khoi_luong || 0, { center: true, bold: true, border: true, numFmt: "#,##0.00" });
      this.setCell(ws, `E${cur}`, "", { merge: `J${cur}`, border: true });
      cur += 2;

      // Sign area
      this.setCell(ws, `A${cur}`, "Đại diện giao hàng", { merge: `E${cur}`, bold: true, italic: true, center: true });
      this.setCell(ws, `F${cur}`, "Đại diện nhận hàng", { merge: `J${cur}`, bold: true, italic: true, center: true });
      cur += 4;
      this.setCell(ws, `A${cur}`, p.Chu_rung || "", { merge: `E${cur}`, bold: true, center: true });
      this.setCell(ws, `F${cur}`, cfg.UQ || "", { merge: `J${cur}`, bold: true, center: true });
      return cur + 2;
    },

    /* ===== Section: PHIẾU NHẬP KHO (BM.COC.01-b) ===== */
    buildSec01b(ws, p, cfg, startRow) {
      const r = startRow;
      this.setCell(ws, `A${r}`, cfg.TEN_CTY, { merge: `J${r}`, bold: true, center: true, size: 12 });
      this.setCell(ws, `A${r + 1}`, "SỔ TAY COC", { merge: `E${r + 1}`, bold: true });
      this.setCell(ws, `F${r + 1}`, cfg.BM_NHAP_KHO || "BM.COC.01-b", { merge: `J${r + 1}`, bold: true, right: true });
      this.setCell(ws, `F${r + 2}`, `Ngày ban hành: ${cfg.NGAY_BAN_HANH || "10.2.2022"}`, { merge: `J${r + 2}`, italic: true, size: 9, right: true });
      this.setCell(ws, `A${r + 3}`, "PHIẾU NHẬP KHO GỖ KEO TRÒN FSC100%",
        { merge: `J${r + 3}`, bold: true, center: true, size: 13 });
      ws.getRow(r + 3).height = 28;
      this.setCell(ws, `F${r + 4}`, `Lần ban hành: ${cfg.LAN_BAN_HANH || "02"}`, { merge: `J${r + 4}`, italic: true, size: 9, right: true });

      const info = [
        ["Người giao hàng:", cfg.UQ, "Số phiếu:", p.So_phieu || ""],
        ["Kho nhập:", cfg.TEN_CTY, "Biển số xe:", p.Xe || ""],
        ["Địa chỉ:", cfg.DIA_CHI_CTY, "Ngày nhập:", this.formatDate(p.Ngay_nhap)],
        ["Trạng thái MT:", "FSC 100%", "Nhóm SP:", "W1.1"],
        ["Mã lô gỗ nhập:", p.Lo_go_tron || "", "", ""],
        ["Số chứng chỉ FM/COC:", cfg.CHUNG_CHI_CTY, "Hiệu lực đến:", cfg.HIEU_LUC_CTY],
      ];
      let cur = r + 6;
      info.forEach(([la, va, lb, vb]) => {
        this.setCell(ws, `A${cur}`, la, { merge: `B${cur}`, bold: !!la });
        this.setCell(ws, `C${cur}`, va, { merge: `E${cur}` });
        this.setCell(ws, `F${cur}`, lb, { merge: `G${cur}`, bold: !!lb });
        this.setCell(ws, `H${cur}`, vb, { merge: `J${cur}`, bold: lb === "Số phiếu:" });
        cur++;
      });

      cur += 1;
      // Data table 10 cột (giống 01-a)
      this.setCell(ws, `A${cur}`, "STT", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `B${cur}`, "Quy cách", { merge: `C${cur}`, center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `D${cur}`, "KL thực nhập (m³)", { center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      this.setCell(ws, `E${cur}`, "Loài gỗ", { merge: `G${cur}`, center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `H${cur}`, "Khoảnh", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `I${cur}`, "Lô", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `J${cur}`, "Diện tích (Ha)", { center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      ws.getRow(cur).height = 32;
      cur++;
      this.setCell(ws, `B${cur}`, "Dài (m)", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `C${cur}`, "Đường kính (cm)", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      ["A", "D", "E", "F", "G", "H", "I", "J"].forEach(c => (ws.getCell(`${c}${cur}`).border = this.bThin()));
      ws.getRow(cur).height = 22;
      cur++;
      this.setCell(ws, `A${cur}`, 1, { center: true, border: true });
      this.setCell(ws, `B${cur}`, 2, { center: true, border: true });
      this.setCell(ws, `C${cur}`, "Từ 13cm trở lên", { center: true, border: true });
      this.setCell(ws, `D${cur}`, p.Khoi_luong || 0, { center: true, border: true, numFmt: "#,##0.00" });
      this.setCell(ws, `E${cur}`, "Gỗ keo tròn FSC 100% (Acacia Mangium)",
        { merge: `G${cur}`, center: true, border: true, wrap: true });
      this.setCell(ws, `H${cur}`, p.Khoang || "", { center: true, border: true });
      this.setCell(ws, `I${cur}`, p.Lo || "", { center: true, border: true });
      this.setCell(ws, `J${cur}`, p.Dien_tich || "", { center: true, border: true, numFmt: "#,##0.00" });
      cur++;
      this.setCell(ws, `A${cur}`, "TỔNG", { merge: `C${cur}`, center: true, bold: true, border: true });
      this.setCell(ws, `D${cur}`, p.Khoi_luong || 0, { center: true, bold: true, border: true, numFmt: "#,##0.00" });
      this.setCell(ws, `E${cur}`, "", { merge: `J${cur}`, border: true });
      cur += 2;

      this.setCell(ws, `A${cur}`, "Đại diện bên giao", { merge: `E${cur}`, bold: true, italic: true, center: true });
      this.setCell(ws, `F${cur}`, "Đại diện bên nhận", { merge: `J${cur}`, bold: true, italic: true, center: true });
      cur += 4;
      this.setCell(ws, `A${cur}`, cfg.UQ || "", { merge: `E${cur}`, bold: true, center: true });
      this.setCell(ws, `F${cur}`, cfg.NGUOI_NHAN || "", { merge: `J${cur}`, bold: true, center: true });
      return cur + 2;
    },

    /* ===== Section: BẢNG KÊ LÂM SẢN (BKLS) — 10 cột A-J ===== */
    buildSecBKLS(ws, p, cfg, startRow) {
      const r = startRow;
      const diaChiCR = [p.Thon, p.Xa, p.Huyen].filter(Boolean).join(", ");
      const diaDanhKT = [p.Xa, p.Huyen].filter(Boolean).join(", ");
      // Ngày BKLS lấy từ KH_KHAI_THAC.ngay_bkls (lưu vào NHAP_GO_TRON.Ngay_BKLS),
      // fallback Ngay_nhap nếu trống
      const dtBKLS = this.parseDateString(p.Ngay_BKLS) || (p.Ngay_nhap ? new Date(p.Ngay_nhap) : null);
      const ngayStr = dtBKLS
        ? `Ngày ${dtBKLS.getDate()} tháng ${dtBKLS.getMonth() + 1} năm ${dtBKLS.getFullYear()}`
        : "Ngày … tháng … năm …";
      const klStr = (p.Khoi_luong || 0).toFixed(2);

      // ---- Header 2 cột ----
      this.setCell(ws, `A${r}`, cfg.TEN_CTY,
        { merge: `D${r}`, bold: true, center: true, size: 12 });
      this.setCell(ws, `E${r}`, "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
        { merge: `J${r}`, bold: true, center: true, size: 11 });
      this.setCell(ws, `A${r + 1}`, "-------", { merge: `D${r + 1}`, center: true });
      this.setCell(ws, `E${r + 1}`, "Độc lập - Tự do - Hạnh phúc",
        { merge: `J${r + 1}`, bold: true, center: true });
      this.setCell(ws, `E${r + 2}`, "---------------", { merge: `J${r + 2}`, center: true });

      // ---- Số BKLS / Tờ số ----
      this.setCell(ws, `A${r + 4}`, `Số(1): ${p.So_BKLS || "___"}-BKLS`,
        { merge: `D${r + 4}` });
      this.setCell(ws, `E${r + 4}`, "Tờ số(2): 01      Tổng số tờ: 01",
        { merge: `J${r + 4}`, right: true });

      // ---- Title ----
      this.setCell(ws, `A${r + 6}`, "BẢNG KÊ LÂM SẢN",
        { merge: `J${r + 6}`, bold: true, center: true, size: 16 });
      ws.getRow(r + 6).height = 32;

      let cur = r + 8;

      // Helper: 1 dòng span A-J
      const line = (text, opts = {}) => {
        this.setCell(ws, `A${cur}`, text, { merge: `J${cur}`, wrap: true, ...opts });
        cur++;
      };

      // 1. Thông tin chủ lâm sản = Chủ rừng (người sở hữu gỗ tròn)
      line("1. Thông tin chủ lâm sản:", { bold: true });
      line(`- Tên chủ lâm sản(4): ${p.Chu_rung || ""}`);
      line(`- Số GCN/MSDN/GPTL/ĐKHĐ/CCCD/CMND/HC(5): ${p.cccd || ""}`);
      line(`- Địa chỉ(6): ${p.dia_chi_cccd || diaChiCR}`);
      line(`- Số điện thoại: ………………, Địa chỉ Email: …………………………`);
      line(`- Số chứng chỉ FM/COC: ${p.So_chung_chi || ""}`);
      cur++;

      // 2. Thông tin tổ chức, cá nhân mua/nhận = Xưởng xẻ (bên mua gỗ tròn)
      line("2. Thông tin tổ chức, cá nhân mua/nhận chuyển giao quyền sở hữu:", { bold: true });
      line(`- Tên tổ chức, cá nhân(4): ${cfg.TEN_CTY}`);
      line(`- Số GCN/MSDN/GPTL/ĐKHĐ/CCCD/CMND/HC(5): ${cfg.MA_SO_THUE}`);
      line(`- Địa chỉ(6): ${cfg.DIA_CHI_CTY}`);
      line(`- Số điện thoại: ${cfg.SDT_CTY}, Địa chỉ Email: ………………………`);
      line(`- Số chứng chỉ FM/COC: ${cfg.CHUNG_CHI_CTY}. Hiệu lực chứng chỉ: ${cfg.HIEU_LUC_CTY}.`);
      cur++;

      // 3. Thông tin về lâm sản
      line("3. Thông tin về lâm sản:", { bold: true });
      line(`- Tên loài: Gỗ tròn Keo tai tượng FSC 100% (Acacia Mangium)`);
      line("- Nhóm loài: Thông thường");
      line(`- Nguồn gốc(7): ${p.So_BKLS || ""}    Địa chỉ: ${diaChiCR}`);
      line("- Mã HS (áp dụng đối với lâm sản nhập khẩu, xuất khẩu): …………………");
      line("- Giá trị (nếu có): ……………………………………………………………");
      line(`- Khối lượng/trọng lượng: ${klStr} m³    Bằng chữ: ${this.volumeToWordsVN(p.Khoi_luong || 0)}.`);
      line("- Số lượng: …………………; đơn vị tính (lóng, khúc; thanh, tấm, hộp, viên, ...): ……………");
      line(`- Thông tin về lô khai thác(8):    KĐ: ${p.KD || "………"}    VĐ: ${p.VD || "………"}`);
      line(`- Thông tin khác có liên quan (nếu có): Địa danh khai thác: ${diaDanhKT}    Lô: ${p.Lo || ""}    Khoảnh: ${p.Khoang || ""}`);
      cur++;

      // 4. Thông tin chi tiết
      line("4. Thông tin chi tiết tại Bảng kê khai kèm theo:", { bold: true });
      line("(Áp dụng đối với gỗ nguyên liệu, sản phẩm gỗ: khai thác từ rừng tự nhiên trong nước, gỗ và sản phẩm gỗ nhập khẩu, gỗ và sản phẩm gỗ sau xử lý tịch thu)",
        { italic: true, size: 9 });
      ws.getRow(cur - 1).height = 28;
      cur++;

      // 5. Thông tin vận chuyển
      line("5. Thông tin vận chuyển (nếu có):", { bold: true });
      line(`Biển kiểm soát/số hiệu phương tiện: ${p.Xe || ""}`);
      line("- Thời gian vận chuyển: 01 ngày");
      line(`- Từ ngày: ${this.formatDate(p.Ngay_nhap)}    Đến ngày: ${this.formatDate(p.Ngay_nhap)}`);
      line(`- Vận chuyển từ: bãi 1 ${p.Chu_rung || ""}    đến: ${cfg.TEN_CTY}`);
      line(`Địa chỉ: ${diaChiCR}        ${cfg.DIA_CHI_CTY}`);
      cur++;

      // 6. Hồ sơ kèm theo
      line("6. Hồ sơ kèm theo (nếu có):", { bold: true });
      cur++;

      // Cam kết
      line("Chúng tôi/Tôi cam kết những nội dung kê khai trong bảng kê này là đúng sự thật và chịu trách nhiệm trước pháp luật về sự trung thực của thông tin đã kê khai.",
        { italic: true });
      ws.getRow(cur - 1).height = 32;

      // Date
      cur++;
      this.setCell(ws, `F${cur}`, ngayStr, { merge: `J${cur}`, italic: true, right: true });
      cur += 2;

      // Sign area
      this.setCell(ws, `A${cur}`, "XÁC NHẬN CỦA CƠ QUAN CÓ THẨM QUYỀN (9)",
        { merge: `E${cur}`, bold: true, center: true, size: 10, wrap: true });
      this.setCell(ws, `F${cur}`, "TỔ CHỨC/CÁ NHÂN LẬP BẢNG KÊ",
        { merge: `J${cur}`, bold: true, center: true, size: 10 });
      ws.getRow(cur).height = 28;
      cur++;
      this.setCell(ws, `A${cur}`, "Vào sổ số: …/…",
        { merge: `E${cur}`, italic: true, size: 9, center: true });
      this.setCell(ws, `F${cur}`, "(Ký, ghi rõ họ tên, đóng dấu đối với tổ chức)",
        { merge: `J${cur}`, italic: true, size: 9, center: true });
      cur++;
      this.setCell(ws, `A${cur}`, "(Người có thẩm quyền ký, ghi rõ họ tên, đóng dấu)",
        { merge: `E${cur}`, italic: true, size: 9, center: true });
      cur += 4;
      this.setCell(ws, `F${cur}`, cfg.UQ || "", { merge: `J${cur}`, bold: true, center: true });
      return cur + 2;
    },

    /* ===== Section: BẢNG KÊ THU MUA (Mẫu 02/TNDN), 10 cột A-J ===== */
    buildSecBKTM(ws, p, cfg, startRow) {
      const r = startRow;
      const diaChiCR = [p.Thon, p.Xa, p.Huyen].filter(Boolean).join(", ");
      const tongTien = p.Khoi_luong && p.Don_gia ? Math.round(p.Khoi_luong * p.Don_gia) : 0;
      const dt = p.Ngay_nhap ? new Date(p.Ngay_nhap) : null;

      // ---- Mẫu số box (góc trái trên, A-C) ----
      this.setCell(ws, `A${r}`, "Mẫu số: 02/TNDN",
        { merge: `C${r}`, center: true, bold: true, border: true, size: 10 });
      this.setCell(ws, `A${r + 1}`, "(Ban hành kèm theo Thông tư số 20/2026/TT-BTC\ncủa Bộ trưởng Bộ Tài chính)",
        { merge: `C${r + 1}`, italic: true, center: true, border: true, size: 9, wrap: true });
      ws.getRow(r + 1).height = 44;

      // ---- Title ----
      this.setCell(ws, `A${r + 3}`, "BẢNG KÊ THU MUA HÀNG HÓA, DỊCH VỤ",
        { merge: `J${r + 3}`, bold: true, center: true, size: 14 });
      this.setCell(ws, `A${r + 4}`, "KHÔNG CÓ HÓA ĐƠN",
        { merge: `J${r + 4}`, bold: true, center: true, size: 13 });
      const ngayParts = dt
        ? `(Ngày ${dt.getDate()} tháng ${dt.getMonth() + 1} năm ${dt.getFullYear()})`
        : "(Ngày ……. tháng ……. năm …………….)";
      this.setCell(ws, `A${r + 5}`, ngayParts,
        { merge: `J${r + 5}`, italic: true, center: true });

      // ---- Info section ----
      let cur = r + 7;
      const setInfoLine = (label, value) => {
        this.setCell(ws, `A${cur}`, label, { merge: `D${cur}`, bold: true });
        this.setCell(ws, `E${cur}`, value, { merge: `J${cur}` });
        cur++;
      };
      setInfoLine("- Tên doanh nghiệp:", cfg.TEN_CTY);
      setInfoLine("- Mã số thuế:", cfg.MA_SO_THUE);
      setInfoLine("- Địa chỉ:", cfg.DIA_CHI_CTY);
      setInfoLine("- Số điện thoại:", cfg.SDT_CTY);
      setInfoLine("- Địa chỉ nơi tổ chức thu mua:", diaChiCR);

      // Hàng đặc biệt: số phiếu BB + Lô gỗ tròn cùng dòng
      this.setCell(ws, `A${cur}`,
        "- Số phiếu của biên bản nghiệm thu gỗ keo tai tượng (Acacia Mangium) FSC100%:",
        { merge: `F${cur}`, bold: true, wrap: true });
      this.setCell(ws, `G${cur}`, p.So_phieu || "", { merge: `H${cur}`, center: true });
      this.setCell(ws, `I${cur}`, `Lô gỗ tròn: ${p.Lo_go_tron || ""}`, { merge: `J${cur}`, bold: true });
      ws.getRow(cur).height = 36;
      cur++;

      setInfoLine("- Số chứng chỉ FM/COC:", p.So_chung_chi || "");
      setInfoLine("- Nhóm Sp:", "W1.1");

      // "Theo HĐ số: ... ngày ..." — căn phải
      const hdText = `Theo HĐ số: ${p.So_hop_dong || ""}` +
        (p.Ngay_hop_dong ? ` ngày ${p.Ngay_hop_dong}` : "");
      this.setCell(ws, `F${cur}`, hdText,
        { merge: `J${cur}`, bold: true, border: true, center: true });
      cur += 2;

      // ---- Data table (10 cols A-J) ----
      // Header row 1: Ngày(rowspan) | Người bán(B-E) | Hàng hóa(F-I) | Ghi chú(rowspan)
      this.setCell(ws, `A${cur}`, "Ngày tháng năm\nmua hàng",
        { merge: `A${cur + 1}`, center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      this.setCell(ws, `B${cur}`, "Người bán",
        { merge: `E${cur}`, center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `F${cur}`, "Hàng hóa, dịch vụ mua vào",
        { merge: `I${cur}`, center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `J${cur}`, "Ghi chú",
        { merge: `J${cur + 1}`, center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      ws.getRow(cur).height = 26;
      cur++;
      // Header row 2: sub-headers
      this.setCell(ws, `B${cur}`, "Tên người bán", { center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      this.setCell(ws, `C${cur}`, "Địa chỉ", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `D${cur}`, "Số căn cước", { center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      this.setCell(ws, `E${cur}`, "Số điện thoại\n(nếu có)", { center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      this.setCell(ws, `F${cur}`, "Tên hàng hóa, dịch vụ", { center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      this.setCell(ws, `G${cur}`, "Số lượng,\ntrọng lượng", { center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      this.setCell(ws, `H${cur}`, "Đơn giá", { center: true, bold: true, fill: "FFF0F0F0", border: true });
      this.setCell(ws, `I${cur}`, "Tổng giá\nthanh toán", { center: true, bold: true, fill: "FFF0F0F0", border: true, wrap: true });
      ws.getRow(cur).height = 50;
      cur++;
      // Số thứ tự cột (1-10)
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((n, i) => {
        const col = String.fromCharCode(65 + i);
        this.setCell(ws, `${col}${cur}`, n, { center: true, italic: true, border: true, size: 9 });
      });
      cur++;
      // Data row — height generous để chứa 3 dòng wrap (tên, địa chỉ, tên hàng hóa)
      this.setCell(ws, `A${cur}`, this.formatDate(p.Ngay_nhap), { center: true, border: true });
      this.setCell(ws, `B${cur}`, p.Chu_rung || "", { center: true, border: true, wrap: true });
      this.setCell(ws, `C${cur}`, diaChiCR, { center: true, border: true, wrap: true });
      this.setCell(ws, `D${cur}`, p.cccd || "", { center: true, border: true, wrap: true });
      this.setCell(ws, `E${cur}`, "", { center: true, border: true });
      this.setCell(ws, `F${cur}`, "Gỗ tròn keo tai tượng (Acacia Mangium) FSC 100%",
        { center: true, border: true, wrap: true });
      this.setCell(ws, `G${cur}`, p.Khoi_luong || 0, { center: true, border: true, numFmt: "#,##0.00" });
      this.setCell(ws, `H${cur}`, p.Don_gia || 0, { center: true, border: true, numFmt: "#,##0" });
      this.setCell(ws, `I${cur}`, tongTien, { center: true, border: true, numFmt: "#,##0" });
      this.setCell(ws, `J${cur}`, "", { border: true });
      ws.getRow(cur).height = 60;
      cur++;
      // 2 hàng trống cho viết tay (có border)
      for (let k = 0; k < 2; k++) {
        for (let c = 1; c <= 10; c++) ws.getCell(cur, c).border = this.bThin();
        ws.getRow(cur).height = 28;
        cur++;
      }
      // Tổng
      this.setCell(ws, `A${cur}`, "Tổng", { merge: `F${cur}`, center: true, bold: true, border: true });
      this.setCell(ws, `G${cur}`, p.Khoi_luong || 0, { center: true, bold: true, border: true, numFmt: "#,##0.00" });
      this.setCell(ws, `H${cur}`, "", { border: true });
      this.setCell(ws, `I${cur}`, tongTien, { center: true, bold: true, border: true, numFmt: "#,##0" });
      this.setCell(ws, `J${cur}`, "", { border: true });
      cur += 2;

      // Tổng giá trị + (Số tiền bằng chữ)
      this.setCell(ws, `A${cur}`, "- Tổng giá trị hàng hóa, dịch vụ mua vào:",
        { merge: `D${cur}`, bold: true });
      this.setCell(ws, `E${cur}`, tongTien ? tongTien.toLocaleString("vi-VN") + " VNĐ" : "",
        { merge: `G${cur}`, bold: true });
      this.setCell(ws, `H${cur}`,
        tongTien ? `(Số tiền bằng chữ: ${this.numberToWordsVN(tongTien)})` : "(Số tiền bằng chữ: …)",
        { merge: `J${cur}`, italic: true });
      cur += 2;

      // Date line
      const ngayStr = dt
        ? `Ngày ${dt.getDate()} tháng ${dt.getMonth() + 1} năm ${dt.getFullYear()}`
        : "Ngày .... tháng .... năm 20...";
      this.setCell(ws, `F${cur}`, ngayStr, { merge: `J${cur}`, italic: true, center: true });
      cur += 2;

      // Sign area
      this.setCell(ws, `A${cur}`, "Người lập bảng kê",
        { merge: `E${cur}`, bold: true, italic: true, center: true });
      this.setCell(ws, `F${cur}`, "Người đại diện hoặc người được\nủy quyền của doanh nghiệp",
        { merge: `J${cur}`, bold: true, italic: true, center: true, wrap: true });
      ws.getRow(cur).height = 38;
      cur++;
      this.setCell(ws, `A${cur}`, "(Ký, ghi rõ họ tên)",
        { merge: `E${cur}`, italic: true, size: 9, center: true });
      this.setCell(ws, `F${cur}`, "(Ký tên, đóng dấu)",
        { merge: `J${cur}`, italic: true, size: 9, center: true });
      cur += 4;
      // Người lập bảng kê: để trống cho người dùng ký tay
      this.setCell(ws, `A${cur}`, "", { merge: `E${cur}` });
      // Người đại diện doanh nghiệp: lấy người đại diện xưởng xẻ (cfg.UQ)
      this.setCell(ws, `F${cur}`, cfg.UQ || "", { merge: `J${cur}`, bold: true, center: true });
      return cur + 2;
    },

    /* ===================== XUẤT WORD (.doc) — 1 file tất cả phiếu, 4 mẫu × 1 trang ===================== */

    wordEsc(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },

    wordCss() {
      return `<style>
        @page Section1 { size: 21cm 29.7cm; margin: 1cm 1.2cm 1cm 1.2cm; mso-page-orientation: portrait; }
        div.Section1 { page: Section1; }
        body { font-family: "Times New Roman", serif; font-size: 13pt; line-height: 1.3; }
        p { margin: 0 0 3pt 0; }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .small { font-size: 10pt; }
        .title { font-size: 15pt; font-weight: bold; text-align: center; margin: 4pt 0; }
        .subtitle { font-size: 13pt; font-style: italic; text-align: center; margin-bottom: 4pt; }
        .form-code { font-weight: bold; }
        table.info { width: 100%; border-collapse: collapse; margin: 4pt 0; }
        table.info td { padding: 2pt 4pt; vertical-align: top; font-size: 12pt; }
        table.info td.lbl { font-weight: bold; width: 22%; }
        table.info td.val { width: 28%; }
        table.tbl { border-collapse: collapse; width: 100%; margin: 4pt 0; }
        table.tbl th, table.tbl td { border: 1px solid #333; padding: 3pt 5pt; vertical-align: middle; font-size: 11pt; }
        table.tbl th { background: #F0F0F0; font-weight: bold; text-align: center; }
        table.tbl td.num { text-align: right; }
        table.tbl td.center { text-align: center; }
        .sign-2col { width: 100%; margin-top: 8pt; }
        .sign-2col td { vertical-align: top; width: 50%; text-align: center; padding: 0 4pt; }
        .sign-name { font-weight: bold; margin-top: 42pt; }
        .pgbreak { page-break-before: always; }
        .header-bar { display: table; width: 100%; }
        .header-bar > div { display: table-cell; }
        .mau-so-box { display: inline-block; border: 1px solid #333; padding: 4pt 8pt; font-size: 10pt; }
        .hd-hi { font-weight: bold; }
        /* BKLS riêng: cỡ chữ 12pt để vừa 1 trang A4 */
        .bkls { font-size: 12pt; line-height: 1.25; }
        .bkls p { font-size: 12pt; margin: 0 0 2pt 0; }
        .bkls .title { font-size: 14pt; }
        .bkls .small { font-size: 9pt; }
        .bkls table.info td { font-size: 11pt; padding: 1pt 4pt; }
        .bkls .sign-name { margin-top: 36pt; }
      </style>`;
    },

    /** Section 1: BM.COC.01-a Biên bản nghiệm thu */
    wordSec01a(p, cfg) {
      const e = this.wordEsc.bind(this);
      const diaChiCR = [p.Thon, p.Xa, p.Huyen].filter(Boolean).join(", ");
      const f = v => (v == null || v === "") ? "" : Number(v).toFixed(2);
      return `
        <table class="info"><tr>
          <td class="bold">${e(cfg.TEN_CTY || "")}</td>
          <td class="right small italic">${e(cfg.BM_NGHIEM_THU || "BM.COC.01-a")}<br/>Ngày ban hành: ${e(cfg.NGAY_BAN_HANH || "10.2.2022")}</td>
        </tr></table>
        <p class="bold">SỔ TAY COC</p>
        <p class="title">BIÊN BẢN NGHIỆM THU VÀ GIAO NHẬN<br/>GỖ KEO TRÒN FSC 100%</p>
        <p class="right small italic">Lần ban hành: ${e(cfg.LAN_BAN_HANH || "02")}</p>
        <table class="info">
          <tr><td class="lbl">Đơn vị giao hàng:</td><td class="val">${e(p.Chu_rung)}</td><td class="lbl">Số phiếu:</td><td class="val bold">${e(p.So_phieu)}</td></tr>
          <tr><td class="lbl">Địa chỉ:</td><td class="val">${e(diaChiCR)}</td><td class="lbl">Biển số xe:</td><td class="val">${e(p.Xe)}</td></tr>
          <tr><td class="lbl">Số chứng chỉ FM/COC:</td><td class="val">${e(p.So_chung_chi)}</td><td class="lbl">Nơi giao nhận:</td><td class="val">tại bãi 1: ${e(p.Chu_rung)}</td></tr>
          <tr><td class="lbl">Đơn vị nhận hàng:</td><td class="val">${e(cfg.UQ)} (${e(cfg.TEN_CTY)})</td><td class="lbl">Ngày nghiệm thu:</td><td class="val">${e(this.formatDate(p.Ngay_nhap))}</td></tr>
          <tr><td class="lbl">Địa chỉ:</td><td class="val">${e(cfg.DIA_CHI_CTY)}</td><td class="lbl">Trạng thái MT:</td><td class="val">FSC 100%</td></tr>
          <tr><td class="lbl">Số chứng chỉ FM/COC:</td><td class="val">${e(cfg.CHUNG_CHI_CTY)}</td><td class="lbl">Nhóm SP:</td><td class="val">W1.1</td></tr>
          <tr><td></td><td></td><td class="lbl">Hiệu lực đến:</td><td class="val">${e(cfg.HIEU_LUC_CTY)}</td></tr>
          <tr><td></td><td></td><td class="lbl">Mã lô gỗ nhập:</td><td class="val">${e(p.Lo_go_tron || "")}</td></tr>
        </table>
        <table class="tbl">
          <tr>
            <th rowspan="2">STT</th>
            <th colspan="2">Quy cách</th>
            <th rowspan="2">KL thực nhập (m³)</th>
            <th rowspan="2">Loài gỗ</th>
            <th rowspan="2">Khoảnh</th>
            <th rowspan="2">Lô</th>
            <th rowspan="2">Diện tích (Ha)</th>
          </tr>
          <tr><th>Dài (m)</th><th>Đường kính (cm)</th></tr>
          <tr>
            <td class="center">1</td><td class="center">2</td><td class="center">Từ 13cm trở lên</td>
            <td class="num">${f(p.Khoi_luong)}</td>
            <td>Gỗ keo tròn FSC 100% (Acacia Mangium)</td>
            <td class="center">${e(p.Khoang)}</td>
            <td class="center">${e(p.Lo)}</td>
            <td class="num">${f(p.Dien_tich)}</td>
          </tr>
          <tr><td colspan="3" class="center bold">TỔNG</td><td class="num bold">${f(p.Khoi_luong)}</td><td colspan="4"></td></tr>
        </table>
        <table class="sign-2col"><tr>
          <td><p class="bold italic">Đại diện giao hàng</p><p class="sign-name">${e(p.Chu_rung)}</p></td>
          <td><p class="bold italic">Đại diện nhận hàng</p><p class="sign-name">${e(cfg.UQ)}</p></td>
        </tr></table>`;
    },

    /** Section 2: BM.COC.01-b Phiếu nhập kho */
    wordSec01b(p, cfg) {
      const e = this.wordEsc.bind(this);
      const f = v => (v == null || v === "") ? "" : Number(v).toFixed(2);
      return `
        <table class="info"><tr>
          <td class="bold">${e(cfg.TEN_CTY || "")}</td>
          <td class="right small italic">${e(cfg.BM_NHAP_KHO || "BM.COC.01-b")}<br/>Ngày ban hành: ${e(cfg.NGAY_BAN_HANH || "10.2.2022")}</td>
        </tr></table>
        <p class="bold">SỔ TAY COC</p>
        <p class="title">PHIẾU NHẬP KHO GỖ KEO TRÒN FSC 100%</p>
        <p class="right small italic">Lần ban hành: ${e(cfg.LAN_BAN_HANH || "02")}</p>
        <table class="info">
          <tr><td class="lbl">Người giao hàng:</td><td class="val">${e(cfg.UQ)}</td><td class="lbl">Số phiếu:</td><td class="val bold">${e(p.So_phieu)}</td></tr>
          <tr><td class="lbl">Kho nhập:</td><td class="val">${e(cfg.TEN_CTY)}</td><td class="lbl">Biển số xe:</td><td class="val">${e(p.Xe)}</td></tr>
          <tr><td class="lbl">Địa chỉ:</td><td class="val">${e(cfg.DIA_CHI_CTY)}</td><td class="lbl">Ngày nhập:</td><td class="val">${e(this.formatDate(p.Ngay_nhap))}</td></tr>
          <tr><td class="lbl">Trạng thái MT:</td><td class="val">FSC 100%</td><td class="lbl">Nhóm SP:</td><td class="val">W1.1</td></tr>
          <tr><td class="lbl">Mã lô gỗ nhập:</td><td class="val">${e(p.Lo_go_tron || "")}</td><td></td><td></td></tr>
          <tr><td class="lbl">Số chứng chỉ FM/COC:</td><td class="val">${e(cfg.CHUNG_CHI_CTY)}</td><td class="lbl">Hiệu lực đến:</td><td class="val">${e(cfg.HIEU_LUC_CTY)}</td></tr>
        </table>
        <table class="tbl">
          <tr>
            <th rowspan="2">STT</th>
            <th colspan="2">Quy cách</th>
            <th rowspan="2">KL thực nhập (m³)</th>
            <th rowspan="2">Loài gỗ</th>
            <th rowspan="2">Khoảnh</th>
            <th rowspan="2">Lô</th>
            <th rowspan="2">Diện tích (Ha)</th>
          </tr>
          <tr><th>Dài (m)</th><th>Đường kính (cm)</th></tr>
          <tr>
            <td class="center">1</td><td class="center">2</td><td class="center">Từ 13cm trở lên</td>
            <td class="num">${f(p.Khoi_luong)}</td>
            <td>Gỗ keo tròn FSC 100% (Acacia Mangium)</td>
            <td class="center">${e(p.Khoang)}</td>
            <td class="center">${e(p.Lo)}</td>
            <td class="num">${f(p.Dien_tich)}</td>
          </tr>
          <tr><td colspan="3" class="center bold">TỔNG</td><td class="num bold">${f(p.Khoi_luong)}</td><td colspan="4"></td></tr>
        </table>
        <table class="sign-2col"><tr>
          <td><p class="bold italic">Đại diện bên giao</p><p class="sign-name">${e(cfg.UQ)}</p></td>
          <td><p class="bold italic">Đại diện bên nhận</p><p class="sign-name">${e(cfg.NGUOI_NHAN)}</p></td>
        </tr></table>`;
    },

    /** Section 3: BKLS Bảng kê lâm sản */
    wordSecBKLS(p, cfg) {
      const e = this.wordEsc.bind(this);
      const diaChiCR = [p.Thon, p.Xa, p.Huyen].filter(Boolean).join(", ");
      const diaDanhKT = [p.Xa, p.Huyen].filter(Boolean).join(", ");
      const dtBKLS = this.parseDateString(p.Ngay_BKLS) || (p.Ngay_nhap ? new Date(p.Ngay_nhap) : null);
      const ngayStr = dtBKLS
        ? `Ngày ${dtBKLS.getDate()} tháng ${dtBKLS.getMonth() + 1} năm ${dtBKLS.getFullYear()}`
        : "Ngày ... tháng ... năm ...";
      const klStr = (p.Khoi_luong || 0).toFixed(2);
      const dtStr = (p.Dien_tich || 0).toFixed(2);
      return `<div class="bkls">
        <table class="info"><tr>
          <td class="bold center">${e(cfg.TEN_CTY || "")}<br/>-------</td>
          <td class="bold center">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br/><span class="italic">Độc lập - Tự do - Hạnh phúc</span><br/>---------------</td>
        </tr></table>
        <table class="info"><tr>
          <td>Số(1): ${e(p.So_BKLS || "___")}-BKLS</td>
          <td class="right">Tờ số(2): 01    Tổng số tờ: 01</td>
        </tr></table>
        <p class="title">BẢNG KÊ LÂM SẢN</p>
        <p class="bold">1. Thông tin chủ lâm sản:</p>
        <p>- Tên chủ lâm sản(4): <b>${e(p.Chu_rung || "")}</b></p>
        <p>- Số GCN/MSDN/GPTL/ĐKHĐ/CCCD/CMND/HC(5): <b>${e(p.cccd || "")}</b></p>
        <p>- Địa chỉ(6): <b>${e(p.dia_chi_cccd || diaChiCR)}</b></p>
        <p>- Số điện thoại: ………………, Địa chỉ Email: …………………………</p>
        <p>- Số chứng chỉ FM/COC: <b>${e(p.So_chung_chi || "")}</b></p>
        <p class="bold">2. Thông tin tổ chức, cá nhân mua/nhận chuyển giao quyền sở hữu:</p>
        <p>- Tên tổ chức, cá nhân(4): <b>${e(cfg.TEN_CTY)}</b></p>
        <p>- Số GCN/MSDN/GPTL/ĐKHĐ/CCCD/CMND/HC(5): <b>${e(cfg.MA_SO_THUE)}</b></p>
        <p>- Địa chỉ(6): <b>${e(cfg.DIA_CHI_CTY)}</b></p>
        <p>- Số điện thoại: ${e(cfg.SDT_CTY)}, Địa chỉ Email: ………………………</p>
        <p>- Số chứng chỉ FM/COC: <b>${e(cfg.CHUNG_CHI_CTY)}</b>. Hiệu lực chứng chỉ: <b>${e(cfg.HIEU_LUC_CTY)}</b>.</p>
        <p class="bold">3. Thông tin về lâm sản:</p>
        <p>- Tên loài: Gỗ tròn Keo tai tượng FSC 100% (Acacia Mangium)</p>
        <p>- Nhóm loài: Thông thường</p>
        <p>- Nguồn gốc(7): ${e(p.So_BKLS)}    Địa chỉ: ${e(diaChiCR)}</p>
        <p>- Mã HS (áp dụng đối với lâm sản nhập khẩu, xuất khẩu): …………………</p>
        <p>- Giá trị (nếu có): ……………………………………………………………</p>
        <p>- Khối lượng/trọng lượng: <b>${klStr}</b> m³    Bằng chữ: <b>${e(this.volumeToWordsVN(p.Khoi_luong || 0))}</b>.</p>
        <p>- Số lượng: …………………; đơn vị tính (lóng, khúc; thanh, tấm, hộp, viên, ...): ……………</p>
        <p>- Thông tin về lô khai thác(8):    KĐ: <b>${e(p.KD || "………")}</b>    VĐ: <b>${e(p.VD || "………")}</b></p>
        <p>- Thông tin khác có liên quan (nếu có): Địa danh khai thác: <b>${e(diaDanhKT)}</b>    Lô: <b>${e(p.Lo)}</b>    Khoảnh: <b>${e(p.Khoang)}</b></p>
        <p class="bold">4. Thông tin chi tiết tại Bảng kê khai kèm theo:</p>
        <p class="small italic">(Áp dụng đối với gỗ nguyên liệu, sản phẩm gỗ: khai thác từ rừng tự nhiên trong nước, gỗ và sản phẩm gỗ nhập khẩu, gỗ và sản phẩm gỗ sau xử lý tịch thu)</p>
        <p class="bold">5. Thông tin vận chuyển (nếu có):</p>
        <p>Biển kiểm soát/số hiệu phương tiện: <b>${e(p.Xe)}</b></p>
        <p>- Thời gian vận chuyển: 01 ngày</p>
        <p>- Từ ngày: ${e(this.formatDate(p.Ngay_nhap))}    Đến ngày: ${e(this.formatDate(p.Ngay_nhap))}</p>
        <p>- Vận chuyển từ: bãi 1 ${e(p.Chu_rung)}    đến: ${e(cfg.TEN_CTY)}</p>
        <p>Địa chỉ: ${e(diaChiCR)}        ${e(cfg.DIA_CHI_CTY)}</p>
        <p class="bold">6. Hồ sơ kèm theo (nếu có):</p>
        <p class="italic">Chúng tôi/Tôi cam kết những nội dung kê khai trong bảng kê này là đúng sự thật và chịu trách nhiệm trước pháp luật về sự trung thực của thông tin đã kê khai.</p>
        <p class="right italic">${e(ngayStr)}</p>
        <table class="sign-2col"><tr>
          <td>
            <p class="bold">XÁC NHẬN CỦA CƠ QUAN CÓ THẨM QUYỀN (9)</p>
            <p class="small italic">Vào sổ số: …/…</p>
            <p class="small italic">(Người có thẩm quyền ký, ghi rõ họ tên, đóng dấu)</p>
          </td>
          <td>
            <p class="bold">TỔ CHỨC/CÁ NHÂN LẬP BẢNG KÊ</p>
            <p class="small italic">(Ký, ghi rõ họ tên, đóng dấu đối với tổ chức)</p>
            <p class="sign-name">${e(cfg.UQ)}</p>
          </td>
        </tr></table></div>`;
    },

    /** Section 4: BKTM Bảng kê thu mua (Mẫu 02/TNDN) */
    wordSecBKTM(p, cfg) {
      const e = this.wordEsc.bind(this);
      const diaChiCR = [p.Thon, p.Xa, p.Huyen].filter(Boolean).join(", ");
      const tongTien = p.Khoi_luong && p.Don_gia ? Math.round(p.Khoi_luong * p.Don_gia) : 0;
      const dt = p.Ngay_nhap ? new Date(p.Ngay_nhap) : null;
      const dateLine = dt
        ? `(Ngày ${dt.getDate()} tháng ${dt.getMonth() + 1} năm ${dt.getFullYear()})`
        : "(Ngày ……. tháng ……. năm …………….)";
      const dateBottom = dt
        ? `Ngày ${dt.getDate()} tháng ${dt.getMonth() + 1} năm ${dt.getFullYear()}`
        : "Ngày .... tháng .... năm 20...";
      const f = v => (v == null || v === "") ? "" : Number(v).toFixed(2);
      const m = v => (v == null || v === "") ? "" : Math.round(Number(v)).toLocaleString("vi-VN");
      return `
        <p class="right"><span class="mau-so-box">Mẫu số: <b>02/TNDN</b><br/><span class="italic small">(Ban hành kèm theo Thông tư số 20/2026/TT-BTC của Bộ trưởng Bộ Tài chính)</span></span></p>
        <p class="title">BẢNG KÊ THU MUA HÀNG HÓA, DỊCH VỤ</p>
        <p class="title">KHÔNG CÓ HÓA ĐƠN</p>
        <p class="subtitle">${e(dateLine)}</p>
        <p>- Tên doanh nghiệp: <b>${e(cfg.TEN_CTY)}</b></p>
        <p>- Mã số thuế: <b>${e(cfg.MA_SO_THUE)}</b></p>
        <p>- Địa chỉ: <b>${e(cfg.DIA_CHI_CTY)}</b></p>
        <p>- Số điện thoại: ${e(cfg.SDT_CTY)}</p>
        <p>- Địa chỉ nơi tổ chức thu mua: ${e(diaChiCR)}</p>
        <p>- Số phiếu của biên bản nghiệm thu gỗ keo tai tượng (Acacia Mangium) FSC100%: <b>${e(p.So_phieu)}</b>    Lô gỗ tròn: <b>${e(p.Lo_go_tron || "")}</b></p>
        <p>- Số chứng chỉ FM/COC: <b>${e(p.So_chung_chi)}</b></p>
        <p>- Nhóm Sp: W1.1</p>
        <p class="right"><span class="hd-hi">Theo HĐ số: ${e(p.So_hop_dong || "")}${p.Ngay_hop_dong ? " ngày " + e(p.Ngay_hop_dong) : ""}</span></p>
        <table class="tbl">
          <tr>
            <th rowspan="2">Ngày tháng năm mua hàng</th>
            <th colspan="4">Người bán</th>
            <th colspan="4">Hàng hóa, dịch vụ mua vào</th>
            <th rowspan="2">Ghi chú</th>
          </tr>
          <tr>
            <th>Tên người bán</th><th>Địa chỉ</th><th>Số căn cước</th><th>Số điện thoại (nếu có)</th>
            <th>Tên hàng hóa, dịch vụ</th><th>Số lượng, trọng lượng</th><th>Đơn giá</th><th>Tổng giá thanh toán</th>
          </tr>
          <tr>
            <td class="center">${e(this.formatDate(p.Ngay_nhap))}</td>
            <td>${e(p.Chu_rung)}</td>
            <td>${e(diaChiCR)}</td>
            <td class="center">${e(p.cccd)}</td>
            <td></td>
            <td>Gỗ tròn keo tai tượng (Acacia Mangium) FSC 100%</td>
            <td class="num">${f(p.Khoi_luong)}</td>
            <td class="num">${m(p.Don_gia)}</td>
            <td class="num">${m(tongTien)}</td>
            <td></td>
          </tr>
          <tr><td colspan="6" class="center bold">Tổng</td><td class="num bold">${f(p.Khoi_luong)}</td><td></td><td class="num bold">${m(tongTien)}</td><td></td></tr>
        </table>
        <p class="bold">- Tổng giá trị hàng hóa, dịch vụ mua vào: ${m(tongTien)} VNĐ <span class="italic">(Số tiền bằng chữ: <b>${e(this.numberToWordsVN(tongTien))}</b>)</span></p>
        <p class="right italic">${e(dateBottom)}</p>
        <table class="sign-2col"><tr>
          <td>
            <p class="bold italic">Người lập bảng kê</p>
            <p class="small italic">(Ký, ghi rõ họ tên)</p>
            <p class="sign-name"></p>
          </td>
          <td>
            <p class="bold italic">Người đại diện hoặc người được<br/>ủy quyền của doanh nghiệp</p>
            <p class="small italic">(Ký tên, đóng dấu)</p>
            <p class="sign-name">${e(cfg.UQ)}</p>
          </td>
        </tr></table>`;
    },

    /** Build HTML cho 1 phiếu — 4 mẫu × 1 trang, có page-break giữa các mẫu. */
    wordOnePhieu(p, idx) {
      const cfg = this.cfgForPhieu(p);
      const firstBreak = idx === 0 ? "" : '<br clear="all" class="pgbreak"/>';
      return `${firstBreak}${this.wordSec01a(p, cfg)}
        <br clear="all" class="pgbreak"/>
        ${this.wordSec01b(p, cfg)}
        <br clear="all" class="pgbreak"/>
        ${this.wordSecBKLS(p, cfg)}
        <br clear="all" class="pgbreak"/>
        ${this.wordSecBKTM(p, cfg)}`;
    },

    /** Xuất 1 file Word chứa tất cả phiếu × 4 mẫu, mỗi mẫu 1 trang A4 portrait. */
    async exportAllWord() {
      this.exporting = true;
      try {
        const res = await this.getAllPhieuGoTron();
        const allPhieu = (res && res.data) || [];
        if (!allPhieu.length) {
          this.$q.notify({ type: "warning", message: "Không có phiếu nào có khối lượng > 0" });
          return;
        }

        const body = allPhieu.map((p, i) => this.wordOnePhieu(p, i)).join("");
        const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/>${this.wordCss()}</head><body><div class="Section1">${body}</div></body></html>`;

        const blob = new Blob(["﻿" + html], { type: "application/msword;charset=utf-8" });
        const tenFile = (this.TEN_CTY || "PhieuNK").replace(/[^\p{L}\p{N}]+/gu, "_");
        saveAs(blob, "Phieu_NK_Go_Tron_" + tenFile + ".doc");

        this.$q.notify({
          type: "positive",
          message: `Đã xuất ${allPhieu.length} phiếu × 4 mẫu = ${allPhieu.length * 4} trang vào 1 file Word`,
          timeout: 4000,
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Lỗi xuất Word: " + (err.message || err), timeout: 6000 });
      } finally {
        this.exporting = false;
      }
    },
  },
};
</script>

<style scoped>
/* ===== Layout 2 biểu mẫu song song ===== */
.bieu-mau-container {
  display: flex;
  gap: 16px;
}
.bieu-mau {
  flex: 1;
  border: 1px solid #333;
  padding: 12px 16px;
  font-size: 11px;
  font-family: "Times New Roman", serif;
  line-height: 1.5;
  min-width: 0;
}

/* Header */
.header-row {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
.header-row .company { font-size: 12px; }
.header-row.small { font-size: 10px; font-weight: normal; font-style: italic; }
.header-row .right { text-align: right; }
.title {
  text-align: center;
  font-weight: bold;
  font-size: 13px;
  margin: 8px 0 4px;
  text-transform: uppercase;
}

/* Info table */
.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
}
.info-table td { padding: 2px 4px; vertical-align: top; }
.info-table .lbl { font-weight: bold; white-space: nowrap; width: 25%; }
.info-table .val { }

/* Data table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
}
.data-table th, .data-table td {
  border: 1px solid #333;
  padding: 3px 5px;
  text-align: center;
  font-size: 10px;
}
.data-table th { background: #f0f0f0; font-weight: bold; }
.data-table .num { text-align: right; }
.data-table .total-row td { font-weight: bold; }

/* Ký tên */
.sign-area {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.sign-col { text-align: center; width: 45%; }
.sign-title { font-weight: bold; font-style: italic; }
.sign-space { height: 60px; }
.sign-name { font-weight: bold; }

/* ===== BKTM ===== */
.bktm-page {
  margin-top: 24px;
}
.bktm {
  border: 1px solid #333;
  padding: 16px 24px;
  font-size: 12px;
  font-family: "Times New Roman", serif;
  line-height: 1.6;
  max-width: 900px;
}
.bktm-header-small { font-size: 10px; font-style: italic; }
.bktm-header-box {
  border: 1px solid #333;
  padding: 4px 10px;
  display: inline-block;
  font-size: 10px;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 8px;
}
.bktm-header-box .italic { font-style: italic; }
.bktm-date-line {
  text-align: center;
  font-style: italic;
  margin: 4px 0 12px;
  font-size: 11px;
}
.hd-highlight {
  font-weight: bold;
}
.bktm-title { text-align: center; font-weight: bold; font-size: 14px; text-transform: uppercase; }
.bktm-title.sub { font-size: 13px; margin-bottom: 4px; }
.bktm-data th, .bktm-data td { font-size: 10px; }
.bktm-data .col-num th { font-weight: normal; font-style: italic; font-size: 9px; }
.bktm-data .small-text { font-size: 9px; }
.bktm-total-text { margin-top: 8px; font-size: 12px; }
.bktm-date { text-align: right; font-style: italic; font-size: 12px; }
.sign-sub { font-style: italic; font-size: 10px; }

/* ===== Print style — bỏ khung border ngoài, chỉ giữ nội dung ===== */
@media print {
  .no-print { display: none !important; }
  .print-area { margin: 0; }

  /* Trang 1: BM 01-a (portrait A4) */
  .bieu-mau-container {
    display: block;
  }
  .bieu-mau {
    border: none;
    padding: 0;
    page-break-after: always;
    page-break-inside: avoid;
    margin-bottom: 0;
  }
  .bieu-mau:last-child {
    page-break-after: auto;
  }

  /* Trang 3: BKTM */
  .bktm-page {
    page-break-before: always;
    margin-top: 0;
  }
  .bktm {
    border: none;
    padding: 0;
    max-width: 100%;
  }

  @page { size: portrait A4; margin: 15mm; }
}
</style>
