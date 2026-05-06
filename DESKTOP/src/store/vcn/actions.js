
import { getRequest, postRequest, putRequest} from "../../utils/utils";
import Axios from "axios";
import { delRequest } from "src/ultils";

export async function IMPORT_ITEMS({ commit }, payload) {
    const data = await postRequest(
        "api/v2/vcn/importItemsVCN",
        payload
    );
    return data.data;
}

export async function CREATE_PO_VCN({ commit }, payload) {
    const data = await postRequest(
        "api/v2/VCN/create-PO",
        payload
    );
    return data.data;
}
export async function GET_CUSTOMER_VCN({ commit }, payload) {
    const data = await getRequest(
        "api/v2/VCN/customer",
        payload
    );
    return data.data;
}

export async function GET_REPORT_RESULT_DETAIL_VCN({ commit }, payload) {
    const data = await getRequest(
        "api/v2/VCN/raw" +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_GOP_CONG_DOAN_VCN({ commit }, payload) {
    const data = await getRequest(
        "api/v2/VCN/report-gop-cong-doan-vcn" +
        "?factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_DEFECT_DETAIL_VCN({ commit }, payload) {
    const data = await getRequest(
        "api/v2/VCN/defect" +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}

export async function GET_REPORT_QC_SOLUTION_VCN({ commit }, payload) {
    const data = await getRequest(
        "api/v2/VCN/qc-xu-ly-vcn" +
        "?from=" +
        payload.fromDate +
        " 00:00&to=" +
        payload.toDate +
        " 23:59&departmentId=" +
        payload.departmentId
    );
    return data;
}

export async function getBBSanPhamLoiVCN({ commit }, payload) {
    const data = await getRequest(
        `api/v2/VCN/bb-san-pham-loi-vcn?factoryId=${payload.factoryId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59`
    );
    return data;
}

export async function getItemErrorByCodeVCN({ commit }, code) {
    const data = await getRequest(
        `api/v2/VCN/qc-item-error-by-code?code=${code}`
    );
    return data;
}
export async function GET_REPORT_WEEK_IN_VCN({ commit }, payload) {
    const data = await getRequest(
        "api/v2/VCN/week" +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}

export async function GET_PO_BY_NUMBER_VCN({ commit }, payload) {
    const data = await getRequest(
        `api/v2/VCN/getPOBYNumberVCN?number=${payload.number}`,
        payload
    );
    return data.data;
}
export async function GET_TON_KHO_VCN({ commit }, payload) {
    const data = await getRequest(
        `api/v2/VCN/getTONKHOVCN?khovan=${payload.khovan}&itemID=${payload.id}`,
        payload
    );
    return data.data;
}
export async function GET_ITEMS_VCN({commit},payload) {
    const {data} = await getRequest(`api/v2/vcn/itemsVCN`)
    return data
}
export async function GET_NUMBER_PO({commit}) {
    const {data} = await getRequest(`api/v2/vcn/number-in-lsx`)
    return data
}
export async function getLSXByNumber({commit}, payload) {
    const {data} = await getRequest(`api/v2/vcn/lsx-by-number?number=${payload.number}`)
    return data
}
export async function insertHeSoQuyDoi({commit},payload) {
    const {data} = await postRequest(`api/v2/vcn/he-so-quy-doi`, payload)
    return data
}
export async function updateHeSoQuyDoi({commit},payload) {
    const {data} = await putRequest(`api/v2/vcn/he-so-quy-doi`, payload)
    return data
}
export async function deleteHeSoQuyDoi({commit},payload) {
    const {data} = await delRequest(`api/v2/vcn/he-so-quy-doi/${payload.id}`)
    return data
}
export async function getHeSoQuyDoi({commit}) {
    const {data} = await getRequest(`api/v2/vcn/he-so-quy-doi`)
    return data
}
export async function getHeSoQuyDoiBySP({commit}, payload) {
    const {data} = await getRequest(`api/v2/vcn/he-so-quy-doi-by-sp?spTruocRong=${payload.spTruocRong}&spSauRong=${payload.spSauRong}`)
    return data
}
export async function ADD_ITEM_VCN({commit},payload){
    const {data} = await postRequest(`api/v2/vcn/itemsVCN`,payload)
    return data
}
export async function UPDATE_ITEM_VCN({commit},payload){
    const {data} = await putRequest(`api/v2/vcn/itemsVCN`,payload)
    return data
}
export async function GET_ITEM_TYPE_VCN({commit},payload){
    const {data} = await getRequest(`api/v2/VCN/item-type`,payload)
    return data
}

export async function sendApprovedVCN({ commit }, payload) {
    let { accountId, poIds } = payload;
    await putRequest(`/api/v2/VCN/${accountId}/approved`, { poIds });
}
export async function sendApprovedPKDVCN({ commit }, payload) {
    let { accountId, poIds } = payload;
    await putRequest(`/api/v2/VCN/${accountId}/approvedPKD`, { poIds });
}
export async function sendApprovedPNLVCN({ commit }, payload) {
    let { accountId, poIds } = payload;
    await putRequest(`/api/v2/VCN/${accountId}/approvedPNL`, { poIds });
}
export async function getLenhSanXuatCapPhoisVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/VCN/${payload.factoryId}/ke-hoach-san-xuat-cong-doan`
    );
    commit("setKeHoachSanXuats", data);
    return data
}
export async function getLenhSanXuatBiTuChoiVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/VCN/${payload.factoryId}/tu-choi-ke-hoach`
    );
    return data
}
export async function getsoLenhSanXuatCapPhoisVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/VCN/${payload.factoryId}/so-ke-hoach-san-xuat-cong-doan-2`
    );
    return data;
    // console.log('Load so lenh')
    // console.log(data)
    // commit("setKeHoachSanXuats", data);
}
export async function viewsoLenhSanXuatCapPhoisVCN({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/VCN/${payload.factoryId}/so-ke-hoach-san-xuat-cong-doan-3?nam=${payload.nam}&tuan=${payload.tuan}`
    );
    return data;

}
export async function getAllSoLenhSanXuats({ commit }) {
    const { data } = await getRequest(`/api/v2/vcn/allNumberPo`);
    return data;
}
export async function DELETE_PO({ commit }, payload) {
    const { data } = await putRequest(
        `/api/v2/vcn/deleteDataPO`, payload
    )
    return data
}
export async function taophieu({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/vcn/tao-phieu-nl`, payload
    )
    return data
}
export async function xuatkhovcn({ commit }, payload) {
    const { data } = await postRequest(
        `/api/v2/vcn/xuat-kho-phieu-nl`, payload
    )
    return data
}
export async function phieuchidinh({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/vcn/phieu-chi-dinh-nl?number=${payload.number}`
    )
    return data
}
export async function REJECT_PO({ commit },payload) {
    const {data} = await putRequest(`/api/v2/vcn/reject`,payload)
    return data
}
export async function getFactory({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/departments`)
    return data.data

}
export async function getNumberInPOByFactoryId({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/number-in-po?factoryId=${payload.factoryId}`)
    return data;

}
export async function updateNumberInPO({ commit },payload) {
    let {data} = await putRequest(`/api/v2/vcn/number-in-po`, payload);
    return data;

}
export async function getTonCongDoanVCN({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/ton-cong-doan-vcn?factoryId=${payload.factoryId}`)
    return data.data

}
export async function getStruct({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/struct?factoryId=${payload.factoryId}`)
    return data;
}
export async function getDepartmentVCN({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/department-by-factory?factoryId=${payload.factoryId}`)
    return data;

}
export async function getTonsByStepIdVCN({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/xuat-nhap-ton-vcn?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
    return data;

}
export async function getTonsLVLByStepIdVCN({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/lvl-xuat-nhap-ton-vcn?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
    return data;

}
export async function getBCLSXTheoCongDoan({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/lsx-theo-cong-doan?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
    return data;

}
export async function getBCLenhSanXuatVCN({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/bc-lsx-vcn?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
    return data;

}
export async function getBCStepByWeek({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/bc-vcn-theo-tuan?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
    return data;

}
export async function getBCStepByDayTable({ commit },payload) {
  let {data} = await getRequest(`/api/v2/vcn/bc-vcn-theo-ngay?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
  return data;
}
export async function getBCStepByWeekOfYear({ commit },payload) {
  let {data} = await getRequest(`/api/v2/vcn/bc-vcn-theo-tuancuanam?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
  return data;
}

export async function getBCStepByWeekOfYearM3({ commit },payload) {
  let {data} = await getRequest(`/api/v2/vcn/bc-vcn-theo-tuancuanamM3?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
  return data;
}

export async function getBCStepByMonthOfYear({ commit },payload) {
  let {data} = await getRequest(`/api/v2/vcn/bc-vcn-theo-thangcuanam?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
  return data;
}
export async function getBCStepByMonthOfYearM3({ commit },payload) {
  let {data} = await getRequest(`/api/v2/vcn/bc-vcn-theo-thangcuanamM3?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
  return data;
}
export async function getBCSanLuongByDayVCN({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/bc-san-luong-by-day-vcn?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
    return data;

}
export async function gettonkhoVCn({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/bc-vcn-ton-kho?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}&ngay=${payload.ngay}
    &stepId=${payload.stepId}`)
    return data;
  }
export async function getBCVCN_Ngay({ commit },payload) {
  let {data} = await getRequest(`/api/v2/vcn/bc-san-luong-vcn-ngay?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
  return data;

}
export async function getBCVCN_Tuan({ commit },payload) {
  let {data} = await getRequest(`/api/v2/vcn/bc-san-luong-vcn-tuan?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
  return data;

}
export async function getBCVCN_Thang({ commit },payload) {
  let {data} = await getRequest(`/api/v2/vcn/bc-san-luong-vcn-thang?factoryId=${payload.factoryId}&from=${payload.fromDate}&to=${payload.toDate}`)
  return data;

}
export async function getBCThucHienVCN({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/thuc-hien-vcn?factoryId=${payload.factoryId}&fromDate=${payload.fromDate}&toDate=${payload.toDate}`)
    return data;

}
export async function getBCThucHienLSXVCN({ commit },payload) {
    let {data} = await getRequest(`/api/v2/vcn/thuc-hien-lsx-vcn?factoryId=${payload.factoryId}&fromDate=${payload.fromDate}&toDate=${payload.toDate}`)
    return data;

}
export async function getRoutingByItemId({ commit }, payload) {
    let {data} = await getRequest(`/api/v2/vcn/routings/${payload.itemId}/${payload.factoryId}`)
    return data.data
}
export async function getRoutingByItemIdbom({ commit }, payload) {
    let {data} = await getRequest(`/api/v2/vcn/routingsbom?factoryId=${payload.factoryId}&itemId=${payload.itemId}&loaisp=${payload.loaisp}&dongsp=${payload.dongsp}&selectionBTP=${payload.selectionBTP}`)
    return data.data
}
export async function getDepartmentByFactotyId({ commit }, payload) {
    const {data} = await getRequest(`/api/v2/vcn/departmentsByFactoryId?factoryId=${payload.factoryId}`)
    return data.data
}
export async function getXuongByFactoryId({ commit }, payload) {
    const {data} = await getRequest(`/api/v2/vcn/xuong-by-factory?factoryId=${payload.factoryId}`)
    return data.data
}
export async function getCongDoanByXuongId({ commit }, payload) {
    const {data} = await getRequest(`/api/v2/vcn/cong-doan-by-xuong?xuongId=${payload.xuongId}`)
    return data.data
}
export async function getBangGiaVCN({ commit }, payload) {
    const {data} = await postRequest(`/api/v2/vcn/bang-gia-vcn`, payload)
    return data.data
}
export async function nhapdongiaVCN({ commit }, payload) {
    const {data} = await postRequest(`/api/v2/vcn/nhap-don-gia-vcn`, payload)
    return data
}
export async function getKlQuyLuongVCN({ commit }, payload) {
    const {data} = await postRequest(`/api/v2/vcn/khoi-luong-quy-luong-vcn`, payload)
    return data
}
export async function createRoutings({ commit },payload) {
    const {data} = await postRequest(`/api/v2/vcn/routings`,payload)
    return data
}
export async function updateRoutings({ commit },payload) {
    const {data} = await putRequest(`/api/v2/vcn/routings/${payload.id}`,payload)
    return data
}
export async function removeRoutings({ commit },payload) {
    const {data} = await Axios.delete(`/api/v2/vcn/routings/${payload.id}`)
    return data
}
export async function getItemsByFactoryId({ commit },payload) {
    const {data} = await getRequest(`/api/v2/vcn/itemsByFactory`)
    return data
}
export async function getBomByItemId({ commit },payload) {
    const {data} = await getRequest(`/api/v2/vcn/boms?itemId=${payload.itemId}`)
    data.data.map(async b => {
        if (b.parentId === 0 && payload.itemId !== b.itemId) {
            let foundBom = await data.data.find(
                f => f.materialsId === b.itemId && f.parentId !== 0
            );
            // console.log(foundBom);
            let foundBom2 = await data.data.find(
                f => f.itemId === foundBom.itemId && f.parentId === 0
            );
            // console.log(foundBom2);
            b.parentId = foundBom2.ID;
            console.log(b);
        }

        return b;
    });
    return data.data
}
export async function createBom({ commit },payload) {
    const {data} = await postRequest(`/api/v2/vcn/boms`,payload)
    return data.data
}
export async function getBomPo({ commit },payload) {
    const {data} = await getRequest(`/api/v2/vcn/boms/${payload.itemId}`)
    return data.data
}
export async function deleteBom({ commit },payload) {
    const {data} = await Axios.delete(`/api/v2/vcn/boms/${payload.id}/${payload.factoryId}`)
    return data.data
}
export async function updateBom({ commit },payload) {
    const {data} = await putRequest(`/api/v2/vcn/boms/${payload.id}`,payload)
    return data.data
}
export async function getGroups({ commit },payload) {
    const {data} = await getRequest(`/api/v2/vcn/groups`)
    return data.data
}
export async function UPDATE_PO({ commit },payload){
    const data = await putRequest(`/api/v2/vcn/po/${payload.numbers}/${payload.factoryId}`,payload);
    return data
}
export async function updatePOByNumber({ commit },payload){
    const data = await putRequest(`/api/v2/vcn/po-by-number`,payload);
    return data
}
export async function GET_DEPARTMENT_BY_FACTORY_VCN({ commit },payload) {
    const {data} = await getRequest(`/api/v2/vcn/get-department-by-factory-vcn?factoryId=${payload.factoryId}`)
    return data
}
export async function GET_ITEM_IN_TON_DEPARTMENT_NAME_VCN({ commit },payload) {
    const {data} = await getRequest(`/api/v2/vcn/item-in-ton-department-name-vcn?departmentName=${payload.departmentName}&toDate=${payload.toDate}`)
    return data
}
export async function GET_REPORT_CHART_SAN_LUONG_WEEK_CONG_DOAN_VCN({ commit },payload) {
    const {data} = await postRequest(`/api/v2/vcn/chart-san-luong-week-cong-doan-vcn`, payload)
    return data
}
export async function GET_REPORT_CHART_SAN_LUONG_CONG_DOAN_WEEK_VCN({ commit },payload) {
    const {data} = await postRequest(`/api/v2/vcn/chart-san-luong-cong-doan-week-vcn`, payload)
    return data
}
export async function GET_REPORT_CHART_TON_CONG_DOAN_WEEK_VCN({ commit },payload) {
    const {data} = await getRequest(`/api/v2/vcn/chart-ton-cong-doan-week?end=${payload.toDate}&factoryId=${payload.factoryId}`)
    return data
}
export async function GET_ITEM_IN_DEPARTMENT_NAME_VCN({ commit },payload) {
    const {data} = await getRequest(`/api/v2/vcn/item-in-department-name-vcn?departmentName=${payload.departmentName}&fromDate=${payload.fromDate}&toDate=${payload.toDate}`)
    return data
}
export const getAllDepartmetVCN = async ({ commit }) => {
  const { data } = await getRequest(
      `/api/v2/vcn/get-all-department-vcn`
  );
  return data;
};