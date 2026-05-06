<template>
  <DxDataGrid
    id="gridContainer"
    :data-source="dataSource"
    :show-borders="true"
    key-expr="name"
    @editorPreparing="onEditorPreparing"
    @row-updated="updated"
  >
    <DxEditing :allow-updating="true" mode="row" />
    <DxPaging :enabled="false" />
    <DxColumn :width="200" data-field="name" caption="Tên danh mục" />
    <DxColumn data-field="SELECT" caption="Xem" />
    <DxColumn data-field="CREATE" caption="Thêm mới" />
    <DxColumn data-field="UPDATE" caption="Cập nhật" />
    <DxColumn data-field="DELETE" caption="Xóa" />
    <DxColumn data-field="ALL" caption="Ủy quyền" />
  </DxDataGrid>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxEditing,
  DxPaging
} from "devextreme-vue/data-grid";
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxEditing,
    DxPaging
  },
  props: {
    dataSource: {},
    updated: {
      type: Function
    }
  },
  methods: {
    onEditorPreparing(e) {
      if (e.dataField === "name") {
        e.editorOptions.disabled = true;
      }
    }
    // async updated(e){
    //     setTimeout(() => {
    //         this.$root.$emit('update_table_quan_ly_danh_muc',e.data)
    //     }, 500);
    // }
  }
};
</script>

<style></style>
