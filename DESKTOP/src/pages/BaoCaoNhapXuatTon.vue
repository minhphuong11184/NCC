<template>
  <q-page padding>
    <div class="text-h5 q-mb-md no-print">Báo cáo Nhập - Xuất - Tồn theo tháng</div>

    <!-- Filter -->
    <div class="row q-col-gutter-md items-end q-mb-md no-print">
      <div class="col-auto">
        <q-select v-model="nam" :options="namOptions" emit-value map-options label="Năm" filled dense style="width:120px" />
      </div>
      <div class="col-auto">
        <q-select
          v-model="xuongXe"
          :options="xuongOptions"
          emit-value map-options
          clearable
          label="Xưởng xẻ (để trống = tất cả)"
          filled dense style="min-width:280px"
        />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="search" label="Tải báo cáo" @click="load" :loading="loading" />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="file_download" label="Xuất Excel" @click="exportExcel" :disable="!rows.length" />
      </div>
    </div>

    <!-- Bảng báo cáo -->
    <dx-data-grid
      v-if="rows.length"
      :data-source="rowsFilled"
      :show-borders="true"
      :column-auto-width="false"
      key-expr="key"
      height="60vh"
    >
      <dx-column data-field="ky" caption="Tháng" :width="120" alignment="center" />
      <dx-column data-field="ton_dau_ky" caption="Tồn đầu kỳ (m³)" data-type="number" format="#,##0.00" :width="160" alignment="right" />
      <dx-column data-field="nhap" caption="Nhập (KH) (m³)" data-type="number" format="#,##0.00" :width="160" alignment="right" />
      <dx-column data-field="xuat" caption="Xuất (đã chia) (m³)" data-type="number" format="#,##0.00" :width="180" alignment="right" />
      <dx-column data-field="ton_cuoi_ky" caption="Tồn cuối kỳ (m³)" data-type="number" format="#,##0.00" :width="160" alignment="right" />
      <dx-summary>
        <dx-total-item column="nhap" summary-type="sum" value-format="#,##0.00" display-format="Tổng nhập: {0}" />
        <dx-total-item column="xuat" summary-type="sum" value-format="#,##0.00" display-format="Tổng xuất: {0}" />
      </dx-summary>
    </dx-data-grid>

    <div v-else-if="!loading" class="text-center text-grey-5 q-mt-xl no-print">
      Chọn năm + xưởng → bấm "Tải báo cáo"
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import xuongXeMixin from "../mixins/xuongXeMixin";
import {
  DxDataGrid, DxColumn, DxSummary, DxTotalItem,
} from "devextreme-vue/data-grid";

