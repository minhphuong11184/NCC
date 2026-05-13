<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Quản lý Xưởng xẻ (Nhà cung cấp)</div>

    <div class="q-mb-md">
      <q-btn color="primary" icon="add" label="Thêm xưởng" @click="openAdd" />
    </div>

    <dx-data-grid
      :data-source="rows"
      :show-borders="true"
      :column-auto-width="true"
      :allow-column-resizing="true"
      key-expr="id"
      @row-dbl-click="e => openEdit(e.data)"
    >
      <dx-filter-row :visible="true" />
      <dx-column data-field="ma" caption="Mã" :width="60" />
      <dx-column data-field="ten" caption="Tên công ty" :min-width="200" />
      <dx-column data-field="dia_chi" caption="Địa chỉ" :min-width="180" />
      <dx-column data-field="mst" caption="MST" :width="110" />
      <dx-column data-field="sdt" caption="SĐT" :width="100" />
      <dx-column data-field="chung_chi" caption="Chứng chỉ COC" :width="140" />
      <dx-column data-field="hieu_luc_cc" caption="Hiệu lực" :width="90" />
      <dx-column data-field="nguoi_dai_dien" caption="Người ĐD" :width="120" />
      <dx-column data-field="bm_nghiem_thu" caption="BM Nghiệm thu" :width="120" />
      <dx-column data-field="bm_nhap_kho" caption="BM Nhập kho" :width="120" />
      <dx-column data-field="ngay_ban_hanh" caption="Ngày BH" :width="100" />
      <dx-column data-field="lan_ban_hanh" caption="Lần BH" :width="80" />
      <dx-column data-field="mancc_woodsland" caption="Mã NCC WS" :width="90" />
      <DxEditing :allow-deleting="true" :confirm-delete="true" mode="row" :texts="{ confirmDeleteMessage: 'Xóa xưởng xẻ này?' }" />
      <DxColumn type="buttons" :width="100" caption="">
        <DxButton text="Sửa" icon="edit" :on-click="e => openEdit(e.row.data)" />
        <DxButton name="delete" icon="trash" />
      </DxColumn>
    </dx-data-grid>

    <!-- Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">{{ editId ? 'Sửa xưởng xẻ' : 'Thêm xưởng xẻ' }}</div>
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <div class="row q-col-gutter-md">
            <div class="col-3"><q-input v-model="form.ma" label="Mã" filled dense /></div>
            <div class="col-9"><q-input v-model="form.ten" label="Tên công ty" filled dense /></div>
          </div>
          <q-input v-model="form.dia_chi" label="Địa chỉ" filled dense />
          <div class="row q-col-gutter-md">
            <div class="col-4"><q-input v-model="form.mst" label="Mã số thuế" filled dense /></div>
            <div class="col-4"><q-input v-model="form.sdt" label="Số điện thoại" filled dense /></div>
            <div class="col-4"><q-input v-model="form.mancc_woodsland" label="Mã NCC Woodsland" filled dense /></div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-6"><q-input v-model="form.chung_chi" label="Chứng chỉ COC" filled dense /></div>
            <div class="col-6"><q-input v-model="form.hieu_luc_cc" label="Hiệu lực CC" filled dense /></div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-4"><q-input v-model="form.nguoi_dai_dien" label="Người đại diện" filled dense /></div>
            <div class="col-4"><q-input v-model="form.chuc_vu" label="Chức vụ" filled dense /></div>
            <div class="col-4"><q-input v-model="form.nguoi_nhan" label="Người nhận hàng" filled dense /></div>
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-3"><q-input v-model="form.bm_nghiem_thu" label="Mã BM Nghiệm thu" filled dense hint="vd: BM.COC.01-a" /></div>
            <div class="col-3"><q-input v-model="form.bm_nhap_kho" label="Mã BM Nhập kho" filled dense hint="vd: BM.COC.01-b" /></div>
            <div class="col-3"><q-input v-model="form.ngay_ban_hanh" label="Ngày ban hành" filled dense hint="vd: 10.2.2022" /></div>
            <div class="col-3"><q-input v-model="form.lan_ban_hanh" label="Lần ban hành" filled dense hint="vd: 02" /></div>
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
import { DxDataGrid, DxColumn, DxFilterRow, DxEditing, DxButton } from "devextreme-vue/data-grid";

export default {
  components: { DxDataGrid, DxColumn, DxFilterRow, DxEditing, DxButton },
  data() {
    return {
      rows: [],
      showDialog: false,
      editId: null,
      saving: false,
      form: { ma: "", ten: "", dia_chi: "", mst: "", sdt: "", chung_chi: "", hieu_luc_cc: "", nguoi_dai_dien: "", chuc_vu: "", nguoi_nhan: "", mancc_woodsland: "", bm_nghiem_thu: "", bm_nhap_kho: "", ngay_ban_hanh: "", lan_ban_hanh: "" },
    };
  },
  created() { this.load(); },
  methods: {
    host() { return window.location.hostname || "127.0.0.1"; },
    async load() {
      try {
        const { data } = await axios.get(`http://${this.host()}:2003/api/v1/xuong-xe`);
        this.rows = data && data.meta && data.meta.success ? data.data : [];
      } catch (err) { this.$q.notify({ type: "negative", message: err.message }); }
    },
    openAdd() {
      this.editId = null;
      this.form = { ma: "", ten: "", dia_chi: "", mst: "", sdt: "", chung_chi: "", hieu_luc_cc: "", nguoi_dai_dien: "", chuc_vu: "", nguoi_nhan: "", mancc_woodsland: "" };
      this.showDialog = true;
    },
    openEdit(row) {
      this.editId = row.id;
      this.form = { ...row };
      this.showDialog = true;
    },
    async save() {
      this.saving = true;
      try {
        if (this.editId) {
          await axios.put(`http://${this.host()}:2003/api/v1/xuong-xe/${this.editId}`, this.form);
        } else {
          await axios.post(`http://${this.host()}:2003/api/v1/xuong-xe`, this.form);
        }
        this.$q.notify({ type: "positive", message: "Lưu thành công" });
        this.showDialog = false;
        this.load();
      } catch (err) {
        this.$q.notify({ type: "negative", message: err.message });
      } finally { this.saving = false; }
    },
  },
};
</script>
