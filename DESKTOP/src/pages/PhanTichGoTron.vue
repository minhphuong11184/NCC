<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Phân tích KH khai thác vs Thực nhập gỗ tròn</div>

    <!-- Tổng hợp -->
    <div v-if="tongHop.length" class="q-mb-lg">
      <div class="text-h6 q-mb-sm">Tổng hợp theo tháng</div>
      <div class="row q-col-gutter-md">
        <div v-for="(t, idx) in tongHop" :key="idx" class="col-auto">
          <q-card bordered class="q-pa-md" style="min-width:280px">
            <div class="text-subtitle1 text-bold">Tháng {{ t.thang }}/{{ t.nam }} ({{ t.source_sheet }})</div>
            <div>Số hộ KH: <b>{{ t.so_ho_kh }}</b></div>
            <div>Tổng KL kế hoạch: <b>{{ fmtNum(t.tong_kl_kh) }} m³</b></div>
            <div>Số chủ rừng đã nhập: <b>{{ t.so_chu_rung_nhap }}</b></div>
            <div>Tổng KL thực nhập: <b>{{ fmtNum(t.tong_kl_nhap) }} m³</b></div>
            <div :class="t.tong_kl_nhap >= t.tong_kl_kh ? 'text-positive' : 'text-negative'">
              Chênh lệch: <b>{{ fmtNum(t.tong_kl_nhap - t.tong_kl_kh) }} m³</b>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="row q-col-gutter-md items-center q-mb-md">
      <div class="col-auto">
        <q-select v-model="filterThang" :options="thangOptions" label="Tháng" filled dense emit-value map-options style="width:120px" @input="load" />
      </div>
      <div class="col-auto">
        <q-btn icon="file_download" label="Xuất Excel" color="secondary" @click="exportExcel" :disable="!soSanh.length" />
      </div>
    </div>

    <!-- Bảng so sánh chi tiết -->
    <div v-if="soSanh.length" class="q-mb-lg">
      <div class="text-h6 q-mb-sm">Chi tiết theo hộ gia đình</div>
      <dx-data-grid
        :data-source="soSanh"
        :show-borders="true"
        :column-auto-width="true"
        :allow-column-resizing="true"
        key-expr="stt"
        height="50vh"
      >
        <dx-filter-row :visible="true" />
        <dx-column data-field="stt" caption="STT" :width="50" />
        <dx-column data-field="ten_ho" caption="Tên hộ" />
        <dx-column data-field="xa" caption="Xã" :width="100" />
        <dx-column data-field="thang" caption="Tháng" :width="65" />
        <dx-column data-field="source_sheet" caption="Sheet" :width="80" />
        <dx-column data-field="kl_ke_hoach" caption="KL kế hoạch" data-type="number" format="#,##0.00" :width="110" />
        <dx-column data-field="kl_thuc_nhap" caption="KL thực nhập" data-type="number" format="#,##0.00" :width="110" />
        <dx-column data-field="chenh_lech" caption="Chênh lệch" data-type="number" format="#,##0.00" :width="100"
          :calculate-cell-value="rowCL"
          cell-template="clTemplate"
        />
        <dx-column data-field="trang_thai" caption="Trạng thái" :width="110" cell-template="ttTemplate" />
        <dx-column data-field="so_phieu_co_kl" caption="Số phiếu" :width="80" />
        <dx-column data-field="khoanh" caption="Khoảnh" :width="70" />
        <dx-column data-field="lo" caption="Lô" :width="60" />
        <dx-column data-field="dien_tich" caption="DT (ha)" data-type="number" format="#,##0.00" :width="80" />
        <dx-summary>
          <dx-total-item column="stt" summary-type="count" display-format="{0} hộ" />
          <dx-total-item column="kl_ke_hoach" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
          <dx-total-item column="kl_thuc_nhap" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
          <dx-total-item column="chenh_lech" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
        </dx-summary>

        <template #clTemplate="{ data }">
          <span :style="{ color: data.value >= 0 ? '#2e7d32' : '#c62828', fontWeight: 'bold' }">
            {{ data.value >= 0 ? '+' : '' }}{{ fmtNum(data.value) }}
          </span>
        </template>
        <template #ttTemplate="{ data }">
          <q-badge :color="ttColor(data.value)" :label="data.value" />
        </template>
      </dx-data-grid>
    </div>

    <!-- Ngoài KH -->
    <div v-if="ngoaiKH.length" class="q-mb-lg">
      <div class="text-h6 q-mb-sm text-orange-9">Chủ rừng có nhập nhưng KHÔNG có trong KH</div>
      <dx-data-grid
        :data-source="ngoaiKH"
        :show-borders="true"
        :column-auto-width="true"
        key-expr="ten_ho"
        height="30vh"
      >
        <dx-column data-field="ten_ho" caption="Chủ rừng" />
        <dx-column data-field="so_phieu" caption="Số phiếu" :width="80" />
        <dx-column data-field="tong_kl" caption="Tổng KL (m³)" data-type="number" format="#,##0.00" :width="120" />
        <dx-column data-field="ngay_nhap_dau" caption="Từ ngày" data-type="date" format="dd/MM/yyyy" :width="110" />
        <dx-column data-field="ngay_nhap_cuoi" caption="Đến ngày" data-type="date" format="dd/MM/yyyy" :width="110" />
        <dx-summary>
          <dx-total-item column="ten_ho" summary-type="count" display-format="{0} hộ" />
          <dx-total-item column="tong_kl" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
        </dx-summary>
      </dx-data-grid>
    </div>
  </q-page>
