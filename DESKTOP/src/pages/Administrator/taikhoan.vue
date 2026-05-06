<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div>
        <q-avatar size="200px">
          <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" />
        </q-avatar>
        <br />
        <br />
        <q-separator></q-separator>
      </div>
    </div>
    <div class="row justify-center q-mt-sm">
      <div class="col-12 col-sm-6">
        <q-card class="prodTextNormal">
          <!-- <q-card-section>
            <q-toggle label="Chế độ nền tối" v-model="darkMode" />
          </q-card-section> -->
          <q-card-section>
            <q-toggle
              :label="
                activeMail == false
                  ? 'Bật thông báo email'
                  : 'Tắt thông báo email'
              "
              v-model="activeMail"
              @input="activeNotifiMail(activeMail)"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center q-mt-md">
      <q-card class="col-12 col-sm-6 q-pa-sm">
        <q-card-section class="q-pa-sm">
            <p class="prodTextTitle">Thông tin</p>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <q-input outlined readonly v-model="fullname" label="Họ tên" />
        <br />
        <q-input outlined readonly v-model="department.NAME" label="Bộ phận" />
        <br />
        <q-input outlined v-model="email" label="Email" 
          
        />
        <br />
        <q-input outlined v-model="phoneNumber" label="SĐT" 
        error-message="Không vượt quá 10 số"
        hint="Tối đa 10 số"
        />
        <!-- <q-input outlined v-model="phoneExt" label="Số máy lẻ" 
        error-message="Không vượt quá 10 số"
        hint="Tối đa 10 số"
        /> -->
          </q-card-section>
         <q-btn  class="q-mt-sm" push @click="updProfile" color="primary" icon-right="send" label="Cập nhật" />
        
      </q-card>
    </div>
    <div class="row justify-center q-mt-sm">
      <div class="col-12 col-sm-6">
        <q-card>
          <q-card-section>
            <p class="prodTextTitle">Đổi mật khẩu</p>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <q-input outlined type="password" v-model="curPass" label="Mật khẩu đang sử dụng" />
            <br />
            <q-input outlined type="password" v-model="newPass" label="Mật khẩu mới" />
            <br />
            <q-input outlined type="password" v-model="newPass2" label="Nhập lại mật khẩu mới" />
          </q-card-section>
          <q-card-actions>
            <q-btn @click="showDialog=true" color="primary full-width" glossy label="Đổi mật khẩu" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width:300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm prodTextTitle">Chắc chưa nè ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Hủy" color="primary" v-close-popup />
          <q-btn flat label="Đồng Ý" color="primary" @click="confirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-inner-loading :showing="showLoading">
      <q-spinner-gears size="150px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      text: "",
      curPass: "",
      newPass: "",
      newPass2: "",
      fullname: "",
      department: "",
      email: "",
      showLoading: false,
      showDialog: false,
      userInfo: {},
      darkMode: false,
      dataProfile:null,
      phoneNumber:"",
      phoneExt: "",
      activeMail: null
    };
  },
  computed:{
    // isValid () {
    //   return this.phoneNumber.length <= 10
    // }
  },
  watch: {
    darkMode(val) {
      if (val) {
        localStorage.setItem("theme", "dark");
        this.$q.dark.set(true);
      } else {
        localStorage.setItem("theme", "light");
        this.$q.dark.set(false);
      }
    }
  },
  async created() {
    this.initTheme();
    const userInfo = this.$store.state.base.userInfo;
    this.userInfo = userInfo;
    this.dataProfile = await this.getAccountByID(this.userInfo.id);
    console.log('this.dataProfile',this.dataProfile);
    this.activeMail = this.dataProfile.notificationMail;
    this.phoneNumber = this.dataProfile.PHONE;
    this.phoneExt = this.dataProfile.PHONE_EXT;
    (this.email = this.dataProfile.EMAIL || "Chưa có"),
      (this.fullname = userInfo.firstName || "" + " " + userInfo.lastName);
     this.department  = await this.GET_DEPARTMENTSBYID(
      this.userInfo.department
    );
  },
  methods: {
      ...mapActions("base", ["GET_DEPARTMENTSBYID","getAccountByID","updUser"]),
      ...mapActions("requests", [
      "activeNotificationMail",
      "unActiveNotificationMail"
    ]),
    async updProfile(){
      let payload={
        id: this.userInfo.id,
        email: this.email,
        phoneNumber : this.phoneNumber,
        phoneExt: this.phoneExt
      }
      if(this.email == null || this.phoneNumber == null || this.phoneNumber == 'null' || this.email == 'null' || this.phoneNumber == '' || this.email == ''){
        this.$q.notify({
              message: "Vui lòng nhập đầy đủ thông tin !",
              color: "primary",
              position:'center',
              timeout:500
        });
      }else{
        console.log('payload',payload)
        await this.updUser(payload);
        this.$q.notify({
              message: "Cập nhật thông tin thành công !",
              color: "primary",
              position:'center',
              timeout:500
        });
      }
    },
    initTheme() {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        this.darkMode = true;
      }
    },
    async activeNotifiMail(val) {
      if (val) {
        if (this.email == "") {
          this.$q.notify({
            message:
              "Vui lòng nhập đầy đủ thông tin địa chỉ Email bên dưới để bật thông báo !",
            color: "red"
          });
          this.activeMail = false;
        } else {
          console.log("bạn đã thay đổi bật thành công");
          localStorage.setItem("activeMail", "true");
          this.activeMail = true;
          let payload = {
            email: this.email,
            ACCOUNT: this.userInfo.account
          };
          let { data } = await this.activeNotificationMail(payload);
          console.log(data.data[1]);
          if (data.data[1] == 1) {
            this.$q.notify({
              message: "Bật thông báo email thành công !",
              color: "teal"
            });
          }
        }
      } else {
        if (this.email == "") {
          this.$q.notify({
            message:
              "Vui lòng nhập đầy đủ thông tin địa chỉ Email bên dưới để tắt thông báo !",
            color: "red"
          });
          this.activeMail = true;
        } else {
          console.log("bạn đã thay đổi bật thành công");
          localStorage.setItem("activeMail", "false");
          this.activeMail = false;
          let payload = {
            email: this.email,
            ACCOUNT: this.userInfo.account
          };
          let { data } = await this.unActiveNotificationMail(payload);
          console.log(data.data[1]);
          if (data.data[1] == 1) {
            this.$q.notify({
              message: "Tắt thông báo email thành công !",
              color: "orange"
            });
          }
        }
      }
    },
    async confirm() {
      this.showDialog = false;
      this.showLoading = true;
      if (this.curPass && this.newPass && this.newPass2) {
        if (this.newPass.trim() === this.newPass2.trim()) {
          const payload = {
            data: {
              username: this.userInfo.account,
              oldPassword: this.curPass,
              newPassword: this.newPass
            },
            token: this.userInfo.token
          };
          await this.$store
            .dispatch('production/ACTION_CHANGE_PASS', payload)
            .then(res => {
              if (res.meta.success === true) {
                this.$q.notify({
                  message: "Đổi mật khẩu thành công !",
                  color: "green"
                });
                setTimeout(() => {
                  this.$store.dispatch('production/ACTION_LOGOUT');
                }, 1500);
              } else {
                this.$q.notify({
                  message: res.meta.messages.message,
                  color: "red"
                });
              }
            })
            .catch(err => {
              this.$q.notify({
                message: err.data.meta.messages.message,
                color: "red"
              });
            });
          this.showLoading = false;
          this.curPass = "";
          this.newPass = "";
          this.newPass2 = "";
        } else {
          this.$q.notify({
            message: "Mật khẩu mới không giống nhau !",
            color: "red"
          });
          this.showLoading = false;
        }
      } else {
        this.$q.notify({
          message: "Vui lòng nhập đủ thông tin ",
          color: "red"
        });
        this.showLoading = false;
      }
    }
  }
};
</script>

<style>
</style>