export default {
  mixins: [xuongXeMixin],
  components: { DxDataGrid, DxColumn, DxSummary, DxTotalItem },
  data() {
    return {
      nam: new Date().getFullYear(),
      xuongXe: "",
      loading: false,
      rows: [],
      namOptions: (() => {
        const cur = new Date().getFullYear();
        return Array.from({ length: 6 }, (_, i) => {
          const y = cur - 2 + i;
          return { label: String(y), value: y };
        });
      })(),
    };
  },
  computed: {
    xuongOptions() {
      return [{ label: "(Tất cả)", value: "" }, ...this.xuongSelectOptions];
    },
    /** Bảng đã fill đủ 12 tháng (kể cả tháng không có dữ liệu hiện 0). */
    rowsFilled() {
      const map = {};
      this.rows.forEach(r => { map[r.thang] = r; });
      const out = [];
      for (let m = 1; m <= 12; m++) {
        const r = map[m] || { thang: m, nam: this.nam, ton_dau_ky: 0, nhap: 0, xuat: 0, ton_cuoi_ky: 0 };
        out.push({
          ...r,
          key: `${this.nam}-${m}`,
          ky: `T${m}/${this.nam}`,
        });
      }
      return out;
    },
  },
  async created() {
    await this.loadXuongXe();
  },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    async load() {
      this.loading = true;
      try {
        const params = { nam: this.nam };
        if (this.xuongXe) params.xuong_xe = this.xuongXe;
        const { data } = await axios.get(
          `http://${this.host()}:2003/api/v1/phan-tich/nhap-xuat-ton`,
          { params }
        );
        if (data && data.meta && data.meta.success) {
          this.rows = data.data || [];
          if (!this.rows.length) {
            this.$q.notify({ type: "warning", message: "Chưa có dữ liệu cho năm này" });
          }
        } else {
          this.$q.notify({ type: "negative", message: JSON.stringify(data && data.meta) });
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      } finally {
        this.loading = false;
      }
    },
    async exportExcel() {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("NXT", {
        pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1 },
      });
      ws.columns = [
        { width: 12 }, { width: 16 }, { width: 16 }, { width: 18 }, { width: 16 },
      ];

      // Title
      ws.mergeCells("A1:E1");
      const t = ws.getCell("A1");
      t.value = `BÁO CÁO NHẬP - XUẤT - TỒN GỖ TRÒN NĂM ${this.nam}` + (this.xuongXe ? ` — XƯỞNG ${this.xuongXe}` : "");
      t.font = { name: "Times New Roman", size: 14, bold: true };
      t.alignment = { horizontal: "center", vertical: "middle" };
      ws.getRow(1).height = 28;

      // Header
      const hdr = ["Tháng", "Tồn đầu kỳ (m³)", "Nhập KH (m³)", "Xuất đã chia (m³)", "Tồn cuối kỳ (m³)"];
      const hRow = ws.getRow(3);
      hdr.forEach((h, i) => {
        const c = hRow.getCell(i + 1);
        c.value = h;
        c.font = { name: "Times New Roman", size: 11, bold: true };
        c.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } };
        c.border = { top: {style:"thin"}, bottom: {style:"thin"}, left: {style:"thin"}, right: {style:"thin"} };
      });
      hRow.height = 26;

      // Data
      let totalNhap = 0, totalXuat = 0;
      this.rowsFilled.forEach((r, idx) => {
        const row = ws.getRow(4 + idx);
        row.getCell(1).value = r.ky;
        row.getCell(2).value = r.ton_dau_ky;
        row.getCell(3).value = r.nhap;
        row.getCell(4).value = r.xuat;
        row.getCell(5).value = r.ton_cuoi_ky;
        for (let c = 1; c <= 5; c++) {
          const cell = row.getCell(c);
          cell.font = { name: "Times New Roman", size: 11 };
          cell.alignment = { horizontal: c === 1 ? "center" : "right", vertical: "middle" };
          cell.border = { top: {style:"thin"}, bottom: {style:"thin"}, left: {style:"thin"}, right: {style:"thin"} };
          if (c >= 2) cell.numFmt = "#,##0.00";
        }
        totalNhap += r.nhap || 0;
        totalXuat += r.xuat || 0;
      });

      // Total row
      const totalRow = ws.getRow(4 + 12);
      totalRow.getCell(1).value = "TỔNG";
      totalRow.getCell(3).value = totalNhap;
      totalRow.getCell(4).value = totalXuat;
      for (let c = 1; c <= 5; c++) {
        const cell = totalRow.getCell(c);
        cell.font = { name: "Times New Roman", size: 11, bold: true };
        cell.alignment = { horizontal: c === 1 ? "center" : "right", vertical: "middle" };
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF3CD" } };
        cell.border = { top: {style:"thin"}, bottom: {style:"thin"}, left: {style:"thin"}, right: {style:"thin"} };
        if (c >= 2) cell.numFmt = "#,##0.00";
      }

      const buf = await wb.xlsx.writeBuffer();
      const fname = `NXT_${this.nam}` + (this.xuongXe ? `_${this.xuongXe.replace(/[^\p{L}\p{N}]+/gu, "_")}` : "") + ".xlsx";
      saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), fname);
    },
  },
};
</script>
