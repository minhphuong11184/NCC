<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Import phiếu nhập kho từ Excel Woodsland</div>
    <div class="text-caption text-grey-7 q-mb-md">
      Mỗi lần lưu sẽ xóa toàn bộ dữ liệu cùng tháng/năm/NCC đã import trước đó.
      File Excel cần có header ở dòng đầu với các cột:
      <b>SOPHIEU, MAKHO, NHOMSP, BIENSOXE, CREATED_AT,
      DAY, RONG, CAO, SOBO, SOTHANH_BO, KL_M3</b>
      (KL_M3 có thể để trống — sẽ tự tính từ DAY×RONG×CAO×SOBO×SOTHANH_BO/1e9).
    </div>

    <!-- Filter: tháng, năm, NCC -->
    <div class="row q-col-gutter-md items-end q-mb-md">
      <div class="col-auto">
        <q-select v-model="thang" :options="thangOptions" emit-value map-options
          label="Tháng" filled dense style="width:140px" />
      </div>
      <div class="col-auto">
        <q-input v-model.number="nam" type="number" label="Năm" filled dense style="width:100px" />
      </div>
      <div class="col-auto">
        <q-select v-model="mancc" :options="nccOptions" option-value="code" option-label="label"
          emit-value map-options label="Nhà cung cấp" filled dense style="min-width:300px"
          use-input @filter="filterNcc" />
      </div>
    </div>

    <!-- File picker + sheet + import -->
    <div class="row q-col-gutter-md items-end q-mb-md">
      <div class="col-auto">
        <q-file v-model="file" label="File Excel (.xlsx)" accept=".xlsx,.xls"
          filled dense style="width:340px" @input="onFile">
          <template v-slot:prepend><q-icon name="attach_file" /></template>
        </q-file>
      </div>
      <div class="col-auto">
        <q-select v-if="sheets.length" v-model="sheetName" :options="sheets"
          label="Sheet" filled dense style="min-width:200px" @input="parseSelectedSheet" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="cloud_upload" label="Lưu vào DB"
          :disable="!rows.length || !mancc || !thang || !nam"
          :loading="saving" @click="doImport" />
      </div>
      <div class="col-auto">
        <q-btn flat color="secondary" icon="link" label="Sang trang Ghép" to="/ghep-lo-go" />
      </div>
    </div>

    <div v-if="fileName" class="q-mb-sm text-grey-8">
      File: <b>{{ fileName }}</b> — sheet <b>{{ sheetName }}</b> — đã parse
      <b>{{ rows.length }}</b> dòng
      <span v-if="missingFields.length" class="text-orange-9">
        — Cảnh báo: thiếu cột {{ missingFields.join(", ") }}
      </span>
    </div>

    <!-- Tóm tắt các (tháng/năm/ncc) đã có trong DB -->
    <q-expansion-item v-if="summaryList.length" label="Đã import trước đó" icon="storage" dense
      class="q-mb-md bg-grey-2">
      <q-list bordered>
        <q-item v-for="s in summaryList" :key="s.thang+'-'+s.nam+'-'+s.mancc" dense>
          <q-item-section>
            T{{ s.thang }}/{{ s.nam }} — {{ s.mancc }} —
            <b>{{ s.so_dong }}</b> dòng / <b>{{ s.so_phieu }}</b> phiếu
            (lúc {{ fmtDateTime(s.imported_at) }})
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>

    <!-- Preview grid -->
    <dx-data-grid v-if="rows.length" :data-source="rows" :show-borders="true"
      :column-auto-width="true" :allow-column-resizing="true" height="60vh">
      <dx-filter-row :visible="true" />
      <dx-column data-field="SOPHIEU" caption="Số phiếu" :width="120" />
      <dx-column data-field="BIENSOXE" caption="Biển số xe" :width="120" />
      <dx-column data-field="CREATED_AT" caption="Ngày" data-type="date" format="dd/MM/yyyy" :width="100" />
      <dx-column data-field="MAKHO" caption="Mã kho" :width="80" />
      <dx-column caption="Tên kho" :width="160" :calculate-cell-value="r => khoTenFromCode(r.MAKHO)" />
      <dx-column data-field="NHOMSP" caption="Nhóm SP" :width="90" />
      <dx-column data-field="DAY" caption="Dày" :width="70" />
      <dx-column data-field="RONG" caption="Rộng" :width="70" />
      <dx-column data-field="CAO" caption="Dài" :width="70" />
      <dx-column data-field="SOBO" caption="Số bó" :width="70" />
      <dx-column data-field="SOTHANH_BO" caption="Thanh/bó" :width="80" />
      <dx-column data-field="KL_M3" caption="KL m³" data-type="number" format="#,##0.0000" :width="100" />
      <dx-summary>
        <dx-total-item column="SOPHIEU" summary-type="count" display-format="{0} dòng" />
        <dx-total-item column="KL_M3" summary-type="sum" value-format="#,##0.0000" display-format="Tổng: {0}" />
      </dx-summary>
    </dx-data-grid>

    <div v-else-if="!fileName" class="text-grey-5 text-center q-mt-xl">
      Chọn tháng, năm, NCC rồi chọn file Excel để xem trước
    </div>
  </q-page>
