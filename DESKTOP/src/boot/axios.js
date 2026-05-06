import Vue from "vue";
import axios from "axios";
import moment from "moment";
moment.locale("vi");

Vue.prototype.$axios = axios;
// Auto detect host: nếu mở trên máy server thì là localhost,
// nếu mở từ máy khác trong LAN thì là IP của server.
const apiHost = (typeof window !== "undefined" && window.location && window.location.hostname) || "localhost";
Vue.prototype.$axios.defaults.baseURL = "http://" + apiHost + ":2003";
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
