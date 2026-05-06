import { getRequest, postRequest, putRequest, delRequest } from "../../ultils";
import { api } from "../../ultils/api";

export async function getAllPos({ commit }, payload) {
    let data = await getRequest(api.P_POS + "?factoryId=" + payload.factoryId);
    commit("setPos", data.data);
}

export async function taoPhoi({ commit }, poIds) {
    return await putRequest(api.P_POS + "/none/tao", {
        poIds
    });
}

export async function getAllPoPrint({ commit }, payload) {
    let data = await getRequest(
        api.P_POS + "/print/print?factoryId=" + payload.factoryId
    );
    commit("setPos", data.data);
}
export async function getAllPoApproved({ commit }, payload) {
    let { factoryId } = payload;
    let data = null;
    if (factoryId) data = await getRequest(`/api/v2/khsx/${factoryId}/approved`);
    if (data.data) commit("setApprovedPos", data.data);

    return data.data;
}

export async function sendApproved({ commit }, payload) {
    // let { accountId, poIds } = payload;
    await putRequest(`/api/v2/khsx/${payload.accountId}/approved`, payload);
}
export async function sendApproved2({ commit }, payload) {
    await putRequest(`/api/v2/khsx/${payload.accountId}/approved-2`, payload);
}
export async function deletePos({ commit }, payload) {
    let { accountId, poIds } = payload;
    await putRequest(`/api/v2/khsx/${accountId}/xoa-ke-hoach`, { poIds });
}
export async function deletePos2({ commit }, payload) {
    let { accountId, lsxs } = payload;
    console.log(lsxs)
    await putRequest(`/api/v2/khsx/${accountId}/xoa-ke-hoach-2`, { lsxs });
}

export async function getAllBom({ commit }, payload) {
    let data = await getRequest(
        api.P_POS + "/all/bom?factoryId=" + payload.factoryId
    );
    commit("setBoms", data.data);
}

export async function getAllThucHienKHSX({ commit }, payload) {
    let data = await getRequest(
        api.P_POS + "/khsx/thuchien" + "?factoryId=" + payload.factoryId + "&idDepartment=" + payload.idDepartment + "&fromWeek=" + payload.fromWeek + "&toWeek=" + payload.toWeek+ "&year="+payload.year
    );
    commit("setPos", data.data);
    return data;
}
//createdby HTHIEU(2021-09-03)
export async function getDepartment({ commit }, payload) {
    let data = await getRequest(
        api.P_POS + "/khsx/getDepartment" + "?departmentId=" + payload.departmentId
    );
    // commit("setPos", data.data);
    return data.data.data;
}
export async function getNumberByPO({ commit }, payload) {
    let data = await getRequest(
        api.P_POS + "/khsx/getNumberByPO" + "?departmentId=" + payload.departmentId + "&year=" + payload.year + "&week=" + payload.week
    );
    // commit("setPos", data.data);
    return data.data.data;
}
export async function getSXByDepartment({ commit }, payload) {
    let data = await getRequest(
        api.P_POS + "/khsx/thuchienByDepartment" + "?departmentId=" + payload.departmentId + "&year=" + payload.year + "&week=" + payload.week + "&number=" + payload.number
    );
    commit("setPos", data.data);
    return data;
}

export async function updateBom({ commit }, { key, values }) {
    await putRequest(api.P_POS + "/" + key + "/update-bom", {
        rate: values.rate
    });
}
export async function getAllRouting({ commit }) {
    let data = await getRequest(api.P_POS + "/all/routing");
    commit("setRoutings", data.data);
}

export async function updateRouting({}, { key, values }) {
    await putRequest(api.P_POS + "/" + key + "/update-routing", {
        values
    });
}
export async function DELETE_PO({ commit }, payload) {
    let res = await getRequest(
        
        "/api/v2/san-luong/deletePO" +
        "?number=" +
        payload.number +
        "&factoryId=" +
        payload.factoryId
    );
    return res.data;
}
export async function TUCHOI_PO({ commit }, payload) {
    let res = await getRequest(
        
        "/api/v2/san-luong/tuChoiPO" +
        "?number=" +
        payload.number +
        "&factoryId=" +
        payload.factoryId
    );
    return res.data;
}
export async function getNumberInLSX({ commit }, payload) {
    let res = await getRequest(  
        `/api/v2/san-luong/number-in-lsx?factoryId=${payload.factoryId}&week=${payload.week}&year=${payload.year}`
    );
    return res.data;
}
export async function getDepartmentInLSX({ commit }, payload) {
    let res = await getRequest(  
        `/api/v2/san-luong/department-in-lsx?number=${payload.number}`
    );
    return res.data;
}
export async function getNumberstepId({ commit }, payload) {
    let res = await getRequest(  
        `/api/v2/san-luong/department-lsx-updated?number=${payload.number}&stepId=${payload.stepId}`
    );
    return res.data;
}
export async function closeStepInLSX({ commit }, payload) {
    let res = await putRequest(  
        `/api/v2/san-luong/close-step-in-lsx`, payload
    );
    return res.data;
}
export async function openStepInLSX({ commit }, payload) {
    let res = await putRequest(  
        `/api/v2/san-luong/open-step-in-lsx`, payload
    );
    return res.data;
}
export async function updatedinhtuyen({ commit }, payload) {
    let res = await putRequest(  
        `/api/v2/san-luong/update-dinh-tuyen`, payload
    );
    return res;
}
export async function getPoLogByNumber({ commit }, payload) {
    let res = await getRequest(  
        `/api/v2/san-luong/po-log-by-number?number=${payload.number}`
    );
    return res.data;
}
export async function getCodeInMarket({ commit }, payload) {
    let res = await getRequest(  
        `/api/v2/san-luong/code-in-market`
    );
    return res.data;
}
export async function getMainPrices({ commit }, payload) {
    let res = await getRequest(  
        `/api/v2/san-luong/main-prices?code=${payload.code}`
    );
    return res.data;
}
export async function insertMainPrices({ commit }, payload) {
    let res = await postRequest(  
        `/api/v2/san-luong/main-prices`, payload
    );
    return res.data;
}
export async function updateMainPrices({ commit }, payload) {
    let res = await putRequest(  
        `/api/v2/san-luong/main-prices`, payload
    );
    return res.data;
}
export async function deleteMainPrices({ commit }, payload) {
    let res = await delRequest(  
        `/api/v2/san-luong/main-prices/${payload.id}`,
    );
    return res.data;
}
export async function getExchangeRate({ commit }, payload) {
    let res = await getRequest(  
        `/api/v2/san-luong/exchange-rate`
    );
    return res.data;
}
export async function insertExchangeRate({ commit }, payload) {
    let res = await postRequest(  
        `/api/v2/san-luong/exchange-rate`, payload
    );
    return res.data;
}
export async function updateExchangeRate({ commit }, payload) {
    let res = await putRequest(  
        `/api/v2/san-luong/exchange-rate`, payload
    );
    return res.data;
}

export async function deleteExchangeRate({ commit }, payload) {
    let res = await delRequest(  
        `/api/v2/san-luong/exchange-rate/${payload.id}`
    );
    return res.data;
}