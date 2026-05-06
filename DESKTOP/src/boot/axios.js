import Vue from "vue";
import axios from "axios";
import moment from "moment";
moment.locale("vi");

Vue.prototype.$axios = axios;
if (process.env.PROD) {
  Vue.prototype.$axios.defaults.baseURL = "https://app.woodsland.com.vn:2002";
} else {
  Vue.prototype.$axios.defaults.baseURL = "http://localhost:2003";
}
Vue.prototype.moment = moment;

Vue.filter("lastName", function (accountId) {
  if (typeof Storage !== "undefined") {
    if (sessionStorage.getItem("NHAN_VIEN_CACHED") !== null) {
      // Caching danh sach Nhan Vien
      const dsNhanVien = JSON.parse(sessionStorage.getItem("NHAN_VIEN_DATA"));
      const foundNV = dsNhanVien.find(i => i.id == accountId);
      return foundNV ? foundNV.lastName : accountId;
    }
  }
});
