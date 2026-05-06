import {
    isObjectEmpty,
    postRequest,
    putRequest,
    setToken,
    delRequest,
    setBaseUrl,
    getRequest
} from "../../ultils";
import moment from "moment";
import { api } from "../../ultils/api";
export async function LOGIN({ commit }, userReq) {
    let data = await postRequest(api.AUTH, userReq);
    if (data.data.meta.success) {
        localStorage.setItem("userInfo", JSON.stringify(data.data.data));
        localStorage.setItem("last_login",  moment().subtract(6,'hours').format("YYYY-MM-DD"));
        commit("LOGIN", data.data.data);
    }
}
export function AUTO_LOGIN({ commit }, userInfo) {
    if (!isObjectEmpty(userInfo.token)) {
        setToken(userInfo.token);
        commit("LOGIN", userInfo);
    } else {
        commit("LOGOUT");
    }
}
export function SET_LOGOUT({ commit }) {
    commit("SET_LOGOUT");
}
export function CANCEL_LOGOUT({ commit }) {
    commit("CANCEL_LOGOUT");
}
export function SET_BASE_URL(url) {
    setBaseUrl(url);
    return true;
}
export async function GET_VENDORS({ commit }, payload) {
    //cbg,vcg
    let data = await getRequest(api.VENDOR + "?module=" + payload.module);
    return data.data;
}
export async function ADD_VENDORS({ commit }, payload) {
    let data = await postRequest(api.VENDOR, payload);
    return data.data;
}
export async function UPDATE_VENDOR({ commit }, payload) {
    let data = await putRequest(api.VENDOR + "/" + payload.id, payload.data);
    return data.data;
}
//upd user HTHIEU( 2021-02-22)
export async function updUser({ commit }, payload) {
    let res = await putRequest(`/api/v2/account-profile?id=${payload.id}`, payload);
    return res.data;
}

export async function getUser({ commit }) {
    let res = await getRequest(`/api/v2/account-profile/all`);
    return res.data;
}

export async function updateUser({ commit }, payload) {
    let res = await putRequest(`/api/v2/account-profile/update`, payload);
    return "OK";
}

export async function GET_ITEMS({ commit }, payload) {
    let query = `?factoryId=` + payload.factoryId;
    if (payload.typeId) {
        query += "&typeId=" + payload.typeId;
    }
    let data = await getRequest(api.ITEMS + query);
    return data.data;
}

export async function ADD_ITEM({ commit }, payload) {
    let data = await postRequest(api.ITEMS, payload);
    return data.data;
}
export async function UPDATE_ITEM({ commit }, payload) {
    let data = await putRequest(api.ITEMS + "/" + payload.id, payload.data);
    return data.data;
}
export async function GET_ITEM_TYPES({ commit }, payload) {
    let query = ``;
    if (payload.typeId) {
        query = `?id=` + payload.typeId;
    }
    let data = await getRequest(api.ITEM_TYPE + query);
    return data.data;
}
export async function GET_UNITS({ commit }, payload) {
    let data = await getRequest(api.UNITS);
    return data.data;
}
export async function GET_DEPARTMENTS({ commit }, payload) {
    let data = await getRequest(
        api.DEPARTMENTS + "?factoryId=" + payload.factoryId
    );

    return data.data;
}
export async function GET_DEPARTMENTS_FULL({ commit }) {
    let data = await getRequest(
        api.DEPARTMENTS + "/full/department"
    );

    return data.data;
}
export async function GET_POSITION({ commit }) {
    let data = await getRequest(
        api.DEPARTMENTS + "/position"
    );

    return data.data;
}

export async function GET_DEPARTMENTSBYID({ commit }, id) {
    let data = await getRequest("/api/v1/departmentForm?id=" + id);
    console.log(data.data.data);
    return data.data.data[0];
}

