<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Nhập tồn gỗ tròn theo lô</div>

    <!-- Thanh công cụ -->
    <div class="row q-col-gutter-md items-end q-mb-md">
      <div class="col-auto">
        <q-select
          v-model="mancc"
          :options="nccOptions"
          option-value="code" option-label="label"
          emit-value map-options
          label="Xưởng xẻ" filled dense
          style="min-width:300px" use-input @filter="filterNcc"
        />
      </div>
      <div class="col-auto">
        <q-select v-model="thang" :options="thangOptions" emit-value map-options
          label="Tháng (kỳ ghép dùng tồn)" filled dense style="width:200px" />
      </div>
      <div class="col-auto">
        <q-input v-model.number="nam" type="number" label="Năm" filled dense style="width:110px" />
      </div>
      <div class="col-auto">
        <q-btn flat color="teal" icon="file_download" label="Tải file mẫu" @click="exportTemplate" />
      </div>
      <div class="col-auto">
        <q-file
          v-model="file"
          label="Chọn file Excel (.xlsx)"
          accept=".xlsx,.xls"
          filled dense style="width: 300px"
          @input="onFile"
        >
          <template v-slot:prepend><q-icon name="attach_file" /></template>
        </q-file>
      </div>
      <div class="col-auto">
        <q-btn flat color="secondary" icon="cloud_download" label="Tải tồn đã lưu" @click="loadTon" :loading="loading" />
      </div>
    </div>

    <div class="row q-col-gutter-md items-center q-mb-sm">
      <div class="col-auto">
        <q-btn color="green-7" icon="add" label="Thêm dòng" @click="addRow" />
      </div>
      <div class="col-auto">
        <q-checkbox v-model="truncate" label="Xóa tồn cũ của kỳ này trước khi lưu" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="save" label="Lưu vào DB"
          :disable="!rows.length || !mancc" :loading="saving" @click="doImport" />
      </div>
      <div class="col-auto text-grey-8" v-if="fileName">
        File: <b>{{ fileName }}</b> — <b>{{ rows.length }}</b> lô
      </div>
    </div>

    <dx-data-grid
      :data-source="rows"
      :show-borders="true"
      :column-auto-width="true"
      :allow-column-resizing="true"
      key-expr="_idx"
      height="62vh"
      @row-removed="reindex"
    >
      <dx-editing :allow-updating="true" :allow-deleting="true" mode="cell" />
      <dx-filter-row :visible="true" />
      <dx-column data-field="_idx" caption="STT" :width="60" :allow-editing="false" />
      <dx-column data-field="lo_go" caption="Mã lô gỗ tròn" :min-width="180" />
      <dx-column data-field="kl_con_lai_tron" caption="KL tồn gỗ tròn (m³)"
        data-type="number" format="#,##0.0000" :width="180" />
      <dx-column data-field="he_so" caption="Hệ số (tròn/xẻ)"
        data-type="number" format="#,##0.##" :width="140" />
      <dx-column data-field="kl_tron_goc" caption="KL gốc lô (tham chiếu)"
        data-type="number" format="#,##0.0000" :width="180" />
      <dx-column data-field="ghi_chu" caption="Ghi chú" :min-width="160" />
      <dx-summary>
        <dx-total-item column="_idx" summary-type="count" display-format="{0} lô" />
        <dx-total-item column="kl_con_lai_tron" summary-type="sum"
          value-format="#,##0.0000" display-format="Tổng tồn: {0}" />
      </dx-summary>
    </dx-data-grid>

    <q-banner v-if="!rows.length" class="bg-blue-1 text-blue-9 q-mt-md" rounded>
      Chọn xưởng + tháng/năm rồi: <b>Tải file mẫu</b> để điền và import, hoặc <b>Thêm dòng</b> nhập tay,
      hoặc <b>Tải tồn đã lưu</b> để sửa tồn hiện có. Tháng/Năm là kỳ ghép sẽ dùng phần tồn này.
    </q-banner>
  </q-page>
</template>

<script>
import XLSX from "xlsx";
import axios from "axios";
import { saveAs } from "file-saver";
import xuongXeMixin from "../mixins/xuongXeMixin";
import {
  DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem, DxEditing,
} from "devextreme-vue/data-grid";

const toStr = v => { if (v == null) return null; const s = String(v).trim(); return s === "" ? null : s; };
const toFloat = v => { if (v == null || v === "") return null; const n = parseFloat(String(v).replace(/,/g, "").trim()); return isNaN(n) ? null : n; };

