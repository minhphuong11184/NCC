<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Import Kế hoạch NGG từ Excel</div>

    <div class="row q-col-gutter-md items-center q-mb-md">
      <div class="col-auto">
        <q-file
          v-model="file"
          label="Chọn file Excel (.xls, .xlsx)"
          accept=".xlsx,.xls"
          filled dense style="width: 360px"
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
          filled dense style="min-width: 220px"
          @input="parseSheet"
        />
      </div>
      <div class="col-auto">
        <q-input v-model.number="thang" type="number" label="Tháng" filled dense style="width:100px" />
      </div>
      <div class="col-auto">
        <q-input v-model.number="nam" type="number" label="Năm" filled dense style="width:100px" />
      </div>
      <div class="col-auto">
        <q-select
          v-model="xuongXe"
          :options="xuongSelectOptions"
          emit-value map-options
          label="Xưởng xẻ"
          filled dense
          clearable
          style="min-width:240px"
        />
      </div>
      <div class="col-auto">
        <q-checkbox v-model="truncate" label="Xóa KH cũ trước khi import" />
      </div>
      <div class="col-auto">
        <q-checkbox v-model="laTonBanDau" label="Đây là KH tồn ban đầu" color="orange" />
      </div>
      <div class="col-auto" v-if="laTonBanDau">
        <q-input v-model.number="thangGoc" type="number" label="Tháng gốc tồn" filled dense style="width:130px" hint="VD: 3 (tồn từ T3)" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="cloud_upload" label="Import vào DB" :disable="!rows.length" :loading="importing" @click="doImport" />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="directions_car" label="Chia xe ngay" :disable="!imported" @click="$router.push('/chia-xe-go-tron')" />
      </div>
    </div>

    <div v-if="fileName" class="q-mb-sm text-grey-8">
      File: <b>{{ fileName }}</b> — sheet <b>{{ sheetName }}</b> — <b>{{ rows.length }}</b> hộ
    </div>

    <dx-data-grid
      v-if="rows.length"
      :data-source="rows"
      :show-borders="true"
      :column-auto-width="true"
      :allow-column-resizing="true"
      key-expr="_idx"
      height="60vh"
    >
      <dx-filter-row :visible="true" />
      <dx-column data-field="_idx" caption="STT" :width="50" />
      <dx-column data-field="lo_go_tron" caption="Lô gỗ tròn" :width="120" />
      <dx-column data-field="ten_ho" caption="Chủ rừng" />
      <dx-column data-field="xa" caption="Địa danh KT" :width="120" />
      <dx-column data-field="khoanh" caption="Khoảnh" :width="70" />
      <dx-column data-field="lo" caption="Lô" :width="60" />
      <dx-column data-field="dien_tich" caption="DT (ha)" data-type="number" format="#,##0.00" :width="80" />
      <dx-column data-field="nam_trong" caption="Năm trồng" :width="80" />
      <dx-column data-field="chung_chi" caption="Số CC Rừng" :width="120" />
      <dx-column data-field="nhom_chung_chi" caption="Nhóm CC" :width="120" />
      <dx-column data-field="kl_bang_ke" caption="KL bảng kê" data-type="number" format="#,##0.00" :width="100" />
      <dx-column data-field="kl_go" caption="KL thực tế" data-type="number" format="#,##0.00" :width="100" />
      <dx-column data-field="don_gia" caption="Đơn giá" data-type="number" format="#,##0" :width="100" />
      <dx-column data-field="so_bkls" caption="Số BKLS" :width="110" />
      <dx-column data-field="cccd" caption="CCCD" />
      <dx-summary>
        <dx-total-item column="_idx" summary-type="count" display-format="{0} hộ" />
        <dx-total-item column="kl_bang_ke" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
        <dx-total-item column="kl_go" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
      </dx-summary>
    </dx-data-grid>
  </q-page>
</template>

<script>
import XLSX from "xlsx";
import axios from "axios";
import xuongXeMixin from "../mixins/xuongXeMixin";
import {
  DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem,
} from "devextreme-vue/data-grid";

const toStr = v => { if (v == null) return null; const s = String(v).trim(); return s === "" ? null : s; };
const toFloat = v => { if (v == null || v === "") return null; const n = parseFloat(String(v).replace(/,/g, "").trim()); return isNaN(n) ? null : n; };
const toInt = v => { const n = toFloat(v); return n == null ? null : Math.round(n); };

