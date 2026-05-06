<template>
  <q-layout>
    <q-page-container>
      <q-page padding>
        <div  class="fit row wrap justify-center items-start content-start">
          <div id="wrap" class="col-12 col-md-6 col-lg-4 mt-md">
            <div align="center">
              <div class="home">TanTrao2026</div>
              <div style="padding-top:20px; color:#f6b024">Desktop Application</div>
            </div>
            <br>
            <q-separator  inset />
            <br>
            <q-input
              filled
              v-model="username"
              label="Tên đăng nhập"
              v-on:keyup.enter="focus"
            />
            <br>
            <q-input
              filled
              v-model="password"
              type="password"
              ref="pass"
              label="Mật khẩu"
              v-on:keyup.enter="doLogin"
            />
            <br>
            <div style="width=100%" align="center">
              <!-- <q-btn color="primary" glossy @click="doLogin"  class="q-mt-mb-xs" label="Đăng nhập" style="margin-bottom:10px" /> -->
              <q-btn
              color="blue"
              glossy
              @click="doLogin"
              class="q-mt-mb-xs"
              label="Đăng nhập"
              style="margin-bottom: 10px"
            />
            </div>
             <!-- <q-card class="my-card">
               <q-card-section>
                
                
              </q-card-section>
              
              <q-card-section>
                
              </q-card-section>
              <q-card-actions>
                
              </q-card-actions>
            </q-card> -->
          </div>
        </div>
        <!-- <div class="fixed-bottom" align="right" style="    margin-right: 3%;
    font-family: monospace;
    font-style: italic;
    font-size: small;">Phiên bản : {{this.$store.state.base.appVerion}}</div> -->
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>



export default {
  // name: 'PageName',
  data(){
    return {
      username:'',
      password:'',
    }
  },
  created(){
      console.log(this.$store.getters['base/isLogin'])
  },
  methods : {
    pushHome(){
      this.$router.push('/module')
    },
    // focus(){
    //   this.$ref.pass.focus()
    // },
    doLogin(){
      if (this.username!='' && this.password!='') {
        const user = {
          username:this.username,
          password:this.password
        }
        // console.log(this.$router)
        this.$store.dispatch('base/LOGIN',user).then(()=>{
          this.$root.$emit('login')
        })
        
        // setTimeout(() => {
        //     window.location.reload()
        // }, 500);
      }else {
        this.$q.notify({
          message:'Vui lòng nhập đầy đủ thông tin !',
          color:'red',
        })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
#wrap{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding:18px;
}
.home {
  font-size: 25px;
  border: 5px solid #f6b024;
  border-radius: 50px;
  font-weight: bold;
  padding: 5px;
  color: #0b61a5;
  display: inline
}
</style>