<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Chia xe theo đợt (từ ngày → đến ngày)</div>

    <!-- Toolbar: 3 dòng, mỗi dòng 4 cell width cố định để thẳng hàng -->
    <!-- Cells: A=140px (số), B=140px (số), C=280px (text/select), D=200px (button/chip) -->

    <!-- Dòng 1: Bộ lọc -->
    <div class="row q-gutter-md items-end q-mb-sm">
      <q-select v-model="thang" :options="thangOptions" emit-value map-options label="Tháng" filled dense style="width:140px" />
      <q-input v-model.number="nam" type="number" label="Năm" filled dense style="width:140px" />
      <q-select v-model="xuongXe" :options="xuongSelectOptions" emit-value map-options label="Xưởng xẻ *" filled dense style="width:280px" :error="!xuongXe" />
      <q-btn color="primary" icon="search" label="Tải KH chưa chia" @click="loadKH" :loading="loading" :disable="!xuongXe" style="width:200px" />
    </div>

    <!-- Dòng 2: Khoảng ngày -->
    <div class="row q-gutter-md items-end q-mb-sm">
      <q-input v-model="tuNgay" type="date" label="Từ ngày *" filled dense style="width:140px" :error="!tuNgay" />
      <q-input v-model="denNgay" type="date" label="Đến ngày *" filled dense style="width:140px" :error="!denNgay" />
      <q-input v-model="ngayLe" label="Ngày lễ (vd: 30/4, 1/5)" filled dense style="width:280px" />
      <div style="width:200px" class="flex items-center justify-center">
        <q-chip outline color="grey-8" icon="event_available" v-if="tuNgay && denNgay" class="q-ma-none">
          {{ workdaysInRange.length }} ngày làm việc
        </q-chip>
      </div>
    </div>

    <!-- Dòng 3: Tham số + Cách phân ngày + 2 nút -->
    <div class="row q-gutter-md items-end q-mb-md">
      <q-input v-model.number="dungSai" type="number" label="Dung sai ±(%)" filled dense style="width:140px" />
      <q-input v-model.number="minKlChuyen" type="number" label="KL min/chuyến" filled dense style="width:140px" />
      <div style="width:280px">
        <div class="text-caption text-grey-7 q-mb-xs">Cách phân ngày trong khoảng</div>
        <q-btn-toggle
          v-model="cachPhanNgay"
          :options="[
            { label: 'A: Liên tiếp', value: 'A' },
            { label: 'B: Rải đều', value: 'B' },
          ]"
          color="grey-4" text-color="black" toggle-color="primary" dense no-caps
        />
      </div>
      <q-btn color="primary" icon="directions_car" label="Chia xe đợt này" @click="chiaXe" :loading="chiaing" :disable="!coTheChia" style="width:200px" />
      <q-btn color="deep-orange" icon="save" label="Lưu DB" @click="luuVaoDB" :loading="saving" :disable="!phieu.length" style="width:200px" />
    </div>

    <!-- Danh sách xe (luôn hiển thị) -->
    <div class="q-mb-md">
      <div class="text-subtitle2 q-mb-xs">Danh sách xe</div>
      <div class="row q-col-gutter-sm items-center" v-for="(xe, i) in danhSachXe" :key="i">
        <div class="col-auto"><q-input v-model="xe.bien_so" label="Biển số" filled dense style="width:160px" /></div>
        <div class="col-auto"><q-input v-model.number="xe.m3" type="number" label="m³ (mặc định 30)" filled dense style="width:150px" /></div>
        <div class="col-auto">
          <q-btn flat round dense icon="remove_circle" color="negative" @click="danhSachXe.splice(i, 1)" v-if="danhSachXe.length > 1" />
        </div>
      </div>
      <q-btn flat dense icon="add_circle" label="Thêm xe" color="primary" class="q-mt-xs" @click="danhSachXe.push({ bien_so: '', m3: null })" />
    </div>

    <!-- Hint khi chưa load -->
    <q-banner v-if="!khList.length && !loading" class="bg-blue-1 text-blue-9 q-mb-md" rounded>
      <template v-slot:avatar><q-icon name="info" /></template>
      Bấm "Tải KH chưa chia" để xem danh sách hộ trong T{{ thang }}/{{ nam }}, sau đó tích chọn các hộ muốn chia.
    </q-banner>

    <!-- Grid KH chưa chia (chọn) -->
    <div v-if="khList.length" class="q-mb-md">
      <div class="text-subtitle2 q-mb-xs">
        Hộ chưa chia trong T{{ thang }}/{{ nam }} ({{ khList.length }} hộ)
        — đã chọn: <b>{{ selectedKH.length }}</b>
        <q-btn flat dense size="sm" color="primary" label="Chọn tất cả" @click="selectedKH = khList.map(k => k.ten_ho)" />
        <q-btn flat dense size="sm" color="grey-7" label="Bỏ chọn" @click="selectedKH = []" />
      </div>
      <dx-data-grid
        :data-source="khList"
        :show-borders="true"
        :column-auto-width="true"
        :selected-row-keys="selectedKH"
        @selection-changed="onSelectKH"
        key-expr="ten_ho"
        height="35vh"
      >
        <dx-selection mode="multiple" show-check-boxes-mode="always" />
        <dx-filter-row :visible="true" />
        <dx-column data-field="ten_ho" caption="Chủ rừng" :min-width="180" />
        <dx-column data-field="xa" caption="Xã" :width="120" />
        <dx-column data-field="thon" caption="Thôn" :width="120" />
        <dx-column data-field="tong_kl_go" caption="Tổng KL (m³)" data-type="number" format="#,##0.00" :width="120" />
        <dx-column data-field="so_lo" caption="Số lô" :width="70" />
        <dx-column data-field="cccd" caption="CCCD" :width="140" />
        <dx-summary>
          <dx-total-item column="ten_ho" summary-type="count" display-format="{0} hộ" />
          <dx-total-item column="tong_kl_go" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
        </dx-summary>
      </dx-data-grid>
    </div>

    <!-- Preview phiếu đã chia -->
    <div v-if="summary" class="row q-col-gutter-md q-mb-md">
      <div class="col-auto"><q-chip color="blue" text-color="white" icon="people">{{ summary.so_ho }} hộ</q-chip></div>
      <div class="col-auto"><q-chip color="teal" text-color="white" icon="receipt">{{ summary.so_phieu }} phiếu (STT từ {{ summary.stt_offset + 1 }})</q-chip></div>
      <div class="col-auto"><q-chip color="green" text-color="white" icon="straighten">{{ fmtNum(summary.tong_kl) }} m³</q-chip></div>
      <div class="col-auto"><q-chip outline color="grey-8">{{ workdaysInRange.length }} ngày làm việc trong khoảng</q-chip></div>
    </div>

    <dx-data-grid
      v-if="phieu.length"
      :data-source="phieu"
      :show-borders="true"
      :column-auto-width="true"
      key-expr="stt"
      height="45vh"
    >
      <dx-filter-row :visible="true" />
      <dx-column data-field="stt" caption="STT" :width="60" />
      <dx-column data-field="so_phieu_du_kien" caption="Số phiếu" :width="130" />
      <dx-column data-field="ten_ho" caption="Chủ rừng" :min-width="160" />
      <dx-column data-field="xe" caption="Xe" :width="110" />
      <dx-column caption="Chuyến" :width="70" :calculate-cell-value="r => r.chuyen_thu + '/' + r.so_chuyen_ho" />
      <dx-column data-field="khoi_luong" caption="KL (m³)" data-type="number" format="#,##0.00" :width="100" />
      <dx-column data-field="kl_tong_ho" caption="KL hộ" data-type="number" format="#,##0.00" :width="100" />
      <dx-column data-field="lo_go_tron" caption="Lô gỗ" :width="120" />
      <dx-summary>
        <dx-total-item column="stt" summary-type="count" display-format="{0} chuyến" />
        <dx-total-item column="khoi_luong" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
      </dx-summary>
    </dx-data-grid>

    <div v-if="!khList.length && !loading" class="text-center text-grey-5 q-mt-xl">
      Chọn Tháng / Năm / Xưởng → bấm "Tải KH chưa chia" để bắt đầu
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import xuongXeMixin from "../mixins/xuongXeMixin";
import {
  DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem, DxSelection,
} from "devextreme-vue/data-grid";

