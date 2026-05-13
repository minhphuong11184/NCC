<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Chia xe tự động từ KH khai thác</div>

    <!-- Params -->
    <div class="row q-col-gutter-md items-end q-mb-md">
      <div class="col-auto">
        <q-select v-model="thang" :options="thangOptions" emit-value map-options label="Tháng KH" filled dense style="width:160px" />
      </div>
      <div class="col-auto">
        <q-input v-model.number="nam" type="number" label="Năm" filled dense style="width:100px" />
      </div>
      <div class="col-auto">
        <q-select
          v-model="xuongXe"
          :options="xuongSelectOptions"
          emit-value map-options
          label="Xưởng xẻ *"
          filled dense style="min-width:280px"
          :error="!xuongXe"
          error-message="Bắt buộc chọn xưởng xẻ"
        />
      </div>
      <div class="col-auto">
        <q-input v-model.number="dungSai" type="number" label="Dung sai ±(%)" filled dense style="width:120px" />
      </div>
      <div class="col-auto">
        <q-input v-model.number="soChuyenMax" type="number" label="Giới hạn chuyến (0=hết)" filled dense style="width:180px" />
      </div>
      <div class="col-auto">
        <q-input v-model.number="minKlChuyen" type="number" label="KL min/chuyến (m³)" filled dense style="width:160px" hint="Cân lại nếu chuyến cuối < ngưỡng" />
      </div>
      <div class="col-auto">
        <q-input
          v-model="ngayLe"
          label="Ngày lễ (cách nhau dấu phẩy)"
          hint="VD: 30/4, 1/5, 2026-05-15"
          filled dense style="min-width:240px"
        />
      </div>
      <div class="col-auto">
        <div class="text-caption q-mb-xs">Cách phân ngày</div>
        <q-btn-toggle
          v-model="cachPhanNgay"
          :options="[
            { label: 'A: Liên tiếp đầu tháng', value: 'A' },
            { label: 'B: Rải đều cả tháng', value: 'B' },
          ]"
          color="grey-4" text-color="black" toggle-color="primary" dense
        />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="directions_car" label="Chia xe" @click="chiaXe" :loading="loading" :disable="!xuongXe" />
      </div>
      <div class="col-auto">
        <q-btn color="deep-orange" icon="save" label="Lưu vào DB" @click="luuVaoDB" :loading="saving" :disable="!phieu.length" />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="file_download" label="Xuất Excel" @click="exportExcel" :disable="!phieu.length" />
      </div>
    </div>

    <!-- Cảnh báo: (thang, nam, xưởng) đang chọn đã chia rồi -->
    <q-banner v-if="daChiaInfo && daChiaInfo.da_chia" class="bg-orange-2 text-orange-10 q-mb-md" rounded>
      <template v-slot:avatar><q-icon name="warning" /></template>
      Tháng {{ thang }}/{{ nam }} - xưởng <b>{{ xuongXe }}</b> đã chia xe rồi:
      <b>{{ daChiaInfo.so_phieu }}</b> phiếu / <b>{{ daChiaInfo.so_dong }}</b> dòng trong Nhập gỗ tròn
      <span v-if="daChiaInfo.so_ton > 0">
        + <b>{{ daChiaInfo.so_ton }}</b> dòng tồn ({{ fmtNum(daChiaInfo.tong_kl_ton) }} m³) đã chuyển sang KH tháng sau
      </span>.
      <b>Không cho chia lại</b>.
      <template v-slot:action>
        <q-btn flat color="negative" icon="restart_alt" label="Reset chia xe xưởng này"
          :loading="resetting" @click="resetChiaXe" />
      </template>
    </q-banner>

    <!-- Danh sách xe -->
    <div class="q-mb-md">
      <div class="text-subtitle2 q-mb-xs">Danh sách xe (để trống m³ = mặc định 30)</div>
      <div class="row q-col-gutter-sm items-center" v-for="(xe, i) in danhSachXe" :key="i">
        <div class="col-auto">
          <q-input v-model="xe.bien_so" label="Biển số xe" filled dense style="width:160px" />
        </div>
        <div class="col-auto">
          <q-input v-model.number="xe.m3" type="number" :label="'m³ (mặc định 30)'" filled dense style="width:150px" :placeholder="'30'" />
        </div>
        <div class="col-auto">
          <q-btn flat round dense icon="remove_circle" color="negative" @click="danhSachXe.splice(i, 1)" v-if="danhSachXe.length > 1" />
        </div>
      </div>
      <q-btn flat dense icon="add_circle" label="Thêm xe" color="primary" class="q-mt-xs" @click="danhSachXe.push({ bien_so: '', m3: null })" />
    </div>

    <!-- Summary -->
    <div v-if="summary" class="row q-col-gutter-md q-mb-md">
      <div class="col-auto">
        <q-chip color="blue" text-color="white" icon="people">{{ summary.so_ho }} hộ</q-chip>
      </div>
      <div class="col-auto">
        <q-chip color="teal" text-color="white" icon="receipt">{{ summary.so_phieu }} phiếu (chuyến xe)</q-chip>
      </div>
      <div class="col-auto">
        <q-chip color="green" text-color="white" icon="straighten">{{ fmtNum(summary.tong_kl) }} m³</q-chip>
      </div>
      <div class="col-auto" v-for="(xe, i) in summary.xe" :key="'xe'+i">
        <q-chip outline color="grey-8">{{ xe.bien_so }} ({{ xe.m3 }}m³): {{ countByXe(xe.bien_so) }} chuyến / {{ fmtNum(klByXe(xe.bien_so)) }} m³</q-chip>
      </div>
      <div class="col-auto" v-if="ton.length">
        <q-chip color="orange" text-color="white" icon="warning">TỒN: {{ ton.length }} hộ / {{ fmtNum(summary.tong_ton) }} m³</q-chip>
      </div>
    </div>

    <!-- Bảng phiếu đã chia -->
    <dx-data-grid
      v-if="phieu.length"
      :data-source="phieu"
      :show-borders="true"
      :column-auto-width="true"
      :allow-column-resizing="true"
      :group-panel="{visible: true}"
      key-expr="stt"
      height="50vh"
    >
      <dx-filter-row :visible="true" />
      <dx-column data-field="stt" caption="STT" :width="50" />
      <dx-column data-field="so_phieu_du_kien" caption="Số phiếu (dự kiến)" :width="130" />
      <dx-column data-field="ten_ho" caption="Chủ rừng" :group-index="0" />
      <dx-column data-field="xa" caption="Xã" :width="100" />
      <dx-column data-field="xe" caption="Xe" :width="110" />
      <dx-column caption="Chuyến" :width="70" :calculate-cell-value="r => r.chuyen_thu + '/' + r.so_chuyen_ho" />
      <dx-column data-field="khoi_luong" caption="KL chuyến (m³)" data-type="number" format="#,##0.00" :width="120" />
      <dx-column data-field="kl_tong_ho" caption="KL tổng hộ" data-type="number" format="#,##0.00" :width="100" />
      <dx-column data-field="khoanh" caption="Khoảnh" :width="70" />
      <dx-column data-field="lo" caption="Lô" :width="60" />
      <dx-column data-field="dien_tich" caption="DT (ha)" data-type="number" format="#,##0.00" :width="80" />
      <dx-column data-field="loai_cay" caption="Loài cây" :width="120" />
      <dx-summary>
        <dx-total-item column="stt" summary-type="count" display-format="{0} chuyến" />
        <dx-total-item column="khoi_luong" summary-type="sum" value-format="#,##0.00" display-format="Tổng: {0}" />
        <dx-group-item column="khoi_luong" summary-type="sum" value-format="#,##0.00" display-format="Tổng hộ: {0}" />
      </dx-summary>
    </dx-data-grid>

    <!-- Bảng tồn -->
    <div v-if="ton.length" class="q-mt-lg">
      <div class="text-h6 text-orange q-mb-sm">KH tồn chưa chia hết ({{ ton.length }} hộ - {{ fmtNum(tongTon) }} m³)</div>
      <dx-data-grid
        :data-source="ton"
        :show-borders="true"
        :column-auto-width="true"
        key-expr="ten_ho"
        height="30vh"
      >
        <dx-filter-row :visible="true" />
        <dx-column data-field="ten_ho" caption="Chủ rừng" />
        <dx-column data-field="xa" caption="Xã" :width="100" />
        <dx-column data-field="kl_kh" caption="KL KH" data-type="number" format="#,##0.00" :width="100" />
        <dx-column data-field="kl_da_chia" caption="Đã chia" data-type="number" format="#,##0.00" :width="100" />
        <dx-column data-field="kl_ton" caption="Tồn (m³)" data-type="number" format="#,##0.00" :width="100" cell-template="tonCell" />
        <dx-column data-field="khoanh" caption="Khoảnh" :width="70" />
        <dx-column data-field="lo" caption="Lô" :width="60" />
        <dx-column data-field="thang_goc" caption="Tháng gốc" :width="80" />
        <template #tonCell="{ data }">
          <span style="color: #e65100; font-weight: bold">{{ fmtNum(data.value) }}</span>
        </template>
        <dx-summary>
          <dx-total-item column="kl_ton" summary-type="sum" value-format="#,##0.00" display-format="Tổng tồn: {0}" />
          <dx-total-item column="kl_kh" summary-type="sum" value-format="#,##0.00" display-format="Tổng KH: {0}" />
        </dx-summary>
      </dx-data-grid>
    </div>
  </q-page>
