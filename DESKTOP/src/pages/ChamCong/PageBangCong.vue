<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-icon name="schedule" size="28px" color="blue-8" class="q-mr-sm" />
      <div class="text-h6 text-blue-8">Bảng công vào - ra</div>
    </div>

    <!-- Bộ lọc -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row q-gutter-md items-end">
          <div class="col-12 col-md-2">
            <div class="text-caption text-grey-7 q-mb-xs">Từ ngày</div>
            <q-input v-model="filter.fromDate" type="date" outlined dense />
          </div>
          <div class="col-12 col-md-2">
            <div class="text-caption text-grey-7 q-mb-xs">Đến ngày</div>
            <q-input v-model="filter.toDate" type="date" outlined dense />
          </div>
          <div class="col-12 col-md-2">
            <div class="text-caption text-grey-7 q-mb-xs">Mã chấm công</div>
            <q-input v-model="filter.userId" outlined dense clearable placeholder="Nhập mã CC..." />
          </div>
          <div class="col-auto">
            <q-btn color="blue-8" icon="search" label="Xem" :loading="loading" @click="loadData" />
          </div>
          <div class="col-auto">
            <q-btn color="green-7" icon="download" label="Xuất Excel" @click="exportExcel" :disable="!rows.length" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Thống kê -->
    <div v-if="rows.length" class="row q-gutter-sm q-mb-md">
      <q-chip icon="people" color="blue-8" text-color="white">
        {{ uniqueUsers }} nhân viên
      </q-chip>
      <q-chip icon="event_note" color="teal-7" text-color="white">
        {{ rows.length }} dòng
      </q-chip>
    </div>

    <!-- Bảng -->
    <q-card>
      <q-table
        :data="rows"
        :columns="columns"
        row-key="_key"
        :loading="loading"
        flat dense
        :pagination="{ rowsPerPage: 50 }"
        :filter="search"
      >
        <template v-slot:top-right>
          <q-input v-model="search" dense outlined placeholder="Tìm..." clearable>
            <template v-slot:prepend><q-icon name="search" /></template>
          </q-input>
        </template>

        <template v-slot:body-cell-checkIn="props">
          <q-td :props="props">
            <span class="text-positive text-bold">{{ formatTime(props.row.checkIn) }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-checkOut="props">
          <q-td :props="props">
            <span class="text-negative text-bold">{{ formatTime(props.row.checkOut) }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-workHours="props">
          <q-td :props="props">
            <q-chip dense size="sm"
              :color="props.row.workMinutes >= 480 ? 'positive' : props.row.workMinutes > 0 ? 'orange-7' : 'grey-5'"
              text-color="white">
              {{ formatHours(props.row.workMinutes) }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import { date } from "quasar";

export default {
  name: "PageBangCong",
  data() {
    return {
      loading: false,
      search: "",
      rows: [],
      filter: {
        fromDate: date.formatDate(new Date(), "YYYY-MM-DD"),
        toDate: date.formatDate(new Date(), "YYYY-MM-DD"),
        userId: "",
      },
      columns: [
        { name: "workDate", label: "Ngày", field: "workDate", align: "left",
          format: (val) => this.formatDate(val), sortable: true },
        { name: "userId", label: "Mã CC", field: "userId", align: "left", sortable: true },
        { name: "fullName", label: "Họ tên", field: "fullName", align: "left", sortable: true },
        { name: "checkIn", label: "Giờ vào", field: "checkIn", align: "center", sortable: true },
        { name: "checkOut", label: "Giờ ra", field: "checkOut", align: "center", sortable: true },
        { name: "workMinutes", label: "Số phút", field: "workMinutes", align: "center", sortable: true },
        { name: "workHours", label: "Số giờ", field: "workMinutes", align: "center", sortable: true },
        { name: "punchCount", label: "Số lần quẹt", field: "punchCount", align: "center", sortable: true },
      ],
    };
  },
  computed: {
    uniqueUsers() {
      return new Set(this.rows.map((r) => r.userId)).size;
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    ...mapActions("prod", ["getAttendanceSummary"]),

    async loadData() {
      this.loading = true;
      this.rows = [];
      try {
        const params = {};
        if (this.filter.fromDate) params.fromDate = this.filter.fromDate;
        if (this.filter.toDate) params.toDate = this.filter.toDate;
        if (this.filter.userId) params.userId = this.filter.userId;
        const res = await this.getAttendanceSummary(params);
        this.rows = (res?.data || []).map((r, i) => ({
          ...r,
          _key: i,
          fullName: r.fullName || "",
        }));
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message, position: "top" });
      } finally {
        this.loading = false;
      }
    },

    formatDate(val) {
      if (!val) return "";
      const d = new Date(val);
      if (isNaN(d.getTime())) return "";
      const p = (n) => String(n).padStart(2, "0");
      return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
    },

    formatTime(val) {
      if (!val) return "—";
      const d = new Date(val);
      if (isNaN(d.getTime())) return "—";
      const p = (n) => String(n).padStart(2, "0");
      return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
    },

    formatHours(minutes) {
      if (!minutes) return "0h";
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return m > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
    },

    exportExcel() {
      if (!this.rows.length) return;
      let csv = "\uFEFF"; // BOM for UTF-8
      csv += "Ngày,Mã CC,Họ tên,Giờ vào,Giờ ra,Số phút,Số giờ,Số lần quẹt\n";
      this.rows.forEach((r) => {
        csv += `${this.formatDate(r.workDate)},${r.userId},"${r.fullName || ""}",${this.formatTime(r.checkIn)},${this.formatTime(r.checkOut)},${r.workMinutes || 0},${this.formatHours(r.workMinutes)},${r.punchCount}\n`;
      });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `bang-cong-${this.filter.fromDate}_${this.filter.toDate}.csv`;
      link.click();
    },
  },
};
</script>
