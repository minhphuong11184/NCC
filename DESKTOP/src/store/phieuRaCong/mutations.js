import { Loading, QSpinnerIos } from "quasar";
import axios from "axios";
export function REQUEST_PENDING() {
  Loading.show({
    spinner: QSpinnerIos
  });
}
export function REQUEST_DONE() {
  Loading.hide();
}
export function AUTH_SUCCESS_INIT(state, { user, getters }) {
  state.userInfo = user;
  state.myFeatures = getters["myFeatures"];
}
export function AUTH_SUCCESS(state, { user, getters }) {
  // console.log(user)
  state.auth_status = true;
  axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  state.userInfo = user;
  if (state.myFeatures.length < getters.myFeatures.length) {
    state.myFeatures = getters["myFeatures"];
  }
}
export function AUTH_ERROR(state) {
  state.auth_status = false;
}
export function LOGOUT(state) {
  localStorage.removeItem("user_info");
  localStorage.removeItem("last_login");
  state.auth_status = false;
  state.userInfo = {};
}
//chon chuc nag
export function SELECT_FEATURE(state, { feature, getters }) {
  state.featureSelected = feature;
  const featureIndex = getters["myFeatures"].findIndex(f => {
    return f.id === feature.id;
  });
  let cloneFeatureState = getters["myFeatures"];
  cloneFeatureState.forEach(element => {
    element.active = false;
  });
  cloneFeatureState[featureIndex].active = true;
  state.myFeatures = cloneFeatureState;
}
// chọn công đoạn
export function SELECT_SOURCE(state, source) {
  state.sourceSelected = source;
}
export function FETCH_PALLETS_IN_LINE(state, pallets) {
  state.palletsInLine = pallets;
}
// detail pallet
export function FETCH_PALLET_DETAIL(state, pallet) {
  state.palletSelected = pallet;
}
//item
//get all item to state items
export function FETCH_ALL_ITEM(state, items) {
  state.loadItemsDone = false;
  state.items = items;
}
// remove duplicate group item from items
export function IDENTITY_GROUP_ITEMS(state, items) {
  let groups = [];
  // console.log(items)
  items.forEach(element => {
    let isExist = false;
    if (groups.length > 0) {
      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (group === element.typeId) {
          isExist = true;
        }
      }
      if (!isExist) {
        groups.push(element.typeId);
      }
    } else {
      groups.push(element.typeId);
    }
  });
  state.groupItems = groups;
}
//choose item
export function CHOOSE_ITEM(state, item) {
  if (item.id > 0) {
    // nếu là object item thông thường
    state.itemChoosed = item;
  } else {
    // object item select {label,value}
    let it = state.items.find(i => i.id === item.value);
    it.qty = "";
    state.itemChoosed = it;
  }
}
// nối gỗ thô vào item
export function PUSH_ITEMS(state) {
  let dupplicateItems = state.items;
  let dup2 = dupplicateItems.concat(state.woods);
  state.items = dup2;
}
//intit loadSatte create pallet
export function LOAD_DONE_INIT(state) {
  state.loadItemsDone = false;
}
//remove item choose
export function REMOVE_ITEM(state) {
  state.itemChoosed = null;
}
//update qty item choose
export function UPDATE_QTY_ITEM(state, payload) {
  payload.item.qty = payload.qty;
  state.itemChoosed = payload.item;
}
//update qty Material
export function UPDATE_QTY_MATERIAL(state, payload) {
  payload.item.qty = payload.qty;
  state.materialSelected = payload.item;
}
export function FETCH_PACKAGE_TYPE(state, packageTypess) {
  state.packageTypes = packageTypess;
  const palletTypes = packageTypess.filter(obj => {
    return obj.typeId === 100001;
  });
  const palletTypeInOut = packageTypess.filter(obj => {
    return obj.typeId === 100002;
  });
  const defects = packageTypess.filter(obj => {
    return obj.typeId === 100000;
  });
  state.defects = defects;
  state.typePalletInOutdoors = palletTypeInOut;
  state.palletTypes = palletTypes;
}
export function LOAD_DONE_CREATE_PALLET(state) {
  state.loadItemsDone = true;
}