export default {
  mixins: [xuongXeMixin],
  components: { DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem, DxSelection },
  data() {
    return {
      thang: new Date().getMonth() + 1,
      nam: new Date().getFullYear(),
      xuongXe: "",
      thangOptions: Array.from({ length: 12 }, (_, i) => ({ label: "Tháng " + (i + 1), value: i + 1 })),
      khList: [],
      selectedKH: [],
      tuNgay: "", denNgay: "",
      dungSai: 10, minKlChuyen: 20, ngayLe: "",
      cachPhanNgay: "B",
      danhSachXe: [
        { bien_so: "19C-16601", m3: 30 },
        { bien_so: "19C-05899", m3: 30 },
        { bien_so: "19C-06609", m3: 30 },
      ],
      phieu: [], ton: [], summary: null,
      tenHoChiaActual: [],
      tonPartial: [],   // List { ten_ho, kl_ton } cho hộ chia một phần ở đợt cuối
      loading: false, chiaing: false, saving: false,
    };
  },
  computed: {
    coTheChia() {
      return this.xuongXe && this.tuNgay && this.denNgay && this.selectedKH.length > 0
        && this.workdaysInRange.length > 0;
    },
    workdaysInRange() {
      if (!this.tuNgay || !this.denNgay) return [];
      const holidays = this.parseNgayLe();
      const start = new Date(this.tuNgay);
      const end = new Date(this.denNgay);
      if (isNaN(start) || isNaN(end) || end < start) return [];
      const out = [];
      const cur = new Date(start);
      while (cur <= end) {
        if (cur.getDay() !== 0) {  // bỏ Chủ nhật
          const iso = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
          if (!holidays.has(iso)) out.push(iso);
        }
        cur.setDate(cur.getDate() + 1);
      }
      return out;
    },
  },
  async created() {
    await this.loadXuongXe();
    this.setDefaultDates();
  },
  watch: {
    thang() { this.setDefaultDates(); },
    nam() { this.setDefaultDates(); },
  },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    fmtNum(v) { return v == null ? "0.00" : Number(v).toFixed(2); },
    onSelectKH(e) { this.selectedKH = e.selectedRowKeys; },
    /** Set Từ ngày = đầu tháng, Đến ngày = cuối tháng theo (thang, nam) hiện chọn. */
    setDefaultDates() {
      if (!this.thang || !this.nam) return;
      const lastDay = new Date(this.nam, this.thang, 0).getDate();
      const mm = String(this.thang).padStart(2, "0");
      this.tuNgay = `${this.nam}-${mm}-01`;
      this.denNgay = `${this.nam}-${mm}-${String(lastDay).padStart(2, "0")}`;
    },
    parseNgayLe() {
      const out = new Set();
      (this.ngayLe || "").split(/[,;\n]+/).map(s => s.trim()).filter(Boolean).forEach(s => {
        let y, m, d;
        const m1 = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        const m2 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        const m3 = s.match(/^(\d{1,2})\/(\d{1,2})$/);
        if (m1) { y = +m1[1]; m = +m1[2]; d = +m1[3]; }
        else if (m2) { d = +m2[1]; m = +m2[2]; y = +m2[3]; }
        else if (m3) { d = +m3[1]; m = +m3[2]; y = this.nam; }
        else return;
        out.add(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
      });
      return out;
    },
    /** True nếu dateStr ("YYYY-MM-DD") là ngày cuối cùng của (thang, nam). */
    laNgayCuoiThang(dateStr, thang, nam) {
      if (!dateStr) return false;
      const parts = dateStr.split("-");
      if (parts.length !== 3) return false;
      const day = parseInt(parts[2]);
      const lastDay = new Date(nam, thang, 0).getDate();
      return day === lastDay;
    },

    /** Đợt cuối tháng: tự động đóng tháng — chuyển tất cả tồn (hộ da_chia=0 + hộ chia một phần) sang KH tháng sau. */
    async dongThangChuyenTon() {
      try {
        const { data } = await axios.post(`http://${this.host()}:2003/api/v1/chia-xe/chuyen-ton-cuoi-thang`, {
          thang: this.thang, nam: this.nam, xuong_xe: this.xuongXe,
          ton_partial: this.tonPartial || [],
        });
        if (data && data.meta && data.meta.success) {
          const partialMsg = (this.tonPartial && this.tonPartial.length)
            ? ` (gồm ${this.tonPartial.length} hộ chia một phần)` : "";
          this.$q.notify({
            type: "positive",
            message: `Đóng tháng: chuyển ${data.data.inserted} dòng tồn sang KH T${data.data.thang_moi}/${data.data.nam_moi}${partialMsg}, đánh dấu ${data.data.marked} hộ`,
            timeout: 6000,
          });
        } else {
          this.$q.notify({ type: "negative", message: (data && data.meta && data.meta.message) || "Lỗi chuyển tồn" });
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      }
    },

    async loadKH() {
      if (!this.xuongXe) return;
      this.loading = true;
      this.phieu = []; this.ton = []; this.summary = null; this.selectedKH = [];
      try {
        const { data } = await axios.get(`http://${this.host()}:2003/api/v1/chia-xe/kh-chua-chia`, {
          params: { thang: this.thang, nam: this.nam, xuong_xe: this.xuongXe },
        });
        if (data && data.meta && data.meta.success) {
          this.khList = (data.data || []).map(k => ({ ...k, so_lo: k.so_lo || 0 }));
          if (!this.khList.length) {
            this.$q.notify({ type: "warning", message: `Không có hộ nào chưa chia trong T${this.thang}/${this.nam}` });
          }
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      } finally {
        this.loading = false;
      }
    },
    async chiaXe() {
      // Validate ngày cùng tháng/năm
      const start = new Date(this.tuNgay);
      const end = new Date(this.denNgay);
      if (start.getMonth() + 1 !== this.thang || start.getFullYear() !== this.nam
        || end.getMonth() + 1 !== this.thang || end.getFullYear() !== this.nam) {
        this.$q.notify({ type: "negative", message: "Từ ngày & Đến ngày phải nằm trong T" + this.thang + "/" + this.nam });
        return;
      }
      if (!this.workdaysInRange.length) {
        this.$q.notify({ type: "negative", message: "Khoảng ngày không có ngày làm việc nào" });
        return;
      }

      this.chiaing = true;
      try {
        const xe = this.danhSachXe.filter(x => x.bien_so).map(x => ({ bien_so: x.bien_so.trim(), m3: x.m3 || 30 }));
        const { data } = await axios.post(`http://${this.host()}:2003/api/v1/chia-xe/phan-bo-dot`, {
          thang: this.thang, nam: this.nam, xuong_xe: this.xuongXe,
          xe, dung_sai: this.dungSai, min_kl_chuyen: this.minKlChuyen || 20,
          ten_ho_chon: this.selectedKH,
        });
        if (data && data.meta && data.meta.success) {
          const allPhieu = data.data.phieu;
          const allTon = data.data.ton || [];
          const W = this.workdaysInRange.length;
          const K = xe.length;
          const cap = 2 * K * W;
          const isDotCuoi = this.laNgayCuoiThang(this.denNgay, this.thang, this.nam);

          if (allPhieu.length > cap) {
            if (isDotCuoi) {
              // ===== ĐỢT CUỐI: cắt theo chuyến (không cắt cả hộ), KL thừa lưu tồn =====
              const phieuOk = allPhieu.slice(0, cap);
              const klDaChiaByHo = new Map();   // ten_ho -> kl đã chia trong phieuOk
              const klKhByHo = new Map();       // ten_ho -> kl gốc của hộ
              for (const p of allPhieu) {
                if (!klKhByHo.has(p.ten_ho)) klKhByHo.set(p.ten_ho, p.kl_tong_ho || 0);
              }
              for (const p of phieuOk) {
                klDaChiaByHo.set(p.ten_ho, (klDaChiaByHo.get(p.ten_ho) || 0) + p.khoi_luong);
              }
              // Tính tồn partial: hộ có kl_ton > 0
              const tonPartial = [];
              for (const [ten_ho, klKh] of klKhByHo.entries()) {
                const klChia = klDaChiaByHo.get(ten_ho) || 0;
                const klTon = Math.round((klKh - klChia) * 100) / 100;
                if (klTon > 0.01) tonPartial.push({ ten_ho, kl_ton: klTon });
              }
              this.phieu = phieuOk;
              this.tenHoChiaActual = Array.from(new Set(phieuOk.map(p => p.ten_ho)));
              this.tonPartial = tonPartial;
              this.ton = allTon;
              this.summary = {
                so_ho: this.tenHoChiaActual.length,
                so_phieu: phieuOk.length,
                tong_kl: Math.round(phieuOk.reduce((s, r) => s + r.khoi_luong, 0) * 100) / 100,
                stt_offset: data.data.stt_offset,
              };
              this.$q.notify({
                type: "info",
                message: `Đợt cuối T${this.thang}: chia ${phieuOk.length}/${allPhieu.length} chuyến. ${tonPartial.length} hộ có KL thừa (${tonPartial.reduce((s, t) => s + t.kl_ton, 0).toFixed(2)} m³) → sẽ chuyển KH tháng sau khi Lưu DB.`,
                timeout: 8000,
              });
              return;
            }

            // ===== ĐỢT THƯỜNG: dialog hỏi (cắt cả hộ) =====
            const choice = await new Promise(resolve => {
              this.$q.dialog({
                title: "Vượt cap chia xe",
                message: `<b>${allPhieu.length}</b> chuyến > cap <b>${cap}</b> (= 2 chuyến/xe/ngày × ${K} xe × ${W} ngày).<br/><br/>
                  Bạn muốn xử lý thế nào?<br/>
                  • <b>Chia tiếp</b>: tăng lên 3+ chuyến/xe/ngày (vượt cap)<br/>
                  • <b>Dừng, lưu tồn</b>: chỉ chia ${cap} chuyến đầu; các hộ bị cắt giữa chừng không lưu, chia tiếp đợt sau`,
                html: true,
                persistent: true,
                cancel: { label: "Dừng, lưu tồn", color: "orange" },
                ok: { label: "Chia tiếp", color: "primary" },
              }).onOk(() => resolve("tiep"))
                .onCancel(() => resolve("ton"));
            });

            if (choice === "ton") {
              // Đợt thường: cắt nguyên hộ, hộ bị cắt giữ da_chia=0 cho đợt sau
              const phieuOk = [];
              const tenHoOk = new Set();
              const tenHoBoQua = new Set();
              for (const p of allPhieu) {
                if (tenHoBoQua.has(p.ten_ho)) continue;
                if (phieuOk.length + 1 > cap) {
                  tenHoBoQua.add(p.ten_ho);
                  tenHoOk.delete(p.ten_ho);
                  for (let i = phieuOk.length - 1; i >= 0; i--) {
                    if (phieuOk[i].ten_ho === p.ten_ho) phieuOk.splice(i, 1);
                  }
                  continue;
                }
                phieuOk.push(p);
                tenHoOk.add(p.ten_ho);
              }
              this.phieu = phieuOk;
              this.tenHoChiaActual = Array.from(tenHoOk);
              this.tonPartial = [];
              this.ton = allTon;
              this.summary = {
                so_ho: tenHoOk.size,
                so_phieu: phieuOk.length,
                tong_kl: Math.round(phieuOk.reduce((s, r) => s + r.khoi_luong, 0) * 100) / 100,
                stt_offset: data.data.stt_offset,
              };
              this.$q.notify({
                type: "info",
                message: `Đã cắt: chia ${phieuOk.length}/${allPhieu.length} chuyến (${tenHoOk.size}/${this.selectedKH.length} hộ). ${tenHoBoQua.size} hộ bị cắt sẽ chia đợt sau.`,
                timeout: 8000,
              });
              return;
            }
            // "Chia tiếp" → fall through
          }

          this.phieu = allPhieu;
          this.tenHoChiaActual = [...this.selectedKH];
          this.tonPartial = [];
          this.ton = allTon;
          this.summary = {
            so_ho: data.data.so_ho, so_phieu: data.data.so_phieu,
            tong_kl: data.data.tong_kl, stt_offset: data.data.stt_offset,
          };
        } else {
          this.$q.notify({ type: "negative", message: (data && data.meta && data.meta.message) || "Lỗi chia xe" });
        }
      } catch (err) {
        const detail = err.response && err.response.data && err.response.data.meta
          ? err.response.data.meta.message : (err.message || err);
        this.$q.notify({ type: "negative", message: String(detail), timeout: 6000 });
      } finally {
        this.chiaing = false;
      }
    },
    /** Phân bổ N chuyến vào workdaysInRange theo K chuyến/ngày (K=số xe). */
    phanBoNgayNhap(N) {
      const workdays = this.workdaysInRange;
      const W = workdays.length;
      const K = Math.max(1, this.danhSachXe.filter(x => x.bien_so).length);
      if (W === 0 || N === 0) return null;
      let perDayPlan = [];
      if (N <= K * W) {
        let remaining = N;
        while (remaining > 0) { perDayPlan.push(Math.min(K, remaining)); remaining -= K; }
      } else if (N <= 2 * K * W) {
        const extra = N - K * W;
        const days2K = Math.ceil(extra / K);
        const days1K = W - days2K;
        for (let i = 0; i < days1K; i++) perDayPlan.push(K);
        for (let i = 0; i < days2K; i++) perDayPlan.push(2 * K);
      } else {
        const base = Math.floor(N / W);
        const rem = N % W;
        for (let i = 0; i < W; i++) perDayPlan.push(base + (i < rem ? 1 : 0));
        this.$q.notify({ type: "warning", message: `Vượt 2 chuyến/xe/ngày, chia dồn.`, timeout: 6000 });
      }
      // Chọn ngày làm việc theo cách A (liên tiếp) hoặc B (rải đều khoảng từ-đến)
      const numSessions = perDayPlan.length;
      let chosenDays;
      if (this.cachPhanNgay === "B" && numSessions > 1 && numSessions < W) {
        const step = Math.floor(W / numSessions);
        chosenDays = [];
        for (let i = 0; i < numSessions; i++) {
          chosenDays.push(workdays[Math.min(W - 1, i * step)]);
        }
      } else {
        chosenDays = workdays.slice(0, numSessions);
      }

      const result = [];
      let phIdx = 0;
      for (let dayIdx = 0; dayIdx < numSessions; dayIdx++) {
        const dayIso = chosenDays[dayIdx];
        for (let k = 0; k < perDayPlan[dayIdx]; k++) {
          result[phIdx++] = `${dayIso}T09:00:00`;
        }
      }
      return result;
    },
    async luuVaoDB() {
      this.saving = true;
      try {
        // Round-robin xe (1 ngày các xe đều có chuyến)
        const byXe = new Map();
        this.phieu.forEach(p => {
          if (!byXe.has(p.xe)) byXe.set(p.xe, []);
          byXe.get(p.xe).push(p);
        });
        for (const q of byXe.values()) {
          q.sort((a, b) => (a.chuyen_thu || 0) - (b.chuyen_thu || 0));
        }
        const xeQueues = Array.from(byXe.values());
        const ordered = [];
        while (xeQueues.some(q => q.length > 0)) {
          for (const q of xeQueues) {
            if (q.length > 0) ordered.push(q.shift());
          }
        }

        // Phân ngày
        const ngayList = this.phanBoNgayNhap(ordered.length);
        if (!ngayList) {
          this.$q.notify({ type: "negative", message: "Không có ngày làm việc nào" });
          return;
        }
        const phieuToSave = ordered.map((p, i) => ({
          ...p,
          xuong_xe: p.xuong_xe || this.xuongXe,
          ngay_nhap: ngayList[i] || ngayList[ngayList.length - 1],
        }));

        const tenHoChia = (this.tenHoChiaActual && this.tenHoChiaActual.length)
          ? this.tenHoChiaActual : this.selectedKH;
        const { data } = await axios.post(`http://${this.host()}:2003/api/v1/chia-xe/luu-dot`, {
          phieu: phieuToSave,
          thang_chia: this.thang, nam_chia: this.nam,
          xuong_xe: this.xuongXe,
          ten_ho_chia: tenHoChia,
        });
        if (data && data.meta && data.meta.success) {
          this.$q.notify({
            type: "positive",
            message: `Đã lưu ${data.data.inserted} chuyến + đánh dấu ${data.data.kh_marked} hộ đã chia`,
            timeout: 5000,
          });

          // Đợt cuối tháng → tự động đóng tháng + chuyển tồn (gồm hộ chia một phần)
          if (this.laNgayCuoiThang(this.denNgay, this.thang, this.nam)) {
            await this.dongThangChuyenTon();
          }

          // Reload list KH chưa chia (loại bỏ các hộ vừa chia)
          this.phieu = []; this.ton = []; this.summary = null;
          this.tenHoChiaActual = [];
          this.tonPartial = [];
          this.loadKH();
        } else {
          this.$q.notify({ type: "negative", message: (data && data.meta && data.meta.message) || "Lỗi lưu", timeout: 6000 });
        }
      } catch (err) {
        const detail = err.response && err.response.data && err.response.data.meta
          ? err.response.data.meta.message : (err.message || err);
        this.$q.notify({ type: "negative", message: String(detail), timeout: 8000 });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
