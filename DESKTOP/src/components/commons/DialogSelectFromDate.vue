<template>
  <q-dialog v-model="showChooseDate" persistent>
      <q-card class="my-card" style="min-width:35%">
      <q-card-section>
      </q-card-section>
      <q-separator  inset   />
      <q-card-section>
         <div class="row justify-between">
             <div class="col-6" align="center">
                 <q-date
                    v-model="fromDate"
                    title="Từ ngày"
                    />
             </div>
         </div>
      </q-card-section>
      <q-card-actions  align="right">
          <q-btn  label="Đồng ý" @click="selectDate(fromDate)" color="primary" />
          <q-btn  color="red"  label="Hủy" @click="cancelChooseDate" />
      </q-card-actions>
  </q-card>
  </q-dialog>
</template>

<script>
import { DxDateBox } from 'devextreme-vue';
import { formatDateAny,getFisrtDayOfMonth,formatDateVN } from '../../ultils'
export default {
    props:{
        showChooseDate:{
            type:Boolean,
            default:false
        },
        selectDate:{
            type:Function
        },
        cancelChooseDate:{
            type:Function
        }
    },
    components:{
        DxDateBox
    },
    data(){
        return {
             fromDate:null,
            toDate: null,
            value1:[]
        }
    },
    created(){
        this.fromDate = formatDateAny(new Date(),'YYYY/MM/DD')
    }
}
</script>

<style>

</style>