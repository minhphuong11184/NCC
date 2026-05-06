<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Bảng công - Tự động nhận ca</div>

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
    <div v-if="rows.length" class="row q-col-gutter-sm q-mb-md">
      <div class="col-auto">
        <q-chip color="blue" text-color="white" icon="people">{{ uniqueUsers }} nhân viên</q-chip>
      </div>
      <div class="col-auto">
        <q-chip color="teal" text-color="white" icon="event">{{ rows.length }} ngày công</q-chip>
      </div>
      <div class="col-auto" v-if="soNgayTre > 0">
        <q-chip color="orange" text-color="white" icon="warning">{{ soNgayTre }} lượt đi trễ</q-chip>
      </div>
      <div class="col-auto" v-if="soNgayKhongCa > 0">
        <q-chip color="red" text-color="white" icon="help">{{ soNgayKhongCa }} lượt không nhận được ca</q-chip>
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
      <dx-column data-field="ca_ma" caption="Ca" :width="80">
        <dx-header-filter :data-source="caFilterItems" />
      </dx-column>
      <dx-column data-field="ca_ten" caption="Tên ca" :width="100" />
      <dx-column data-field="checkInStr" caption="Giờ vào" :width="80" />
      <dx-column data-field="checkOutStr" caption="Giờ ra" :width="80" />
      <dx-column data-field="ca_giovao_str" caption="Ca vào" :width="80" css-class="text-grey-6" />
      <dx-column data-field="ca_giora_str" caption="Ca ra" :width="80" css-class="text-grey-6" />
      <dx-column data-field="tre_phut" caption="Trễ (phút)" :width="90" data-type="number"
        :calculate-cell-value="r => r.tre_phut > 0 ? r.tre_phut : ''"
        css-class="text-orange" />
      <dx-column data-field="mealtime" caption="Nghỉ (phút)" :width="90" data-type="number"
        :calculate-cell-value="r => r.mealtime > 0 ? r.mealtime : ''" />
      <dx-column data-field="workMinutes" caption="Phút LV" :width="80" data-type="number" />
      <dx-column data-field="workHoursStr" caption="Giờ LV" :width="80" />
      <dx-column data-field="lamThem" caption="Làm thêm (phút)" :width="120" data-type="number"
        :calculate-cell-value="r => r.lamThem > 0 ? r.lamThem : ''"
        css-class="text-deep-purple" />
      <dx-column data-field="lamThemStr" caption="Làm thêm (giờ)" :width="110" />
      <dx-column data-field="punchCount" caption="Lượt quẹt" :width="80" />
      <dx-summary>
        <dx-total-item column="workDateStr" summary-type="count" display-format="{0} ngày công" />
        <dx-group-item column="workMinutes" summary-type="sum" display-format="LV: {0} phút" />
        <dx-group-item column="lamThem" summary-type="sum" display-format="Thêm: {0} phút" />
        <dx-group-item column="workDateStr" summary-type="count" display-format="{0} ngày" />
      </dx-summary>
    </dx-data-grid>

    <div v-if="!rows.length && !loading" class="text-center text-grey-5 q-mt-xl">
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
      rows: [],
    };
  },
  computed: {
    uniqueUsers() {
      return new Set(this.rows.map(r => r.userId)).size;
    },
    soNgayTre() {
      return this.rows.filter(r => r.tre_phut > 0).length;
    },
    soNgayKhongCa() {
      return this.rows.filter(r => !r.ca_ma).length;
    },
    caFilterItems() {
      const cas = [...new Set(this.rows.map(r => r.ca_ma).filter(Boolean))];
      return cas.map(c => ({ text: c, value: c }));
    },
  },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    fmtTime(min) {
      if (min === null || min === undefined) return "";
      return String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0");
    },
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
    fmtWorkHours(min) {
      if (!min || min < 5) return "";
      const h = Math.floor(min / 60);
      const m = min % 60;
      return h + "h" + (m > 0 ? String(m).padStart(2, "0") : "");
    },
    async load() {
      this.loading = true;
      try {
        const params = { fromDate: this.fromDate, toDate: this.toDate };
        if (this.filterUserId) params.userId = this.filterUserId.trim();
        const { data } = await axios.get(`http://${this.host()}:2003/api/v1/attendance/auto-ca`, { params });
        if (data && data.meta && data.meta.success) {
          this.rows = data.data.map((r, i) => ({
            ...r,
            _key: r.userId + '_' + r.workDate + '_' + i,
            workDateStr: this.fmtDate(r.workDate),
            checkInStr: this.fmtDateTime(r.checkIn),
            checkOutStr: r.workMinutes >= 5 ? this.fmtDateTime(r.checkOut) : "",
            ca_giovao_str: this.fmtTime(r.ca_giovao),
            ca_giora_str: this.fmtTime(r.ca_giora),
            workHoursStr: this.fmtWorkHours(r.workMinutes),
            lamThem: r.lamThem || 0,
            lamThemStr: r.lamThem > 0 ? this.fmtWorkHours(r.lamThem) : "",
          }));
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
        "Tên ca": r.ca_ten || "",
        "Giờ vào": r.checkInStr,
        "Giờ ra": r.checkOutStr,
        "Ca vào": r.ca_giovao_str,
        "Ca ra": r.ca_giora_str,
        "Trễ (phút)": r.tre_phut > 0 ? r.tre_phut : "",
        "Nghỉ (phút)": r.mealtime > 0 ? r.mealtime : "",
        "Phút LV": r.workMinutes,
        "Giờ LV": r.workHoursStr,
        "Làm thêm (phút)": r.lamThem > 0 ? r.lamThem : "",
        "Làm thêm (giờ)": r.lamThemStr,
        "Lượt quẹt": r.punchCount,
      }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(xlData), "Bảng công");
      const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([out]), "BangCong_AutoCa.xlsx");
    },
  },
};
</script>
