<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-12 top-title text-blue">Quản lý Phòng ban / Công đoạn</div>
        </div>
        <q-btn
          color="positive"
          icon="add_circle_outline"
          label="Thêm mới"
          @click="openAdd"
          class="q-mt-sm"
        />
        <DxTreeList
          id="deptTree"
          :data-source="departments"
          :column-auto-width="true"
          :show-row-lines="true"
          :show-borders="true"
          :expanded-row-keys="expandedRowKeys"
          key-expr="id"
          parent-id-expr="parentId"
          class="q-mt-sm"
        >
          <DxPaging :enabled="true" :page-size="50" />
          <DxFilterRow :visible="true" />
          <DxSearchPanel :visible="true" :width="300" placeholder="Tìm phòng ban" />
          <DxColumn data-field="name" caption="Tên" />
          <DxColumn data-field="code" caption="Mã" :width="120" />
          <DxColumn data-field="type" caption="Loại" :width="120" />
          <DxColumn data-field="type2" caption="Loại 2" :width="120" />
          <DxColumn
            caption="Sửa"
            :width="80"
            alignment="center"
            cell-template="edit-cell"
          />
          <template #edit-cell="cell">
            <span class="fake-link" @click="openEdit(cell)">Sửa</span>
          </template>
          <DxColumn
            caption="Xóa"
            :width="80"
            alignment="center"
            cell-template="del-cell"
          />
          <template #del-cell="cell">
            <span class="fake-link" @click="onDelete(cell)">Xóa</span>
          </template>
        </DxTreeList>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 60%">
        <q-card-section>
          <div class="row">
            <div class="col-12 top-title text-primary">
              {{ isEdit ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới" }}
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-around">
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                use-input
                v-model="form.parent"
                :options="filteredParents"
                @filter="filterParent"
                label="Phòng ban cha"
                clearable
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="form.name" label="Tên phòng ban" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="form.code" label="Mã" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                v-model="form.type"
                :options="typeOptions"
                label="Loại"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                v-model="form.type2"
                :options="type2Options"
                label="Loại 2"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm"></div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="OK" @click="onSubmit" color="positive" />
          <q-btn label="Hủy" color="orange" @click="showDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  DxTreeList,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxSearchPanel,
} from "devextreme-vue/tree-list";
import { getRequest, postRequest, putRequest, delRequest, showNotifySuccess, showNotifyError } from "../../ultils";

export default {
  components: {
    DxTreeList,
    DxColumn,
    DxPaging,
    DxFilterRow,
    DxSearchPanel,
  },
  data() {
    return {
      departments: [],
      expandedRowKeys: [],
      showDialog: false,
      isEdit: false,
      editId: null,
      parentList: [],
      filteredParents: [],
      form: {
        parent: null,
        name: null,
        code: null,
        type: null,
        type2: null,
      },
      typeOptions: ["Nhà máy", "Xưởng", "Kho", "Tổ", "QC", "Nhóm", "Phòng"],
      type2Options: ["factory", "department", "stock", "stock2", "to", "close"],
    };
  },
  async created() {
    await this.loadDepartments();
  },
  methods: {
    async loadDepartments() {
      const res = await getRequest("/api/v3/departments/all");
      if (res && res.data) {
        this.departments = res.data.map((d) => ({
          id: d.ID,
          parentId: d.parentId || 0,
          code: d.CODE,
          name: d.NAME,
          type: d.TYPE,
          type2: d.TYPE2,
          factoryId: d.factoryId,
        }));
        this.parentList = this.departments.map((d) => ({
          label: `[${d.code || ""}] ${d.name}`,
          value: d.id,
        }));
        this.filteredParents = this.parentList;
      }
    },
    filterParent(val, update) {
      if (val === "") {
        update(() => {
          this.filteredParents = this.parentList;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.filteredParents = this.parentList.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    openAdd() {
      this.isEdit = false;
      this.editId = null;
      this.form = { parent: null, name: null, code: null, type: null, type2: null };
      this.showDialog = true;
    },
    openEdit(cell) {
      const d = cell.data.data;
      this.isEdit = true;
      this.editId = d.id;
      this.form.parent = this.parentList.find((p) => p.value == d.parentId) || null;
      this.form.name = d.name;
      this.form.code = d.code;
      this.form.type = d.type;
      this.form.type2 = d.type2;
      this.showDialog = true;
    },
    async onSubmit() {
      if (!this.form.name) {
        showNotifyError("Vui lòng nhập tên phòng ban");
        return;
      }
      if (this.isEdit) {
        await this.update();
      } else {
        await this.insert();
      }
      this.showDialog = false;
    },
    async insert() {
      const payload = {
        parentId: this.form.parent ? this.form.parent.value : null,
        name: this.form.name,
        code: this.form.code,
        type: this.form.type,
        type2: this.form.type2,
      };
      const res = await postRequest("/api/v2/departments", payload);
      if (res && res.data && res.data.meta.success) {
        showNotifySuccess("Tạo phòng ban thành công!");
        await this.loadDepartments();
      } else {
        showNotifyError();
      }
    },
    async update() {
      const payload = {
        parentId: this.form.parent ? this.form.parent.value : null,
        name: this.form.name,
        code: this.form.code,
        type: this.form.type,
        type2: this.form.type2,
      };
      const res = await putRequest("/api/v2/departments/" + this.editId, payload);
      if (res && res.data && res.data.meta.success) {
        showNotifySuccess("Cập nhật thành công!");
        await this.loadDepartments();
      } else {
        showNotifyError();
      }
    },
    onDelete(cell) {
      const d = cell.data.data;
      this.$q
        .dialog({
          html: true,
          title: "Xác nhận",
          message: `Bạn có chắc chắn muốn xóa <br><span style="color:red; font-weight:bold">${d.name}</span>?`,
          color: "negative",
          ok: "Xác nhận",
          cancel: true,
        })
        .onOk(async () => {
          await postRequest("/api/v2/departments/del" + d.id);
          showNotifySuccess("Xóa thành công!");
          await this.loadDepartments();
        });
    },
  },
};
</script>
