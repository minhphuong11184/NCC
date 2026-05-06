<template>
  <div class="dx-field">
    <div class="dx-field-label">{{title}}</div>
    <div class="dx-field-value">
      <DxSelectBox
        :search-enabled="true"
        :data-source="dataSource"
        :search-mode="'contains'"
        :search-expr="searchColumn"
        :search-timeout="200"
        :min-search-length="0"
        value-expr="id"
        :show-data-before-search="false"
        :display-expr="displayColumn"
        @value-changed="onChange"
        :value="defaultValue"
      />
    </div>
  </div>
</template>

<script>
import { DxSelectBox } from "devextreme-vue/select-box";
export default {
    components:{
        DxSelectBox
    },
  props: {
    dataSource: {
      type: Array
    },
    searchColumn:{
        type:String,
        default:'name'
    },
    displayColumn:{
        type:String,
        default:'name'
    },
    onChange: {
      type: Function
    },
    title:{
        type:String,
        default:'Title'
    },
    defaultValue:{
        type:String,
    }
  }
};
</script>

<style>
</style>