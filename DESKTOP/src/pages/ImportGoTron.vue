<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Import dữ liệu gỗ tròn từ Excel</div>

    <div class="row q-col-gutter-md items-center q-mb-md">
      <div class="col-auto">
        <q-file
          v-model="file"
          label="Chọn file Excel (.xlsx)"
          accept=".xlsx,.xls"
          filled
          dense
          style="width: 360px"
          @input="onFile"
        >
          <template v-slot:prepend><q-icon name="attach_file" /></template>
        </q-file>
      </div>

      <div class="col-auto">
        <q-select
          v-if="sheets.length"
          v-model="sheetName"
          :options="sheets"
          label="Sheet"
          filled
          dense
          style="min-width: 220px"
          @input="parseSelectedSheet"
        />
      </div>

      <div class="col-auto">
        <q-checkbox v-model="truncate" label="Xóa dữ liệu cũ trước khi import" />
      </div>

      <div class="col-auto">
        <q-btn
          color="primary"
          icon="cloud_upload"
          label="Import vào DB"
          :disable="!rows.length"
          :loading="importing"
          @click="doImport"
        />
      </div>
    </div>

    <div v-if="fileName" class="q-mb-sm text-grey-8">
      File: <b>{{ fileName }}</b> — sheet <b>{{ sheetName }}</b> — đã parse
      <b>{{ rows.length }}</b> dòng
    </div>

    <dx-data-grid
      v-if="rows.length"
      :data-source="rows"
      :show-borders="true"
      :column-auto-width="true"
      :allow-column-resizing="true"
      key-expr="So_phieu"
      height="60vh"
    >
      <dx-filter-row :visible="true" />
      <dx-column data-field="TT" caption="TT" :width="60" />
      <dx-column data-field="So_phieu" caption="Số phiếu" :width="110" />
      <dx-column data-field="Xuong_xe" caption="Xưởng xẻ" />
      <dx-column data-field="Chu_rung" caption="Chủ rừng" />
      <dx-column data-field="Xa" caption="Xã" />
      <dx-column data-field="Huyen" caption="Huyện" />
      <dx-column data-field="Ngay_nhap" caption="Ngày xuất" data-type="date" format="dd/MM/yyyy" />
      <dx-column data-field="Khoi_luong" caption="Khối lượng" data-type="number" format="#,##0.00" />
      <dx-column data-field="Xe" caption="Xe" />
      <dx-column data-field="Loai_go" caption="Loài gỗ" />
      <dx-column data-field="Lo_go" caption="Lô gỗ" />
      <dx-column data-field="So_chung_chi" caption="Số chứng chỉ" />
      <dx-column data-field="So_BKLS" caption="Số BKLS" />
      <dx-column data-field="Don_gia" caption="Đơn giá" data-type="number" format="#,##0" />
      <dx-column data-field="Go_xe_giao" caption="Gỗ xẻ giao" data-type="number" format="#,##0.00" />
      <dx-summary>
        <dx-total-item column="So_phieu" summary-type="count" display-format="{0} phiếu" />
        <dx-total-item column="Khoi_luong" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
      </dx-summary>
    </dx-data-grid>
  </q-page>
</template>

<script>
import XLSX from "xlsx";
import axios from "axios";
import {
  DxDataGrid,
  DxColumn,
  DxFilterRow,
  DxSummary,
  DxTotalItem,
} from "devextreme-vue/data-grid";

const COL_MAP = {
  TT: 0, Xuong_xe: 1, Chu_rung: 2, Xa: 3, Huyen: 4,
  Loai_go: 5, Lo_go: 6, Thang: 7, So_phieu: 8, Ngay_nhap: 9,
  Khoi_luong: 10, Xe: 11, So_chung_chi: 12, Hinh_thuc_xe: 13,
  Khoang: 14, Lo: 15, Dien_tich: 16, Nam: 17, Don_gia: 18,
  So_BKLS: 19, Go_xe_giao: 20,
};
const FORWARD_FILL = [
  "Xuong_xe","Chu_rung","Xa","Huyen","Loai_go","Lo_go",
  "Thang","So_chung_chi","Hinh_thuc_xe",
  "Khoang","Lo","Dien_tich","Nam","Don_gia","So_BKLS",
];