</template>

<script>
import XLSX from "xlsx";
import axios from "axios";
import khoMixin from "../mixins/khoMixin";
import {
  DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem,
} from "devextreme-vue/data-grid";

// Map nhãn cột (case-insensitive, normalized) → field
const FIELD_ALIASES = {
  SOPHIEU: ["sophieu", "so phieu", "so_phieu", "số phiếu"],
  MAKHO: ["makho", "ma kho", "ma_kho", "mã kho"],
  NHOMSP: ["nhomsp", "nhom sp", "nhom_sp", "nhóm sp"],
  BIENSOXE: ["biensoxe", "bien so xe", "bien_so_xe", "biển số xe", "biển số"],
  CREATED_AT: ["created_at", "createdat", "ngày", "ngay", "ngày tạo", "ngay_tao"],
  DAY: ["day", "dày", "dt_day"],
  RONG: ["rong", "rộng", "dt_rong"],
  CAO: ["cao", "dài", "dai", "dt_cao"],
  SOBO: ["sobo", "so_bo", "số bó", "so bo"],
  SOTHANH_BO: ["sothanh_bo", "sothanhbo", "thanh/bó", "so thanh bo", "số thanh/bó"],
  KL_M3: ["kl_m3", "klm3", "kl m3", "khối lượng m3", "khoi_luong_m3"],
};

const REQUIRED_FIELDS = ["SOPHIEU", "BIENSOXE", "CREATED_AT", "DAY", "RONG", "CAO"];

const normHeader = h => String(h || "").trim().toLowerCase().replace(/\s+/g, " ");

function buildHeaderMap(headerRow) {
  const map = {};
  if (!headerRow) return map;
  headerRow.forEach((h, idx) => {
    const norm = normHeader(h);
    if (!norm) return;
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      if (aliases.some(a => normHeader(a) === norm)) {
        if (map[field] === undefined) map[field] = idx;
        break;
      }
    }
  });
  return map;
}

const toStr = v => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
};
const toFloat = v => {
  if (v === null || v === undefined || v === "") return null;
  const n = parseFloat(String(v).replace(/,/g, "").trim());
  return isNaN(n) ? null : n;
};
const toDate = v => {
  if (v === null || v === undefined || v === "") return null;
  if (v instanceof Date && !isNaN(v)) return v.toISOString();
  const s = String(v).trim();
  // dd/mm/yyyy hoặc mm/dd/yyyy
  const m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (m) {
    let a = +m[1], b = +m[2], y = +m[3];
    if (y < 100) y += 2000;
    let dd, mm;
    if (a > 12) { dd = a; mm = b; }
    else if (b > 12) { mm = a; dd = b; }
    else { dd = a; mm = b; } // mặc định dd/mm
    const hh = +(m[4] || 0), mi = +(m[5] || 0), ss = +(m[6] || 0);
    const d = new Date(Date.UTC(y, mm - 1, dd, hh, mi, ss));
    return isNaN(d) ? null : d.toISOString();
  }
  // ISO hoặc các format khác
  const d = new Date(s);
  return isNaN(d) ? null : d.toISOString();
};

const FIELD_PARSERS = {
  SOPHIEU: toStr,
  MAKHO: toStr,
  NHOMSP: toStr,
  BIENSOXE: toStr,
  CREATED_AT: toDate,
  DAY: toFloat,
  RONG: toFloat,
  CAO: toFloat,
  SOBO: toFloat,
  SOTHANH_BO: toFloat,
  KL_M3: toFloat,
};

