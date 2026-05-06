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
        <q-btn icon="print" label="In phiếu" color="primary" @click="printPage" :disable="!phieu" />
      </div>
      <div class="col-auto">
        <q-btn icon="file_download" label="Xuất Excel tất cả" color="secondary" @click="exportAllExcel" :loading="exporting" />
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
            <span class="right">BM.COC.01-a</span>
          </div>
          <div class="header-row small">
            <span></span>
            <span class="right">Ngày ban hành: 10.2.2022</span>
          </div>
          <div class="title">BIÊN BẢN NGHIỆM THU VÀ GIAO NHẬN<br/>GỖ KEO TRÒN FSC100%</div>
          <div class="header-row small right">Lần ban hành: 02</div>

          <table class="info-table">
            <tr><td class="lbl">Đơn vị giao hàng:</td><td class="val">{{ phieu.Chu_rung }}</td><td class="lbl">Số phiếu:</td><td class="val">{{ phieu.So_phieu }}</td></tr>
            <tr><td class="lbl">Địa chỉ:</td><td class="val" colspan="1">{{ phieu.Thon || '' }} {{ phieu.Xa || '' }} {{ phieu.Huyen || '' }}</td><td class="lbl">Biển số xe:</td><td class="val">{{ phieu.Xe }}</td></tr>
            <tr><td class="lbl">Số chứng chỉ FM/COC:</td><td class="val">{{ phieu.So_chung_chi }}</td><td class="lbl">Nơi giao nhận</td><td class="val">tại bãi 1: {{ phieu.Chu_rung }}</td></tr>
            <tr><td class="lbl">Đơn vị nhận hàng:</td><td class="val">{{ UQ }} ({{ TEN_CTY }})</td><td class="lbl">Ngày nghiệm thu:</td><td class="val">{{ formatDate(phieu.Ngay_nhap) }}</td></tr>
            <tr><td class="lbl">Địa chỉ:</td><td class="val">{{ DIA_CHI_CTY }}</td><td class="lbl">Trạng thái MT:</td><td class="val">FSC 100%</td></tr>
            <tr><td class="lbl">Số chứng chỉ FM/COC:</td><td class="val">{{ CHUNG_CHI_CTY }}</td><td class="lbl">Nhóm SP:</td><td class="val">W1.1</td></tr>
            <tr><td></td><td></td><td class="lbl">Hiệu lực đến:</td><td class="val">{{ HIEU_LUC_CTY }}</td></tr>
            <tr><td></td><td></td><td class="lbl">Mã lô gỗ nhập:</td><td class="val">{{ phieu.Lo_go }}</td></tr>
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
            <span class="right">BM.COC.01-b</span>
          </div>
          <div class="header-row small">
            <span></span>
            <span class="right">Ngày ban hành: 10.2.2022</span>
          </div>
          <div class="title">PHIẾU NHẬP KHO GỖ KEO TRÒN FSC100%</div>
          <div class="header-row small right">Lần ban hành: 02</div>

          <table class="info-table">
            <tr><td class="lbl">Người giao hàng:</td><td class="val">{{ UQ }}</td><td class="lbl">Số phiếu:</td><td class="val">{{ phieu.So_phieu }}</td></tr>
            <tr><td class="lbl">Kho nhập:</td><td class="val">{{ TEN_CTY }}</td><td class="lbl">Biển số xe:</td><td class="val">{{ phieu.Xe }}</td></tr>
            <tr><td class="lbl">Địa chỉ:</td><td class="val">{{ DIA_CHI_CTY }}</td><td class="lbl">Ngày nhập:</td><td class="val">{{ formatDate(phieu.Ngay_nhap) }}</td></tr>
            <tr><td class="lbl">Trạng thái MT:</td><td class="val">FSC 100%</td><td class="lbl">Nhóm SP:</td><td class="val">W1.1</td></tr>
            <tr><td class="lbl">Mã lô gỗ nhập:</td><td class="val">{{ phieu.Lo_go }}</td><td></td><td></td></tr>
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
              <td class="val">{{ phieu.So_phieu }} &nbsp;&nbsp;&nbsp; Lô gỗ tròn: <b>{{ phieu.Lo_go }}</b></td>
            </tr>
            <tr><td class="lbl">- Số chứng chỉ FM/COC:</td><td class="val">{{ phieu.So_chung_chi }}</td></tr>
            <tr><td class="lbl">- Nhóm Sp:</td><td class="val">W1.1</td></tr>
            <tr>
              <td class="lbl"></td>
              <td class="val"><span class="hd-highlight">Theo HĐ số: {{ phieu.So_hop_dong || '' }}</span></td>
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
            <span class="italic">(Số tiền bằng chữ: …)</span>
          </div>

          <div class="bktm-date q-mt-md">
            Ngày {{ ngay }} tháng {{ thang }} năm {{ nam }}
          </div>

          <div class="sign-area">
            <div class="sign-col">
              <div class="sign-title">Người lập bảng kê</div>
              <div class="sign-sub">(Ký, ghi rõ họ tên)</div>
              <div class="sign-space"></div>
              <div class="sign-name">{{ UQ }}</div>
            </div>
            <div class="sign-col">
              <div class="sign-title">Người đại diện hoặc người được<br/>ủy quyền của doanh nghiệp</div>
              <div class="sign-sub">(Ký tên, đóng dấu)</div>
              <div class="sign-space"></div>
              <div class="sign-name">{{ NGUOI_NHAN }}</div>
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
      const xuong = this.phieu.Xuong_xe ? this.phieu.Xuong_xe.trim() : "";
      const cfg = this.getXuongConfig(xuong);
      this.TEN_CTY = cfg.ten || "";
      this.UQ = cfg.nguoi_dai_dien || "";
      this.DIA_CHI_CTY = cfg.dia_chi || "";
      this.SDT_CTY = cfg.sdt || "";
      this.CHUNG_CHI_CTY = cfg.chung_chi || "";
      this.HIEU_LUC_CTY = cfg.hieu_luc_cc || "";
      this.NGUOI_NHAN = cfg.nguoi_nhan || "";
      this.MA_SO_THUE = cfg.mst || "";
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
      const x = p && p.Xuong_xe ? p.Xuong_xe.trim() : "";
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
      this.setCell(ws, `F${r + 1}`, "BM.COC.01-a", { merge: `J${r + 1}`, bold: true, right: true });
      this.setCell(ws, `F${r + 2}`, "Ngày ban hành: 10.2.2022", { merge: `J${r + 2}`, italic: true, size: 9, right: true });
      this.setCell(ws, `A${r + 3}`, "BIÊN BẢN NGHIỆM THU VÀ GIAO NHẬN GỖ KEO TRÒN FSC100%",
        { merge: `J${r + 3}`, bold: true, center: true, size: 13 });
      ws.getRow(r + 3).height = 28;
      this.setCell(ws, `F${r + 4}`, "Lần ban hành: 02", { merge: `J${r + 4}`, italic: true, size: 9, right: true });

      // Info table — A-B label, C-E value, F-G label, H-J value (mở rộng A4)
      const info = [
        ["Đơn vị giao hàng:", p.Chu_rung || "", "Số phiếu:", p.So_phieu || ""],
        ["Địa chỉ:", diaChiCR, "Biển số xe:", p.Xe || ""],
        ["Số chứng chỉ FM/COC:", p.So_chung_chi || "", "Nơi giao nhận:", "tại bãi 1: " + (p.Chu_rung || "")],
        ["Đơn vị nhận hàng:", `${cfg.UQ} (${cfg.TEN_CTY})`, "Ngày nghiệm thu:", this.formatDate(p.Ngay_nhap)],
        ["Địa chỉ:", cfg.DIA_CHI_CTY, "Trạng thái MT:", "FSC 100%"],
        ["Số chứng chỉ FM/COC:", cfg.CHUNG_CHI_CTY, "Nhóm SP:", "W1.1"],
        ["", "", "Hiệu lực đến:", cfg.HIEU_LUC_CTY],
        ["", "", "Mã lô gỗ nhập:", p.Lo_go || ""],
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
      this.setCell(ws, `F${r + 1}`, "BM.COC.01-b", { merge: `J${r + 1}`, bold: true, right: true });
      this.setCell(ws, `F${r + 2}`, "Ngày ban hành: 10.2.2022", { merge: `J${r + 2}`, italic: true, size: 9, right: true });
      this.setCell(ws, `A${r + 3}`, "PHIẾU NHẬP KHO GỖ KEO TRÒN FSC100%",
        { merge: `J${r + 3}`, bold: true, center: true, size: 13 });
      ws.getRow(r + 3).height = 28;
      this.setCell(ws, `F${r + 4}`, "Lần ban hành: 02", { merge: `J${r + 4}`, italic: true, size: 9, right: true });

      const info = [
        ["Người giao hàng:", cfg.UQ, "Số phiếu:", p.So_phieu || ""],
        ["Kho nhập:", cfg.TEN_CTY, "Biển số xe:", p.Xe || ""],
        ["Địa chỉ:", cfg.DIA_CHI_CTY, "Ngày nhập:", this.formatDate(p.Ngay_nhap)],
        ["Trạng thái MT:", "FSC 100%", "Nhóm SP:", "W1.1"],
        ["Mã lô gỗ nhập:", p.Lo_go || "", "", ""],
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

      // 1. Thông tin chủ lâm sản
      line("1. Thông tin chủ lâm sản:", { bold: true });
      line(`- Tên chủ lâm sản(4): ${cfg.TEN_CTY}`);
      line(`- Số GCN/MSDN/GPTL/ĐKHĐ/CCCD/CMND/HC(5): ${cfg.MA_SO_THUE}`);
      line(`- Địa chỉ(6): ${cfg.DIA_CHI_CTY}`);
      line(`- Số điện thoại: ${cfg.SDT_CTY}, Địa chỉ Email: ………………………`);
      line(`- Số chứng chỉ FM/COC: ${cfg.CHUNG_CHI_CTY}. Hiệu lực chứng chỉ: ${cfg.HIEU_LUC_CTY}.`);
      cur++;

      // 2. Thông tin tổ chức, cá nhân mua
      line("2. Thông tin tổ chức, cá nhân mua/nhận chuyển giao quyền sở hữu:", { bold: true });
      line("- Tên tổ chức, cá nhân(4): ………………………………………………..");
      line("- Số GCN/MSDN/GPTL/ĐKHĐ/CCCD/CMND/HC(5): …………………");
      line("- Địa chỉ(6): ………………………………………………………………");
      line("- Số điện thoại: ………………, Địa chỉ Email: …………………………");
      line("- Số chứng chỉ FM/COC: ………………………… Hiệu lực: ……………………….");
      cur++;

      // 3. Thông tin về lâm sản
      line("3. Thông tin về lâm sản:", { bold: true });
      line(`- Tên loài: Gỗ tròn Keo tai tượng FSC 100% (Acacia Mangium)`);
      line("- Nhóm loài: Thông thường");
      line(`- Nguồn gốc(7): ${p.So_BKLS || ""}    Địa chỉ: ${diaChiCR}`);
      line("- Mã HS (áp dụng đối với lâm sản nhập khẩu, xuất khẩu): …………………");
      line("- Giá trị (nếu có): ……………………………………………………………");
      line(`- Khối lượng/trọng lượng: ${klStr} m³    Bằng chữ: ${klStr} mét khối.`);
      line("- Số lượng: …………………; đơn vị tính (lóng, khúc; thanh, tấm, hộp, viên, ...): ……………");
      line(`- Thông tin về lô khai thác(8):    Khoảnh: ${p.Khoang || ""}    Lô: ${p.Lo || ""}    Diện tích: ${(p.Dien_tich || 0).toFixed(2)} ha`);
      line(`- Thông tin khác có liên quan (nếu có): Địa danh khai thác: ${diaDanhKT}`);
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
      this.setCell(ws, `I${cur}`, `Lô gỗ tròn: ${p.Lo_go || ""}`, { merge: `J${cur}`, bold: true });
      ws.getRow(cur).height = 36;
      cur++;

      setInfoLine("- Số chứng chỉ FM/COC:", p.So_chung_chi || "");
      setInfoLine("- Nhóm Sp:", "W1.1");

      // "Theo HĐ số:" với highlight vàng — căn phải
      this.setCell(ws, `H${cur}`, `Theo HĐ số: ${p.So_hop_dong || ""}`,
        { merge: `J${cur}`, bold: true, fill: "FFFFEB3B", border: true, center: true });
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
      this.setCell(ws, `H${cur}`, "(Số tiền bằng chữ: …)",
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
      this.setCell(ws, `A${cur}`, cfg.UQ || "", { merge: `E${cur}`, bold: true, center: true });
      this.setCell(ws, `F${cur}`, cfg.NGUOI_NHAN || "", { merge: `J${cur}`, bold: true, center: true });
      return cur + 2;
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
  background: #fff59d;
  padding: 1px 8px;
  display: inline-block;
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

/* ===== Print style ===== */
@media print {
  .no-print { display: none !important; }
  .print-area { margin: 0; }

  /* Trang 1: BM 01-a (portrait A4) */
  .bieu-mau-container {
    display: block;
  }
  .bieu-mau {
    border: 1px solid #000;
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
  .bktm { border: 1px solid #000; }

  @page { size: portrait A4; margin: 10mm; }
}
</style>
