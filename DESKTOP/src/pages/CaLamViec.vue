<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Ca làm việc</div>

    <div class="q-mb-md">
      <q-btn color="primary" icon="add" label="Thêm ca" @click="openAdd" />
    </div>

    <dx-data-grid
      :data-source="rows"
      :show-borders="true"
      :column-auto-width="true"
      :allow-column-resizing="true"
      key-expr="id"
      @row-dbl-click="onRowDblClick"
      @row-removed="onRowRemoved"
    >
      <dx-column data-field="id" caption="ID" :width="50" />
      <dx-column data-field="ma" caption="Mã ca" :width="100" />
      <dx-column data-field="ten" caption="Tên ca" :width="120" />
      <dx-column data-field="giovao" caption="Giờ vào" :width="100" :calculate-cell-value="r => fmtTime(r.giovao)" />
      <dx-column data-field="gionghi" caption="Giờ nghỉ" :width="100" :calculate-cell-value="r => fmtTime(r.gionghi)" />
      <dx-column data-field="gionghi1" caption="Hết nghỉ" :width="100" :calculate-cell-value="r => fmtTime(r.gionghi1)" />
      <dx-column data-field="giora" caption="Giờ ra" :width="100" :calculate-cell-value="r => fmtTime(r.giora)" />
      <dx-column data-field="mealtime" caption="Ăn (phút)" :width="90" />
      <dx-column data-field="thoigianlamviec" caption="Làm việc (phút)" :width="120" />
      <dx-column caption="Làm việc (giờ)" :width="110" :calculate-cell-value="r => r.thoigianlamviec ? (r.thoigianlamviec / 60).toFixed(1) + 'h' : ''" />
      <DxEditing :allow-updating="false" :allow-deleting="true" :confirm-delete="true" mode="row" :texts="{ confirmDeleteMessage: 'Bạn có chắc muốn xóa ca này?' }" />
      <DxColumn type="buttons" :width="120" caption="Thao tác">
        <DxButton text="Sửa" icon="edit" :on-click="onEditClick" />
        <DxButton name="delete" icon="trash" />
      </DxColumn>
    </dx-data-grid>

    <!-- Dialog thêm/sửa -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 450px">
        <q-card-section>
          <div class="text-h6">{{ editId ? 'Sửa ca' : 'Thêm ca mới' }}</div>
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="form.ma" label="Mã ca" filled dense />
            </div>
            <div class="col-6">
              <q-input v-model="form.ten" label="Tên ca" filled dense />
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="form.giovao_str" label="Giờ vào (HH:mm)" filled dense mask="##:##" placeholder="06:00">
                <template v-slot:prepend><q-icon name="login" /></template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="form.giora_str" label="Giờ ra (HH:mm)" filled dense mask="##:##" placeholder="14:00">
                <template v-slot:prepend><q-icon name="logout" /></template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model="form.gionghi_str" label="Giờ nghỉ (HH:mm)" filled dense mask="##:##" placeholder="" hint="Bỏ trống nếu không nghỉ">
                <template v-slot:prepend><q-icon name="free_breakfast" /></template>
              </q-input>
            </div>
            <div class="col-6">
              <q-input v-model="form.gionghi1_str" label="Hết nghỉ (HH:mm)" filled dense mask="##:##" placeholder="">
                <template v-slot:prepend><q-icon name="restart_alt" /></template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-input v-model.number="form.mealtime" type="number" label="Thời gian ăn (phút)" filled dense />
            </div>
            <div class="col-6">
              <q-input :value="thoigianLV" label="Thời gian làm việc" filled dense readonly hint="Tự tính">
                <template v-slot:append><span class="text-caption">phút</span></template>
              </q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Hủy" @click="showDialog = false" />
          <q-btn color="primary" :label="editId ? 'Cập nhật' : 'Thêm'" @click="save" :loading="saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from "axios";
import { DxDataGrid, DxColumn, DxEditing, DxButton } from "devextreme-vue/data-grid";

