import moment from "moment";

export function LOGIN(state, userInfo) {

  // localStorage.setItem("last_login", new Date().toISOString().slice(0, 10));
    state.userInfo = userInfo;
}
export function LOGOUT(state) {
    state.userInfo = {};
    localStorage.removeItem("userInfo");
    localStorage.removeItem("last_login");
    state.isLogout = false;
    state.userInfo = null;
}
export function SET_LOGOUT(state) {
    state.userInfo = null;
    state.isLogout = true;
}
export function CANCEL_LOGOUT(state) {
    state.isLogout = false;
}
export function SELECT_ITEM(state, currentItem) {
    state.currentItemSelected = currentItem;
}
export function REMOVE_ITEM(state) {
    state.currentItemSelected = {};
}
// /SELECT_MATERIRAL
export function SELECT_MATERIRAL(state, currentItem) {
    state.currentMaterialSelected = currentItem;
}
export function SELECT_ROLE(state, roleInfo) {
    state.roleInfoById = roleInfo;
}
export function reset(state) {
    // state.isLogout = state.getDefaultState
    // Object.assign(state, state.getDefaultState)
}

export function setDSCongDoans(state, payload) {
    state.dsCongDoans = payload;
}

export function setMarkets(state, payload) {
    state.markets = payload;
}

export function setMenus(state, payload) {
    state.menus = payload;
}

export const setDepartments = (state, payload) => (state.departments = payload);