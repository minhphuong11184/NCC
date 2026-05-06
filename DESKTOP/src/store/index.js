import Vue from "vue";
import Vuex from "vuex";

import base from "./base";
import keHoach from "./ke-hoach";
import report from "./report";
import prod from "./prod";
import nlvan from "./nlvan";
import nlg from "./nlg";
import item from "./item";
import po from "./po";
import itemInPackages from "./packages";
import sanxuat from "./sanxuat";
import eof from "./e-office";
import eofm from "./eof";
import production from "./production";
import lenhSanXuats from "./lenh-san-xuat";
import vcn from "./vcn"
import NOTIFY from "./NOTIFY"
import machine from "./machine";
import phieuRaCong from "./phieuRaCong"
import vcnBienGiaNhan from "./vcnBienGiaNhan"
import attendance from "./attendance"

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const Store = new Vuex.Store({
  modules: {
    base,
    keHoach,
    report,
    prod,
    nlvan,
    nlg,
    item,
    po,
    itemInPackages,
    sanxuat,
    ...eofm,
    ...eof,
    production,
    lenhSanXuats,
    phieuRaCong,
    vcn,
    NOTIFY,
    machine,
    vcnBienGiaNhan,
    attendance,
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV
});
export default Store;