const toStr = (v) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};
const toFloat = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = parseFloat(String(v).replace(/,/g, "").trim());
  return isNaN(n) ? null : n;
};
const toInt = (v) => { const n = toFloat(v); return n === null ? null : Math.round(n); };
const parseThang = (v) => {
  if (v === null || v === undefined) return null;
  const m = String(v).match(/(\d+)/); return m ? parseInt(m[1], 10) : null;
};
const parseNgay = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (v instanceof Date && !isNaN(v)) return v.toISOString();
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return null;
  let a = +m[1], b = +m[2], y = +m[3];
  if (y < 100) y += 2000;
  let dd, mm;
  if (a > 12) { dd = a; mm = b; }
  else if (b > 12) { mm = a; dd = b; }
  else { mm = a; dd = b; }
  const d = new Date(Date.UTC(y, mm - 1, dd));
  return isNaN(d) ? null : d.toISOString();
};

export default {
  components: { DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem },
  data() {
    return {
      file: null,
      fileName: "",
      workbook: null,
      sheets: [],
      sheetName: null,
      rows: [],
      truncate: false,
      importing: false,
    };
  },
  methods: {
    async onFile(file) {
      if (!file) { this.reset(); return; }
      this.fileName = file.name;
      const buf = await file.arrayBuffer();
      this.workbook = XLSX.read(buf, { type: "array", cellDates: true });
      this.sheets = this.workbook.SheetNames;
      this.sheetName = this.sheets[0];
      this.parseSelectedSheet();
    },
    parseSelectedSheet() {
      if (!this.workbook || !this.sheetName) return;
      const ws = this.workbook.Sheets[this.sheetName];
      const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false });
      const last = {};
      const out = [];
      // Row 0: trống, Row 1: title, Row 2: header, data từ row 3
      for (let i = 3; i < raw.length; i++) {
        const r = raw[i];
        if (!r) continue;
        const soPhieu = toStr(r[COL_MAP.So_phieu]);
        if (!soPhieu) continue;
        const pick = (key, parser) => {
          let val = parser(r[COL_MAP[key]]);
          if ((val === null || val === "") && FORWARD_FILL.includes(key)) {
            val = last[key] !== undefined ? last[key] : null;
          }
          if (val !== null) last[key] = val;
          return val;
        };
        out.push({
          TT: toFloat(r[COL_MAP.TT]),
          Xuong_xe: pick("Xuong_xe", toStr),
          Chu_rung: pick("Chu_rung", toStr),
          Xa: pick("Xa", toStr),
          Huyen: pick("Huyen", toStr),
          Loai_go: pick("Loai_go", toStr),
          Lo_go: pick("Lo_go", toStr),
          Thang: pick("Thang", parseThang),
          So_phieu: soPhieu,
          Ngay_nhap: parseNgay(r[COL_MAP.Ngay_nhap]),
          Khoi_luong: toFloat(r[COL_MAP.Khoi_luong]),
          Xe: toStr(r[COL_MAP.Xe]),
          So_chung_chi: pick("So_chung_chi", toStr),
          Hinh_thuc_xe: pick("Hinh_thuc_xe", toStr),
          Khoang: pick("Khoang", toStr),
          Lo: pick("Lo", toStr),
          Dien_tich: pick("Dien_tich", toFloat),
          Nam: pick("Nam", toInt),
          Don_gia: pick("Don_gia", toFloat),
          So_BKLS: pick("So_BKLS", toStr),
          Go_xe_giao: toFloat(r[COL_MAP.Go_xe_giao]),
        });
      }
      this.rows = out;
    },
    async doImport() {
      const host = window.location.hostname || "127.0.0.1";
      try {
        this.importing = true;
        const { data } = await axios.post(
          `http://${host}:2003/api/v1/import-go-tron/import`,
          {
            rows: this.rows,
            truncate: this.truncate,
          }
        );
        if (data && data.meta && data.meta.success) {
          this.$q.notify({
            type: "positive",
            message: `Import thành công ${data.data.inserted} dòng${this.truncate ? " (đã xóa data cũ)" : ""}`,
            timeout: 4000,
          });
        } else {
          this.$q.notify({
            type: "negative",
            message: "Import lỗi: " + JSON.stringify(data && data.meta),
            timeout: 6000,
          });
        }
      } catch (err) {
        const detail = err.response && err.response.data && err.response.data.meta
          ? err.response.data.meta.messages
          : (err.message || err);
        this.$q.notify({ type: "negative", message: "Lỗi: " + JSON.stringify(detail), timeout: 10000 });
      } finally {
        this.importing = false;
      }
    },
    reset() {
      this.fileName = "";
      this.workbook = null;
      this.sheets = [];
      this.sheetName = null;
      this.rows = [];
    },
  },
};
</script>
