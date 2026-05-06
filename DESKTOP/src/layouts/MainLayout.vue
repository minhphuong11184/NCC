<template>
  <q-layout
    view="lHh lpr lFf"
    class="bg-grey-1"
    v-if="this.$store.getters['base/isLogin'] === true"
  >
    <q-header
      elevated
      style="background-color: #0b61a5"
      class="text-white q-py-xs print-hide"
      height-hint="58"
    >
      <q-toolbar>
        <q-btn
          to="/"
          flat
          no-caps
          @click="onBackHome"
          no-wrap
          style="margin-right: 30px; margin-left: 0px"
          v-if="$q.screen.gt.xs"
        >
          <q-toolbar-title
            shrink
            style="padding-top: 14px; font-weight: bold"
            class="text-white"
            >Nhà Cung Cấp</q-toolbar-title
          >
        </q-btn>
        <div class="q-pa-sm q-pl-md row items-center font-header">
          <div
            v-for="menu in mymenu.filter((m) => {
              return m.parentId === null && m.hashChild === true;
            })"
            v-bind:key="'m' + menu.id"
            @click="onSelect(menu)"
            :class="{ active: menu.isActive }"
            class="menu cursor-pointer non-selectable"
            style="margin: 5px 15px 5px 15px"
          >
            {{ menu.name }}
            <q-menu>
              <q-list dense style="min-width: 100px">
                <q-separator />
                <q-item
                  :to="submenu.hashChild ? '' : submenu.path"
                  v-for="submenu in mymenu.filter((m) => {
                    return m.parentId === menu.id;
                  })"
                  v-bind:key="'sm' + submenu.id"
                  clickable
                >
                  <q-item-section
                    @click="onSelect(submenu)"
                    :class="{ active: submenu.isActive }"
                    >{{ submenu.name }}</q-item-section
                  >
                  <q-item-section v-if="submenu.hashChild" side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>

                  <q-menu
                    v-if="submenu.hashChild"
                    anchor="top end"
                    self="top start"
                  >
                    <q-list>
                      <q-item
                        :to="submenu2.hashChild ? '' : submenu2.path"
                        v-for="submenu2 in mymenu.filter((m) => {
                          return m.parentId === submenu.id;
                        })"
                        :key="'sm' + submenu2.id"
                        dense
                        clickable
                      >
                        <q-item-section
                          @click="onSelect(submenu2)"
                          :class="{ active: submenu2.isActive }"
                          >{{ submenu2.name }}</q-item-section
                        >
                        <q-item-section v-if="submenu2.hashChild" side>
                          <q-icon name="keyboard_arrow_right" />
                        </q-item-section>
                        <q-menu anchor="top end" self="top start">
                          <q-list>
                            <q-item
                              :to="submenu3.hashChild ? '' : submenu3.path"
                              v-for="submenu3 in mymenu.filter((m) => {
                                return m.parentId === submenu2.id;
                              })"
                              :key="'sm' + submenu3.id"
                              dense
                              clickable
                            >
                              <q-item-section
                                @click="onSelect(submenu3)"
                                :class="{ active: submenu3.isActive }"
                                >{{ submenu3.name }}</q-item-section
                              >
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>

                <q-separator />
              </q-list>
            </q-menu>
          </div>
        </div>
        <q-space />
        <!-- <search-bar /> -->

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            clickable
            to="/Notification"
            round
            dense
            flat
            color="white"
            icon="notifications"
          >
            <q-badge
              v-if="tintuc.length > 0"
              color="red"
              text-color="white"
              floating
              >{{ tintuc.length }}</q-badge
            >
            <q-tooltip>Xem thông báo</q-tooltip>
          </q-btn>
          <q-btn label="tài khoản" color="orange">
            <!-- <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar> -->
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable to="/wms-accounts" v-close-popup>
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

    <!-- <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="240"
      class="print-hide"
    >
      <q-scroll-area class="fit">
        <q-list bordered separator padding>
          <q-expansion-item
            expand-separator
            :header-inset-level="0"
            :content-inset-level="0"
            :label="menu.name"
            header-class="bg-blue-grey text-amber text-bold"
            v-for="menu in mymenu.filter((m) => {
              return m.parentId === null && m.hashChild === true;
            })"
            v-bind:key="'m' + menu.id"
          >
            <q-item
              dense
              :to="submenu.path"
              clickable
              v-ripple
              v-for="submenu in mymenu.filter((m) => {
                return m.hashChild === false && m.parentId === menu.id;
              })"
              v-bind:key="'sm' + submenu.id"
            >
              <q-item-section>{{ submenu.name }}</q-item-section>
            </q-item>
            <q-expansion-item
              dense
              :header-inset-level="0"
              :content-inset-level="0.5"
              :label="submenu.name"
              header-class="text-blue-10"
              v-for="submenu in mymenu.filter((m) => {
                return m.parentId === menu.id && m.hashChild === true;
              })"
              v-bind:key="'sm1' + submenu.id"
            >
              <q-item
                :to="submenu3.path"
                dense
                clickable
                style="
                  border: 1px solid #eceff1;
                  margin: 2px;
                  background-color: #eceff1;
                "
                v-ripple
                v-for="(submenu3, index) in mymenu.filter((m) => {
                  return m.parentId === submenu.id && m.hashChild === false;
                })"
                v-bind:key="index"
              >
                <q-item-section>{{ submenu3.name }}</q-item-section>
              </q-item>
              <q-expansion-item
                dense
                :label="submenu2.name"
                :header-inset-level="0"
                :content-inset-level="0.2"
                v-for="submenu2 in mymenu.filter((m) => {
                  return m.parentId === submenu.id && m.hashChild === true;
                })"
                v-bind:key="'sm2' + submenu2.id"
              >
                <q-item
                  dense
                  style="
                    border: 1px solid #eceff1;
                    margin: 2px;
                    background-color: #eceff1;
                  "
                  :to="submenu4.path"
                  clickable
                  v-ripple
                  v-for="submenu4 in mymenu.filter((m) => {
                    return m.hashChild === false && m.parentId === submenu2.id;
                  })"
                  v-bind:key="'sm4' + submenu4.id"
                >
                  <q-item-section>{{ submenu4.name }}</q-item-section>
                </q-item>
                <q-expansion-item
                  dense
                  :label="submenu5.name"
                  :header-inset-level="0"
                  :content-inset-level="0.2"
                  v-for="submenu5 in mymenu.filter((m) => {
                    return m.parentId === submenu2.id && m.hashChild === true;
                  })"
                  v-bind:key="'sm5' + submenu5.id"
                >
                  <q-item
                    dense
                    :to="submenu4.path"
                    clickable
                    v-ripple
                    v-for="submenu4 in mymenu.filter((m) => {
                      return (
                        m.hashChild === false && m.parentId === submenu5.id
                      );
                    })"
                    v-bind:key="'sm42' + submenu4.id"
                  >
                    <q-item-section>{{ submenu4.name }}</q-item-section>
                  </q-item>
                </q-expansion-item>
              </q-expansion-item>
            </q-expansion-item>
          </q-expansion-item>
          <q-separator class="q-mt-md q-mb-lg" />

          <div class="q-px-md text-grey-9 draw">
            <div class="row items-center q-gutter-x-sm q-gutter-y-xs">
              <a
                v-for="button in buttons1"
                :key="'bt1' + button.text"
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
                :key="'bt2' + button.text"
                class="YL__drawer-footer-link"
                href="javascript:void(0)"
                >{{ button.text }}</a
              >
            </div>
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer> -->

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
  DxSearchPanel,
} from "devextreme-vue/tree-list";
import moment from "moment";
import { formatDateISO, getFisrtDayOfMonth, formatDateVN } from "../ultils";
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
    DxSearchPanel,
  },
  computed: {
    ...mapGetters("base", ["myFactoryInfor", "mySources", "userInfo"]),
  },
  data() {
    return {
      expandedRowKeys: [],
      selectedRowKeys: [],
      mymenu: [],
      tintuc: [],
      i: 0,
      toDate: null,
      color: ["#1976d2", "#1976d2", "#ffb74d", "#607d8b", "#21ba45", "#31ccec"],
      leftDrawerOpen: true,
      buttons1: [
        // { text: "Giới thiệu" },
        // { text: "Liên hệ" },
      ],
      buttons2: [],
      behavior: "mobile",
      registration: false,
      dataProfile: null,
      email: null,
      phoneNumber: null,
    };
  },
  async created() {
    this.toDate = new Date();
    this.toDate.setDate(this.toDate.getDate() + 1);
    // this.getAllAccounts();
    // createdby : HTHIEU(2021-02-22)
    // check email và SĐT đã được đki hay chưa

    console.log("userInfo", this.userInfo);
    this.$root.$on("logout", (e) => {
      this.mymenu = [];
    });
    this.$root.$on("login", (e) => {
      let mymenu = this.$store.getters["base/myMenu"];
      mymenu.sort((a, b) => a.stt - b.stt);
      this.mymenu = mymenu.filter((e) => e.name);
    });
    let mymenu = this.$store.getters["base/myMenu"];
    mymenu.sort((a, b) => a.stt - b.stt);
    this.mymenu = mymenu.filter((e) => e.name);
    let test = mymenu.filter((m) => {
      return m.parentId === null && m.hashChild === true;
    });
    console.log("this.menu", test);
    this.fabYoutube = fabYoutube;
    // this.mymenu =this.$store.getters['base/myMenu']

    this.$store.getters["base/myMenu"].forEach((element) => {
      // console.log(this.$store.getters['base/myMenu'].filter(m=>{return m.parentId===element.id}).length>0)
      if (element.parentId === null && element.name) {
        this.expandedRowKeys.push(element.id);
      }
    });
    let c = moment();
    let d = moment(localStorage.getItem("last_login"));
    let e = c.diff(d, "days");
    console.log("thoi gian:", e);
    if (e >=15) {
      this.$q.notify({
        message: "Hết thời hạn đăng nhập!",
        color: "primary",
        position: "center",
        timeout: 500,
      });
      if (this.$route.path !== "/") {
        this.$router.push("/");
        this.$store.dispatch("base/LOGOUT");
      } else {
        this.$store.dispatch("base/LOGOUT");
      }
      this.$root.$emit("logout");
    }
    var mediaQueryList = window.matchMedia("print");
    mediaQueryList.addListener(function (mql) {
      if (mql.matches) {
        // this.leftDrawerOpen=false
      }
    });
    window.addEventListener("beforeprint", function (event) {
      this.behavior = "mobile";
    });
  },
  watch: {
    selectedRowKeys(val) {
      const path = this.$store.getters["base/myMenu"].find((m) => {
        return m.id === val[0];
      }).path;
      // console.log(val)

      this.$router.push(path).catch((err) => {
        this.$q.notify({ message: err.message });
      });
    },
  },
  methods: {
    ...mapActions("ordersm", ["getAllAccounts", "getAllDepartments"]),
    ...mapActions("base", ["GET_DEPARTMENTSBYID", "getAccountByID", "updUser"]),
    ...mapActions("item", ["getItemsByFactoryId"]),
    goHome() {},
    onBackHome() {
      this.mymenu.forEach((el) => {
        el.isActive = false;
      });
    },
    onSelect(menu) {
      this.mymenu.forEach((el) => {
        el.isActive = false;
      });
      console.log("menu", menu);
      let myMenu = menu;
      while (myMenu.parentId != null) {
        let index = this.mymenu.findIndex((d) => d.id == myMenu.id);
        this.mymenu[index].isActive = true;
        let index2 = this.mymenu.findIndex((d) => d.id == myMenu.parentId);
        myMenu = this.mymenu[index2];
        console.log("myMenu", myMenu);
      }
      let index3 = this.mymenu.findIndex((d) => d.id == myMenu.id);
      this.mymenu[index3].isActive = true;
    },
    async confirm() {
      let payload = {
        id: this.userInfo.id,
        email: this.email,
        phoneNumber: this.phoneNumber,
      };
      if (
        this.email == null ||
        this.phoneNumber == null ||
        this.phoneNumber == "null" ||
        this.email == "null" ||
        this.phoneNumber == "" ||
        this.email == ""
      ) {
        this.$q.notify({
          message: "Vui lòng nhập đầy đủ thông tin !",
          color: "primary",
          position: "center",
          timeout: 500,
        });
      } else {
        await this.updUser(payload);
        this.$q.notify({
          message: "Cập nhật thông tin thành công !",
          color: "primary",
          position: "center",
          timeout: 500,
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
    },
  },
};
</script>

<style lang="sass">
.q-separator
  background: white
.relative-position
  padding-bottom: 5px
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
.menu{
  background-color: white;
  padding: 5px 10px 5px 10px;
  border-radius: 20px;
  color: #0b61a5;
  font-size: 12px;
  font-weight: bold;
}
.active,
.menu:hover {
  color: #f6b024;

}
.font-header {
  font-family: Cambria;
}
/* .menu{
  border: 2px solid #f6b024;
  padding: 5px 10px 5px 10px;
  border-radius: 20px;
} */


</style>
