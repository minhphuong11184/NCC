
import { getRequest, postRequest, putRequest} from "../../utils/utils";
import Axios from "axios";

export async function INSERT_INFORMATION({ commit }, payload) {
    const data = await postRequest(
        "/api/v2/notify/insert-information" ,
        payload
    );
    return data.data;
}
export async function INSERT_REQUEST({ commit }, payload) {
    const data = await postRequest(
        "/api/v2/notify/insert-request" ,
        payload
    );
    return data.data;
}
export async function CONFIRM_INFORMATION({ commit }, payload) {
    const data = await getRequest(
        `/api/v2/notify/confirm-information?from=${payload.fromDate}&to=${payload.toDate}`
    );
    return data.data;
}
export async function COUNT_CONFIRM_INFORMATION({ commit }, payload) {
    const data = await getRequest(
        `/api/v2/notify/count-confirm-information?from=${payload.fromDate}&to=${payload.toDate}`
    );
    return data.data;
}
export async function UPDATE_INFORMATION({ commit }, payload) {
    const data = await putRequest(
        "/api/v2/notify/update-information/"+payload.ID ,
        payload
    );
    return data.data;
}
export async function DELETE_INFORMATION({ commit }, payload) {
    const data = await putRequest(
        "/api/v2/notify/delete-information/"+payload.id ,
        payload
    );
    return data.data;
}
export async function INFORMATIONS({ commit }, payload) {
    const data = await getRequest(
        "/api/v2/notify/informations?start=" + payload.fromDate + "&end=" + payload.toDate,
    );
    return data.data;
}
export async function REQUESTS({ commit }, payload) {
    const data = await getRequest(
        "/api/v2/notify/requests?accountId=" + payload.accountId + "&end=" + payload.toDate + "&start=" + payload.fromDate,
    );
    return data.data;
}
export async function GET_DEPARTMENT_BY_INFO({ commit }) {
    const data = await getRequest(
        "/api/v2/notify/department-by-infoId"
    );
    return data.data;
}
export async function VIEW_TIN_TUC({ commit }, payload) {
    const data = await getRequest(
        "/api/v2/notify/viewtintuc" + "?accountId=" + payload.accountId + 
        "&start=" + payload.fromDate + "&end=" + payload.toDate,
        payload
    );
    return data.data;
}
export async function VIEW_TIN_TUC_TB({ commit }, payload1) {
    const data = await getRequest(
        `/api/v2/notify/viewtintuctb?deparmentId=${payload1.departmentId}&accountId=${payload1.accountId}`
    );
    return data.data;
}
export async function VIEW_PHONG_BAN({ commit }, payload) {
    const data = await getRequest(
        `/api/v2/notify/viewphongban?id=${payload.ID}&infoId=${payload.infoId}`
    );
    return data.data;
}
export async function getCodeInNotify({ commit }) {
    const data = await getRequest(
        "/api/v2/notify/code-in-notify"
    );
    return data.data.data;
}
export async function VIEW_FORM_TIN_TUC({ commit }, payload2) {
    const data = await getRequest(
        "/api/v2/notify/viewformid"  + "?accountId=" + payload2.accountId +
        "&infoId=" + payload2.infoId
    );
    return data.data;
}
export async function UPDATE_FORM_TIN_TUC({ commit }, payload) {
    const data = await getRequest(
        "/api/v2/notify/formid"  + "?accountId=" + payload.accountId +
        "&infoId=" + payload.infoId
    );
    return data.data;
}


