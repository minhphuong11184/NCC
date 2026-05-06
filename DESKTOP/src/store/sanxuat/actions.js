import { postRequest, getRequest } from "../../ultils";
import { api } from "../../ultils/api";
export async function getAllTruyNguyen({ commit }, payload) {
    let data = await postRequest(api.P_PACKAGES + "/none/truy-nguyen", payload);
    commit("setThongTinTruyNguyens", data.data);
}
export async function getAllSanLuong({ commit }, payload) {
    let data = await postRequest(api.P_PACKAGES + "/none/san-luong", payload);
    commit("setSanLuongs", data.data);
}
export async function getSanLuongLuaPhoi({ commit }, payload) {
    let data = await postRequest(`api/v2/cong-doan/san-luong-lua-phoi`, payload);
    return data.data;
}
export async function getAllSanLuongchonhan({ commit }, payload) {
    let data = await postRequest(api.P_PACKAGES + "/none/san-luong-cho-nhan", payload);
    commit("setSanLuongs", data.data);
}
export async function getAllnhanNM({ commit }, payload) {
    let data = await postRequest(`/api/v2/san-luong/san-luong-nhan-nm`, payload);
    return data.data.data;
}
export async function getAllnhanmuangoai({ commit }, payload) {
    let data = await postRequest(`/api/v2/san-luong/san-luong-nhan-mua-ngoai`, payload);
    return data.data.data;
}
export async function getSanLuongVanity({ commit }, payload) {
    let data = await getRequest(`/api/v2/san-luong/vanity?fromDate=${payload.fromDate}&toDate=${payload.toDate}&factoryId=${payload.departmentId}`)
    return data.data;
}