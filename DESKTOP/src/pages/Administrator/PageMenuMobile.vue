<template>
  <q-page class="q-pa-sm">
    <q-card class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-6 top-title text-blue">
            Quản lý danh mục chức năng Mobile
          </div>
        </div>
        <DxDataGrid
          id="departments"
          :data-source="dataSource"
          :column-auto-width="true"
          :show-row-lines="true"
          :show-borders="true"
          key-expr="id"
          parent-id-expr="parentId"
          @row-inserted="insert"
          @row-updated="updated"
          @row-removed="removed"
        >
        <DxScrolling mode="infinite" />
          <DxEditing
            :allow-updating="true"
            :allow-deleting="true"
            :allow-adding="true"
            :popup="popupOptions"
            mode="popup"
          />
          <DxPaging :enabled="true" :page-size="40" />
          <DxFilterRow :visible="true" />

          <DxSearchPanel :visible="true" :width="200" placeholder="Search" />
           <DxColumn :group-index="0" data-field="species" caption="Nhóm">
            <DxLookup
              :data-source="group"
              display-expr="name"
              value-expr="id"
            />
            <DxValidationRule type="required" />
          </DxColumn>
           <DxColumn data-field="PATH" caption="Đường dẫn" width="300">
            <DxValidationRule type="required" />
          </DxColumn>
          <DxColumn data-field="NAME" caption="Tên menu" width="300">
            <DxValidationRule type="required" />
          </DxColumn>
          <DxColumn data-field="permission" caption="Phân quyền" width="300">
        <DxLookup
          :data-source="permissions"
          display-expr="label"
          value-expr="value"
        />
      </DxColumn>
          <DxColumn data-field="isActive" caption="Active" width="120">
          </DxColumn>
         
          <DxColumn type="buttons">
            <DxButton name="edit" />
            <DxButton name="delete" />
          </DxColumn>
        </DxDataGrid>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {
  DxDataGrid,
  DxEditing,
  DxColumn,
  DxValidationRule,
  DxLookup,
  DxPaging,
  DxFilterRow,
  DxSearchPanel,
  DxButton,
  DxScrolling
} from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../../ultils";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    DxDataGrid,
    DxEditing,
    DxColumn,
    DxValidationRule,
    DxLookup,
    DxPaging,
    DxFilterRow,
    DxSearchPanel,
    DxScrolling,
    DxButton,
  },
  data() {
    return {
      dataSource: [],
      departments: [],
      users: [],
      expandedRowKeys: [1],
      dataProfile: null,
      popupOptions: {
        title: "Employee Info",
        showTitle: true,
        width: 700,
      },
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
      group: [
        {
          name: "CHẾ BIẾN GỖ",
          id: "1         ",
        },
        {
          name: "e-OFFICE",
          id: "2         ",
        },
        {
          name: "VÁN CÔNG NGHIỆP",
          id: "3         ",
        },
        {
          name: "QUẢN LÝ SẤY GỖ",
          id: "4         ",
        },
        {
          name: "QUẢN LÝ MÁY",
          id: "5         ",
        },
        {
          name: "THÔNG TIN",
          id: "6         ",
        },
      ],
    };
  },
  created() {
    this.loadMenus();
  },
  methods: {
    ...mapActions("base", [
      "getMenuMobile",
      "addMenuMobile",
      "updateMenuMobile",
      "deleteMenu",
    ]),
    async insert(e) {
      console.log("du lieu:", e.data);
      let payload = {
        name: e.data.NAME,
        path: e.data.PATH,
        type: "mobile",
        permission: e.data.permission,
        species: e.data.species,
        isActive: 1
      };
      const data = await this.addMenuMobile(payload);
      console.log("ID:", data[0].id);
      if (data.length != 0) {
        this.insertmenu(data[0].id);
        await this.loadMenus();
        showNotifySuccess("Tạo thành công !");
      } else {
        showNotifyError();
      }
    },
    async insertmenu(k) {
      let payload = {
        roleId: 100400,
        roleTypeId: 100009,
        value: k,
      };
      data = await this.$store.dispatch("base/ADD_ROLE_VALUE", payload);
      if (data.meta.success) {
        this.$q.notify({
          message: "Thành công !",
          color: "green",
        });
      }
    },
    async updated(e) {
      console.log("data e", e.data);
      const { id, NAME, PATH, species, permission, isActive } = e.data;
      await this.updateMenuMobile({ id, NAME, PATH, species, permission, isActive });
    },
    async removed({ key }) {
      await this.deleteMenu({ id: key });
    },
    async loadMenus() {
      let data = await this.getMenuMobile();
      this.dataSource = data;
    },
  },
};
</script>

<style>
#departments{
  height: 800px;
}
.dx-datagrid-rowsview .dx-group-row.dx-row > td {
    font-weight: bold;
    color: black;
}
</style>