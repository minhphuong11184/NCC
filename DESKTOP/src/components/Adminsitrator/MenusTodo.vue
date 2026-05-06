<template>
  <div>
    <q-btn
      color="positive"
      icon="add_circle_outline"
      label="Thêm mới"
      @click="addMenu"
    />
    <DxTreeList
      id="departments"
      :data-source="menus(menuType)"
      :column-auto-width="true"
      :show-row-lines="true"
      :show-borders="true"
      :expanded-row-keys="expandedRowKeys"
      key-expr="id"
      parent-id-expr="parentId"
    >
      <DxPaging :enabled="true" :page-size="40" />
      <DxFilterRow :visible="true" />

      <DxSearchPanel :visible="true" :width="300" placeholder="Tìm menu" />
      <DxColumn
        :width="120"
        data-field="parentId"
        caption="Menu cha"
        :visible="false"
      >
        <DxLookup :data-source="strMenu" display-expr="name" value-expr="id" />
      </DxColumn>
       
      <DxColumn data-field="name" caption="Tên menu" />
      <DxColumn data-field="code" caption="Mã" />
      <DxColumn data-field="path" caption="Đường dẫn" />
      <DxColumn
        data-field="sequence"
        caption="Thứ tự"
        sort-order="asc"
        :sort-index="0"
      />
      <DxColumn data-field="permission" caption="Phân quyền" />
      <DxColumn data-field="isActive" caption="Active" />
      <DxColumn
        caption="Chỉnh sửa"
        width="100"
        alignment="center"
        cell-template="update-cell"
      />
      <template #update-cell="cell">
        <span class="fake-link" @click="onSelectionChanged(cell)">Sửa</span>
      </template>
      <DxColumn
        caption="Xóa"
        width="100"
        alignment="center"
        cell-template="del-cell"
      />
      <template #del-cell="cell">
        <span class="fake-link" @click="removed(cell)">Xóa</span>
      </template>
    </DxTreeList>
    <q-dialog v-model="showChooseMenu" persistent>
      <q-card style="min-width: 70%">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title text-primary">Nhập thông tin Menu</div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-around">
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                use-input
                v-model="iParentName"
                :options="listMenu"
                @filter="filterFn"
                label="Menu cha"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iName" label="Tên menu" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iCode" label="Mã" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iPath" label="Đường dẫn" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-input v-model="iOrder" label="Thứ tự" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select
                v-model="iPermission"
                label="Phân quyền"
                :options="permissions"
              />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
              <q-select v-model="iActive" label="Active" :options="actives" />
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
            </div>
            <div v-if="iPermission.value" class="col-12 col-md-11 q-mt-sm">
              <q-option-group
                color="orange"
                :options="listPermission"
                type="checkbox"
                v-model="permission"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="OK" @click="createDepartment" color="positive" />
          <q-btn label="Hủy" color="orange" @click="showChooseMenu = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {
  DxTreeList,
  DxEditing,
  DxColumn,
  DxValidationRule,
  DxLookup,
  DxPaging,
  DxFilterRow,
  DxSearchPanel,
  DxButton,
} from "devextreme-vue/tree-list";
import { showNotifySuccess, showNotifyError } from "../../ultils";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxTreeList,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxPaging,
    DxFilterRow,
    DxSearchPanel,
    DxButton,
  },

  data() {
    return {
      menuType: "desktop",
      departments: [],
      users: [],
      expandedRowKeys: [1],
      showChooseMenu: false,
      iParentName: null,
      id: null,
      iName: null,
      iPath: null,
      iOrder: null,
      iCode: null,
      iPermission: {
        label: "Không",
        value: false,
      },
      iActive: null,
      isEdit: false,
      permissions: [
        {
          label: "Có",
          value: true,
        },
        {
          label: "Không",
          value: false,
        },
      ],
      actives: [
        {
          label: "Có",
          value: true,
        },
        {
          label: "Không",
          value: false,
        },
      ],
      listMenu: [],
      listPermission: [],
      permission: [],
      strMenu: [],
      dataProfile: null,
      popupOptions: {
        title: "Employee Info",
        showTitle: true,
        width: 700,
      },
    };
  },
  created() {
    this.loadMenus();
    this.loadPermission();
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "menus"]),
    getSources() {
      if (this.departments && this.departments.length)
        return this.departments.map((d) => ({
          ...d,
          parentId: d.parentId ? d.parentId : 0,
        }));
      return [];
    },
  },
  methods: {
    ...mapActions("base", ["getAllMenus", "updateMenu", "deleteMenu"]),
    ...mapActions("prod", [
      "getAllPermission",
      "deleteMenuPermission",
      "insertMenuPermission",
      "getMenuPermissionMenuId",
    ]),
    addMenu() {
      this.iParentName = null;
      this.iName = null;
      this.iCode = null;
      this.iPath = null;
      this.iOrder = null;
      this.iPermission = {
        label: "Không",
        value: 0,
      };
      this.iActive = {
        label: "Có",
        value: 1,
      };
      this.showChooseMenu = true;
      this.isEdit = false;
    },
    filterFn(val, update) {
      console.log("val", val);
      if (val === "") {
        update(() => {
          this.listMenu = this.strMenu;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.listMenu = this.strMenu.filter(
          (v) => v.label.toLowerCase().indexOf(needle) > -1
        );
        console.log("this.listMenu", this.listMenu);
      });
    },
    onSelectionChanged(e) {
      this.id = e.data.data.id;
      this.iParentName = this.listMenu.find(
        (p) => p.value == e.data.data.parentId
      );
      this.iName = e.data.data.name;
      this.iCode = e.data.data.code;
      this.iPath = e.data.data.path;
      this.iOrder = e.data.data.sequence;
      this.iPermission = this.permissions.find(
        (p) => p.value == e.data.data.permission
      );
      this.iActive = this.actives.find((p) => p.value == e.data.data.isActive);
      this.isEdit = true;
      console.log("this.iParentName", this.iParentName);
      this.loadMenuPermissionByMenuId(e.data.data.id);
      this.showChooseMenu = true;
    },
    async loadMenuPermissionByMenuId(menuId) {
      const payload = {
        menuId: menuId,
      };
      const data = await this.getMenuPermissionMenuId(payload);
      this.permission = [];
      data.data.forEach((el) => {
        this.permission.push(el.PERMISSTION_ID);
      });
    },
    onEditorPreparing(e) {
      if (e.dataField === "Head_ID" && e.row.data.ID === 1) {
        e.editorOptions.disabled = true;
        e.editorOptions.value = null;
      }
    },
    onInitNewRow(e) {
      e.data.factoryId = this.myFactoryInfor.id;
      this.loadUsers();
    },
    createDepartment() {
      if (this.isEdit) {
        this.updated();
      } else {
        this.insert();
      }
      this.showChooseMenu = false;
    },
    async insert() {
      let payload = {
        parentId: this.iParentName ? this.iParentName.value : null,
        name: this.iName,
        code: this.iCode,
        path: this.iPath,
        sequence: this.iOrder,
        type: this.menuType,
        permission: this.iPermission.value,
        isActive: this.iActive.value,
      };
      console.log("payload", payload);
      const data = await this.$store.dispatch("base/CREATE_MENU", payload);
      if (data.meta.success) {
        this.insertmenu(data.data.id);
        if (this.iPermission.value) {
          this.addMenuPermission(data.data.id);
        }
        await this.loadMenus();
        showNotifySuccess("Tạo thành công !");
      } else {
        showNotifyError();
      }
    },
    async addMenuPermission(id) {
      await this.deleteMenuPermission({ id: id });
      const payload = {
        id: id,
        permissions: this.permission,
        createdBy: this.$store.state.base.userInfo.id,
      };
      await this.insertMenuPermission(payload);
      this.permission = [];
    },
    async insertmenu(k) {
      const adminIds = [100001];
      for (const roleId of adminIds) {
        let payload = {
          roleId: roleId,
          roleTypeId: 100006,
          value: k,
        };
        await this.$store.dispatch("base/ADD_ROLE_VALUE", payload);
      }
      this.$q.notify({
        message: "Thành công !",
        color: "green",
      });
    },
    async updated() {
      let payload = {
        id: this.id,
        parentId: this.iParentName.value,
        name: this.iName,
        code: this.iCode,
        path: this.iPath,
        sequence: this.iOrder,
        type: this.menuType,
        permission: this.iPermission.value,
        isActive: this.iActive.value,
      };
      if (payload.parentId == 0) {
        payload.parentId = null;
      }
      await this.updateMenu(payload);
      if (this.iPermission.value) {
        this.addMenuPermission(this.id);
      }
      this.loadMenus();
    },
    async removed(e) {
      this.$q
        .dialog({
          html: true,
          title: "Xác nhận",
          message: `Bạn có chắn chắn muốn xóa <br> <span style="color:red; font-weight:bold">${e.data.data.name}</span>?`,
          color: "negative",
          ok: `Xác nhận`,
          cancel: true,
          default: "Hủy", // <<<<
        })
        .onOk(() => {
          this.xoaMenu(e.data.data.id);
        });
    },
    async xoaMenu(id) {
      await this.deleteMenu({ id: id });
    },
    async loadMenus() {
      let data = await this.getAllMenus();
      this.listMenu = [];
      this.strMenu = [];
      data.forEach((el) => {
        this.listMenu.push({
          label: `[${el.code}] ${el.name}`,
          value: el.id,
        });
      });
      this.strMenu = this.listMenu;
      console.log(data);
    },
    async loadPermission() {
      this.listPermission = [];
      const data = await this.getAllPermission();
      data.data.forEach((el) => {
        this.listPermission.push({
          label: el.NAME,
          value: el.ID,
        });
      });
    },
  },
};
</script>

<style></style>
