import { putRequest, getRequest, postRequest, delRequest } from "../../ultils";
import { api } from "../../ultils/api";

export async function getItems({ commit }, { factoryId }) {
    let data = await getRequest(api.B_ITEMS + "?factoryId=" + factoryId);

    commit("setItems", data.data);
}
export async function getItemsByFactoryId({ commit }, payload) {
    const { data } = await getRequest(`/api/v3/items/${payload.factoryId}/items`);
    commit("setItems", data);
}
export async function getItemInMarket({ commit }) {
    const { data } = await getRequest(api.B_ITEMS+`/market`);
    return data;
}
export async function getVatTuByType({ commit }, payload) {
    const { data } = await getRequest(api.B_ITEMS+`/ma-vt?type=${payload.type}`);
    return data;
}
export async function themDinhMucVatTu({ commit }, payload) {
    const { data } = await postRequest(api.B_ITEMS+`/insert-dinh-muc-vt`, payload);
    return data;
}
export async function updateDinhMucVT({ commit }, payload) {
    const { data } = await putRequest(api.B_ITEMS+`/update-dinh-muc-vt`, payload);
    return data;
}
export async function deleteDinhMucVT({ commit }, payload) {
    const { data } = await delRequest(api.B_ITEMS+`/delete-dinh-muc-vt/`+payload.id);
    return data;
}
export async function getDinhMucByMarket({ commit }, payload) {
    const { data } = await getRequest(api.B_ITEMS+`/dinh-muc-by-market?marketCode=${payload.marketCode}`);
    return data;
}

export async function updateItem({ commit }, { key, values }) {
    await putRequest(api.B_ITEMS + "/" + key, {
        heSo: values.heSo
    });
}
export async function getItemsVan({ commit }) {
    const { data } = await getRequest(api.B_ITEMS + "/van");
    return data;

}
export async function getItemVanity({ commit }, payload) {
    try {
        const data = await getRequest(api.B_ITEMS + "/vanity");
        return data.data.recordset;
    } catch (err) {
        return err
    }
}
export async function getItemtypes({ commit }, payload) {
 
        const data = await getRequest(api.B_ITEMS + "/types");
        return data.data;
 
    
}
export const getBCXuatCatHaCap = async({ commit }, payload) => {
    const { data } = await getRequest(
        api.B_ITEMS+`/bc-xuat-cat-ha-cap?factoryId=${payload.factoryId}&start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};