<template>
  <q-dialog v-model="showChooseMonth">
      <q-card style="min-width:60%">
          <q-card-section class="row items-center">
              <div class="top-title">
                  Chọn tháng - năm
              </div>
          </q-card-section>
          <q-card-section>
              <div class="row">
                  <div class="col-3">
                      <!-- <q-select v-model="warehouse" :options="options" label="Standard" filled /> -->
                  </div>
                  <div class="col-3 q-pa-md">
                      <q-select v-model="month" :options="months" label="Tháng"  />
                  </div>
                  <div class="col-3 q-pa-md">
                      <q-select v-model="year" :options="years" label="Năm"  />
                  </div>
                  <div class="col-3 self-center">
                      <!-- <q-btn color="primary" class="full-width" label="Xem báo cáo" @click="loadReport" /> -->
                  </div>
              </div>
          </q-card-section>
          <q-card-actions align="right">
              <q-btn flat label="Đồng Ý" @click="selectMonthYear(month,year)" color="primary"  />
          </q-card-actions>
      </q-card>
  </q-dialog>
</template>

<script>
export default {
    props:{
        showChooseMonth:{
            type:Boolean
        },
        selectMonthYear:{
            type: Function
        }
    },
    data(){
        return {
            years:[
                {label:'2019',value:2019},
                {label:'2020',value:2020},
                {label:'2021',value:2021},
                {label:'2022',value:2022},
                {label:'2023',value:2023},
            ],
            year:null,
            months:[
                {label:'Tháng 1',value:1},
                {label:'Tháng 2',value:2},
                {label:'Tháng 3',value:3},
                {label:'Tháng 4',value:4},
                {label:'Tháng 5',value:5},
                {label:'Tháng 6',value:6},
                {label:'Tháng 7',value:7},
                {label:'Tháng 8',value:8},
                {label:'Tháng 9',value:9},
                {label:'Tháng 10',value:10},
                {label:'Tháng 11',value:11},
                {label:'Tháng 12',value:12}
            ],
            month:null,
        }
    },
    created(){
        const today = new Date()
        const currentMonth = today.getMonth()
        const currentMontIndex = this.months.findIndex(m=>{return m.value===parseInt(currentMonth+1)})
        this.month = this.months[currentMontIndex]
        const currentYear = today.getFullYear()
        const currentYearIndex = this.years.findIndex(m=>{return  m.value===parseInt(currentYear)})
        this.year = this.years[currentYearIndex]
        // this.loadReport()
    },
}
</script>

<style>

</style>