<template>
  <q-layout
    view="lHh lpR fFf"
    class="bg-grey-1"
    v-if="this.$store.getters['base/isLogin'] === true"
  >
    <q-header
      elevated
      class="bg-white text-grey-8 q-py-xs print-hide"
      height-hint="58"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <q-btn
          to="/"
          flat
          no-caps
          no-wrap
          class="q-ml-xs"
          v-if="$q.screen.gt.xs"
        >
          <q-toolbar-title shrink class="text-weight-bold"
            >Woodsland</q-toolbar-title
          >
        </q-btn>

        <q-space />
        <!-- <search-bar /> -->

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="grey-8"
            icon="apps"
            v-if="$q.screen.gt.sm"
          >
            <q-tooltip>Ứng dụng</q-tooltip>
          </q-btn>
          <q-btn
            round
            dense
            flat
            color="grey-8"
            icon="message"
            v-if="$q.screen.gt.sm"
          >
            <q-tooltip>Messages</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>2</q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable to="/tai-khoan" v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="settings" />
                  </q-item-section>
                  <q-item-section>Thông tin</q-item-section>
                </q-item>
                <q-item clickable @click="logOut" v-close-popup>
                  <q-item-section avatar>
                    <q-icon name="power_settings_new" />
                  </q-item-section>
                  <q-item-section>Đăng xuất</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-dialog v-model="registration" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6" style="font-family: cursive;">Để nhằm bảo mật và xác thực tài khoản 2 lớp . Vui lòng nhập đầy đủ thông tin Email và SĐT bên dưới . </br> Trân trọng cảm ơn  !</div>
            <q-input outlined v-model="email" label="Email" />
            <br />
            <q-input outlined v-model="phoneNumber" label="SĐT" />
            <br />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn  label="OK" @click="confirm" color="primary" />
          </q-card-actions>
        </q-card>
    </q-dialog>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="310"
      class="print-hide"
      :behavior="behavior"
    >
      <q-scroll-area class="fit">
        <!-- <q-list dense bordered padding class="rounded-borders">
          <q-item to="/de-xuat" clickable v-ripple>
            <q-item-section>Phiếu đề xuất</q-item-section>
          </q-item>
        </q-list> -->
        <q-list padding>
          <q-expansion-item
            dense
            expand-separator
            :header-inset-level="0"
            :content-inset-level="0.2"
            :label="menu.name"
            default-opened
            header-class="bg-teal text-white"
            v-for="menu in mymenu.filter(m => {
              return m.parentId === null && m.hashChild === true;
            })"
            v-bind:key="menu.id"
          >
            <q-item
              dense
              :to="submenu.path"
              clickable
              v-ripple
              v-for="submenu in mymenu.filter(m => {
                return m.hashChild === false && m.parentId === menu.id;
              })"
              v-bind:key="submenu.id"
            >
              <q-item-section>{{ submenu.name }}</q-item-section>
            </q-item>
            <q-expansion-item
              dense
              :header-inset-level="0"
              :content-inset-level="0.5"
              :label="submenu.name"
              header-class="text-blue"
              v-for="submenu in mymenu.filter(m => {
                return m.parentId === menu.id && m.hashChild === true;
              })"
              v-bind:key="submenu.id"
            >
              <!-- vong 2 -->
              <q-item
                :to="submenu3.path"
                dense
                clickable
                v-ripple
                v-for="submenu3 in mymenu.filter(m => {
                  return m.parentId === submenu.id && m.hashChild === false;
                })"
                v-bind:key="submenu3.id"
              >
                <q-item-section>{{ submenu3.name }}</q-item-section>
              </q-item>
              <q-expansion-item
                dense
                :label="submenu2.name"
                :header-inset-level="0"
                :content-inset-level="0.2"
                v-for="submenu2 in mymenu.filter(m => {
                  return m.parentId === submenu.id && m.hashChild === true;
                })"
                v-bind:key="submenu2.id"
              >
                <q-item
                  dense
                  :to="submenu4.path"
                  clickable
                  v-ripple
                  v-for="submenu4 in mymenu.filter(m => {
                    return m.hashChild === false && m.parentId === submenu2.id;
                  })"
                  v-bind:key="submenu4.id"
                >
                  <q-item-section>{{ submenu4.name }}</q-item-section>
                </q-item>
                <q-expansion-item
                  dense
                  :label="submenu5.name"
                  :header-inset-level="0"
                  :content-inset-level="0.2"
                  v-for="submenu5 in mymenu.filter(m => {
                    return m.parentId === submenu2.id && m.hashChild === true;
                  })"
                  v-bind:key="submenu5.id"
                >
                  <q-item
                    dense
                    :to="submenu4.path"
                    clickable
                    v-ripple
                    v-for="submenu4 in mymenu.filter(m => {
                      return (
                        m.hashChild === false && m.parentId === submenu5.id
                      );
                    })"
                    v-bind:key="submenu4.id"
                  >
                    <q-item-section>{{ submenu4.name }}</q-item-section>
                  </q-item>
                </q-expansion-item>
              </q-expansion-item>
              <!-- end vong 2 -->
            </q-expansion-item>
          </q-expansion-item>

          <!-- <DxTreeList
                  id="menus"
                  :data-source="this.$store.getters['base/myMenu']"
                  :show-row-lines="true"
                  :show-borders="true"
                  :column-auto-width="true"
                  :expanded-row-keys="expandedRowKeys"
                  :selected-row-keys.sync="selectedRowKeys"
                  key-expr="id"
                  parent-id-expr="parentId"
                  :no-data-text="'Tài khoản của bạn chưa đc cấp quyền !'"
                  :hover-state-enabled="false"
                  :highlight-changes="true"
                >
               
                  <DxSelection
                    mode="single"
                  />
                  <DxColumn
                    data-field="name"
                    caption="Menu"
                  />
          </DxTreeList>-->

          <q-separator class="q-mt-md q-mb-lg" />

          <div class="q-px-md text-grey-9 draw">
            <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
              <a
                v-for="button in buttons1"
                :key="button.text"
                class="YL__drawer-footer-link"
                href="javascript:void(0)"
                >{{ button.text }}</a
              >
            </div>
          </div>
          <div class="q-py-md q-px-md text-grey-9 draw">
            <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
              <a
                v-for="button in buttons2"
                :key="button.text"
                class="YL__drawer-footer-link"
                href="javascript:void(0)"
                >{{ button.text }}</a
              >
            </div>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <transition appear enter-active-class="animated fadeOutRight">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
  <auth-page v-else />
