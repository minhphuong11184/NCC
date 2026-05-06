<template>
  <DxDataGrid
    id="gridContainer"
    :data-source="departments"
    :allow-column-reordering="true"
    :columns-auto-width="true"
    :show-borders="true"
    :selection="{ mode: 'single' }"
    :hover-state-enabled="true"
    @editorPreparing="onEditorPreparing"
    @row-inserted="insert"
    @row-updated="updated"
    key-expr="id"
  >
    <DxPaging :enabled="true" :page-size="40" />
    <DxEditing :allow-updating="true" :allow-adding="true" mode="popup" />
    <DxFilterRow :visible="true" />

    <DxSearchPanel :visible="true" :width="100" placeholder="Tìm phòng ban" />
    <DxColumn data-field="id" :visible="false" />
    <DxColumn
      :width="120"
      data-field="parent_id"
      caption="Nhà máy"
      :visible="false"
    >
      <DxLookup
        :data-source="departments"
        display-expr="name"
        value-expr="id"
      />
    </DxColumn>
    <!-- <DxColumn data-field="code" caption="Code" :width="80">
      <DxRequiredRule />
    </DxColumn>-->
    <DxColumn data-field="name" caption="Tên phòng ban">
      <DxRequiredRule />
    </DxColumn>
    <DxColumn
      :width="120"
      data-field="accountId"
      caption="Trưởng phòng"
      :visible="false"
    >
      <DxLookup :data-source="users" display-expr="account" value-expr="id" />
      <DxRequiredRule />
    </DxColumn>
    <DxColumn
      :width="120"
      data-field="accountId1"
      caption="Phó phòng 1"
      :visible="false"
    >
      <DxLookup :data-source="users" display-expr="account" value-expr="id" />
    </DxColumn>
    <DxColumn
      :width="120"
      data-field="accountId2"
      caption="Phó phòng 2"
      :visible="false"
    >
      <DxLookup :data-source="users" display-expr="account" value-expr="id" />
    </DxColumn>
  </DxDataGrid>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging,
  DxRequiredRule,
  DxLookup,
  DxSearchPanel,
  DxHeaderFilter,
  DxFilterRow
} from "devextreme-vue/data-grid";
import { showNotifySuccess, showNotifyError } from "../../ultils";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging,
    DxLookup,
    DxSearchPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxRequiredRule
  },

  data() {
    return {
      departments: [],
      users: []
    };
  },
  created() {
    Promise.all([this.loadDepartment(), this.loadRoles(), this.loadUsers()]);
  },
  methods: {
    async insert(e) {
      let payload = {
        accountId: e.data.accountId,
        accountId1: e.data.accountId1,
        accountId2: e.data.accountId2,
        code: e.data.code,
        name: e.data.name,
        parentId: e.data.parent_id,
        type: e.data.type,
        type2: e.data.type2
      };
      const data = await this.$store.dispatch(
        "base/CREATE_DEPARTMENT",
        payload
      );
      if (data.meta.success) {
        await this.loadDepartment();
        showNotifySuccess("Tạo thành công !");
      } else {
        showNotifyError();
      }
    },
    async updated(e) {
      // console.log(e.data)

      if (e.data) {
        const payload = {
          id: e.data.id,
          data: {
            accountId: e.data.accountId,
            accountId1: e.data.accountId1,
            accountId2: e.data.accountId2,
            code: e.data.code,
            name: e.data.name,
            parentId: e.data.parent_id,
            type: e.data.type,
            type2: e.data.type2
          }
        };
        const data = await this.$store.dispatch(
          "base/UPDATE_DEPARTMENT",
          payload
        );
        if (data.meta.success) {
          showNotifySuccess("Cập nhật thành công !");
        } else {
          showNotifyError();
        }
      }
    },
    async loadDepartment() {
      let dataProfile = await this.$store.dispatch("base/GET_ACCOUNTS");
      const data = await this.$store.dispatch("base/GET_DEPARTMENTS", {
        factoryId: dataProfile.data[0].factoryId
      });
      this.departments = data.data;
    },
    async loadUsers() {
      const data = await this.$store.dispatch("base/GET_ACCOUNTS");
      this.users = data.data;
    },
    async loadRoles() {
      // const data = await this.$store.dispatch('base/GET_ROLES')
      // this.roles = data.data
      return true;
    },
    // async onSelectionChanged({ selectedRowsData }){
    //     const data = selectedRowsData[0];
    //     let dataRole = await this.$store.dispatch('base/GET_ROLE_INFO_BY_ID',data.roleId)
    //     // console.log(dataRole.data)
    //     this.$q.loading.show(

    //     )
    //     setTimeout(() => {
    //         this.$root.$emit('chon_role', dataRole.data)
    //         this.$q.loading.hide()
    //     }, 1500);

    // },
    onEditorPreparing(e) {
      if (e.dataField === "id" || e.dataField === "roleId") {
        e.editorOptions.disabled = true;
      }
    }
  }
};
</script>

<style></style>
