import { postRequest, putRequest, delRequest, getRequest } from "../../ultils";
export async function getAllLenhSanXuats({ commit }) {
    const { data } = await getRequest("/api/v2/production-order/lenh-san-xuat");
    commit("setLenhSanXuats", data);
}
export async function getLenhSanXuatChiTiets({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.number}/ke-hoach-chi-tiet`
    );
    commit("setKeHoachSanXuats", data);
}
export async function getTinhHeSoLSX({ commit }, number) {
    const { data } = await getRequest(`/api/v2/production-order/numberLSX?number=` + number);
    return data;
}
export async function InsertItemInPackageByBirch({ commit }, payload) {
    const { data } = await postRequest(`/api/v2/production-order/item-in-package-by-birch`, payload);
    return data;
}

export async function insertBirch({ commit }, payload) {
    const { data } = await postRequest(`/api/v2/production-order/birch`, payload);
    return data;
}

export async function getLenhSanXuatCapPhois({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/ke-hoach-san-xuat-cong-doan`
    );
    commit("setKeHoachSanXuats", data);
}
export async function getLenhSanXuatchuaduyet({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/ke-hoach-san-xuat-cong-doan-chua-duyet?week=${payload.week}&year=${payload.year}`
    );
    commit("setKeHoachSanXuats", data);
}

export async function getLenhSanXuatCapPhoispheduyet({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/ke-hoach-san-xuat-cong-doan-phe-duyet?week=${payload.week}&year=${payload.year}`
    );
    commit("setKeHoachSanXuats", data);
}
export async function getLichsusuapo({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/lich-su-sua-po?week=${payload.week}&year=${payload.year}`
    );
  return  data
}
export async function trangthaiLSX({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/bc-trang-thai-lsx?week=${payload.week}&year=${payload.year}`
    );
  return  data
}
export async function getsoLenhSanXuatCapPhois({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/so-ke-hoach-san-xuat-cong-doan-2`
    );
    return data;
    // console.log('Load so lenh')
    // console.log(data)
    // commit("setKeHoachSanXuats", data);
}

export async function getBaoCaoCapPhoiSanXuats({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/rp-ke-hoach-san-xuat`
    );
    commit("setKeHoachSanXuats", data);
}

export async function getBaoCaoThucHienSanXuats({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/rp-thuc-hien-san-xuat`
    );
    commit("setKeHoachSanXuats", data);
}

export async function getBaoCaoThucHienDongGois({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/rp-thuc-hien-dong-goi`
    );
    commit("setKeHoachSanXuats", data);
}

export async function updatePo({ commit }, payload) {
    const { data } = await putRequest(
        `/api/v2/production-order/${payload.code}`,
        payload
    );
    return data;
}

export async function deletePoById({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/deletePoById?id=`+payload.id
    );
    return data;
}

export async function getAllSoLenhSanXuats({ commit }) {
    const { data } = await getRequest(`/api/v2/production-order/numbers`);
    commit("setSoLenhSanXuats", data);
    return data;
}
export async function getKeHoachDongGois({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.number}/lay-ke-hoach-thuc-hien-san-xuat`
    );
    commit("setKeHoachDongGois", data);
}
export async function getAllSoLenhSanXuatCons({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/ke-hoach-san-xuat-con`
    );

    commit("setSoLenhSanXuatCons", data);
    return data
}
export async function getAllSoLenhSanXuatConsBTP({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.factoryId}/ke-hoach-san-xuat-con-BTP`
    );

   // commit("setSoLenhSanXuatCons", data);
    return data
}

export async function resetKeHoachSanXuat({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/production-order/${payload.number}/reset-ke-hoach`
    );
    return data;
}
// export async function getLenhSanXuatnew({ commit }, payload) {
//     const { data } = await getRequest(
//         `/api/v2/production-order/${payload.factoryId}/ke-hoach-san-xuat-new`
//     );
//     commit("setKeHoachSanXuats", data);
// }
// export async function getLenhSanXuatnew1({ commit }, payload2) {
//     const { data } = await getRequest(
//         `/api/v2/production-order/${payload2.factoryId}/ke-hoach-san-xuat-new1`
//     );
//     commit("setKeHoachSanXuats", data);
// }
export async function getLenhSanXuatupdate({ commit }, payload) {
    let data = await postRequest(
        `/api/v2/production-order/ke-hoach-san-xuat-update`, payload
    );
    return data.data;
}
export async function getLenhSanXuatkythuat({ commit }, payloadkythua) {
    let data = await postRequest(
        `/api/v2/production-order/ke-hoach-san-xuat-kythuat`, payloadkythua
    );
    return data.data;
}
export async function getLenhSanXuatdinhtuyen({ commit }, payloaddinhtuyen) {
    let data = await postRequest(
        `/api/v2/production-order/ke-hoach-san-xuat-dinh-tuyen`, payloaddinhtuyen
    );
    return data.data;
}
export async function POST_NHAP_SO_DIEN({ commit }, payload) {
    let data = await postRequest(
        `/api/v2/production-order/post-nhap-so-dien`, payload
    );
    return data.data;
}
export async function POST_NHAP_DM_DIEN({ commit }, payload) {
    let data = await postRequest(
        `/api/v2/production-order/post-nhap-dm-dien`, payload
    );
    return data.data;
}