export async function GET_DEPARTMENTSALL({ commit }) {
    let data = await getRequest("/api/v1/departmentAll");
    console.log(data.data.data);
    return data.data.data;
}
export async function CREATE_MENU({ commit }, payload) {
    const data = await postRequest(api.DM_MENU, payload);
    return data.data;
}
export async function CREATE_DEPARTMENT({ commit }, payload) {
    const data = await postRequest(api.DEPARTMENTS, payload);
    return data.data;
}
export async function UPDATE_DEPARTMENT({ commit }, payload) {
    let data = await putRequest(api.DEPARTMENTS + "/" + payload.id, payload.data);
    return data.data;
}
export async function DELETE_DEPARTMENT({ commit }, id) {
    const data = await postRequest(api.DEPARTMENTS + "/del" + id);
    return data.data;
}
export function SELECT_ITEM({ commit }, currentItemSelected) {
    commit("SELECT_ITEM", currentItemSelected);
}
export function REMOVE_ITEM({ commit }) {
    commit("REMOVE_ITEM");
}
export function SELECT_MATERIRAL({ commit }, currentItemSelected) {
    commit("SELECT_MATERIRAL", currentItemSelected);
}
export async function CREATE_BOM({ commit }, payload) {
    const data = await postRequest(api.BOM, payload);
    return data.data;
}

export async function GET_ROLE_INFO_BY_ID({ commit }, id) {
    const data = await getRequest(api.GET_ROLE_INFO_BY_ID + id);
    commit("SELECT_ROLE", data.data);
    return data.data;
}
export async function DELETE_ROLE_VALUE({ commit }, id) {
    const data = await delRequest(api.ROLE_VALUES + "/" + id);
    return data.data;
}
export async function ADD_ROLE_VALUE({ commit }, payload) {
    const data = await postRequest(api.ROLE_VALUES, payload);
    return data.data;
}
export function LOGOUT({ commit }) {
    commit("LOGOUT");
    commit("reset");
}
export async function GET_ROLES({ commit }) {
    const data = await getRequest(api.ROLE);
    return data.data;
}
export async function GET_ACCOUNTS({ commit }) {
    const data = await getRequest(api.ACCOUNT);
    return data.data;
}
export async function DELETE_ROLE_VALUE_DESKTOP({ commit },payload) {
    const data = await postRequest(api.ACCOUNT + "/delete-role-value-desktop",payload);
    return data.data;
}
export async function DELETE_ROLE_VALUE_DESKTOP_MOBILE({ commit },payload) {
    const data = await postRequest(api.ACCOUNT + "/delete-role-value-desktop-mobile",payload);
    return data.data;
}
export async function DELETE_ROLE_VALUE_MOBILE({ commit },payload) {
    const data = await postRequest(api.ACCOUNT + "/delete-role-value-mobile",payload);
    return data.data;
}
export async function GET_ACCOUNT_IN_DEPARTMENT({ commit }) {
    const data = await getRequest(api.ACCOUNT+ "/account-in-department");
    return data.data;
}
export async function GET_USER_IN_MENU({ commit },payload) {
    const data = await getRequest(api.ACCOUNT +`/user-in-menu?menuId=${payload.menuId}&type=${payload.type}`);
    return data.data;
}
export async function GET_MENU_PHAN_QUYEN({ commit },payload) {
    const data = await getRequest(api.ACCOUNT +`/menu-phan-quyen?type=${payload.type}&accountId=${payload.accountId}`);
    return data.data;
}
export async function UPDATE_ACCOUNT({ commit }, payload) {
    const data = await putRequest(api.ACCOUNT + "/" + payload.id, payload.data);
    return data.data;
}
export async function DELETE_ACCOUNT({ commit }, payload) {
    const data = await delRequest(api.ACCOUNT + "/" + payload.id);
    return data.data;
}
export async function CREATE_ACCOUNT({ commit }, payload) {
    const data = await postRequest(api.SIGNUP, payload);
    return data.data;
}
export async function GET_IKEA_BY_ITEM({ commit }, itemId) {
    const data = await getRequest(api.IKEA + "/" + itemId);
    return data.data;
}
export async function CREATE_IKEA({ commit }, payload) {
    const data = await postRequest(api.IKEA, payload);
    return data.data;
}
export async function UPDATE_IKEA({ commit }, payload) {
    const data = await putRequest(
        api.IKEA + "/" + payload.productId,
        payload.data
    );
    return data.data;
}
export async function DEL_IKEA({ commit }, id) {
    const data = await delRequest(api.IKEA + "/" + id);
    return data.data;
}
export async function CREATE_ROUTING_INLSX({ commit }, payload) {
    const data = await postRequest(api.ROUTING_NAME, payload);
    return data.data;
}
export async function GET_ROUTING_NAME({ commit }, id) {
    const data = await getRequest(api.ROUTING_NAME + "?factoryId=" + id);
    return data.data;
}
export async function GET_ROUTING_NAME_DETAIL({ commit }, id) {
    const data = await getRequest(api.ROUTING_NAME + "/" + id);
    return data.data;
}
export async function REMOVE_ROUTING_NAME({ commit }, name) {
    const data = await delRequest(api.ROUTING_NAME + "/" + name);
    return data.data;
}
export async function TOOL_CREATE_PACKAGE({ commit }, payload) {
    const data = await postRequest(api.PROD_PACKAGE, payload);
    return data.data;
}
export async function getAllItemsByFactoryId({ commit }, payload) {
    const { data } = await getRequest(`/api/v3/items/${payload.factoryId}/items`);
    return data;
}
export async function getAllCongDoans({ commit }, payload) {
    let { data } = await getRequest(
        `/api/v3/departments/${payload.factoryId}/departments`
    );
    data = data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    commit("setDSCongDoans", data);
}