export default {
  mixins: [xuongXeMixin],
  components: { DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem },
  async created() {
    await this.loadXuongXe();
  },
  data() {
    return {
      file: null,
      fileName: "",
      workbook: null,
      sheets: [],
      sheetName: null,
      rows: [],
      thang: 1,
      nam: 2026,
      xuongXe: "",
      truncate: true,
      laTonBanDau: false,
      thangGoc: null,
      importing: false,
      imported: false,
    };
  },
  methods: {
    async onFile(file) {
      if (!file) { this.reset(); return; }
      this.fileName = file.name;
      this.imported = false;
      const buf = await file.arrayBuffer();
      this.workbook = XLSX.read(buf, { type: "array", cellDates: true });
      this.sheets = this.workbook.SheetNames;
      this.sheetName = this.sheets[0];
      this.parseSheet();
    },
    parseSheet() {
      if (!this.workbook || !this.sheetName) return;
      const ws = this.workbook.Sheets[this.sheetName];
      const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false });

      /**
       * File Mẫu KH NGG mới (mau_20260428):
       * Row 0: title "KẾ HOẠCH NGG"
       * Row 1: trống
       * Row 2: header
       * Row 3: sub-header (tọa độ KD/VD)
       * Row 4+: data
       *
       * [0]  TT
       * [1]  Lô Gỗ Tròn
       * [2]  Lô Gỗ Xẻ
       * [3]  Chủ rừng
       * [4]  Địa danh khai thác
       * [5]  Địa chỉ theo CCCD
       * [6]  Số CCCD chủ rừng
       * [7]  Số Chứng Chỉ Rừng              ← MỚI
       * [8]  Tên Nhóm chứng chỉ rừng        ← MỚI
       * [9]  Khoảnh Rừng
       * [10] Lô Rừng
       * [11] Diện tích lô rừng
       * [12] Năm trồng
       * [13] KL Gỗ Bảng Kê Lâm Sản
       * [14] KL gỗ Thực tế về xưởng
       * [15] Số Bảng kê lâm sản
       * [16] Ngày Bảng kê lâm sản
       * [17] Kinh độ
       * [18] Vĩ độ
       * [19] Đơn Giá gỗ Tròn
       * [20] Thành tiền
       */
      const out = [];
      for (let i = 4; i < raw.length; i++) {
        const r = raw[i]; if (!r) continue;
        const tenHo = toStr(r[3]); if (!tenHo) continue;
        if (tenHo.toLowerCase().includes("tổng") || tenHo.toLowerCase().includes("cộng")) continue;

        out.push({
          _idx: out.length + 1,
          lo_go_tron: toStr(r[1]),
          lo_go_xe: toStr(r[2]),
          ten_ho: tenHo,
          xa: toStr(r[4]),
          dia_chi_cccd: toStr(r[5]),
          cccd: toStr(r[6]),
          chung_chi: toStr(r[7]),
          nhom_chung_chi: toStr(r[8]),
          khoanh: toStr(r[9]),
          lo: toStr(r[10]),
          dien_tich: toFloat(r[11]),
          nam_trong: toInt(r[12]),
          kl_bang_ke: toFloat(r[13]),
          kl_go: toFloat(r[14]),
          so_bkls: toStr(r[15]),
          ngay_bkls: toStr(r[16]),
          KD: toStr(r[17]),
          VD: toStr(r[18]),
          don_gia: toFloat(r[19]),
          thanh_tien: toFloat(r[20]),
        });
      }
      this.rows = out;
    },
    async doImport() {
      const host = window.location.hostname || "127.0.0.1";
      this.importing = true;
      try {
        const ssheet = this.laTonBanDau ? "TON_BAN_DAU" : this.sheetName;
        const sfile = this.laTonBanDau
          ? (this.fileName + " (Tồn từ T" + (this.thangGoc || "?") + ")")
          : this.fileName;
        const payload = {
          rows: this.rows.map(r => ({
            ...r, thang: this.thang, nam: this.nam,
            source_sheet: ssheet, source_file: sfile,
            xuong_xe: this.xuongXe || null,
          })),
          truncate: this.truncate,
        };
        const { data } = await axios.post(
          `http://${host}:2003/api/v1/import-kh/import`,
          payload
        );
        if (data && data.meta && data.meta.success) {
          this.imported = true;
          this.$q.notify({
            type: "positive",
            message: `Import thành công ${data.data.inserted} hộ KH tháng ${this.thang}/${this.nam}`,
            timeout: 4000,
          });
        } else {
          this.$q.notify({ type: "negative", message: "Lỗi: " + JSON.stringify(data.meta), timeout: 6000 });
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
      this.fileName = ""; this.workbook = null; this.sheets = [];
      this.sheetName = null; this.rows = []; this.imported = false;
    },
  },
};
</script>