</template>

<script>
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import {
  DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem,
} from "devextreme-vue/data-grid";

export default {
  components: { DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem },
  data() {
    return {
      tongHop: [],
      soSanh: [],
      ngoaiKH: [],
      filterThang: null,
      thangOptions: [
        { label: "Tất cả", value: null },
        { label: "Tháng 9/2025", value: 9 },
        { label: "Tháng 10/2025", value: 10 },
      ],
    };
  },
  created() { this.load(); },
  methods: {
    async apiGet(path) {
      const token = this.$store.state.base.token || localStorage.getItem("token");
      const host = window.location.hostname || "127.0.0.1";
      const { data } = await axios.get(`http://${host}:2003/api/v1${path}`, {
        params: { token },
      });
      return data && data.data ? data.data : [];
    },
    async load() {
      const thangQ = this.filterThang ? `?thang=${this.filterThang}&nam=2025` : "";
      const [th, ss, nk] = await Promise.all([
        this.apiGet("/phan-tich/tong-hop"),
        this.apiGet("/phan-tich/so-sanh" + thangQ),
        this.apiGet("/phan-tich/ngoai-kh"),
      ]);
      this.tongHop = th;
      this.soSanh = ss;
      this.ngoaiKH = nk;
    },
    fmtNum(v) {
      if (v === null || v === undefined) return "0.00";
      return Number(v).toFixed(2);
    },
    rowCL(row) { return row.chenh_lech; },
    ttColor(v) {
      if (v === "Đúng KH") return "positive";
      if (v === "Chưa nhập") return "grey";
      if (v === "Nhập thiếu") return "negative";
      return "primary";
    },
    exportExcel() {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Tổng hợp
      const thData = this.tongHop.map(t => ({
        "Tháng": t.thang, "Năm": t.nam, "Sheet": t.source_sheet,
        "Số hộ KH": t.so_ho_kh, "Tổng KL KH": t.tong_kl_kh,
        "Số chủ rừng nhập": t.so_chu_rung_nhap, "Tổng KL nhập": t.tong_kl_nhap,
        "Chênh lệch": (t.tong_kl_nhap || 0) - (t.tong_kl_kh || 0),
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(thData), "Tổng hợp");

      // Sheet 2: Chi tiết
      const ctData = this.soSanh.map(r => ({
        "STT": r.stt, "Tên hộ": r.ten_ho, "Xã": r.xa,
        "Tháng": r.thang, "Sheet": r.source_sheet,
        "KL kế hoạch": r.kl_ke_hoach, "KL thực nhập": r.kl_thuc_nhap,
        "Chênh lệch": r.chenh_lech, "Trạng thái": r.trang_thai,
        "Số phiếu": r.so_phieu_co_kl, "Khoảnh": r.khoanh,
        "Lô": r.lo, "Diện tích": r.dien_tich,
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ctData), "Chi tiết so sánh");

      // Sheet 3: Ngoài KH
      if (this.ngoaiKH.length) {
        const nkData = this.ngoaiKH.map(r => ({
          "Chủ rừng": r.ten_ho, "Số phiếu": r.so_phieu,
          "Tổng KL (m³)": r.tong_kl,
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(nkData), "Ngoài KH");
      }

      const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([out]), "PhanTich_KH_vs_ThucNhap.xlsx");
    },
  },
};
</script>