export async function getAllMarkets({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v3/markets/${payload.factoryId}/markets`
    );
    commit("setMarkets", data);
}
export const getAccountByID = async({ commit }, id) => {
    const { data } = await getRequest("/api/v2/account?accountId=" + id);
    console.log(data.data[0]);
    return data.data[0];
};
// export const insertXemPhieuLuong = async({ commit }) => {
//     const data = await getRequest(api.ACCOUNT+ "/xem-phieu-luong");
//     return data.data;
// };

export const getAllDepartment = async({ commit }) => {
    let { data } = await getRequest("/api/v3/departments/all");
    data = data.sort((a,b) => (a.NAME > b.NAME) ? 1 : ((b.NAME > a.NAME) ? -1 : 0));
    commit("setDepartments", data);
    return data
};

export const getAllMenus = async({ commit }) => {
    const { data } = await getRequest("/api/v3/menu");
    commit("setMenus", data.data);
    return data.data;
};

export const getMenuDesk = async({ commit }, payload) => {
    const { data } = await postRequest("/api/v2/menu-Eoffice?id=" + payload.id);
    return data.data;
};

export const getMenuMobile = async({ commit }, payload) => {
    const { data } = await getRequest("/api/v2/menu-Eoffice/menu-mobile");
    return data.data;
};

export const addMenuMobile = async({ commit }, payload) => {
    const { data } = await postRequest("/api/v2/menu-Eoffice/menu-mobile",payload);
    return data.data;
};

export const updateMenuMobile = async({ commit }, payload) => {
    const { data } = await putRequest("/api/v2/menu-Eoffice/menu-mobile",payload);
    return data.data;
};

export const addMenu = async({ commit }, payload) => {
    const { data } = await postRequest("/api/v3/menu", payload);
    if (data && data.meta.success) {
        const { data } = await getRequest("/api/v3/menu");
        commit("setMenus", data.data);
    }
};

export const updateMenu = async({ commit }, payload) => {
    await putRequest(`/api/v3/menu/${payload.id}`, payload);
    const { data } = await getRequest("/api/v3/menu");
    commit("setMenus", data.data);
};

export const deleteMenu = async({ commit }, payload) => {
    await delRequest(`/api/v3/menu/${payload.id}`);
    const { data } = await getRequest("/api/v3/menu");
    commit("setMenus", data.data);
};
// export const hrmDepartments = async({commit},payload)=>{
//     const {data} = await getRequest('/api/v2/cong-doan/hrmDepartment')
//     return data.data.recordset
// }
export async function IMPORT_ACCOUNTS({ commit }, payload) {
    const data = await postRequest(
        "api/v2//account-profile",
        payload
    );
    return data.data;
}