export default {
  mixins: [xuongXeMixin],
  components: { DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem, DxEditing },
  data() {
    return {
      mancc: "",
      thang: new Date().getMonth() + 1,
      nam: new Date().getFullYear(),
      thangOptions: Array.from({ length: 12 }, (_, i) => ({ label: "Tháng " + (i + 1), value: i + 1 })),
      nccList: [],
      nccOptions: [],
      file: null,
      fileName: "",
      rows: [],
      truncate: true,
      loading: false,
      saving: false,
    };
  },
  async created() {
    await this.loadXuongXe();
    this.loadNcc();
  },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    /** Danh sách xưởng (emit mancc_woodsland — đồng bộ với trang Ghép Lô Gỗ). */
    loadNcc() {
      this.nccList = (this.danhSachXuong || [])
        .filter(x => x.mancc_woodsland && String(x.mancc_woodsland).trim())
        .map(x => {
          const code = String(x.mancc_woodsland).trim();
          return { code, name: x.ten, label: code + " — " + x.ten };
        });
      this.nccOptions = this.nccList;
    },
    filterNcc(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.nccOptions = this.nccList.filter(n => n.label.toLowerCase().includes(needle));
      });
    },
    reindex() {
      this.rows.forEach((r, i) => { r._idx = i + 1; });
    },
    addRow() {
      this.rows.push({
        _idx: this.rows.length + 1,
        lo_go: "",
        kl_con_lai_tron: 0,
        he_so: 2,
        kl_tron_goc: null,
        ghi_chu: null,
      });
    },
    async onFile(file) {
      if (!file) { this.fileName = ""; return; }
      this.fileName = file.name;
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, raw: false });
      // Header ở dòng index 3 (0-based), data từ dòng 4
      const out = [];
      for (let i = 4; i < raw.length; i++) {
        const r = raw[i]; if (!r) continue;
        const lo = toStr(r[1]); if (!lo) continue;
        if (lo.toLowerCase().includes("tổng") || lo.toLowerCase().includes("cộng")) continue;
        out.push({
          _idx: out.length + 1,
          lo_go: lo,
          kl_con_lai_tron: toFloat(r[2]) || 0,
          he_so: toFloat(r[3]) || 2,
          kl_tron_goc: toFloat(r[4]),
          ghi_chu: toStr(r[5]),
        });
      }
      this.rows = out;
      this.$q.notify({ type: "info", message: `Đọc ${out.length} lô từ file`, timeout: 2500 });
    },
    exportTemplate() {
      const aoa = [
        ["BẢNG NHẬP TỒN GỖ TRÒN THEO LÔ — Import vào hệ thống Ghép Lô Gỗ"],
        ["Hướng dẫn: Điền Mã lô gỗ tròn + KL tồn gỗ tròn (m³) + Hệ số (mặc định 2). Tháng/Năm/Xưởng chọn trên giao diện khi import."],
        [],
        ["STT", "Mã lô gỗ tròn", "KL tồn gỗ tròn (m³)", "Hệ số (tròn/xẻ)", "KL gốc lô (tham chiếu)", "Ghi chú"],
        [1, "FSC100%26-006 S05", 40, 2, 100, "VD: lô còn 40 m³ tròn chưa xẻ"],
        [2, "", 0, 2, null, ""],
        [3, "", 0, 2, null, ""],
      ];
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      ws["!cols"] = [
        { wch: 6 }, { wch: 26 }, { wch: 20 }, { wch: 16 }, { wch: 20 }, { wch: 30 },
      ];
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "TON_GO_TRON");
      const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([buf], { type: "application/octet-stream" }), "Mau_Nhap_Ton_Go_Tron.xlsx");
    },
    async loadTon() {
      if (!this.mancc) {
        this.$q.notify({ type: "warning", message: "Chọn xưởng trước" });
        return;
      }
      this.loading = true;
      try {
        const { data } = await axios.get(
          `http://${this.host()}:2003/api/v1/ton-lo-go/list`,
          { params: { thang: this.thang, nam: this.nam, mancc: this.mancc } }
        );
        if (data && data.meta && data.meta.success) {
          this.rows = (data.data.rows || []).map((r, i) => ({
            _idx: i + 1,
            lo_go: r.lo_go,
            kl_con_lai_tron: r.kl_con_lai_tron,
            he_so: r.he_so,
            kl_tron_goc: r.kl_tron_goc,
            ghi_chu: null,
          }));
          this.fileName = "";
          this.$q.notify({
            type: this.rows.length ? "positive" : "info",
            message: this.rows.length
              ? `Đã tải ${this.rows.length} lô tồn của T${this.thang}/${this.nam}`
              : `T${this.thang}/${this.nam} chưa có tồn đã lưu`,
            timeout: 3000,
          });
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: this.errMsg(err) });
      } finally {
        this.loading = false;
      }
    },
    async doImport() {
      if (!this.mancc) {
        this.$q.notify({ type: "warning", message: "Chọn xưởng trước khi lưu" });
        return;
      }
      this.saving = true;
      try {
        const payload = {
          thang: this.thang,
          nam: this.nam,
          mancc: this.mancc,
          truncate: this.truncate,
          rows: this.rows.map(r => ({
            lo_go: r.lo_go,
            kl_con_lai_tron: r.kl_con_lai_tron,
            he_so: r.he_so,
            kl_tron_goc: r.kl_tron_goc,
          })),
        };
        const { data } = await axios.post(
          `http://${this.host()}:2003/api/v1/ton-lo-go/import`,
          payload
        );
        if (data && data.meta && data.meta.success) {
          this.$q.notify({
            type: "positive",
            message: `Đã lưu ${data.data.upserted} lô tồn (xóa ${data.data.deleted} dòng cũ) cho T${this.thang}/${this.nam}`,
            timeout: 4000,
          });
        } else {
          this.$q.notify({ type: "negative", message: "Lỗi: " + JSON.stringify(data.meta), timeout: 6000 });
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: this.errMsg(err) });
      } finally {
        this.saving = false;
      }
    },
    errMsg(err) {
      const d = err && err.response && err.response.data;
      if (d && d.meta && d.meta.messages && d.meta.messages.message) return d.meta.messages.message;
      return (err && err.message) || "Lỗi không xác định";
    },
  },
};
</script>