export default {
  components: { DxDataGrid, DxColumn, DxEditing, DxButton },
  data() {
    return {
      rows: [],
      showDialog: false,
      editId: null,
      saving: false,
      form: {
        ma: "", ten: "",
        giovao_str: "", giora_str: "",
        gionghi_str: "", gionghi1_str: "",
        mealtime: 0,
      },
    };
  },
  computed: {
    thoigianLV() {
      const vao = this.timeToMin(this.form.giovao_str);
      const ra = this.timeToMin(this.form.giora_str);
      const meal = this.form.mealtime || 0;
      if (vao === null || ra === null) return "";
      let diff = ra - vao;
      if (diff < 0) diff += 1440; // qua ngày
      return diff - meal;
    },
  },
  created() { this.load(); },
  methods: {
    async load() {
      const host = window.location.hostname || "127.0.0.1";
      try {
        const { data } = await axios.get(`http://${host}:2003/api/v1/ca-lam-viec`);
        this.rows = data && data.meta && data.meta.success ? data.data : [];
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      }
    },
    fmtTime(min) {
      if (min === null || min === undefined) return "";
      const h = Math.floor(min / 60);
      const m = min % 60;
      return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
    },
    timeToMin(str) {
      if (!str || str.length < 4) return null;
      const clean = str.replace(":", "");
      const h = parseInt(clean.substring(0, 2));
      const m = parseInt(clean.substring(2, 4));
      if (isNaN(h) || isNaN(m)) return null;
      return h * 60 + m;
    },
    openAdd() {
      this.editId = null;
      this.form = { ma: "", ten: "", giovao_str: "", giora_str: "", gionghi_str: "", gionghi1_str: "", mealtime: 0 };
      this.showDialog = true;
    },
    openEdit(row) {
      this.editId = row.id;
      this.form = {
        ma: (row.ma || "").trim(),
        ten: (row.ten || "").trim(),
        giovao_str: this.fmtTime(row.giovao),
        giora_str: this.fmtTime(row.giora),
        gionghi_str: this.fmtTime(row.gionghi),
        gionghi1_str: this.fmtTime(row.gionghi1),
        mealtime: row.mealtime || 0,
      };
      this.showDialog = true;
    },
    onRowDblClick(e) { this.openEdit(e.data); },
    onEditClick(e) { this.openEdit(e.row.data); },
    async onRowRemoved(e) {
      const host = window.location.hostname || "127.0.0.1";
      try {
        await axios.delete(`http://${host}:2003/api/v1/ca-lam-viec/${e.data.id}`);
        this.$q.notify({ type: "positive", message: "Đã xóa ca " + e.data.ma });
        this.load();
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      }
    },
    async save() {
      if (!this.form.ma || !this.form.ma.trim()) {
        this.$q.notify({ type: "warning", message: "Mã ca không được để trống" });
        return;
      }
      const maTrung = this.rows.find(r => r.ma.trim() === this.form.ma.trim() && r.id !== this.editId);
      if (maTrung) {
        this.$q.notify({ type: "warning", message: `Mã ca "${this.form.ma}" đã tồn tại (${maTrung.ten})` });
        return;
      }
      const host = window.location.hostname || "127.0.0.1";
      const payload = {
        ma: this.form.ma.trim(),
        ten: this.form.ten,
        giovao: this.timeToMin(this.form.giovao_str),
        giora: this.timeToMin(this.form.giora_str),
        gionghi: this.timeToMin(this.form.gionghi_str),
        gionghi1: this.timeToMin(this.form.gionghi1_str),
        mealtime: this.form.mealtime || 0,
        thoigianlamviec: this.thoigianLV || 0,
      };
      this.saving = true;
      try {
        if (this.editId) {
          await axios.put(`http://${host}:2003/api/v1/ca-lam-viec/${this.editId}`, payload);
          this.$q.notify({ type: "positive", message: "Cập nhật thành công" });
        } else {
          await axios.post(`http://${host}:2003/api/v1/ca-lam-viec`, payload);
          this.$q.notify({ type: "positive", message: "Thêm ca thành công" });
        }
        this.showDialog = false;
        this.load();
      } catch (err) {
        const detail = err.response && err.response.data && err.response.data.meta
          ? err.response.data.meta.messages : (err.message || err);
        this.$q.notify({ type: "negative", message: "Lỗi: " + JSON.stringify(detail) });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
