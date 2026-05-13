<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Danh sách Kế hoạch khai thác</div>

    <!-- Filter -->
    <div class="row q-col-gutter-md items-end q-mb-md">
      <div class="col-auto">
        <q-select v-model="thang" :options="thangOptions" emit-value map-options label="Tháng" filled dense style="width:140px" />
      </div>
      <div class="col-auto">
        <q-select v-model="nam" :options="namOptions" emit-value map-options label="Năm" filled dense style="width:120px" />
      </div>
      <div class="col-auto">
        <q-select v-model="xuongXe" :options="xuongSelectOptions" emit-value map-options label="Xưởng xẻ" filled dense clearable style="min-width:280px" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="search" label="Tải dữ liệu" @click="load" :loading="loading" />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="directions_car" label="Sang Chia xe" @click="$router.push('/chia-xe-go-tron')" />
      </div>
    </div>

    <!-- Summary -->
    <div v-if="rows.length" class="row q-col-gutter-md q-mb-md">
      <div class="col-auto">
        <q-chip color="blue" text-color="white" icon="people">{{ rows.length }} hộ</q-chip>
      </div>
      <div class="col-auto">
        <q-chip color="green" text-color="white" icon="check_circle">{{ daChiaCount }} đã chia</q-chip>
      </div>
      <div class="col-auto">
        <q-chip color="orange" text-color="white" icon="pending">{{ rows.length - daChiaCount }} chưa chia</q-chip>
      </div>
      <div class="col-auto">
        <q-chip color="teal" text-color="white" icon="straighten">{{ fmtNum(tongKL) }} m³ tổng</q-chip>
      </div>
    </div>

    <!-- Grid -->
    <dx-data-grid
      v-if="rows.length"
      :data-source="rows"
      :show-borders="true"
      :column-auto-width="true"
      :allow-column-resizing="true"
      key-expr="ten_ho"
      height="65vh"
    >
      <dx-filter-row :visible="true" />
      <dx-column data-field="ten_ho" caption="Chủ rừng" :min-width="180" />
      <dx-column data-field="xa" caption="Xã" :width="120" />
      <dx-column data-field="thon" caption="Thôn" :width="120" />
      <dx-column data-field="xuong_xe" caption="Xưởng xẻ" :width="200" />
      <dx-column data-field="tong_kl_go" caption="Tổng KL (m³)" data-type="number" format="#,##0.00" :width="120" />
      <dx-column data-field="so_lo" caption="Số lô" data-type="number" :width="70" :calculate-cell-value="r => (r.lo_list || []).length" />
      <dx-column data-field="da_chia" caption="Đã chia" :width="100" alignment="center" cell-template="daChiaCell" />
      <dx-column data-field="ngay_chia" caption="Ngày chia" data-type="datetime" format="dd/MM/yyyy HH:mm" :width="140" />
      <dx-column data-field="so_hop_dong" caption="Số HĐ" :width="130" />
      <dx-column data-field="ngay_hop_dong" caption="Ngày HĐ" :width="100" />
      <dx-column data-field="so_bkls" caption="Số BKLS" :width="110" />
      <dx-column data-field="cccd" caption="CCCD" :width="140" />

      <template #daChiaCell="{ data }">
        <q-chip v-if="data.value === 1 || data.value === true" color="green" text-color="white" icon="check" dense size="sm">Đã chia</q-chip>
        <q-chip v-else color="orange" text-color="white" icon="pending" dense size="sm">Chưa</q-chip>
      </template>

      <dx-summary>
        <dx-total-item column="ten_ho" summary-type="count" display-format="{0} hộ" />
        <dx-total-item column="tong_kl_go" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
        <dx-total-item column="da_chia" summary-type="sum" display-format="Đã chia: {0}" />
      </dx-summary>
    </dx-data-grid>

    <div v-if="!rows.length && !loading" class="text-center text-grey-5 q-mt-xl">
      Chọn Tháng / Năm → Tải dữ liệu để xem danh sách KH
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import xuongXeMixin from "../mixins/xuongXeMixin";
import { DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem } from "devextreme-vue/data-grid";

export default {
  mixins: [xuongXeMixin],
  components: { DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem },
  data() {
    return {
      thang: new Date().getMonth() + 1,
      nam: new Date().getFullYear(),
      xuongXe: "",
      thangOptions: Array.from({ length: 12 }, (_, i) => ({ label: "Tháng " + (i + 1), value: i + 1 })),
      namOptions: (() => {
        const cur = new Date().getFullYear();
        return Array.from({ length: 6 }, (_, i) => {
          const y = cur - 2 + i;
          return { label: String(y), value: y };
        });
      })(),
      rows: [],
      loading: false,
    };
  },
  computed: {
    daChiaCount() {
      return this.rows.filter(r => r.da_chia === 1 || r.da_chia === true).length;
    },
    tongKL() {
      return this.rows.reduce((s, r) => s + (Number(r.tong_kl_go) || 0), 0);
    },
  },
  async created() { await this.loadXuongXe(); },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    fmtNum(v) { return v == null ? "0.00" : Number(v).toFixed(2); },
    async load() {
      this.loading = true;
      try {
        const params = { thang: this.thang, nam: this.nam };
        if (this.xuongXe) params.xuong_xe = this.xuongXe;
        const { data } = await axios.get(`http://${this.host()}:2003/api/v1/hop-dong/danh-sach`, { params });
        if (data && data.meta && data.meta.success) {
          this.rows = data.data || [];
          if (!this.rows.length) {
            this.$q.notify({ type: "warning", message: `Không có KH tháng ${this.thang}/${this.nam}` });
          }
        } else {
          this.$q.notify({ type: "negative", message: "Lỗi tải dữ liệu" });
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