</template>

<script>
import {
  DxTreeList,
  DxSelection,
  DxColumn,
  DxSearchPanel
} from "devextreme-vue/tree-list";
import { fabYoutube } from "@quasar/extras/fontawesome-v5";
import SearchBar from "../components/commons/SearchBar";
import AuthPage from "../pages/Auth";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "MyLayout",
  components: {
    "search-bar": SearchBar,
    "auth-page": AuthPage,
    DxTreeList,
    DxSelection,
    DxColumn,
    DxSearchPanel
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "mySources","userInfo"])
  },
  data() {
    return {
      expandedRowKeys: [],
      selectedRowKeys: [],
      mymenu: [],
      leftDrawerOpen: false,
      buttons1: [
        // { text: "Giới thiệu" },
        // { text: "Liên hệ" },
      ],
      buttons2: [],
      behavior: "mobile",
      registration:false,
      dataProfile:null,
      email:null,
      phoneNumber:null
    };
  },
  async created() {
    this.getAllAccounts();
    // createdby : HTHIEU(2021-02-22)
    // check email và SĐT đã được đki hay chưa
    this.dataProfile = await this.getAccountByID(this.userInfo.id);
    console.log('this.dataProfile',this.dataProfile)
    this.email= this.dataProfile.EMAIL;
    this.phoneNumber= this.dataProfile.PHONE;
    if(this.dataProfile.EMAIL == null || this.dataProfile.PHONE == null || this.dataProfile.PHONE == 'null' || this.dataProfile.EMAIL == 'null'){ // nếu rỗng 1 trong 2 sẽ bắt đăng kí
      this.registration = true 
    }
     console.log("userInfo", this.userInfo);
    this.$root.$on("logout", e => {
      this.mymenu = [];
    });
    this.$root.$on("login", e => {
      this.mymenu = this.$store.getters["base/myMenu"];
    });
    this.mymenu = this.$store.getters["base/myMenu"];
    this.fabYoutube = fabYoutube;
    // this.mymenu =this.$store.getters['base/myMenu']

    this.$store.getters["base/myMenu"].forEach(element => {
      // console.log(this.$store.getters['base/myMenu'].filter(m=>{return m.parentId===element.id}).length>0)
      if (element.parentId === null) {
        this.expandedRowKeys.push(element.id);
      }
    });
    var mediaQueryList = window.matchMedia("print");
    mediaQueryList.addListener(function(mql) {
      if (mql.matches) {
        // this.leftDrawerOpen=false
      }
    });
    window.addEventListener("beforeprint", function(event) {
      this.behavior = "mobile";
    });
    this.getAllDepartments();
  },
  watch: {
    selectedRowKeys(val) {
      const path = this.$store.getters["base/myMenu"].find(m => {
        return m.id === val[0];
      }).path;
      // console.log(val)

      this.$router.push(path).catch(err => {
        this.$q.notify({ message: err.message });
      });
    }
  },
  methods: {
    ...mapActions("ordersm", ["getAllAccounts", "getAllDepartments"]),
    ...mapActions("base", ["GET_DEPARTMENTSBYID", "getAccountByID","updUser"]),
    ...mapActions("item", ["getItemsByFactoryId"]),
    goHome() {},
    async confirm(){
      let payload={
        id: this.userInfo.id,
        email: this.email,
        phoneNumber : this.phoneNumber
      }
      if(this.email == null || this.phoneNumber == null || this.phoneNumber == 'null' || this.email == 'null' || this.phoneNumber == '' || this.email == ''){
        this.$q.notify({
              message: "Vui lòng nhập đầy đủ thông tin !",
              color: "primary",
              position:'center',
              timeout:500
        });
      }else{
        await this.updUser(payload);
        this.$q.notify({
              message: "Cập nhật thông tin thành công !",
              color: "primary",
              position:'center',
              timeout:500
        });
        this.registration = false;
      }
    },
    logOut() {
      // this.$store.dispatch('base/SET_LOGOUT')
      if (this.$route.path !== "/") {
        this.$router.push("/");
        this.$store.dispatch("base/LOGOUT");
      } else {
        this.$store.dispatch("base/LOGOUT");
      }
      this.$root.$emit("logout");
    }
  }
};
</script>

<style lang="sass">
.YL
  &__toolbar-input-container
    min-width: 100px
    width: 55%
  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>
<style>
@keyframes dx-treelist-highlight-change {
  from {
    background-color: #efefef;
  }
  50% {
    background-color: #efefef;
  }
}
.dx-treelist-cell-updated-animation {
  animation: dx-treelist-highlight-change 1s;
}
.dx-treelist-row-inserted-animation {
  animation: dx-treelist-highlight-change 1s;
}
</style>
