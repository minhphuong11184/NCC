<template>
  <q-page padding>
    <div class="text-h5 q-mb-md no-print">Phiếu cân hàng gỗ tròn</div>

    <!-- Toolbar 1: Filter + Tải dữ liệu -->
    <div class="row q-col-gutter-md items-end q-mb-md no-print">
      <div class="col-auto">
        <q-select v-model="thang" :options="thangOptions" emit-value map-options label="Tháng" filled dense style="width:140px" />
      </div>
      <div class="col-auto">
        <q-input v-model.number="nam" type="number" label="Năm" filled dense style="width:120px" />
      </div>
      <div class="col-auto">
        <q-select
          v-model="xuongXe"
          :options="xuongSelectOptions"
          emit-value map-options
          label="Xưởng xẻ *"
          filled dense style="min-width:280px"
          :error="!xuongXe"
          error-message="Bắt buộc chọn xưởng xẻ"
        />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="search" label="Tải dữ liệu" @click="loadData" :loading="loading" :disable="!xuongXe" />
      </div>
      <div class="col-auto">
        <q-btn color="deep-orange" icon="shuffle" label="Chia trọng lượng bì" @click="chiaTrongLuongBi" :disable="!rows.length" />
      </div>
      <div class="col-auto">
        <q-btn color="positive" icon="save" label="Lưu vào DB" @click="luuVaoDB" :loading="saving" :disable="!coBi" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="print" label="In phiếu đã chọn" @click="printPage" :disable="!selectedRow" />
      </div>
      <div class="col-auto">
        <q-btn color="blue-7" icon="description" label="Xuất Word tất cả" @click="exportAllWord" :loading="exportingWord" :disable="!coBi" />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="file_download" label="Xuất Excel tất cả" @click="exportPhieuCan" :loading="exporting" :disable="!coBi" />
      </div>
    </div>

    <!-- Tham số chia bì -->
    <div class="row q-col-gutter-md items-end q-mb-md no-print">
      <div class="col-auto">
        <q-input v-model.number="biMin" type="number" step="0.01" label="Bì tối thiểu (Tấn)" filled dense style="width:160px" />
      </div>
      <div class="col-auto">
        <q-input v-model.number="biMax" type="number" step="0.01" label="Bì tối đa (Tấn)" filled dense style="width:160px" />
      </div>
      <div class="col-auto">
        <div class="text-caption text-grey-7">Random theo từng chuyến trong tháng, mỗi dòng 1 giá trị khác nhau (2 chữ số thập phân).</div>
      </div>
    </div>

    <!-- Summary chips -->
    <div v-if="rows.length" class="row q-col-gutter-md q-mb-md no-print">
      <div class="col-auto"><q-chip color="blue" text-color="white" icon="receipt">{{ rows.length }} phiếu</q-chip></div>
      <div class="col-auto"><q-chip color="green" text-color="white" icon="straighten">{{ fmtNum(tongHang) }} m³ / Tấn (hàng)</q-chip></div>
      <div class="col-auto" v-if="coBi"><q-chip color="orange" text-color="white" icon="inventory_2">{{ fmtNum(tongBi) }} Tấn (bì)</q-chip></div>
      <div class="col-auto" v-if="coBi"><q-chip color="deep-orange" text-color="white" icon="scale">{{ fmtNum(tongTong) }} Tấn (tổng)</q-chip></div>
    </div>

    <!-- Bảng phiếu cân -->
    <dx-data-grid
      v-if="rows.length"
      class="no-print"
      :data-source="rows"
      :show-borders="true"
      :column-auto-width="true"
      :allow-column-resizing="true"
      :selected-row-keys="selectedKeys"
      @selection-changed="onSelectRow"
      key-expr="ID"
      height="55vh"
    >
      <dx-selection mode="single" />
      <dx-editing
        mode="cell"
        :allow-updating="true"
        :select-text-on-edit-start="true"
        start-edit-action="click"
      />
      <dx-filter-row :visible="true" />
      <dx-column data-field="So_phieu" caption="Số phiếu" :width="120" :allow-editing="false" />
      <dx-column data-field="Ngay_nhap" caption="Ngày nhập" data-type="date" format="dd/MM/yyyy" :width="110" :allow-editing="false" />
      <dx-column data-field="Chu_rung" caption="Chủ rừng (bên bán)" :min-width="180" :allow-editing="false" />
      <dx-column data-field="Xe" caption="Biển số xe" :width="110" :allow-editing="false" />
      <dx-column data-field="Lo_go_tron" caption="Mã lô gỗ" :width="130" :allow-editing="false" />
      <dx-column data-field="Khoi_luong" caption="KL hàng (m³ = Tấn)" data-type="number" format="#,##0.00" :width="130" :allow-editing="false" />
      <dx-column
        data-field="Trong_luong_bi"
        caption="TL bì (Tấn) — bấm để sửa"
        data-type="number"
        format="#,##0.00"
        :width="180"
        :allow-editing="true"
        :editor-options="{ format: '#,##0.00', step: 0.01, min: 0, showSpinButtons: true }"
        cell-template="biCell"
      />
      <dx-column caption="TL tổng (Tấn)" data-type="number" format="#,##0.00" :width="130"
        :allow-editing="false"
        :calculate-cell-value="r => (Number(r.Khoi_luong) || 0) + (Number(r.Trong_luong_bi) || 0)" />
      <dx-column data-field="So_chung_chi" caption="Số chứng chỉ" :width="160" :allow-editing="false" />
      <dx-column data-field="So_BKLS" caption="Số BKLS" :width="120" :allow-editing="false" />
      <template #biCell="{ data }">
        <span :class="data.value ? 'text-orange-9 text-weight-medium' : 'text-grey-5'">
          {{ data.value ? fmtNum(data.value) : '—' }}
        </span>
      </template>
      <dx-summary>
        <dx-total-item column="So_phieu" summary-type="count" display-format="{0} phiếu" />
        <dx-total-item column="Khoi_luong" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
        <dx-total-item column="Trong_luong_bi" summary-type="sum" value-format="#,##0.00" display-format="Tổng bì: {0}" />
      </dx-summary>
    </dx-data-grid>

    <!-- Empty state -->
    <q-banner v-if="!rows.length && !loading" class="bg-blue-1 text-blue-9 q-mb-md no-print" rounded>
      <template v-slot:avatar><q-icon name="info" /></template>
      Chọn <b>tháng / năm / xưởng xẻ</b> rồi bấm <b>Tải dữ liệu</b> để xem các phiếu nhập gỗ tròn đã chia.
    </q-banner>

    <!-- Preview phiếu cân đã chọn (cũng dùng để in trực tiếp window.print) -->
    <div v-if="selectedRow" class="print-area q-mt-md">
      <div class="phieu-can">
        <div class="ten-xuong">{{ (cfg.ten || xuongXe || '').toUpperCase() }}</div>
        <div class="dia-chi">Địa chỉ: {{ cfg.dia_chi || '' }}</div>
        <div class="title">PHIẾU CÂN HÀNG</div>
        <div class="so-phieu">Số phiếu: {{ selectedRow.So_phieu }}/{{ namPhieu(selectedRow) }}/HĐ</div>

        <table class="info-table">
          <tr>
            <td class="lbl">Ngày vào:</td>
            <td class="val">{{ fmtDate(selectedRow.Ngay_nhap) }}</td>
            <td class="lbl">Giờ vào:</td>
            <td class="val">{{ gioVao(selectedRow) }}</td>
          </tr>
          <tr>
            <td class="lbl">Ngày ra:</td>
            <td class="val">{{ fmtDate(selectedRow.Ngay_nhap) }}</td>
            <td class="lbl">Giờ ra:</td>
            <td class="val">{{ gioRa(selectedRow) }}</td>
          </tr>
          <tr>
            <td class="lbl">Biển số xe:</td>
            <td class="val">{{ selectedRow.Xe }}</td>
            <td class="lbl">Mặt hàng:</td>
            <td class="val">Gỗ keo tai tượng (Acacia mangium) FSC100%</td>
          </tr>
          <tr>
            <td class="lbl">Bên mua:</td>
            <td class="val" colspan="3">
              <b>{{ cfg.ten || xuongXe }}</b> — Mã số chứng nhận: <b>{{ cfg.chung_chi || '' }}</b>
            </td>
          </tr>
          <tr>
            <td class="lbl">Bên bán:</td>
            <td class="val" colspan="3">
              <b>{{ selectedRow.Chu_rung }}</b> — Mã số chứng nhận: <b>{{ selectedRow.So_chung_chi || '' }}</b>
            </td>
          </tr>
        </table>

        <div class="can-wrap">
          <table class="can-inner">
            <tr>
              <td class="can-lbl">Trọng lượng tổng:</td>
              <td class="can-val">{{ fmtNum(tongCan(selectedRow)) }}</td>
              <td class="can-unit">(Tấn)</td>
            </tr>
            <tr>
              <td class="can-lbl">Trọng lượng bì:</td>
              <td class="can-val">{{ fmtNum(selectedRow.Trong_luong_bi) }}</td>
              <td class="can-unit">(Tấn)</td>
            </tr>
            <tr class="hang">
              <td class="can-lbl">Trọng lượng hàng:</td>
              <td class="can-val">{{ fmtNum(selectedRow.Khoi_luong) }}</td>
              <td class="can-unit">(Tấn)</td>
            </tr>
          </table>
        </div>

        <table class="sign-table">
          <tr>
            <td class="sign-title">BÊN GIAO</td>
            <td class="sign-title">NGƯỜI CÂN</td>
            <td class="sign-title">BÊN NHẬN</td>
          </tr>
          <tr>
            <td class="sign-space"></td>
            <td class="sign-space"></td>
            <td class="sign-space"></td>
          </tr>
          <tr>
            <td class="sign-name">{{ selectedRow.Chu_rung }}</td>
            <td class="sign-name"></td>
            <td class="sign-name">{{ cfg.nguoi_nhan || cfg.nguoi_dai_dien || '' }}</td>
          </tr>
        </table>
      </div>
    </div>

    <q-banner v-if="rows.length && !selectedRow" class="bg-grey-2 text-grey-8 q-mt-md no-print" rounded dense>
      <template v-slot:avatar><q-icon name="touch_app" /></template>
      <b>Click ô "TL bì (Tấn)"</b> để sửa giá trị thủ công trước khi Lưu DB.
      <b>Click vào 1 dòng</b> để xem mẫu phiếu cân và bấm <b>"In phiếu đã chọn"</b>.
    </q-banner>
  </q-page>
