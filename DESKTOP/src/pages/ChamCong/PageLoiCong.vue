<template>
  <q-page padding>
    <div class="text-h5 q-mb-md text-red-8">
      <q-icon name="error_outline" class="q-mr-sm" />Danh sách lỗi công
    </div>
    <div class="text-caption text-grey-7 q-mb-md">
      Các ngày chỉ có giờ vào hoặc giờ ra (thiếu một chiều — thường do quên quẹt).
    </div>

    <!-- Filter -->
    <div class="row q-col-gutter-md items-end q-mb-md">
      <div class="col-auto">
        <q-input v-model="fromDate" type="date" label="Từ ngày" filled dense style="width:160px" />
      </div>
      <div class="col-auto">
        <q-input v-model="toDate" type="date" label="Đến ngày" filled dense style="width:160px" />
      </div>
      <div class="col-auto">
        <q-input v-model="filterUserId" label="Mã CC (để trống = tất cả)" filled dense style="width:200px" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="search" label="Xem" @click="load" :loading="loading" />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="file_download" label="Xuất Excel" @click="exportExcel" :disable="!rows.length" />
      </div>
    </div>

    <!-- Summary chips -->
    <div v-if="loaded" class="row q-col-gutter-sm q-mb-md">
      <div class="col-auto">
        <q-chip color="red" text-color="white" icon="error">{{ rows.length }} lượt lỗi công</q-chip>
      </div>
      <div class="col-auto">
        <q-chip color="blue" text-color="white" icon="people">{{ uniqueUsers }} nhân viên</q-chip>
      </div>
    </div>

    <!-- Data grid -->
    <dx-data-grid
      v-if="rows.length"
      :data-source="rows"
      :show-borders="true"
      :column-auto-width="true"
      :allow-column-resizing="true"
      :group-panel="{visible: true}"
      :row-alternation-enabled="true"
      key-expr="_key"
      height="65vh"
    >
      <dx-filter-row :visible="true" />
      <dx-header-filter :visible="true" />
      <dx-column data-field="fullName" caption="Họ tên" :group-index="0" />
      <dx-column data-field="userId" caption="Mã CC" :width="70" />
      <dx-column data-field="workDateStr" caption="Ngày" :width="100" sort-order="asc" />
      <dx-column data-field="ca_ma" caption="Ca" :width="90" />
      <dx-column data-field="vao1Str" caption="Vào ca 1" :width="80" />
      <dx-column data-field="ra1Str" caption="Ra ca 1" :width="80" />
      <dx-column data-field="vao2Str" caption="Vào ca 2" :width="80" css-class="bg-blue-1" />
      <dx-column data-field="ra2Str" caption="Ra ca 2" :width="80" css-class="bg-blue-1" />
      <dx-column data-field="loiText" caption="Lỗi" :width="160" css-class="text-red text-bold" />
      <dx-column data-field="punchCount" caption="Lượt quẹt" :width="80" />
      <dx-summary>
        <dx-total-item column="workDateStr" summary-type="count" display-format="{0} lượt lỗi" />
        <dx-group-item column="workDateStr" summary-type="count" display-format="{0} lượt" />
      </dx-summary>
    </dx-data-grid>

    <div v-if="!rows.length && loaded && !loading" class="text-center text-positive q-mt-xl">
      <q-icon name="check_circle" size="32px" /><br>Không có lỗi công nào trong khoảng đã chọn
    </div>
    <div v-if="!loaded && !loading" class="text-center text-grey-5 q-mt-xl">
      Chọn khoảng ngày rồi nhấn Xem
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  DxDataGrid, DxColumn, DxFilterRow, DxHeaderFilter,
  DxSummary, DxTotalItem, DxGroupItem,
} from "devextreme-vue/data-grid";

export default {
  components: { DxDataGrid, DxColumn, DxFilterRow, DxHeaderFilter, DxSummary, DxTotalItem, DxGroupItem },
  data() {
    return {
      fromDate: new Date().toISOString().slice(0, 8) + "01",
      toDate: new Date().toISOString().slice(0, 10),
      filterUserId: "",
      loading: false,
      loaded: false,
      rows: [],
    };
  },
  computed: {
    uniqueUsers() {
      return new Set(this.rows.map(r => r.userId)).size;
    },
  },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    fmtDateTime(dt) {
      if (!dt) return "";
      const d = new Date(dt);
      return String(d.getUTCHours()).padStart(2, "0") + ":" + String(d.getUTCMinutes()).padStart(2, "0");
    },
    fmtDate(dt) {
      if (!dt) return "";
      const d = new Date(dt);
      return String(d.getUTCDate()).padStart(2, "0") + "/" +
             String(d.getUTCMonth() + 1).padStart(2, "0") + "/" + d.getUTCFullYear();
    },
    async load() {
      this.loading = true;
      try {
        const params = { fromDate: this.fromDate, toDate: this.toDate };
        if (this.filterUserId) params.userId = this.filterUserId.trim();
        const { data } = await axios.get(`http://${this.host()}:2003/api/v1/attendance/auto-ca`, { params });
        if (data && data.meta && data.meta.success) {
          this.rows = data.data
            .filter(r => r.loi)   // chỉ giữ dòng lỗi công
            .map((r, i) => ({
              ...r,
              _key: r.userId + '_' + r.workDate + '_' + i,
              workDateStr: this.fmtDate(r.workDate),
              vao1Str: this.fmtDateTime(r.ca1_checkIn),
              ra1Str:  r.ca1_checkOut ? this.fmtDateTime(r.ca1_checkOut) : "",
              vao2Str: r.ca2_checkIn  ? this.fmtDateTime(r.ca2_checkIn)  : "",
              ra2Str:  r.ca2_checkOut ? this.fmtDateTime(r.ca2_checkOut) : "",
            }));
          this.loaded = true;
        } else {
          this.$q.notify({ type: "negative", message: "Lỗi: " + JSON.stringify(data.meta) });
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      } finally {
        this.loading = false;
      }
    },
    exportExcel() {
      const xlData = this.rows.map(r => ({
        "Mã CC": r.userId,
        "Họ tên": r.fullName,
        "Ngày": r.workDateStr,
        "Ca": r.ca_ma || "",
        "Vào ca 1": r.vao1Str,
        "Ra ca 1": r.ra1Str,
        "Vào ca 2": r.vao2Str,
        "Ra ca 2": r.ra2Str,
        "Lỗi": r.loiText || "",
        "Lượt quẹt": r.punchCount,
      }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(xlData), "Lỗi công");
      const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([out]), "LoiCong.xlsx");
    },
  },
};
</script>
