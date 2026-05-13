<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Ghép mã lô gỗ vào phiếu nhập kho</div>

    <!-- Filter -->
    <div class="row q-col-gutter-md items-end q-mb-md no-print">
      <div class="col-auto">
        <q-select v-model="thang" :options="thangOptions" emit-value map-options label="Tháng" filled dense style="width:140px" />
      </div>
      <div class="col-auto">
        <q-input v-model.number="nam" type="number" label="Năm" filled dense style="width:100px" />
      </div>
      <div class="col-auto">
        <q-select v-model="mancc" :options="nccOptions" option-value="code" option-label="label" emit-value map-options label="Xưởng xẻ" filled dense style="min-width:300px" use-input @filter="filterNcc" />
      </div>
      <div class="col-auto">
        <q-select v-model="source" :options="sourceOptions" emit-value map-options label="Nguồn dữ liệu" filled dense style="min-width:230px" />
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="search" label="Ghép" @click="load" :loading="loading" />
      </div>
      <div class="col-auto">
        <q-btn color="amber-9" icon="tune" label="Hệ số quy đổi" @click="openHeSoDialog" />
      </div>
      <div class="col-auto">
        <q-btn flat color="secondary" icon="upload_file" label="Import Excel Woodsland" to="/import-pnk-woodsland" />
      </div>
    </div>

    <!-- Dialog hệ số quy đổi -->
    <q-dialog v-model="showHeSo" persistent>
      <q-card style="min-width: 600px; max-width: 900px">
        <q-card-section class="row items-center">
          <div class="text-h6">Hệ số quy đổi gỗ tròn → gỗ xẻ (theo lô)</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="text-caption q-mb-sm text-grey-7">
            KL gỗ xẻ tương đương = KL gỗ tròn / hệ số. Mặc định = 2.
          </div>
          <dx-data-grid
            :data-source="heSoList"
            :show-borders="true"
            :column-auto-width="true"
            key-expr="Lo_go"
            height="400"
          >
            <dx-column data-field="Lo_go" caption="Mã lô gỗ" :width="150" :allow-editing="false" />
            <dx-column data-field="kl_tron" caption="KL gỗ tròn (m³)" data-type="number" format="#,##0.00" :width="140" :allow-editing="false" />
            <dx-column data-field="he_so" caption="Hệ số" data-type="number" :width="100" />
            <dx-column caption="KL gỗ xẻ tương đương" :width="160" :allow-editing="false"
              :calculate-cell-value="r => r.he_so ? (r.kl_tron / r.he_so).toFixed(4) : ''" />
            <DxEditing :allow-updating="true" mode="cell" />
          </dx-data-grid>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Đóng" v-close-popup />
          <q-btn color="primary" icon="save" label="Lưu hệ số" @click="saveHeSo" :loading="savingHeSo" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Summary + chọn phiếu -->
    <div v-if="phieuList.length" class="row q-col-gutter-md items-end q-mb-md no-print">
      <div class="col-auto"><q-chip color="blue" text-color="white">{{ phieuList.length }} phiếu</q-chip></div>
      <div class="col-auto"><q-chip color="teal" text-color="white">{{ data.tong_detail }} dòng</q-chip></div>
      <div class="col-auto"><q-chip color="green" text-color="white">{{ data.tong_lo }} lô gỗ</q-chip></div>
      <div class="col-auto">
        <q-select
          v-model="selectedIdx"
          :options="phieuDropdown"
          emit-value map-options
          label="Chọn phiếu"
          filled dense style="min-width:350px"
        />
      </div>
      <div class="col-auto">
        <q-btn flat icon="navigate_before" :disable="selectedIdx <= 0" @click="selectedIdx--" />
        <span class="text-bold">{{ selectedIdx + 1 }} / {{ phieuList.length }}</span>
        <q-btn flat icon="navigate_next" :disable="selectedIdx >= phieuList.length - 1" @click="selectedIdx++" />
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="print" label="In phiếu này" @click="printPage" />
      </div>
      <div class="col-auto">
        <q-btn color="deep-orange" icon="print_all" label="In tất cả" @click="printAll" />
      </div>
      <div class="col-auto">
        <q-btn color="positive" icon="save" label="Lưu biên bản"
          :loading="savingResult" :disable="source === 'result'"
          @click="saveResult" />
      </div>
      <div v-if="fromSaved" class="col-auto text-grey-7">
        <q-icon name="history" /> Biên bản đã lưu lúc {{ fmtSavedAt(savedAt) }}
      </div>
    </div>

    <!-- Phiếu hiện tại -->
    <div v-if="currentPhieu" class="print-area">
      <div class="phieu-form" :id="'phieu-' + selectedIdx">
        <div class="header-row">
          <span>SỔ TAY COC</span>
          <span class="right italic">BM.COC.01-b</span>
        </div>
        <div class="title">BIÊN BẢN NGHIỆM THU XẺ TƯƠI<br/>(Kiêm phiếu nhập kho)</div>
        <div class="header-row small">
          <span></span>
          <span class="right italic">Ngày BH: 30/03/2019<br/>Lần ban hành: 04</span>
        </div>

        <table class="info-table">
          <tr>
            <td class="lbl">Đơn vị giao hàng:</td><td class="val">{{ nccName }}</td>
            <td class="lbl">Số phiếu:</td><td class="val bold">{{ currentPhieu.SOPHIEU }}</td>
          </tr>
          <tr>
            <td class="lbl">Địa chỉ:</td><td class="val">{{ nccAddress }}</td>
            <td class="lbl">Biển số xe:</td><td class="val">{{ currentPhieu.BIENSOXE }}</td>
          </tr>
          <tr>
            <td class="lbl">Kho nhập:</td>
            <td class="val">{{ xuongNameOf(currentPhieu) }}</td>
            <td class="lbl">Ngày nhập:</td><td class="val">{{ fmtDate(currentPhieu.CREATED_AT) }}</td>
          </tr>
          <tr v-if="xuongAddressOf(currentPhieu)">
            <td class="lbl">Địa chỉ:</td>
            <td class="val" colspan="3">{{ xuongAddressOf(currentPhieu) }}</td>
          </tr>
          <tr>
            <td class="lbl">Trạng thái MT: FSC 100%</td>
            <td class="val">Nhóm SP: {{ currentPhieu.NHOMSP }}</td>
            <td></td>
            <td class="val">{{ loGoOfPhieu(currentPhieu) }}</td>
          </tr>
          <tr>
            <td class="lbl">Loại gỗ: Keo tai tượng (Acacia mangium)</td><td></td>
            <td class="lbl">Mã lô gỗ nhập:</td><td class="val"></td>
          </tr>
        </table>

        <table class="data-table">
          <thead>
            <tr>
              <th rowspan="2">STT</th>
              <th colspan="3">Quy cách (mm)</th>
              <th rowspan="2">Số bó</th>
              <th rowspan="2">Số<br/>thanh/bó</th>
              <th rowspan="2">Tổng thanh</th>
              <th rowspan="2">Tổng khối<br/>lượng (m3)</th>
              <th rowspan="2">Ghi chú</th>
            </tr>
            <tr>
              <th>Dày</th><th>Rộng</th><th>Dài</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, di) in currentPhieu.chi_tiet" :key="d.dt_id">
              <td>{{ di + 1 }}</td>
              <td>{{ d.dt_day }}</td>
              <td>{{ d.dt_rong }}</td>
              <td>{{ d.dt_cao }}</td>
              <td>{{ d.SOBO }}</td>
              <td>{{ d.SOTHANH_BO }}</td>
              <td>{{ d.tong_thanh }}</td>
              <td class="num">{{ d.kl_m3 ? d.kl_m3.toFixed(4) : '' }}</td>
              <td class="small-text">{{ d.lo_go || '' }}</td>
            </tr>
            <tr class="total-row">
              <td colspan="7">TỔNG</td>
              <td class="num">{{ currentPhieu.tong_kl ? currentPhieu.tong_kl.toFixed(4) : '' }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div class="sign-area">
          <div class="sign-col">
            <div class="sign-title">Đại diện giao hàng</div>
            <div class="sign-space"></div>
          </div>
          <div class="sign-col">
            <div class="sign-title">Thủ kho</div>
            <div class="sign-space"></div>
          </div>
          <div class="sign-col">
            <div class="sign-title">QC kiểm tra</div>
            <div class="sign-space"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- In tất cả (ẩn, chỉ hiện khi in) -->
    <div class="print-all-area">
      <div v-for="(p, pi) in phieuList" :key="'all-'+p.SOPHIEU" class="phieu-form">
        <div class="header-row">
          <span>SỔ TAY COC</span>
          <span class="right italic">BM.COC.01-b</span>
        </div>
        <div class="title">BIÊN BẢN NGHIỆM THU XẺ TƯƠI<br/>(Kiêm phiếu nhập kho)</div>
        <div class="header-row small">
          <span></span>
          <span class="right italic">Ngày BH: 30/03/2019<br/>Lần ban hành: 04</span>
        </div>
        <table class="info-table">
          <tr>
            <td class="lbl">Đơn vị giao hàng:</td><td class="val">{{ nccName }}</td>
            <td class="lbl">Số phiếu:</td><td class="val bold">{{ p.SOPHIEU }}</td>
          </tr>
          <tr>
            <td class="lbl">Địa chỉ:</td><td class="val">{{ nccAddress }}</td>
            <td class="lbl">Biển số xe:</td><td class="val">{{ p.BIENSOXE }}</td>
          </tr>
          <tr>
            <td class="lbl">Kho nhập:</td>
            <td class="val">{{ xuongNameOf(p) }}</td>
            <td class="lbl">Ngày nhập:</td><td class="val">{{ fmtDate(p.CREATED_AT) }}</td>
          </tr>
          <tr v-if="xuongAddressOf(p)">
            <td class="lbl">Địa chỉ:</td>
            <td class="val" colspan="3">{{ xuongAddressOf(p) }}</td>
          </tr>
          <tr>
            <td class="lbl">Trạng thái MT: FSC 100%</td>
            <td class="val">Nhóm SP: {{ p.NHOMSP }}</td>
            <td></td><td class="val">{{ loGoOfPhieu(p) }}</td>
          </tr>
          <tr>
            <td class="lbl">Loại gỗ: Keo tai tượng (Acacia mangium)</td><td></td>
            <td class="lbl">Mã lô gỗ nhập:</td><td class="val"></td>
          </tr>
        </table>
        <table class="data-table">
          <thead>
            <tr>
              <th rowspan="2">STT</th>
              <th colspan="3">Quy cách (mm)</th>
              <th rowspan="2">Số bó</th>
              <th rowspan="2">Số<br/>thanh/bó</th>
              <th rowspan="2">Tổng thanh</th>
              <th rowspan="2">Tổng khối<br/>lượng (m3)</th>
              <th rowspan="2">Ghi chú</th>
            </tr>
            <tr><th>Dày</th><th>Rộng</th><th>Dài</th></tr>
          </thead>
          <tbody>
            <tr v-for="(d, di) in p.chi_tiet" :key="'all-dt-'+d.dt_id">
              <td>{{ di + 1 }}</td>
              <td>{{ d.dt_day }}</td>
              <td>{{ d.dt_rong }}</td>
              <td>{{ d.dt_cao }}</td>
              <td>{{ d.SOBO }}</td>
              <td>{{ d.SOTHANH_BO }}</td>
              <td>{{ d.tong_thanh }}</td>
              <td class="num">{{ d.kl_m3 ? d.kl_m3.toFixed(4) : '' }}</td>
              <td class="small-text">{{ d.lo_go || '' }}</td>
            </tr>
            <tr class="total-row">
              <td colspan="7">TỔNG</td>
              <td class="num">{{ p.tong_kl ? p.tong_kl.toFixed(4) : '' }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="sign-area">
          <div class="sign-col"><div class="sign-title">Đại diện giao hàng</div><div class="sign-space"></div></div>
          <div class="sign-col"><div class="sign-title">Thủ kho</div><div class="sign-space"></div></div>
          <div class="sign-col"><div class="sign-title">QC kiểm tra</div><div class="sign-space"></div></div>
        </div>
      </div>
    </div>

    <div v-if="!phieuList.length && !loading" class="text-center text-grey-5 q-mt-xl no-print">
      Chọn tháng, năm, nhà cung cấp rồi nhấn Ghép
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import { DxDataGrid, DxColumn, DxEditing } from "devextreme-vue/data-grid";
import xuongXeMixin from "../mixins/xuongXeMixin";
import khoMixin from "../mixins/khoMixin";

export default {
  mixins: [xuongXeMixin, khoMixin],
  components: { DxDataGrid, DxColumn, DxEditing },
  data() {
    return {
      thang: 1,
      nam: 2025,
      mancc: "HKP",
      source: "woodsland",
      sourceOptions: [
        { label: "Goxe API (live)", value: "woodsland" },
        { label: "Excel đã import", value: "import" },
        { label: "Biên bản đã lưu", value: "result" },
      ],
      savingResult: false,
      fromSaved: false,
      savedAt: null,
      thangOptions: Array.from({ length: 12 }, (_, i) => ({ label: "Tháng " + (i + 1), value: i + 1 })),
      nccList: [],
      nccOptions: [],
      loading: false,
      data: {},
      phieuList: [],
      selectedIdx: 0,
      nccName: "",
      nccAddress: "",
      showHeSo: false,
      heSoList: [],
      savingHeSo: false,
    };
  },
  computed: {
    currentPhieu() { return this.phieuList[this.selectedIdx] || null; },
    phieuDropdown() {
      return this.phieuList.map((p, i) => ({
        label: (i + 1) + ". " + p.SOPHIEU + " — " + this.fmtDate(p.CREATED_AT) + " — Xe: " + p.BIENSOXE + " (" + p.chi_tiet.length + " dòng)",
        value: i,
      }));
    },
    /** Map mã NCC Woodsland → xưởng xẻ (qua XUONG_XE.mancc_woodsland). */
    xuongByMancc() {
      const map = {};
      (this.danhSachXuong || []).forEach(x => {
        if (x.mancc_woodsland) {
          map[String(x.mancc_woodsland).trim()] = x;
        }
      });
      return map;
    },
  },
  async created() {
    await this.loadXuongXe();
    this.loadNcc();
  },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    fmtDate(dt) {
      if (!dt) return "";
      const d = new Date(dt);
      return d.getUTCDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCFullYear();
    },
    /** Lookup xưởng xẻ theo MANCC của phiếu. */
    xuongOf(p) {
      if (!p || !p.MANCC) return {};
      return this.xuongByMancc[String(p.MANCC).trim()] || {};
    },
    /** Lookup kho theo MAKHO (mã kho Woodsland), dùng khi MANCC không match xưởng. */
    khoOf(p) {
      return this.getKhoConfig(p && p.MAKHO);
    },
    xuongNameOf(p) {
      // Ưu tiên MAKHO (kho thực tế nhập về) → khoMap; fallback MANCC → XUONG_XE
      const k = this.khoOf(p);
      if (k.ten) return k.ten;
      const x = this.xuongOf(p);
      if (x.ten) return x.ten;
      return (p && p.MAKHO) ? String(p.MAKHO).trim() : "";
    },
    xuongAddressOf(p) {
      const k = this.khoOf(p);
      if (k.dia_chi) return k.dia_chi;
      const x = this.xuongOf(p);
      return x.dia_chi || "";
    },
    loGoOfPhieu(p) {
      const los = [...new Set(p.chi_tiet.map(d => d.lo_go).filter(Boolean))];
      return los.join(", ");
    },
    /** Build danh sách NCC từ XUONG_XE local (chỉ xưởng có mancc_woodsland). */
    loadNcc() {
      this.nccList = (this.danhSachXuong || [])
        .filter(x => x.mancc_woodsland && String(x.mancc_woodsland).trim())
        .map(x => {
          const code = String(x.mancc_woodsland).trim();
          return {
            code,
            name: x.ten,
            dia_chi: x.dia_chi,
            label: code + " — " + x.ten,
          };
        });
      this.nccOptions = this.nccList;
      const hkp = this.nccList.find(n => n.code === "HKP");
      if (hkp) {
        this.nccName = hkp.name;
        this.nccAddress = hkp.dia_chi || "";
      }
    },
    filterNcc(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.nccOptions = this.nccList.filter(n => n.label.toLowerCase().includes(needle));
      });
    },
    async load() {
      this.loading = true;
      try {
        // Cập nhật tên + địa chỉ NCC từ XUONG_XE local
        const ncc = this.nccList.find(n => n.code === this.mancc);
        this.nccName = ncc ? ncc.name : this.mancc;
        this.nccAddress = ncc && ncc.dia_chi ? ncc.dia_chi : "";

        const { data } = await axios.get(`http://${this.host()}:2003/api/v1/ghep-lo-go/ghep`, {
          params: { thang: this.thang, nam: this.nam, mancc: this.mancc, source: this.source },
        });
        if (data && data.meta && data.meta.success) {
          this.data = data.data;
          this.phieuList = data.data.phieu || [];
          this.selectedIdx = 0;
          this.fromSaved = !!data.data.from_saved;
          this.savedAt = data.data.saved_at || null;
          if (!this.phieuList.length) {
            this.$q.notify({ type: "warning", message: "Không tìm thấy phiếu nào" });
          }
        } else {
          this.$q.notify({ type: "negative", message: JSON.stringify(data.meta) });
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      } finally {
        this.loading = false;
      }
    },
    async openHeSoDialog() {
      try {
        const { data } = await axios.get(`http://${this.host()}:2003/api/v1/ghep-lo-go/he-so`, {
          params: { thang: this.thang, nam: this.nam },
        });
        if (data && data.meta && data.meta.success) {
          this.heSoList = data.data;
          this.showHeSo = true;
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      }
    },
    async saveHeSo() {
      this.savingHeSo = true;
      try {
        const items = this.heSoList.map(r => ({ lo_go: r.Lo_go, he_so: r.he_so || 2 }));
        const { data } = await axios.post(`http://${this.host()}:2003/api/v1/ghep-lo-go/he-so/bulk`, { items });
        if (data && data.meta && data.meta.success) {
          this.$q.notify({ type: "positive", message: "Đã lưu " + data.data.updated + " hệ số" });
          this.showHeSo = false;
        }
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      } finally {
        this.savingHeSo = false;
      }
    },
    printPage() {
      document.body.classList.add("print-single");
      window.print();
      document.body.classList.remove("print-single");
    },
    printAll() {
      document.body.classList.add("print-all");
      window.print();
      document.body.classList.remove("print-all");
    },
    fmtSavedAt(s) {
      if (!s) return "";
      const d = new Date(s);
      return isNaN(d) ? s : d.toLocaleString("vi-VN");
    },
    async saveResult() {
      if (!this.phieuList.length) return;
      const ok = await new Promise(resolve => {
        this.$q.dialog({
          title: "Xác nhận lưu biên bản",
          message: `Sẽ XÓA biên bản đã lưu trước đó của T${this.thang}/${this.nam} — ${this.mancc} (nếu có) và lưu lại ${this.phieuList.length} phiếu hiện tại. Tiếp tục?`,
          cancel: true,
          persistent: true,
        }).onOk(() => resolve(true)).onCancel(() => resolve(false));
      });
      if (!ok) return;
      this.savingResult = true;
      try {
        const { data } = await axios.post(
          `http://${this.host()}:2003/api/v1/ghep-lo-go/save-result`,
          {
            thang: this.thang,
            nam: this.nam,
            mancc: this.mancc,
            source: this.source,
            phieu: this.phieuList,
          }
        );
        if (data && data.meta && data.meta.success) {
          this.$q.notify({
            type: "positive",
            message: `Đã lưu ${data.data.so_phieu} phiếu / ${data.data.so_chi_tiet} chi tiết (xóa ${data.data.deleted} dòng cũ)`,
            timeout: 5000,
          });
        } else {
          this.$q.notify({ type: "negative", message: "Lỗi: " + JSON.stringify(data && data.meta) });
        }
      } catch (err) {
        const detail = err.response && err.response.data && err.response.data.meta
          ? err.response.data.meta.message
          : (err.message || err);
        this.$q.notify({ type: "negative", message: "Lỗi lưu: " + detail, timeout: 8000 });
      } finally {
        this.savingResult = false;
      }
    },
  },
};
</script>

<style scoped>
.phieu-form {
  border: 1px solid #333;
  padding: 16px 20px;
  font-size: 11px;
  font-family: "Times New Roman", serif;
  line-height: 1.5;
  max-width: 900px;
  margin-bottom: 20px;
}
.header-row { display: flex; justify-content: space-between; font-weight: bold; }
.header-row .right { text-align: right; }
.header-row.small { font-size: 10px; font-weight: normal; }
.italic { font-style: italic; }
.bold { font-weight: bold; }
.title { text-align: center; font-weight: bold; font-size: 14px; margin: 8px 0; }
.info-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
.info-table td { padding: 2px 4px; vertical-align: top; }
.info-table .lbl { font-weight: bold; white-space: nowrap; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { border: 1px solid #333; padding: 3px 5px; text-align: center; font-size: 10px; }
.data-table th { background: #f0f0f0; font-weight: bold; }
.data-table .num { text-align: right; }
.data-table .total-row td { font-weight: bold; }
.data-table .small-text { font-size: 9px; text-align: left; }
.sign-area { display: flex; justify-content: space-between; margin-top: 16px; }
.sign-col { text-align: center; width: 30%; }
.sign-title { font-weight: bold; font-style: italic; }
.sign-space { height: 50px; }

/* Ẩn phần in tất cả khi xem bình thường */
.print-all-area { display: none; }

@media print {
  .no-print { display: none !important; }
  .phieu-form { border: 1px solid #000; }
  @page { size: portrait A4; margin: 8mm; }
}

/* In 1 phiếu: ẩn print-all-area, hiện print-area */
:global(body.print-single) .print-all-area { display: none !important; }
:global(body.print-single) .print-area { display: block !important; }

/* In tất cả: ẩn print-area, hiện print-all-area */
:global(body.print-all) .print-area { display: none !important; }
:global(body.print-all) .print-all-area { display: block !important; }
:global(body.print-all) .print-all-area .phieu-form { page-break-after: always; }
:global(body.print-all) .print-all-area .phieu-form:last-child { page-break-after: auto; }
</style>