</template>

<script>
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import xuongXeMixin from "../mixins/xuongXeMixin";
import {
  DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem, DxSelection, DxEditing,
} from "devextreme-vue/data-grid";

export default {
  mixins: [xuongXeMixin],
  components: { DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem, DxSelection, DxEditing },
  async created() {
    await this.loadXuongXe();
  },
  data() {
    return {
      thang: new Date().getMonth() + 1,
      nam: new Date().getFullYear(),
      thangOptions: Array.from({ length: 12 }, (_, i) => ({ label: "Tháng " + (i + 1), value: i + 1 })),
      xuongXe: "",
      biMin: 10,
      biMax: 13,
      loading: false,
      saving: false,
      exporting: false,
      exportingWord: false,
      rows: [],
      selectedKeys: [],
      selectedRow: null,
    };
  },
  computed: {
    tongHang() { return this.rows.reduce((s, r) => s + (Number(r.Khoi_luong) || 0), 0); },
    tongBi() { return this.rows.reduce((s, r) => s + (Number(r.Trong_luong_bi) || 0), 0); },
    tongTong() { return this.tongHang + this.tongBi; },
    coBi() { return this.rows.some(r => Number(r.Trong_luong_bi) > 0); },
    /** Config xưởng hiện chọn (cho preview phiếu cân in trên web). */
    cfg() { return this.getXuongConfig(this.xuongXe) || {}; },
  },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    fmtNum(v) { return v == null ? "0.00" : Number(v).toFixed(2); },

    /** Format date string/Date → DD/MM/YYYY */
    fmtDate(d) {
      if (!d) return "";
      const dt = new Date(d);
      if (isNaN(dt)) return String(d);
      const pad = n => String(n).padStart(2, "0");
      return `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`;
    },
    namPhieu(p) {
      if (!p || !p.Ngay_nhap) return this.nam || "____";
      const dt = new Date(p.Ngay_nhap);
      return isNaN(dt) ? (this.nam || "____") : dt.getFullYear();
    },
    tongCan(p) {
      return Math.round(((Number(p.Khoi_luong) || 0) + (Number(p.Trong_luong_bi) || 0)) * 100) / 100;
    },

    /**
     * Sinh giờ vào / giờ ra deterministic theo ID + So_phieu để mỗi phiếu khác nhau.
     * Cùng phiếu in lại sẽ ra giờ giống.
     */
    timeForPhieu(p) {
      const seed = (Number(p.ID) || 0) * 73 + (String(p.So_phieu || "").length * 13) + 7;
      const hourIn = 8 + (seed % 8);             // 8..15
      const minIn = (seed * 17 + 9) % 60;
      const secIn = (seed * 11) % 60;
      const addMin = 25 + ((seed * 7) % 16);     // 25..40 phút
      const totalIn = hourIn * 60 + minIn;
      const totalOut = totalIn + addMin;
      const hourOut = Math.floor(totalOut / 60) % 24;
      const minOut = totalOut % 60;
      const secOut = (seed * 19 + 5) % 60;
      return { hourIn, minIn, secIn, hourOut, minOut, secOut };
    },
    fmtTime(h, m, s) {
      const pad = n => String(n).padStart(2, "0");
      return `${pad(h)}:${pad(m)}:${pad(s)} ${h < 12 ? "SA" : "CH"}`;
    },
    gioVao(p) {
      const t = this.timeForPhieu(p);
      return this.fmtTime(t.hourIn, t.minIn, t.secIn);
    },
    gioRa(p) {
      const t = this.timeForPhieu(p);
      return this.fmtTime(t.hourOut, t.minOut, t.secOut);
    },

    onSelectRow(e) {
      const rows = (e && e.selectedRowsData) || [];
      this.selectedRow = rows[0] || null;
      this.selectedKeys = rows.length ? [rows[0].ID] : [];
    },

    printPage() {
      if (!this.selectedRow) {
        this.$q.notify({ type: "warning", message: "Hãy chọn 1 dòng trong bảng để in", timeout: 4000 });
        return;
      }
      window.print();
    },

    /**
     * Trích message lỗi dùng được từ một AxiosError hoặc Error bất kỳ.
     * Tránh trả về chuỗi "undefined" khi meta.message null.
     */
    extractErrorMessage(err, fallback) {
      const resp = err && err.response;
      const meta = resp && resp.data && resp.data.meta;
      const candidates = [
        meta && meta.message,
        meta && meta.errorMessage,
        resp && resp.data && resp.data.message,
        resp && typeof resp.data === "string" ? resp.data : null,
        err && err.message,
        resp && `HTTP ${resp.status} ${resp.statusText || ""}`.trim(),
      ];
      for (const c of candidates) {
        if (c && typeof c === "string" && c.trim() && c !== "undefined") return c.trim();
      }
      return fallback || "Đã có lỗi xảy ra (không có chi tiết). Mở DevTools → Network để xem response.";
    },

    async loadData() {
      if (!this.xuongXe) {
        this.$q.notify({ type: "negative", message: "Chọn xưởng xẻ trước", timeout: 4000 });
        return;
      }
      this.loading = true;
      try {
        const { data } = await axios.get(
          `http://${this.host()}:2003/api/v1/phieu-can/list`,
          { params: { thang: this.thang, nam: this.nam, xuong_xe: this.xuongXe } }
        );
        if (data && data.meta && data.meta.success) {
          this.rows = (data.data || []).map(r => ({ ...r }));
          if (!this.rows.length) {
            this.$q.notify({
              type: "warning",
              message: `Tháng ${this.thang}/${this.nam} - xưởng "${this.xuongXe}" chưa có phiếu nào. Vào "Chia xe gỗ tròn" để chia xe trước.`,
              timeout: 6000,
            });
          } else {
            this.$q.notify({
              type: "positive",
              message: `Đã tải ${this.rows.length} phiếu`,
              timeout: 3000,
            });
          }
        } else {
          const msg = (data && data.meta && data.meta.message)
            || (data && data.message)
            || "Server trả về kết quả không hợp lệ (meta.success = false). Kiểm tra console backend.";
          this.$q.notify({ type: "negative", message: msg, timeout: 6000 });
          console.error("[phieu-can/list] response không hợp lệ:", data);
        }
      } catch (err) {
        console.error("[phieu-can/list] error:", err);
        this.$q.notify({
          type: "negative",
          message: this.extractErrorMessage(err, "Lỗi tải dữ liệu phiếu cân"),
          timeout: 6000,
        });
      } finally {
        this.loading = false;
      }
    },

    /**
     * Random N giá trị duy nhất trong [biMin, biMax], 2 chữ số thập phân.
     * Pool: tất cả số x.xx trong khoảng → shuffle → lấy N đầu.
     * Nếu N > số giá trị có thể (vd 10.00..13.00 = 301 giá trị) → cho phép lặp.
     */
    chiaTrongLuongBi() {
      if (!this.rows.length) return;
      const lo = Math.min(this.biMin, this.biMax);
      const hi = Math.max(this.biMin, this.biMax);
      if (hi - lo < 0.01) {
        this.$q.notify({ type: "negative", message: "Khoảng bì không hợp lệ", timeout: 4000 });
        return;
      }
      const N = this.rows.length;
      // Pool các giá trị 2 decimals trong [lo, hi]
      const pool = [];
      const loInt = Math.round(lo * 100);
      const hiInt = Math.round(hi * 100);
      for (let v = loInt; v <= hiInt; v++) pool.push(v / 100);

      let assigned;
      if (N <= pool.length) {
        // Fisher–Yates shuffle, lấy N đầu — đảm bảo unique
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        assigned = pool.slice(0, N);
      } else {
        // Pool < N — không thể unique hoàn toàn, random có thể lặp
        assigned = Array.from({ length: N }, () => pool[Math.floor(Math.random() * pool.length)]);
      }

      // Gán vào từng dòng (Vue 2: dùng splice/Vue.set để reactive)
      this.rows.forEach((r, i) => {
        this.$set(r, "Trong_luong_bi", assigned[i]);
      });
      this.$q.notify({
        type: "positive",
        message: `Đã chia trọng lượng bì cho ${N} phiếu (${lo.toFixed(2)} – ${hi.toFixed(2)} Tấn)`,
        timeout: 3000,
      });
    },

    async luuVaoDB() {
      const valid = this.rows.filter(r => r.ID && r.Trong_luong_bi != null);
      if (!valid.length) {
        this.$q.notify({ type: "warning", message: "Chưa có trọng lượng bì để lưu — bấm 'Chia trọng lượng bì' trước", timeout: 5000 });
        return;
      }
      this.saving = true;
      try {
        const payload = {
          rows: valid.map(r => ({ ID: r.ID, Trong_luong_bi: r.Trong_luong_bi })),
        };
        const { data } = await axios.post(
          `http://${this.host()}:2003/api/v1/phieu-can/update-bi`,
          payload
        );
        if (data && data.meta && data.meta.success) {
          this.$q.notify({
            type: "positive",
            message: `Đã cập nhật ${data.data.updated}/${data.data.total_input} dòng`,
            timeout: 4000,
          });
        } else {
          const msg = (data && data.meta && data.meta.message)
            || "Lưu thất bại — kiểm tra console backend";
          this.$q.notify({ type: "negative", message: msg, timeout: 6000 });
          console.error("[phieu-can/update-bi] response không hợp lệ:", data);
        }
      } catch (err) {
        console.error("[phieu-can/update-bi] error:", err);
        this.$q.notify({
          type: "negative",
          message: this.extractErrorMessage(err, "Lỗi lưu trọng lượng bì"),
          timeout: 6000,
        });
      } finally {
        this.saving = false;
      }
    },

    /* ===================== Export Excel — Phiếu cân hàng ===================== */

    async exportPhieuCan() {
      const data = this.rows.filter(r => Number(r.Trong_luong_bi) > 0);
      if (!data.length) {
        this.$q.notify({ type: "warning", message: "Chưa có dòng nào có trọng lượng bì để in", timeout: 5000 });
        return;
      }
      this.exporting = true;
      try {
        const cfg = this.getXuongConfig(this.xuongXe) || {};
        const wb = new ExcelJS.Workbook();

        // 1 sheet duy nhất, các phiếu nối tiếp nhau với page break giữa các phiếu
        const ws = wb.addWorksheet("Phiếu cân", {
          pageSetup: {
            paperSize: 9, orientation: "portrait",
            fitToPage: true, fitToWidth: 1, fitToHeight: 0,
            margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
          },
        });
        // 6 cột: A-F để layout 2 cột thông tin (label-value | label-value)
        ws.columns = [
          { width: 14 }, // A: label trái
          { width: 22 }, // B: value trái
          { width: 4 },  // C: spacer
          { width: 14 }, // D: label phải
          { width: 22 }, // E: value phải
          { width: 4 },  // F: pad
        ];

        let row = 1;
        for (let i = 0; i < data.length; i++) {
          row = this.buildOnePhieuCan(ws, data[i], cfg, row, i + 1);
          if (i < data.length - 1) {
            ws.getRow(row - 1).addPageBreak();
            row += 1; // 1 row spacer
          }
        }

        const buf = await wb.xlsx.writeBuffer();
        const fileName = `PhieuCan_${(this.xuongXe || "XX").replace(/[^\p{L}\p{N}]+/gu, "_")}_T${this.thang}_${this.nam}.xlsx`;
        saveAs(
          new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
          fileName
        );

        this.$q.notify({
          type: "positive",
          message: `Đã xuất ${data.length} phiếu cân`,
          timeout: 4000,
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Lỗi xuất Excel: " + (err.message || err), timeout: 6000 });
      } finally {
        this.exporting = false;
      }
    },

    /** Border thin cho 1 ô. */
    bThin() {
      return {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" },
      };
    },

    /** Set 1 ô với options (giống pattern PhieuNKGoTron). */
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
      if (opts.numFmt) cell.numFmt = opts.numFmt;
      return cell;
    },

    /**
     * Tạo 1 phiếu cân hàng (theo mẫu ảnh) bắt đầu từ row `start`.
     * Trả về row tiếp theo có thể dùng.
     */
    buildOnePhieuCan(ws, p, cfg, start, sttPhieu) {
      const r0 = start;
      const tenXuong = (cfg.ten || this.xuongXe || "").toUpperCase();
      const diaChi = cfg.dia_chi || "";
      const chungChiXuong = cfg.chung_chi || "";
      const chungChiCR = p.So_chung_chi || "";

      const klHang = Number(p.Khoi_luong) || 0;     // 1 m³ = 1 Tấn
      const klBi = Number(p.Trong_luong_bi) || 0;
      const klTong = Math.round((klHang + klBi) * 100) / 100;

      // ===== Header =====
      this.setCell(ws, `A${r0}`, tenXuong,
        { merge: `F${r0}`, bold: true, size: 14, center: true });
      ws.getRow(r0).height = 22;

      this.setCell(ws, `A${r0 + 1}`, "Địa chỉ: " + diaChi,
        { merge: `F${r0 + 1}`, italic: true, center: true, size: 11 });

      this.setCell(ws, `A${r0 + 2}`, "PHIẾU CÂN HÀNG",
        { merge: `F${r0 + 2}`, bold: true, size: 16, center: true });
      ws.getRow(r0 + 2).height = 26;

      // Số phiếu: dùng So_phieu của NHAP_GO_TRON (vd "03/02-HKP") + năm
      const ngay = p.Ngay_nhap ? new Date(p.Ngay_nhap) : new Date();
      const namPhieu = ngay.getFullYear();
      const soPhieuFull = `${p.So_phieu || sttPhieu}/${namPhieu}/HĐ`;
      this.setCell(ws, `A${r0 + 3}`, "Số phiếu: " + soPhieuFull,
        { merge: `F${r0 + 3}`, center: true, italic: true });

      // ===== Khối thông tin: 2 cột =====
      // Giờ vào / ra — dùng helper deterministic theo ID (đồng bộ với web preview + Word)
      const t = this.timeForPhieu(p);
      const ngayStr = this.fmtDate(ngay);
      const gioIn = this.fmtTime(t.hourIn, t.minIn, t.secIn);
      const gioOut = this.fmtTime(t.hourOut, t.minOut, t.secOut);

      let r = r0 + 4;
      // Dòng: Ngày vào | Giờ vào
      this.setCell(ws, `A${r}`, "Ngày vào:", { bold: true });
      this.setCell(ws, `B${r}`, ngayStr);
      this.setCell(ws, `D${r}`, "Giờ vào:", { bold: true });
      this.setCell(ws, `E${r}`, gioIn);
      r++;

      // Dòng: Ngày ra | Giờ ra
      this.setCell(ws, `A${r}`, "Ngày ra:", { bold: true });
      this.setCell(ws, `B${r}`, ngayStr);
      this.setCell(ws, `D${r}`, "Giờ ra:", { bold: true });
      this.setCell(ws, `E${r}`, gioOut);
      r++;

      // Dòng: Biển số xe | Mặt hàng
      this.setCell(ws, `A${r}`, "Biển số xe:", { bold: true });
      this.setCell(ws, `B${r}`, p.Xe || "");
      this.setCell(ws, `D${r}`, "Mặt hàng:", { bold: true });
      this.setCell(ws, `E${r}`, "Gỗ keo tai tượng (Acacia mangium) FSC100%",
        { merge: `F${r}` });
      r++;

      // Bên mua (xưởng xẻ)
      this.setCell(ws, `A${r}`, "Bên mua:", { bold: true });
      this.setCell(ws, `B${r}`, `${cfg.ten || this.xuongXe || ""} — Mã số chứng nhận: ${chungChiXuong}`,
        { merge: `F${r}` });
      r++;

      // Bên bán (chủ rừng)
      this.setCell(ws, `A${r}`, "Bên bán:", { bold: true });
      this.setCell(ws, `B${r}`, `${p.Chu_rung || ""} — Mã số chứng nhận: ${chungChiCR}`,
        { merge: `F${r}` });
      r++;

      // ===== Bảng cân (3 dòng) =====
      r++; // spacer
      const tblStart = r;
      // Trọng lượng tổng
      this.setCell(ws, `B${r}`, "Trọng lượng tổng:", { bold: true, border: true });
      this.setCell(ws, `C${r}`, klTong, { numFmt: "#,##0.00", center: true, border: true, bold: true });
      ws.mergeCells(`C${r}:D${r}`);
      this.setCell(ws, `E${r}`, "(Tấn)", { center: true, border: true });
      r++;
      // Trọng lượng bì
      this.setCell(ws, `B${r}`, "Trọng lượng bì:", { bold: true, border: true });
      this.setCell(ws, `C${r}`, klBi, { numFmt: "#,##0.00", center: true, border: true });
      ws.mergeCells(`C${r}:D${r}`);
      this.setCell(ws, `E${r}`, "(Tấn)", { center: true, border: true });
      r++;
      // Trọng lượng hàng
      this.setCell(ws, `B${r}`, "Trọng lượng hàng:", { bold: true, border: true });
      this.setCell(ws, `C${r}`, klHang, { numFmt: "#,##0.00", center: true, border: true, bold: true });
      ws.mergeCells(`C${r}:D${r}`);
      this.setCell(ws, `E${r}`, "(Tấn)", { center: true, border: true });
      r++;

      // Apply border lên toàn block bảng cân
      for (let rr = tblStart; rr < r; rr++) {
        ["B", "C", "D", "E"].forEach(col => {
          ws.getCell(`${col}${rr}`).border = this.bThin();
        });
      }

      // ===== Khu ký =====
      r += 2;
      this.setCell(ws, `A${r}`, "BÊN GIAO", { bold: true, center: true });
      this.setCell(ws, `C${r}`, "NGƯỜI CÂN", { bold: true, center: true, merge: `D${r}` });
      this.setCell(ws, `E${r}`, "BÊN NHẬN", { bold: true, center: true, merge: `F${r}` });

      // 3 dòng trống cho chữ ký
      r += 4;
      this.setCell(ws, `A${r}`, p.Chu_rung || "", { italic: true, center: true });
      this.setCell(ws, `C${r}`, "", { merge: `D${r}`, center: true });
      this.setCell(ws, `E${r}`, cfg.nguoi_nhan || cfg.nguoi_dai_dien || "",
        { italic: true, center: true, merge: `F${r}` });

      r += 2; // padding cuối phiếu
      return r;
    },

    /* ===================== XUẤT WORD (.doc) — 1 file tất cả phiếu, mỗi phiếu 1 trang ===================== */

    wordEsc(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    },

    wordCss() {
      return `<style>
        @page Section1 { size: 21cm 29.7cm; margin: 1.6cm 1.8cm 1.6cm 1.8cm; mso-page-orientation: portrait; }
        div.Section1 { page: Section1; }
        body { font-family: "Times New Roman", serif; font-size: 13pt; line-height: 1.45; }
        p { margin: 0 0 4pt 0; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .ten-xuong { font-size: 17pt; font-weight: bold; text-align: center; text-transform: uppercase; margin: 0 0 4pt 0; letter-spacing: 1pt; }
        .dia-chi { font-size: 12pt; font-style: italic; text-align: center; margin-bottom: 10pt; }
        .title { font-size: 22pt; font-weight: bold; text-align: center; margin: 10pt 0 4pt 0; letter-spacing: 3pt; }
        .so-phieu { font-size: 12pt; font-style: italic; text-align: center; margin-bottom: 16pt; }
        table.info { width: 100%; border-collapse: collapse; margin: 6pt 0 14pt 0; }
        table.info td { padding: 5pt 6pt; vertical-align: top; font-size: 13pt; }
        table.info td.lbl { font-weight: bold; width: 18%; white-space: nowrap; }
        table.info td.val { width: 32%; }
        /* ===== Bảng cân: outer border bao 3 dòng, dòng "hàng" có gạch ngang phía trên ===== */
        table.can-wrap { margin: 14pt auto 4pt auto; border-collapse: collapse; }
        table.can-wrap > tbody > tr > td {
          border: 1.25pt solid #000;
          padding: 14pt 28pt;
        }
        table.can-inner { border-collapse: collapse; margin: 0 auto; }
        table.can-inner td {
          padding: 7pt 14pt;
          font-size: 14pt;
          vertical-align: middle;
        }
        table.can-inner td.lbl { font-weight: bold; white-space: nowrap; }
        table.can-inner td.val {
          text-align: center;
          font-weight: bold;
          min-width: 90pt;
          padding-left: 28pt;
          padding-right: 28pt;
        }
        table.can-inner td.unit {
          text-align: left;
          font-style: italic;
          min-width: 44pt;
        }
        table.can-inner tr.hang td { border-top: 1pt solid #000; padding-top: 10pt; }
        table.sign { width: 100%; margin-top: 26pt; border-collapse: collapse; }
        table.sign td { width: 33.3%; text-align: center; vertical-align: top; padding: 0 4pt; }
        .sign-title { font-weight: bold; text-transform: uppercase; font-size: 13pt; }
        .sign-name { margin-top: 64pt; font-weight: bold; font-style: italic; font-size: 12pt; }
        .pgbreak { page-break-before: always; }
      </style>`;
    },

    /** Build HTML cho 1 phiếu cân — 1 trang A4 portrait. */
    wordOnePhieuCan(p, idx) {
      const e = this.wordEsc.bind(this);
      const cfg = this.cfg || {};
      const firstBreak = idx === 0 ? "" : '<br clear="all" class="pgbreak"/>';
      const ten = (cfg.ten || this.xuongXe || "");
      const klHang = Number(p.Khoi_luong) || 0;
      const klBi = Number(p.Trong_luong_bi) || 0;
      const klTong = Math.round((klHang + klBi) * 100) / 100;
      const ngayStr = this.fmtDate(p.Ngay_nhap);
      const t = this.timeForPhieu(p);
      const gioIn = this.fmtTime(t.hourIn, t.minIn, t.secIn);
      const gioOut = this.fmtTime(t.hourOut, t.minOut, t.secOut);
      const namPh = this.namPhieu(p);

      return `${firstBreak}
        <p class="ten-xuong">${e(ten.toUpperCase())}</p>
        <p class="dia-chi">Địa chỉ: ${e(cfg.dia_chi || "")}</p>
        <p class="title">PHIẾU CÂN HÀNG</p>
        <p class="so-phieu">Số phiếu: ${e(p.So_phieu || "")}/${e(namPh)}/HĐ</p>
        <table class="info">
          <tr>
            <td class="lbl">Ngày vào:</td><td class="val">${e(ngayStr)}</td>
            <td class="lbl">Giờ vào:</td><td class="val">${e(gioIn)}</td>
          </tr>
          <tr>
            <td class="lbl">Ngày ra:</td><td class="val">${e(ngayStr)}</td>
            <td class="lbl">Giờ ra:</td><td class="val">${e(gioOut)}</td>
          </tr>
          <tr>
            <td class="lbl">Biển số xe:</td><td class="val">${e(p.Xe || "")}</td>
            <td class="lbl">Mặt hàng:</td><td class="val">Gỗ keo tai tượng (Acacia mangium) FSC100%</td>
          </tr>
          <tr>
            <td class="lbl">Bên mua:</td>
            <td class="val" colspan="3"><b>${e(ten)}</b> — Mã số chứng nhận: <b>${e(cfg.chung_chi || "")}</b></td>
          </tr>
          <tr>
            <td class="lbl">Bên bán:</td>
            <td class="val" colspan="3"><b>${e(p.Chu_rung || "")}</b> — Mã số chứng nhận: <b>${e(p.So_chung_chi || "")}</b></td>
          </tr>
        </table>
        <table class="can-wrap" align="center"><tr><td>
          <table class="can-inner">
            <tr><td class="lbl">Trọng lượng tổng:</td><td class="val">${klTong.toFixed(2)}</td><td class="unit">(Tấn)</td></tr>
            <tr><td class="lbl">Trọng lượng bì:</td><td class="val">${klBi.toFixed(2)}</td><td class="unit">(Tấn)</td></tr>
            <tr class="hang"><td class="lbl">Trọng lượng hàng:</td><td class="val">${klHang.toFixed(2)}</td><td class="unit">(Tấn)</td></tr>
          </table>
        </td></tr></table>
        <table class="sign">
          <tr>
            <td class="sign-title">BÊN GIAO</td>
            <td class="sign-title">NGƯỜI CÂN</td>
            <td class="sign-title">BÊN NHẬN</td>
          </tr>
          <tr>
            <td class="sign-name">${e(p.Chu_rung || "")}</td>
            <td class="sign-name"></td>
            <td class="sign-name">${e(cfg.nguoi_nhan || cfg.nguoi_dai_dien || "")}</td>
          </tr>
        </table>`;
    },

    /** Xuất 1 file Word chứa tất cả phiếu cân — mỗi phiếu 1 trang A4 portrait. */
    async exportAllWord() {
      const data = this.rows.filter(r => Number(r.Trong_luong_bi) > 0);
      if (!data.length) {
        this.$q.notify({ type: "warning", message: "Chưa có dòng nào có trọng lượng bì để xuất", timeout: 5000 });
        return;
      }
      this.exportingWord = true;
      try {
        const body = data.map((p, i) => this.wordOnePhieuCan(p, i)).join("");
        const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/>${this.wordCss()}</head><body><div class="Section1">${body}</div></body></html>`;
        const blob = new Blob(["﻿" + html], { type: "application/msword;charset=utf-8" });
        const fileName = `PhieuCan_${(this.xuongXe || "XX").replace(/[^\p{L}\p{N}]+/gu, "_")}_T${this.thang}_${this.nam}.doc`;
        saveAs(blob, fileName);
        this.$q.notify({
          type: "positive",
          message: `Đã xuất ${data.length} phiếu cân vào 1 file Word`,
          timeout: 4000,
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({ type: "negative", message: "Lỗi xuất Word: " + (err.message || err), timeout: 6000 });
      } finally {
        this.exportingWord = false;
      }
    },
  },
};
</script>

<style scoped>
/* ===== Preview phiếu cân trên web (cũng là vùng in) ===== */
.print-area { background: #fff; }
.phieu-can {
  font-family: "Times New Roman", serif;
  color: #000;
  max-width: 760px;
  margin: 0 auto;
  border: 1px solid #ccc;
  padding: 20px 28px;
  background: #fff;
}
.phieu-can .ten-xuong {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.phieu-can .dia-chi {
  font-size: 12px;
  font-style: italic;
  text-align: center;
  margin-bottom: 10px;
}
.phieu-can .title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 3px;
  margin: 10px 0 4px;
}
.phieu-can .so-phieu {
  font-size: 13px;
  font-style: italic;
  text-align: center;
  margin-bottom: 16px;
}
.phieu-can .info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}
.phieu-can .info-table td {
  padding: 5px 6px;
  font-size: 13px;
  vertical-align: top;
}
.phieu-can .info-table td.lbl {
  font-weight: bold;
  width: 18%;
  white-space: nowrap;
}
.phieu-can .info-table td.val { width: 32%; }

/* Bảng cân: outer border bao 3 dòng tổng/bì/hàng, ở giữa trang */
.phieu-can .can-wrap {
  border: 1.5px solid #000;
  padding: 14px 32px;
  margin: 18px auto 4px auto;
  width: fit-content;
}
.phieu-can .can-inner {
  border-collapse: collapse;
  margin: 0 auto;
}
.phieu-can .can-inner td {
  padding: 8px 16px;
  font-size: 14px;
  vertical-align: middle;
}
.phieu-can .can-inner td.can-lbl {
  font-weight: bold;
  white-space: nowrap;
}
.phieu-can .can-inner td.can-val {
  text-align: center;
  font-weight: bold;
  min-width: 110px;
  padding-left: 32px;
  padding-right: 32px;
}
.phieu-can .can-inner td.can-unit {
  text-align: left;
  font-style: italic;
  min-width: 56px;
}
/* Dòng "Trọng lượng hàng" có gạch ngang phía trên (giống mẫu) */
.phieu-can .can-inner tr.hang td {
  border-top: 1px solid #000;
  padding-top: 12px;
}

.phieu-can .sign-table {
  width: 100%;
  margin-top: 28px;
  border-collapse: collapse;
}
.phieu-can .sign-table td {
  width: 33.3%;
  text-align: center;
  vertical-align: top;
  padding: 0 4px;
}
.phieu-can .sign-table .sign-title {
  font-weight: bold;
  text-transform: uppercase;
}
.phieu-can .sign-table .sign-space { height: 70px; }
.phieu-can .sign-table .sign-name {
  font-weight: bold;
  font-style: italic;
}

/* ===== Print ===== */
@media print {
  .no-print { display: none !important; }
  .q-page { padding: 0 !important; }
  .print-area { margin: 0; }
  .phieu-can {
    border: none;
    max-width: 100%;
    padding: 0;
    margin: 0;
  }
  .phieu-can .ten-xuong { font-size: 18pt; }
  .phieu-can .dia-chi { font-size: 11pt; }
  .phieu-can .title { font-size: 22pt; }
  .phieu-can .so-phieu { font-size: 12pt; }
  .phieu-can .info-table td { font-size: 13pt; padding: 4pt 6pt; }
  .phieu-can .can-wrap { padding: 12pt 28pt; margin: 14pt auto; }
  .phieu-can .can-inner td { font-size: 14pt; padding: 7pt 14pt; }
  .phieu-can .can-inner td.can-val { padding-left: 28pt; padding-right: 28pt; }
  .phieu-can .sign-table td { font-size: 13pt; }
  .phieu-can .sign-table .sign-space { height: 64pt; }
  @page { size: A4 portrait; margin: 15mm; }
}
</style>