export default {
  mixins: [khoMixin],
  components: { DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem },
  data() {
    return {
      thang: new Date().getMonth() + 1,
      nam: new Date().getFullYear(),
      mancc: "",
      thangOptions: Array.from({ length: 12 }, (_, i) => ({ label: "Tháng " + (i + 1), value: i + 1 })),
      nccList: [],
      nccOptions: [],
      file: null,
      fileName: "",
      workbook: null,
      sheets: [],
      sheetName: null,
      rows: [],
      headerMap: {},
      missingFields: [],
      saving: false,
      summaryList: [],
    };
  },
  created() {
    this.loadNcc();
    this.loadSummary();
  },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    fmtDateTime(s) {
      if (!s) return "";
      const d = new Date(s);
      if (isNaN(d)) return s;
      return d.toLocaleString("vi-VN");
    },
    async loadNcc() {
      try {
        const { data } = await axios.get(`http://${this.host()}:2003/api/v1/ghep-lo-go/nha-cung-cap`);
        if (data && data.meta && data.meta.success) {
          this.nccList = data.data.map(n => ({
            code: n.code, name: n.name,
            label: n.code + " — " + n.name,
          }));
          this.nccOptions = this.nccList;
        }
      } catch (err) {
        console.error("Load NCC:", err);
      }
    },
    filterNcc(val, update) {
      update(() => {
        const needle = (val || "").toLowerCase();
        this.nccOptions = this.nccList.filter(n => n.label.toLowerCase().includes(needle));
      });
    },
    async loadSummary() {
      try {
        const { data } = await axios.get(`http://${this.host()}:2003/api/v1/ghep-lo-go/import-pnk-summary`);
        if (data && data.meta && data.meta.success) {
          this.summaryList = data.data || [];
        }
      } catch (err) {
        console.error("Load summary:", err);
      }
    },
    async onFile(file) {
      if (!file) { this.resetFile(); return; }
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
      if (!raw.length) { this.rows = []; return; }

      // Tìm dòng header: dòng đầu tiên có ít nhất 3 cột match được vào FIELD_ALIASES
      let headerRowIdx = 0;
      let bestMap = {};
      for (let i = 0; i < Math.min(raw.length, 5); i++) {
        const m = buildHeaderMap(raw[i]);
        if (Object.keys(m).length > Object.keys(bestMap).length) {
          bestMap = m;
          headerRowIdx = i;
        }
      }
      this.headerMap = bestMap;
      this.missingFields = REQUIRED_FIELDS.filter(f => bestMap[f] === undefined);

      const out = [];
      for (let i = headerRowIdx + 1; i < raw.length; i++) {
        const r = raw[i];
        if (!r) continue;
        const so = bestMap.SOPHIEU !== undefined ? toStr(r[bestMap.SOPHIEU]) : null;
        // Nếu không có SOPHIEU → bỏ
        if (!so) continue;
        const obj = {};
        for (const field of Object.keys(FIELD_PARSERS)) {
          const idx = bestMap[field];
          obj[field] = idx !== undefined ? FIELD_PARSERS[field](r[idx]) : null;
        }
        // Nếu chưa có KL_M3 → tính từ DAY*RONG*CAO*SOBO*SOTHANH_BO/1e9
        if (obj.KL_M3 === null) {
          const tongThanh = obj.SOBO > 0 && obj.SOTHANH_BO > 0 ? obj.SOBO * obj.SOTHANH_BO : 0;
          if (obj.DAY && obj.RONG && obj.CAO && tongThanh) {
            obj.KL_M3 = (obj.DAY * obj.RONG * obj.CAO * tongThanh) / 1e9;
            obj.KL_M3 = Math.round(obj.KL_M3 * 10000) / 10000;
          }
        }
        out.push(obj);
      }
      this.rows = out;
    },
    async doImport() {
      if (!this.rows.length || !this.mancc || !this.thang || !this.nam) return;
      if (this.missingFields.length) {
        const ok = await this.confirmAsync(
          "File thiếu cột " + this.missingFields.join(", ") + ". Vẫn lưu?"
        );
        if (!ok) return;
      }
      try {
        this.saving = true;
        const { data } = await axios.post(
          `http://${this.host()}:2003/api/v1/ghep-lo-go/import-pnk`,
          {
            thang: this.thang,
            nam: this.nam,
            mancc: this.mancc,
            rows: this.rows,
          }
        );
        if (data && data.meta && data.meta.success) {
          this.$q.notify({
            type: "positive",
            message: `Đã lưu ${data.data.inserted} dòng (xóa ${data.data.deleted} dòng cũ) cho T${this.thang}/${this.nam} — ${this.mancc}`,
            timeout: 5000,
          });
          this.loadSummary();
        } else {
          this.$q.notify({
            type: "negative",
            message: "Lỗi: " + JSON.stringify(data && data.meta),
          });
        }
      } catch (err) {
        const detail = err.response && err.response.data && err.response.data.meta
          ? err.response.data.meta.message
          : (err.message || err);
        this.$q.notify({ type: "negative", message: "Lỗi lưu: " + detail, timeout: 8000 });
      } finally {
        this.saving = false;
      }
    },
    confirmAsync(msg) {
      return new Promise(resolve => {
        this.$q.dialog({
          title: "Xác nhận",
          message: msg,
          cancel: true,
          persistent: true,
        }).onOk(() => resolve(true)).onCancel(() => resolve(false));
      });
    },
    resetFile() {
      this.fileName = "";
      this.workbook = null;
      this.sheets = [];
      this.sheetName = null;
      this.rows = [];
      this.headerMap = {};
      this.missingFields = [];
    },
  },
};
</script>
