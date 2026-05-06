<template>
  <div class="dx-field">
        <div style="font-size:20px; "  class="dx-field-label">{{title}}</div>
        <div class="dx-field-value">
          <DxDateBox
            :show-clear-button="true"
            :use-mask-behavior="true"
            :value="value"
            :placeholder="placeHolder"
            :display-format="displayFormat"
            type="date"
            @value-changed="onChange"
          />
        </div>
      </div>
</template>

<script>
import { DxDateBox } from 'devextreme-vue';
export default {
    components:{
        DxDateBox
    },
    props:{
        title:{
            type:String,
            default:'Tittle'
        },
        value:{
            type:Date,
            default:new Date()
        },
        displayFormat:{
            type:String,
            default:'dd/MM/yyyy'
        },
        placeHolder:{
            type:String,
            default:'Chọn ngày'
        },
        onChange:{
            type:Function
        }
    }
}
</script>

<style>

</style>