</template>

<script>
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import xuongXeMixin from "../mixins/xuongXeMixin";
import {
  DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem, DxGroupItem,
} from "devextreme-vue/data-grid";

export default {
  mixins: [xuongXeMixin],
  components: { DxDataGrid, DxColumn, DxFilterRow, DxSummary, DxTotalItem, DxGroupItem },
  async created() {
    await this.loadXuongXe();
    this.checkDaChia();
  },
  watch: {
    thang() { this.checkDaChia(); },
    nam() { this.checkDaChia(); },
    xuongXe() { this.checkDaChia(); },
  },
  data() {
    return {
      thang: 1,
      nam: 2026,
      thangOptions: [
        { label: "Tất cả", value: null },
        ...Array.from({ length: 12 }, (_, i) => ({ label: "Tháng " + (i + 1), value: i + 1 })),
      ],
      dungSai: 10,
      soChuyenMax: 0,
      minKlChuyen: 20,
      ngayLe: "",
      cachPhanNgay: "B",
      xuongXe: "",
      daChiaInfo: null,
      resetting: false,
      danhSachXe: [
        { bien_so: "19C-16601", m3: 30 },
        { bien_so: "19C-05899", m3: 30 },
        { bien_so: "19C-06609", m3: 30 },
     
      ],
      loading: false,
      saving: false,
      phieu: [],
      ton: [],
      summary: null,
    };
  },
  computed: {
    tongTon() { return this.ton.reduce((s, t) => s + (t.kl_ton || 0), 0); },
  },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },

    async checkDaChia() {
      if (!this.thang || !this.nam || !this.xuongXe) { this.daChiaInfo = null; return null; }
      try {
        const { data } = await axios.get(
          `http://${this.host()}:2003/api/v1/chia-xe/da-chia`,
          { params: { thang: this.thang, nam: this.nam, xuong_xe: this.xuongXe } }
        );
        if (data && data.meta && data.meta.success) {
          this.daChiaInfo = data.data;
          return data.data;
        }
      } catch (err) { /* ignore */ }
      this.daChiaInfo = null;
      return null;
    },

    async chiaXe() {
      if (!this.xuongXe) {
        this.$q.notify({ type: "negative", message: "Vui lòng chọn xưởng xẻ", timeout: 4000 });
        return;
      }
      // Check trước: (thang, nam, xưởng) đã chia thì không cho chia lại
      const info = await this.checkDaChia();
      if (info && info.da_chia) {
        this.$q.notify({
          type: "negative",
          message: `Tháng ${this.thang}/${this.nam} - xưởng "${this.xuongXe}" đã chia xe rồi (${info.so_phieu} phiếu / ${info.so_dong} dòng). Không cho chia lại.`,
          timeout: 6000,
        });
        return;
      }

      this.loading = true;
      try {
        const xe = this.danhSachXe.filter(x => x.bien_so).map(x => ({ bien_so: x.bien_so.trim(), m3: x.m3 || 30 }));
        const { data } = await axios.post(
          `http://${this.host()}:2003/api/v1/chia-xe/phan-bo`,
          {
            thang: this.thang,
            nam: this.nam,
            xuong_xe: this.xuongXe,
            xe,
            dung_sai: this.dungSai,
            so_chuyen_max: this.soChuyenMax || null,
            min_kl_chuyen: this.minKlChuyen || 20,
          }
        );
        if (data && data.meta && data.meta.success) {
          const allPhieu = data.data.phieu;
          let allTon = data.data.ton || [];
          const W = this.danhSachNgayLamViec().length;
          const K = xe.length;
          const cap = 2 * K * W;

          if (allPhieu.length > cap) {
            // Vượt cap 2 chuyến/xe/ngày → hỏi user
            const choice = await new Promise(resolve => {
              this.$q.dialog({
                title: "Vượt cap chia xe",
                message: `<b>${allPhieu.length}</b> chuyến > cap <b>${cap}</b> (= 2 chuyến/xe/ngày × ${K} xe × ${W} ngày làm việc).<br/><br/>
                  Bạn muốn xử lý thế nào?<br/>
                  • <b>Chia tiếp</b>: tăng lên 3+ chuyến/xe/ngày (vượt cap)<br/>
                  • <b>Dừng, lưu tồn</b>: chỉ chia ${cap} chuyến đầu; các hộ bị cắt giữa chừng → chuyển sang KH tháng sau`,
                html: true,
                persistent: true,
                cancel: { label: "Dừng, lưu tồn", color: "orange" },
                ok: { label: "Chia tiếp", color: "primary" },
              }).onOk(() => resolve("tiep"))
                .onCancel(() => resolve("ton"));
            });

            if (choice === "ton") {
              // Cắt phieu trong cap; hộ bị cắt giữa chừng → đẩy vào ton
              const phieuOk = [];
              const tenHoOk = new Set();
              const tenHoBoQua = new Set();
              const hoInfo = new Map();  // ten_ho -> { kl_kh, info }
              for (const p of allPhieu) {
                if (!hoInfo.has(p.ten_ho)) hoInfo.set(p.ten_ho, { kl_kh: p.kl_tong_ho, info: p });
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
              // Tạo thêm dòng tồn cho các hộ bị cắt (chia 0, tồn toàn bộ KL)
              const tonAdd = Array.from(tenHoBoQua).map(name => {
                const v = hoInfo.get(name) || {};
                const info = v.info || {};
                return {
                  ten_ho: name, xa: info.xa, thon: info.thon,
                  kl_kh: v.kl_kh, kl_da_chia: 0, kl_ton: v.kl_kh,
                  khoanh: info.khoanh, lo: info.lo, dien_tich: info.dien_tich,
                  loai_cay: info.loai_cay, nam_trong: info.nam_trong,
                  cccd: info.cccd, chung_chi: info.chung_chi,
                  so_bkls: info.so_bkls, ngay_bkls: info.ngay_bkls,
                  thang_goc: info.thang, nam: info.nam,
                  lo_go_tron: info.lo_go_tron, lo_go_xe: info.lo_go_xe,
                  dia_chi_cccd: info.dia_chi_cccd, don_gia: info.don_gia,
                  KD: info.KD, VD: info.VD,
                  xuong_xe: info.xuong_xe, nhom_chung_chi: info.nhom_chung_chi,
                };
              });
              allTon = [...allTon, ...tonAdd];
              const tongKl = Math.round(phieuOk.reduce((s, r) => s + r.khoi_luong, 0) * 100) / 100;
              const tongTon = Math.round(allTon.reduce((s, t) => s + (t.kl_ton || 0), 0) * 100) / 100;
              this.phieu = phieuOk;
              this.ton = allTon;
              this.summary = {
                so_ho: tenHoOk.size, so_phieu: phieuOk.length,
                tong_kl: tongKl, xe: data.data.xe,
                tong_ton: tongTon, so_ho_ton: allTon.length,
              };
              this.$q.notify({
                type: "info",
                message: `Đã cắt: chia ${phieuOk.length}/${allPhieu.length} chuyến (${tenHoOk.size} hộ). ${tenHoBoQua.size} hộ bị cắt sẽ chuyển KH tháng sau.`,
                timeout: 8000,
              });
              return;
            }
            // "Chia tiếp" → fall through
          }

          this.phieu = allPhieu;
          this.ton = allTon;
          this.summary = {
            so_ho: data.data.so_ho, so_phieu: data.data.so_phieu,
            tong_kl: data.data.tong_kl, xe: data.data.xe,
            tong_ton: data.data.tong_ton, so_ho_ton: data.data.so_ho_ton,
          };
          if (this.ton.length) {
            this.$q.notify({
              type: "warning",
              message: `Còn tồn ${this.ton.length} hộ / ${this.fmtNum(data.data.tong_ton)} m³ chưa chia hết`,
              timeout: 5000,
            });
          }
        } else {
          this.$q.notify({
            type: "negative",
            message: (data && data.meta && data.meta.message) || JSON.stringify(data && data.meta),
            timeout: 6000,
          });
        }
      } catch (err) {
        const detail = err.response && err.response.data && err.response.data.meta
          ? err.response.data.meta.message : (err.message || err);
        this.$q.notify({ type: "negative", message: String(detail), timeout: 6000 });
      } finally {
        this.loading = false;
      }
    },

    async luuVaoDB() {
      this.saving = true;
      let savedPhieu = 0;
      let savedTon = 0;
      let tonThangMoi = null;
      try {
        // 1. Sort GLOBAL theo lô gỗ tròn tăng dần (numeric-aware), tiebreak chuyến thứ
        const ordered = [...this.phieu].sort((a, b) => {
          const la = (a.lo_go_tron || "~").toString();
          const lb = (b.lo_go_tron || "~").toString();
          const cmp = la.localeCompare(lb, "vi", { numeric: true, sensitivity: "base" });
          if (cmp !== 0) return cmp;
          return (a.chuyen_thu || 0) - (b.chuyen_thu || 0);
        });

        // 2. Lấy mã xưởng — ưu tiên parse từ so_phieu_du_kien backend đã set (vd "1/5-TV"),
        //    fallback xuongByTen, cuối cùng "TT"
        let maXuong = "TT";
        const sample = (ordered[0] && ordered[0].so_phieu_du_kien) || "";
        const m = sample.match(/-([^-/\s]+)\s*$/);
        if (m && m[1]) {
          maXuong = m[1];
        } else {
          const xuongObj = (this.xuongByTen && this.xuongByTen[this.xuongXe]) || {};
          if (xuongObj.ma) maXuong = String(xuongObj.ma).trim();
        }

        // 3. Re-STT theo thứ tự đã sort — số phiếu chạy lần lượt theo mã lô gỗ
        ordered.forEach((p, i) => {
          p.stt = i + 1;
          p.so_phieu_du_kien = `${i + 1}/${this.thang || ""}-${maXuong}`;
        });
        this.phieu = ordered;

        // 4. Phân bổ Ngay_nhap: K chuyến/ngày = số xe (mỗi xe 1 chuyến/ngày).
        // Nếu vượt → 2K chuyến/ngày (1 xe 2 chuyến/ngày).
        const ngayList = this.phanBoNgayNhap(this.phieu.length);
        if (!ngayList) {
          this.$q.notify({
            type: "negative",
            message: `Không có ngày làm việc nào trong tháng ${this.thang}/${this.nam} sau khi loại Chủ nhật + ngày lễ`,
            timeout: 6000,
          });
          return;
        }
        const phieuToSave = this.phieu.map((p, i) => ({
          ...p,
          xuong_xe: p.xuong_xe || this.xuongXe || null,
          ngay_nhap: ngayList[i],
        }));
        const { data } = await axios.post(
          `http://${this.host()}:2003/api/v1/chia-xe/luu`,
          {
            phieu: phieuToSave,
            thang_chia: this.thang,
            nam_chia: this.nam,
            xuong_xe: this.xuongXe,
          }
        );
        if (!(data && data.meta && data.meta.success)) {
          this.$q.notify({
            type: "negative",
            message: (data && data.meta && data.meta.message) || JSON.stringify(data && data.meta),
            timeout: 6000,
          });
          return;
        }
        savedPhieu = (data.data.inserted && data.data.inserted[0]) || data.data.inserted || 0;

        // 2. Nếu có tồn → lưu luôn vào KH_KHAI_THAC tháng sau
        if (this.ton.length) {
          const thangMoi = (this.thang || 0) + 1 > 12 ? 1 : (this.thang || 0) + 1;
          const namMoi = (this.thang || 0) + 1 > 12 ? this.nam + 1 : this.nam;
          tonThangMoi = `${thangMoi}/${namMoi}`;
          const tonRes = await axios.post(
            `http://${this.host()}:2003/api/v1/chia-xe/luu-ton`,
            {
              ton: this.ton,
              thang_moi: thangMoi,
              nam: namMoi,
              chia_thang: this.thang,
              chia_nam: this.nam,
            }
          );
          if (tonRes.data && tonRes.data.meta && tonRes.data.meta.success) {
            savedTon = (tonRes.data.data.inserted && tonRes.data.data.inserted[0])
              || tonRes.data.data.inserted || 0;
          } else {
            this.$q.notify({
              type: "warning",
              message: `Đã lưu phiếu nhưng LƯU TỒN LỖI: ${(tonRes.data && tonRes.data.meta && tonRes.data.meta.message) || ""}`,
              timeout: 8000,
            });
          }
        }

        const msg = [`Lưu T${this.thang}/${this.nam}: ${savedPhieu} phiếu`];
        if (savedTon) msg.push(`+ ${savedTon} tồn → KH T${tonThangMoi}`);
        this.$q.notify({ type: "positive", message: msg.join(" "), timeout: 5000 });

        this.checkDaChia();  // refresh banner
      } catch (err) {
        const detail = err.response && err.response.data && err.response.data.meta
          ? err.response.data.meta.message : (err.message || err);
        this.$q.notify({ type: "negative", message: String(detail), timeout: 10000 });
      } finally {
        this.saving = false;
      }
    },

    async resetChiaXe() {
      const info = this.daChiaInfo || {};
      const ok = await new Promise(resolve => {
        this.$q.dialog({
          title: "Xác nhận RESET chia xe",
          message: `Sẽ XÓA: ${info.so_phieu || 0} phiếu (${info.so_dong || 0} dòng) trong Nhập gỗ tròn `
            + `${info.so_ton ? `+ ${info.so_ton} dòng tồn (${this.fmtNum(info.tong_kl_ton)} m³) trong KH tháng sau` : ""}.\n\n`
            + `Sau khi reset có thể chia lại tháng ${this.thang}/${this.nam}. Tiếp tục?`,
          cancel: true,
          persistent: true,
          ok: { label: "Xóa", color: "negative" },
        }).onOk(() => resolve(true)).onCancel(() => resolve(false));
      });
      if (!ok) return;

      this.resetting = true;
      try {
        const { data } = await axios.post(
          `http://${this.host()}:2003/api/v1/chia-xe/reset`,
          { thang: this.thang, nam: this.nam, xuong_xe: this.xuongXe }
        );
        if (data && data.meta && data.meta.success) {
          this.$q.notify({
            type: "positive",
            message: `Đã reset T${this.thang}/${this.nam}: xóa ${data.data.deleted_phieu} dòng phiếu + ${data.data.deleted_ton} dòng tồn`,
            timeout: 5000,
          });
          // Xóa preview hiện tại + refresh banner
          this.phieu = [];
          this.ton = [];
          this.summary = null;
          this.checkDaChia();
        } else {
          this.$q.notify({
            type: "negative",
            message: (data && data.meta && data.meta.message) || JSON.stringify(data && data.meta),
            timeout: 6000,
          });
        }
      } catch (err) {
        const detail = err.response && err.response.data && err.response.data.meta
          ? err.response.data.meta.message : (err.message || err);
        this.$q.notify({ type: "negative", message: String(detail), timeout: 8000 });
      } finally {
        this.resetting = false;
      }
    },

    /**
     * Parse danh sách ngày lễ từ ô input. Hỗ trợ "30/4", "1/5/2026", "2026-05-15".
     * Trả về Set<string> dạng "YYYY-MM-DD".
     */
    parseNgayLe() {
      const out = new Set();
      const raw = (this.ngayLe || "").split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
      const Y = this.nam;
      raw.forEach(s => {
        let y, m, d;
        const m1 = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        const m2 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        const m3 = s.match(/^(\d{1,2})\/(\d{1,2})$/);
        if (m1) { y = +m1[1]; m = +m1[2]; d = +m1[3]; }
        else if (m2) { d = +m2[1]; m = +m2[2]; y = +m2[3]; }
        else if (m3) { d = +m3[1]; m = +m3[2]; y = Y; }
        else return;
        out.add(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
      });
      return out;
    },

    /**
     * Liệt kê các ngày làm việc trong (this.thang, this.nam): bỏ Chủ nhật + ngày lễ.
     */
    danhSachNgayLamViec() {
      const days = [];
      const holidays = this.parseNgayLe();
      const daysInMonth = new Date(this.nam, this.thang, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(this.nam, this.thang - 1, d);
        if (dt.getDay() === 0) continue; // bỏ Chủ nhật
        const iso = `${this.nam}-${String(this.thang).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        if (holidays.has(iso)) continue;
        days.push(iso);
      }
      return days;
    },

    /**
     * Phân bổ N chuyến vào các ngày làm việc theo quy tắc:
     * - Mỗi ngày = K chuyến (K = số xe) → tất cả xe đều chạy 1 chuyến/ngày
     * - Nếu N > K*W → một số ngày tăng lên 2K chuyến (mỗi xe 2 chuyến/ngày)
     * - Nếu N > 2*K*W → quá tải, chia đều có cảnh báo
     * Trả về mảng N phần tử dạng ISO date string "YYYY-MM-DDT09:00:00".
     */
    phanBoNgayNhap(N) {
      const workdays = this.danhSachNgayLamViec();
      const W = workdays.length;
      const xeList = this.danhSachXe.filter(x => x.bien_so);
      const K = Math.max(1, xeList.length);
      if (W === 0 || N === 0) return null;

      let perDayPlan = [];
      if (N <= K * W) {
        // Mỗi ngày K chuyến (mỗi xe 1 chuyến); ngày cuối có thể < K
        let remaining = N;
        while (remaining > 0) {
          perDayPlan.push(Math.min(K, remaining));
          remaining -= K;
        }
      } else if (N <= 2 * K * W) {
        // Vượt mức K/ngày → một số ngày 2K chuyến (mỗi xe 2 chuyến), còn lại K chuyến
        const extra = N - K * W;
        const days2K = Math.ceil(extra / K);
        const days1K = W - days2K;
        for (let i = 0; i < days1K; i++) perDayPlan.push(K);
        for (let i = 0; i < days2K; i++) perDayPlan.push(2 * K);
      } else {
        // Quá tải: chia đều base = ceil(N/W), cảnh báo
        const base = Math.floor(N / W);
        const rem = N % W;
        for (let i = 0; i < W; i++) perDayPlan.push(base + (i < rem ? 1 : 0));
        this.$q.notify({
          type: "warning",
          message: `${N} chuyến / ${W} ngày làm việc với ${K} xe — vượt 2 chuyến/xe/ngày, phải chia cao hơn.`,
          timeout: 7000,
        });
      }

      // Chọn ngày làm việc cho từng buổi theo cách A hoặc B
      const numSessions = perDayPlan.length;
      let chosenDays;
      if (this.cachPhanNgay === "B" && numSessions > 1 && numSessions < W) {
        // Mode B: rải đều cả tháng — step = floor(W/numSessions)
        const step = Math.floor(W / numSessions);
        chosenDays = [];
        for (let i = 0; i < numSessions; i++) {
          const idx = Math.min(W - 1, i * step);
          chosenDays.push(workdays[idx]);
        }
      } else {
        // Mode A (mặc định): liên tiếp từ ngày đầu
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

    fmtNum(v) { return v == null ? "0.00" : Number(v).toFixed(2); },
    countByXe(xe) { return this.phieu.filter(p => p.xe === xe).length; },
    klByXe(xe) { return this.phieu.filter(p => p.xe === xe).reduce((s, p) => s + p.khoi_luong, 0); },
    exportExcel() {
      const wb = XLSX.utils.book_new();

      const byXe = {};
      this.phieu.forEach(p => {
        if (!byXe[p.xe]) byXe[p.xe] = { so_chuyen: 0, tong_kl: 0 };
        byXe[p.xe].so_chuyen++;
        byXe[p.xe].tong_kl += p.khoi_luong;
      });
      const thXe = Object.entries(byXe).map(([xe, v]) => ({ "Biển số xe": xe, "Số chuyến": v.so_chuyen, "Tổng KL (m³)": v.tong_kl }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(thXe), "Tổng hợp xe");

      const ct = this.phieu.map(p => ({
        "STT": p.stt, "Xưởng xẻ": p.xuong_xe || this.xuongXe || "", "Chủ rừng": p.ten_ho,
        "Xã": p.xa, "Loài gỗ": p.loai_cay, "Tháng": p.thang,
        "Số phiếu": p.so_phieu_du_kien, "Xe": p.xe,
        "KL chuyến (m³)": p.khoi_luong, "KL tổng hộ": p.kl_tong_ho,
        "Khoảnh": p.khoanh, "Lô": p.lo,
        "Diện tích": p.dien_tich, "Năm trồng": p.nam_trong,
        "Số BKLS": p.so_bkls,
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ct), "Chi tiết phân bổ");

      (this.summary.xe || []).forEach(xe => {
        const bienSo = xe.bien_so || xe;
        const rows = this.phieu.filter(p => p.xe === bienSo).map((p, i) => ({
          "STT": i + 1, "Số phiếu": p.so_phieu_du_kien, "Chủ rừng": p.ten_ho,
          "Xã": p.xa, "KL (m³)": p.khoi_luong, "Khoảnh": p.khoanh, "Lô": p.lo,
        }));
        const sName = ("Xe " + bienSo).slice(0, 31);
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), sName);
      });

      // Sheet tồn
      if (this.ton.length) {
        const tonRows = this.ton.map(t => ({
          "Chủ rừng": t.ten_ho, "Xã": t.xa, "KL KH": t.kl_kh,
          "Đã chia": t.kl_da_chia, "Tồn (m³)": t.kl_ton,
          "Khoảnh": t.khoanh, "Lô": t.lo, "Tháng gốc": t.thang_goc,
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(tonRows), "Tồn chưa chia");
      }

      const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([out]), "ChiaXe_GoTron.xlsx");
    },
  },
};
</script>