//fetch woods item only
export function FETCH_WOODS_ITEM_ONLY(state, items) {
  state.woods = items;
}
// load xep say done
export function CHANGE_XEP_SAY_DONE(state, status) {
  state.loadXepSayDone = status;
}
//select loại pallet xếp sấy, lưu local và móc ra khi cần :)
export function CHANGE_TYPE_PALLET_XEP_SAY(state, type) {
  state.currentTypeInOutSelected = type;
}
//add woods for woodsSelected
export function ADD_WOODS_SELECT(state, wood) {
  state.woodsSelected.push(wood);
}
//remove 1 wood from woodsSelected
export function REMOVE_WOOD(state, wood) {
  const ws = state.woodsSelected;
  let wIndex = ws.findIndex(w => {
    return w.id === wood.id;
  });
  ws.splice(wIndex, 1);
  state.woodsSelected = ws;
}
//REMOVE ALL WOODSELECTED
export function REMOVE_ALL_WOODSELECTED(state) {
  state.woodsSelected = [];
}
//chon 1 qui cach tho
export function SELECT_MATERIAL(state, material) {
  if (material.id > 0) {
    state.materialSelected = material;
  } else {
    let wood = state.woods.find(w => w.id == material.value);
    state.materialSelected = wood;
  }
}
// xoa material select
export function REMOVE_MATERIAL_SELECTED(state) {
  state.materialSelected = null;
}
// lấy thông tin vật tư
export function FETCH_SUPPLIES(state, supplies) {
  state.supplies = supplies;
}
// lấy THÔNG TIN NHÀ CUNG CẤP
export function FETCH_PROVIDERS(state, providers) {
  state.providers = providers;
}
// â lấy thông tin số lô
export function FETCH_PARCELS(state, parcels) {
  state.parcels = parcels;
}
// lấy thông tin pallewt\ chờ nhận
export function FETCH_PALLET_WAIT_RECIVE(state, pallets) {
  state.palletWaitRecive = pallets;
}
//LẤY THÔNG TIN PALLET ĐẪ XUẤT NHƯNG CHƯA NHẬN
export function FETCH_PALLET_OUT_STOCK(state, pallets) {
  state.palletOutStock = pallets;
}
// mẻ sấy
export function GET_BATCH(state, params) {
  const btchs = params.batchs.filter(b => {
    return b.factoryId === params.factoryId;
  });
  state.batchs = btchs;
}
//chọn mẻ
export function SELECT_BATCH(state, batch) {
  state.batchSelected = batch;
}
export function FETCH_KILNS(state, params) {
  const kil = params.kilns.filter(k => {
    return k.factoryId == params.factoryId;
  });
  state.kilns = kil;
}
// định biên sấy
export function FETCH_RANGES(state, ranges) {
  state.batchRanges = ranges;
}
// chọn invent hoặc package qc
export function SELECT_INVENTORY_QC(state, inv) {
  state.inventoryQCSelected = inv;
}

export function FETCH_SOLUTION_QC(state, solutions) {
  state.solutions = solutions;
}
//lấy list danh sách tồn qc
export function FETCH_INVENTORY_QC(state, invents) {
  state.inventoryQCs = invents;
}
export function GET_TOPICS(state, topics) {
  state.topics = topics;
}
//CHỌN BBMC
export function SELECT_BB_MC(state, bbmc) {
  state.bbmcSelected = bbmc;
}
//CHỌN BBKT
export function SELECT_BB_KT(state, bbmc) {
  state.bbktSelected = bbmc;
}
// chọn bien ban cơ điệnh
export function SELECT_BB_CODIEN(state, bb) {
  state.bbCoDienSelected = bb;
}
export function GET_PRODUCTS(state, products) {
  state.products = products;
}
export function SELECT_DCOC(state, dcoc) {
  state.dcocSelect = dcoc;
}
export function setTonDauKys(state, payload) {
  state.tonDauKys = payload;
}
export function lichsucapphoi(state, payload) {
  state.lichsucapphoi = payload;
}
export function setSanLuongs(state, payload) {
  state.sanLuongs = payload;
}
export function setPos(state, payload) {
  state.pos = payload;
}
