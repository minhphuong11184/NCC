<template>
  <q-page class="flex flex-center" style="background-color:white">
     <!-- <q-dialog v-if="false" v-model="showChooseItem" persistent>
      <q-card style="min-width: 70%">
        <q-card-section class="row items-center">
          <div class="row">
            <div class="col-12 top-title">
            <b>  {{ tintuc[0].TITLE}} </b>
            </div>
          </div>
        </q-card-section>
        <q-card-section align="left">
         
          <div >
            <div class="col-12 col-md-5 q-mt-sm">
           <b> {{ tintuc[0].TITLE}} </b>
            </div>
            <div class="col-12 col-md-5 q-mt-sm">
          {{ tintuc[0].SUMMARY}}
            </div>
            
          
            <div v-if="xemtiep" class="col-6 col-md-5 q-mt-sm" >
              <p v-html="tintuc[0].CONTENT" ></p>
            </div>
             <div v-if="xemtiep && tintuc[0].imageUrl !=''" class="col-6 col-md-5 q-mt-sm" >
               <a :href="('http://' + (window.location.hostname || 'localhost') + ':2003/Attached/') + tintuc[0].imageUrl" target="_blank">
                   <img
                         v-bind:src="('http://' + (window.location.hostname || 'localhost') + ':2003/Attached/') + tintuc[0].imageUrl"
                          alt="File đính kèm"
                          width="180"
                          height="auto"
                         
                        />
                        </a>
            </div>
                <div class="col-12 col-md-5 q-mt-sm">
                <q-btn flat label="xem chi tiết" color="red" @click="cancel" />
            </div>
       
          </div>
        </q-card-section>
        <q-separator />
       
        <q-card-actions align="right">
          <q-btn flat label="Đã hiểu và tuân thủ" color="red" @click="xemtiept" />
        
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <div  v-if="this.$store.state.base.isLogout" class=" row" >
      <div class="top-title">Đăng xuất trong {{time/1000}}s</div>
      <br>
       <div class="col-4">
          <q-btn color="primary" class="full-width"  label="Hủy" @click="onClick" />
       </div>
    </div>
   <div class="text-center" v-else>
      <div class="home">Nhà Cung Cấp</div>
       <div style="padding-top:20px; color:#f6b024; font-size:16px">Desktop Application</div> 
   </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data(){
    return {
      tintuc:[],
      xemtiep:false,
      showChooseItem:false,
      time:1000,
    }
  },
  created(){
    // this.createItem()
    if (this.$store.state.base.isLogout) {
      setTimeout(() => {
        if (this.$store.state.base.isLogout) {
          this.$store.dispatch('base/LOGOUT')
        }
      }, this.time);
      setInterval(() => {
        if (this.$store.state.base.isLogout) {
          this.time=this.time-1000
        }
      }, 1000);
    }
  },
  methods:{
  //    async  createItem() {
  //            const  payload = {
  //            accountId: this.$store.state.base.userInfo.id,
  //            departmentId: this.$store.state.base.userInfo.departmentId
  //    }
  //     const data = await this.$store.dispatch('NOTIFY/VIEW_TIN_TUC_TB',payload)
  //     this.tintuc = data.data
  //    // this.showChooseItem = false;
  //  const  payload1 = {
  //            ID: this.$store.state.base.userInfo.departmentId,
  //            infoId: this.tintuc[0].ID
  //    }
  //     const data1 = await this.$store.dispatch('NOTIFY/VIEW_PHONG_BAN',payload1)
  // if (data1.data.length >0) this.showChooseItem = true;
  //     const  payload2 = {
  //            accountId: this.$store.state.base.userInfo.id,
  //            infoId: this.tintuc[0].ID
  //    }
  //    const data2 = await this.$store.dispatch('NOTIFY/VIEW_FORM_TIN_TUC',payload2)
  //    if (data2.data.length >0) this.showChooseItem = false
    
  //   },
  //    cancel() {
  //     this.xemtiep = true;
  //   },
  //  async  xemtiept() {
  //     this.showChooseItem = false;
  //      const  payload = {
  //            accountId: this.$store.state.base.userInfo.id,
  //            infoId: this.tintuc[0].ID
  //    }
  //    const data = await this.$store.dispatch('NOTIFY/UPDATE_FORM_TIN_TUC',payload)
  //   },
 
    onClick(){
      this.$store.dispatch('base/CANCEL_LOGOUT')
    }
  }
}
</script>

<style>
.home{
  font-size: 30px;
  border: 5px solid #f6b024;
  border-radius: 50px;
  font-weight: bold;
  padding: 10px;
  color: #0b61a5;
}
</style>