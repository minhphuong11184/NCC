import { getRequest, putRequest } from "../../ultils";
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
    let { accountId, poIds } = payload;
    await putRequest(`/api/v2/khsx/${accountId}/approved`, { poIds });
}
export async function sendApproved2({ commit }, payload) {
    let { accountId, lsxs } = payload;
    console.log(lsxs)
    await putRequest(`/api/v2/khsx/${accountId}/approved-2`, { lsxs });
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
        api.P_POS + "/khsx/thuchien" + "?factoryId=" + payload.factoryId + "&idDepartment=" + payload.idDepartment
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