<template>
  <div class="dx-field">
    <div class="dx-field-label">{{title}}</div>
    <div class="dx-field-value">
      <DxSelectBox
        :ref="refer"
        :search-enabled="true"
        :data-source="dataSource"
        :search-mode="'contains'"
        :search-expr="searchColumn"
        :search-timeout="200"
        :min-search-length="0"
        :value-expr="valueExp"
        :show-data-before-search="false"
        :display-expr="displayColumn"
        @value-changed="onChange"
        :value="defaultValue"
        :show-clear-button="showClear"
        :placeholder="placeholder"
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
    showClear:{
      type:Boolean,
      default:false
    },
    title:{
        type:String,
        default:'Title'
    },
    defaultValue:{
        type:Number,
    },
    placeholder:{
      type:String,
      default:'Chọn'
    },
    valueExp:{
      type:String,
      default:'id'
    },
    refer:{
      type:String,
      default:'selectBoxInt'
    }
  }
};
</script>

<style>
</style>