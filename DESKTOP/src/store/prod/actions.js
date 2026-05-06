import {
    postRequest,
    putRequest,
    delRequest,
    getRequest,
    postRequestWithoutProgress
} from "../../ultils";
import { api } from "../../ultils/api";

export async function GET_REPORT_DATE({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_DATE +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_MONTH({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_MONTH +
        "?year=" +
        payload.year +
        "&month=" +
        payload.month +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_WEEK({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_WEEK +
        "?year=" +
        payload.from +
        "&week=" +
        payload.to +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_KILN_PROCESS({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_WEEK +
        "/process?factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_LUONG({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_LUONG +
        "?year=" +
        payload.to +
        "&week=" +
        payload.from +
        "&stepId=" +
        payload.stepId
    );
    return data.data;
}
export async function GET_SAN_PHAM_LSX({ commit }, payload) {
    const data = await getRequest(
        `/api/v2/packages/yeu-cau-ky-thuat?number=${payload.number}`
    );
    return data.data;
}

// export async function GET_REPORT_WEEK3({ commit }, payload) {
//     const data = await getRequest(
//         api.PROD_REPORT_WEEK3 +
//         "?year=" +
//         payload.year +
//         "&week=" +
//         payload.week +
//         "&factoryId=" +
//         payload.factoryId
//     );
//     return data.data;
// }
export async function GET_REPORT_WEEK4({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_WEEK4 +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId +
        "&departmentId=" +
        payload.departmentId +
        "&ngay=" +
        payload.ngay
    );
    return data.data;
}
export async function LSX_IN_VT_SON({ commit }, payload) {
    const data = await getRequest(
        '/api/v2/packages/lsx-in-vt-son' +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_SO_LAN_IN_VT_SON({ commit }, payload) {
    const data = await getRequest(
        '/api/v2/packages/so-lan-in-vt-son' +
        "?number=" +
        payload.number
    );
    return data.data;
}
export async function REPORT_VT_SON({ commit }, payload) {
    const data = await getRequest(
        '/api/v2/packages/report-vt-son' +
        "?number=" +
        payload.number +
        "&arrSoLan=" +
        payload.arrSoLan
    );
    return data.data;
}
export async function GHI_NHAN_SL({ commit }, payload) {
    const data = await getRequest(
        '/api/v2/packages/ghi-nhan-san-luong' +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId +
        "&departmentId=" +
        payload.departmentId +
        "&number=" +
        payload.number
    );
    return data.data;
}
export async function GET_REPORT_WEEKDEPARTMENT({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_WEEKDEPARTMENT +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_WEEK_IN({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_WEEK3 +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId +
        "&departmentId=" +
        payload.departmentId
    );
    return data.data;
}
export const getItemErrorByCode = async ({ commit }, code) => {
    const { data } = await getRequest(
        `/api/v2/packages/qc-item-error-by-code?code=${code}`
    );
        return data;
};
export const getItemErrorkhieunai = async ({ commit }, code) => {
    const { data } = await getRequest(
        `/api/v2/packages/qc-item-error-khieu-nai?code=${code}`
    );
        return data;
};
export const getListCodekhieulai = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/list-code-khieu-nai?factoryId=${payload.factoryId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59`
    );
        return data;
};
export const getListCodeInItemError = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/list-code-qc-item-error?factoryId=${payload.factoryId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59`
    );
        return data;
};
export const getListCodeInItemErrorDaDuyet = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/list-code-qc-item-error-da-duyet?factoryId=${payload.factoryId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59`
    );
        return data;
};
export const getListCodeInItemkhieunaiDaDuyet = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/list-code-qc-item-khieu-nai-da-duyet?factoryId=${payload.factoryId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59`
    );
        return data;
};
export async function GET_REPORT_WEEK_IN_LSX({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_WEEKIN +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId +
        "&departmentId=" +
        payload.departmentId +
        "&number=" +
        payload.number
    );
    return data.data;
}
export const deleteListBCXuLyLoi = async ({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/delete-bc-xu-ly-loi`, payload
    );

    return data;
};
export const deleteListBCkhieunai = async ({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/delete-bc-khieu-nai`, payload
    );

    return data;
};
// export const updateListBCXuLyLoi = async ({ commit }, payload) => {
//     const { data } = await putRequest(
//         `/api/v2/packages/bc-xu-ly-loi`, payload
//     );

//     return data;
// };

export const insertQCItemError = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/qc-item-error`, payload
    );

    return data;
};
export const insertBBKN = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/insert-bb-kn`, payload
    );

    return data;
};
export const XOA_BB_QC = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/delete-qc-item-error?id=${payload.ID}`, payload
    );

    return data;
};
export const getCodeInItemError = async ({ commit }, factoryId) => {
    const { data } = await getRequest(
        `/api/v2/packages/code-qc-item-error?factoryId=${factoryId}`
    );
    if (data.data == []) {
        return [];
    } else {
        return data;
    }
};
export const getListCodeInBBkhieunai = async ({ commit }, factoryId) => {
    const { data } = await getRequest(
        `/api/v2/packages/code-item-kn?factoryId=${factoryId}`
    );
    if (data.data == []) {
        return [];
    } else {
        return data;
    }
};
export const getBBSanPhamLoi = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bb-san-pham-loi?factoryId=${payload.factoryId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59`
    );

    return data;
};

export const getCodeInPhieuNhanPhoi = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/code-phieu-nhan-phoi`
    );
    if (data.data == []) {
        return [];
    } else {
        return data;
    }
};
export const insertPhieuNhanPhoi = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/phieu-nhan-phoi`, payload
    );
    return data;
};
export const getCodeNhanPhoiByFactoryId = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/code-phieu-nhan-phoi-by-factory?factoryId=${payload.factoryId}&start=${payload.fromDate}&end=${payload.toDate}`,
    );
    return data;
};
export const getCodebangiaogotron = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/code-phieu-ban-giao-go-tron?factoryId=${payload.factoryId}&start=${payload.fromDate}&end=${payload.toDate}`,
    );
    return data;
};
export const getBBNhanPhoi = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bien-ban-nhan-phoi?code=${payload.code}`,
    );
    return data;
};
export const getBBgiaogotron = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bien-ban-gio-go-tron?code=${payload.code}`,
    );
    return data;
};
export const getAllPhieuGoTron = async ({ commit }) => {
    const { data } = await getRequest(
        `/api/v2/packages/all-phieu-go-tron`,
    );
    return data;
};
export const GET_REPORT_CHART_SAN_LUONG_QUY = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/chart-san-luong-quy?start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};
export const GET_REPORT_CHART_SAN_LUONG_MONTH = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/chart-san-luong-month?start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};

export async function GET_HE_SO_LSX({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_WEEK2 +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId

    );
    return data.data;
}
export async function GET_HE_SO_LSX_3({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_WEEK2 +
        "/xuat-go?year=" +
        payload.year +
        "&fromWeek=" +
        payload.fromWeek +
        "&toWeek=" +
        payload.toWeek +
        "&factoryId=" +
        payload.factoryId

    );
    return data.data;
}
export async function GET_HE_SO_LSX_2({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_WEEK2 +
        "2?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId

    );
    return data.data;
}
export async function GET_LSX_CHUA_DUYET({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_LSX +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId

    );
    return data.data;
}
export async function GET_LSX_SLQD({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_LSXQD +
        "?number=" +
        payload.number

    );
    return data.data;
}
export async function GET_REPORT_INVENTORY({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_INVENTORY + "?factoryId=" + payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_INVENTORY2({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_INVENTORY +
        "?factoryId=" +
        payload.factoryId +
        "&week=" +
        payload.from +
        "&year=" +
        payload.to
    );
    return data.data;
}
export async function GET_REPORT_RESULT_DETAIL({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_DETAIL +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_RESULT_DETAIL_2({ commit }, payload) {
    const data = await getRequest(
        "/api/v2/bao-cao-raw-data/raw2" +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId +
        "&type=" +
        payload.type
    );
    return data.data;
}
export async function GET_REPORT_EP_MUN({ commit }, payload) {
    const data = await getRequest(
        "/api/v2/dinh-muc-phoi/report-ep-mun" +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate
    );
    return data.data;
}

export async function DELETE_REPORT_RESULT_DETAIL({ commit }, payload) {
    const data = await postRequest(
        api.PROD_REPORT_DETAIL +"/delete1", payload
    );
    return data.data;
}
export async function DELETE_REPORT_RESULT_DETAIL2({ commit }, payload) {
    const data = await postRequest(
        api.PROD_REPORT_DETAIL +"/delete2", payload
    );
    return data.data;
}

export async function GET_REPORT_TON_DETAIL({ commit }, payload) {
    const data = await getRequest(
        api.PROD_TON_DETAIL +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&departmentId=" +
        payload.departmentId
    );
    return data.data;
}
export async function GET_REPORT_TON_AFTERDRYING_DETAIL({ commit }, payload) {
    const data = await getRequest(
        "/api/v2/ton-dau-ky-chi-tiet/afterDrying" +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&departmentId=" +
        payload.departmentId
    );
    return data.data;
}
export async function GET_REPORT_NHAP_XUAT_CT({ commit }, payload) {
    const data = await getRequest(
        "/api/v2/ton-dau-ky-chi-tiet/nhapxuatct" +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&departmentId=" +
        payload.departmentId
    );
    return data.data;
}
export async function GET_REPORT_CHO_SAY({ commit }, payload) {
    const data = await getRequest(
        "/api/v2/ballets/bao-cao-cho-say-2" +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_DEFECT_DETAIL({ commit }, payload) {
    const data = await getRequest(
        api.PROD_DEFECT_DETAIL +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId +
        "&departmentId=" +
        payload.departmentId
    );
    return data.data;
}
export async function GET_REPORT_QC_SOLUTION({ commit }, payload) {
    const data = await getRequest(
        api.PROD_QC_REPORT_SOLUTION +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId +
        "&departmentId=" +
        payload.departmentId +
        "&factoryId2=" +
        payload.factoryId2
    );
    return data.data;
}
export async function GET_REPORT_COC({ commit }, payload) {
    const data = await getRequest(api.PROD_REPORT_COC);
    return data.data;
}
export async function GET_REPORT_LSX({ commit }, payload) {
    const data = await getRequest(
        api.PROD_RESULT_LSX +
        "?year=" +
        payload.year +
        "&month=" +
        payload.month +
        "&factoryId=" +
        payload.factoryId +
        "&productionOrdersTypeId=" +
        payload.productionOrdersTypeId
    );
    return data.data;
}
export async function GET_REPORT_TRUY_NGUYEN({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_COC +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_ME_SAY({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_ME_SAY +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_MATERIAL_OF_MESAY({ commit }, payload) {
    const data = await getRequest(
        api.PROD_MATERIAL_OF_ME_SAY +
        "?from=" +
        payload.fromDate +
        " 00:00&to=" +
        payload.toDate +
        " 23:59&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_MATERIAL_OF_MESAY2({ commit }, payload) {
    const data = await getRequest(
        api.PROD_MATERIAL_OF_ME_SAY + '/export' +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_MATERIAL_OF_MESAY3({ commit }, payload) {
    const data = await getRequest(
        api.PROD_MATERIAL_OF_ME_SAY + '/exportpallet' +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_REPORT_MATERIAL_OF_MESAY3_KHO({ commit }, payload) {
    const data = await getRequest(
        api.PROD_MATERIAL_OF_ME_SAY + '/exportpallet-kho' +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export const getBCNhanSauSay = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bc-nhan-sau-say?start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};
export const getDonGiaTinhLuong = async({ commit }) => {
    const { data } = await getRequest(
        `/api/v2/packages/don-gia-tinh-luong`
    );

    return data;
};
export const UpdateDonGiaTinhLuong = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/don-gia-tinh-luong`, payload
    );

    return data;
};
export const updateBCNhanSauSay = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/bc-nhan-sau-say`, payload
    );

    return data;
};
export const updateBCNhanSauSayngay = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/bc-nhan-sau-say-ngay`, payload
    );

    return data;
};
export const updateBCNhanSauSaytheolo = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/bc-nhan-sau-say-theo-lo`, payload
    );

    return data;
};
export const getBCXuLyLoi = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bc-xu-ly-loi?start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59&department=${payload.department}`
    );

    return data;
};
export const updateListBCXuLyLoi = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/qc-item-error`, payload
    );

    return data;
};
export const GET_ITEMSS = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/item-bb-kn?stepId=${payload.stepId}`
    );

    return data;
};
export const updateQcItemErrorGDSX = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/qc-item-error-gdsx`, payload
    );

    return data;
};
export const updateQcItemkhieunaiGDSX = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/qc-item-khieu-nai-gdsx`, payload
    );

    return data;
};
export const updateQcItemErrorQC = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/qc-item-error-qc`, payload
    );

    return data;
};
export const updateQcItemkhieunaiQC = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/qc-item-khieu-nai-qc`, payload
    );

    return data;
};
export const updateQcItemkhieunaiQC1 = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/qc-item-khieu-nai-qc1`, payload
    );

    return data;
};
export const updateQcItemkhieunaiKH = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/qc-item-khieu-nai-kh`, payload
    );

    return data;
};
export const getDepartmentByKho = async({ commit }) => {
    const { data } = await getRequest(
        `/api/v2/packages/department-kho`
    );

    return data;
};

export const getXuatNhapKho = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/xuat-nhap-kho?stepId=${payload.stepId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59
        &ngay=${payload.ngay}&factoryId=${payload.factoryId}`
    );

    return data;
};
export const getXuatNhapKhogotho = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/xuat-nhap-kho-go-tho?stepId=${payload.stepId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59
        &factoryId=${payload.factoryId}`
    );

    return data;
};
export const getXuatNhapKhogotuoi = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/xuat-nhap-kho-go-tuoi?stepId=${payload.stepId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59
        &makho=${payload.makho}&factoryId=${payload.factoryId}&ngay=${payload.ngay}`
    );

    return data;
};

export const getKiemPhieuXuatKho = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/kiem-phieu-xuat-kho?stepId=${payload.stepId}&date=${payload.date}`
    );

    return data;
};

export const updateBBKiemPhieuXuatKho = ({ commit }, payload) => {
    const { data } = putRequest(
        `/api/v2/packages/kiem-phieu-xuat-kho`, payload
    );

    return "OK";
};
export async function ADD_ITEM_D({ commit }, payload) {
    const data  = await postRequest(
        `/api/v2/packages/duyet`, payload
    );

    return data.data;
};
export async function POST_GHI_NHAN_SL({ commit }, payload) {
    const data  = await postRequest(
        `/api/v2/packages/ghi-nhan-QM`, payload
    );

    return data.data;
};
export async function GET_ITEMS_ADD({ commit }, payload) {
    const data  = await getRequest(
        `/api/v2/packages/GET_ITEMS_ADD`, payload
    );

    return data.data;
};
export async function GET_ITEMS_ADD_GD({ commit }, payload) {
  const data  = await getRequest(
      `/api/v2/packages/GET_ITEMS_ADD_GD`, payload
  );

  return data.data;
};
export async function GET_ITEMS_ADD_BY_ACCOUNT({ commit }, payload) {
    const data  = await getRequest(
        `/api/v2/packages/GET_ITEMS_ADD_BY_ACCOUNT?accountId=${payload.accountId}`
    );

    return data.data;
};
export async function INSERT_HE_SO_LUA_PHOI({ commit }, payload) {
    const data  = await postRequest(
        `/api/v2/packages/he-so-lua-phoi`, payload
    );

    return data.data;
};
export async function INSERT_TY_GIA_USD({ commit }, payload) {
    const data  = await postRequest(
        `/api/v2/packages2/insert-ty-gia-usd`, payload
    );

    return data.data;
};
export async function CHON_LENH({ commit }, payload) {
    const data  = await postRequest(
        `/api/v2/packages2/chon-lenh`, payload
    );

    return data.data;
};
export async function CHON_CD_NHAN_LOI({ commit }, payload) {
    const data  = await postRequest(
        `/api/v2/packages2/chon-cd-nhan-loi`, payload
    );

    return data.data;
};
export async function TRU_LOI({ commit }, payload) {
    const data  = await postRequest(
        `/api/v2/packages2/tru-loi`, payload
    );

    return data.data;
};
export async function INSERT_DON_GIA_SAY({ commit }, payload) {
    const data  = await postRequest(
        `/api/v2/packages2/insert-don-gia-say`, payload
    );

    return data.data;
};
export async function GET_HE_SO_LUA_PHOI({ commit }, payload) {
    const data  = await getRequest(
        `/api/v2/packages/he-so-lua-phoi?factoryId=${payload.factoryId}&month=${payload.month}&year=${payload.year}`
    );

    return data.data;
};
export async function GET_ALL_HE_SO_LUA_PHOI({ commit }, payload) {
    const data  = await getRequest(
        `/api/v2/packages2/he-so-lua-phoi-all?factoryId=${payload.factoryId}&year=${payload.year}`
    );

    return data.data;
};
export async function GET_ALL_TY_GIA_USD({ commit }, payload) {
    const data  = await getRequest(
        `/api/v2/packages2/ty-gia-USD?year=${payload.year}`
    );

    return data.data;
};
export async function UPDATE_ITEMS_ADD({ commit }, payload) {
    const data  = await getRequest(
        `/api/v2/packages/UPDATE_ITEMS_ADD?ID=${payload.ID}&approvedByAccountGD=${payload.approvedByAccountGD}`, payload
    );

    return data.data;
};
export async function UPDATE_ITEMS_ADD_BEFORE({ commit }, payload) {
  const data  = await getRequest(
      `/api/v2/packages/UPDATE_ITEMS_ADD_BEFORE?ID=${payload.ID}&approvedByAccount=${payload.approvedByAccount}`, payload
  );

  return data.data;
};
export async function DEL_ITEMS_ADD({ commit }, payload) {
    const data  = await getRequest(
        `/api/v2/packages/DEL_ITEMS_ADD?ID=${payload.ID}`, payload
    );

    return data.data;
};
//xóa các item add đã được phê duyệt
export async function DELETE_ITEM_ADD_DONE({ commit }) {
  const data  = await getRequest(
      `/api/v2/packages/DELETE_ITEM_ADD_DONE`
  );

  return data.data;
};
export const getSoPhieuXuatNhapTonKho = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/kiem-phieu-xuat-kho/so-phieu?stepId=${payload.stepId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59`
    );

    return data;
};

export const getXuatNhapTonKhoBySoPhieu = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/kiem-phieu-xuat-kho-by-so-phieu?soPhieu=${payload.soPhieu}&department=${payload.department}&month=${payload.month}`
    );

    return data;
};

export const getXuatKhoDetail = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/xuat-kho-detail?stepId=${payload.stepId}&start=${payload.fromDate} 00:00&end=${payload.toDate} 23:59`
    );

    return data;
};

export async function GET_PROD_ORDERS({ commit }, payload) {
    const data = await getRequest(
        api.PROD_ORDERS + "?factoryId=" + payload.factoryId + "&get=all"
    );
    return data.data;
}
export async function CREATE_PROD_ORDERS({ commit }, payload) {
    const data = await postRequest(api.PROD_ORDERS, payload);
    return data.data;
}
export async function GET_PRACEL_BY_PROD_ORDER({ commit }, prodOrderId) {
    const data = await getRequest(
        api.PROD_ORDERS + "/" + prodOrderId + "/parcel"
    );
    return data.data;
}
export async function CREATE_PRACEL_BY_PROD_ORDER({ commit }, payload) {
    const data = await postRequest(
        api.PROD_ORDERS + "/" + payload.prodOrderId + "/parcel",
        payload.data
    );
    return data.data;
}
export async function GET_PRODUCT_TO_PROD_ORDER({ commit }, id) {
    const data = await getRequest(api.PROD_ORDERS + "/" + id + "/products");
    return data.data;
}
export async function ADD_PRODUCT_TO_PROD_ORDER({ commit }, payload) {
    const data = await postRequest(
        api.PROD_ORDERS + "/" + payload.prodOrderId + "/products",
        payload.data
    );
    return data.data;
}
export async function GET_MATERIAL_TO_PROD_ORDER({ commit }, id) {
    const data = await getRequest(api.PROD_ORDERS + "/" + id);
    return data.data;
}
export async function UPDATE_PROD_ORDER({ commit }, payload) {
    const data = await putRequest(
        api.PROD_ORDERS + "/" + payload.id,
        payload.data
    );
    return data.data;
}
//REMOVE_MATERIAL_IN_PROD_ORDER
export async function REMOVE_MATERIAL_IN_PROD_ORDER({ commit }, payload) {
    const data = await delRequest(
        api.PROD_ORDERS +
        "/" +
        payload.prodOrderId +
        "/materials/" +
        payload.materialsId
    );
    return data.data;
}
export async function ADD_MATERIAL_TO_PROD_ORDER({ commit }, payload) {
    const data = await postRequest(
        api.PROD_ORDERS + "/" + payload.prodOrderId + "/materials",
        payload.data
    );
    return data.data;
}

export async function GET_BOM({ commit }) {
    const data = await getRequest(api.PROD_BOM);
    return data.data;
}

export async function GET_BOM_BY_ITEM_ID({ commit }, itemId) {
    const data = await getRequest(api.PROD_BOM + "/" + itemId);
    return data.data;
}
export async function REMOVE_BOM_BY_ITEM_ID({ commit }, itemId) {
    const data = await delRequest(api.PROD_BOM + "/" + itemId);
    return data.data;
}
export async function GET_ROUTING_BY_ITEM_ID({ commit }, itemId) {
    const data = await getRequest(api.PROD_ROUTING + "/" + itemId);
    commit("GET_ROUTING_BY_ITEM_ID", data.data.data);
    return data.data;
}
export async function ADD_STEP_TO_ROUTING({ commit }, payload) {
    const data = await postRequest(api.PROD_ROUTING, payload);
    return data.data;
}
export async function GET_KE_HOACH_DON_HANG({ commit }) {
    const data = await getRequest(api.PROD_KE_HOACH_DON_HANG);
    return data.data;
}
export async function ADD_KE_HOACH_DON_HANG({ commit }, payload) {
    const data = await postRequest(api.PROD_KE_HOACH_DON_HANG, payload);
    return data.data;
}
export async function GET_OSCP({ commit }, payload) {
    const data = await getRequest(
        api.PROD_OSCP +
        "?departmentId=" +
        payload.departmentId +
        "&itemId=" +
        payload.itemId
    );
    return data.data;
}
export async function ADD_OSCP({ commit }, payload) {
    const data = await postRequest(api.PROD_OSCP, payload);
    return data.data;
}
export async function UPDATE_OSCP({ commit }, payload) {
    const data = await putRequest(api.PROD_OSCP + "/" + payload.id, payload);
    return data.data;
}
export async function DEL_OSCP({ commit }, id) {
    const data = await delRequest(api.PROD_OSCP + "/" + id);
    return data.data;
}
export async function CALCULATOR_PLAN({ commit }, payload) {
    const data = await getRequest(
        api.PROD_PLAN_ORDER +
        "?departmentId=" +
        payload.departmentId +
        "&itemId=" +
        payload.itemId +
        "&quantity=" +
        payload.quantity +
        "&week=" +
        payload.week +
        "&year=" +
        payload.year
    );
    return data.data;
}
export async function CALCULATOR_PLANV2({ commit }, payload) {
    const data = await getRequest(
        api.PROD_PLAN_ORDER +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&market=" +
        payload.market +
        "&number=" +
        payload.number
    );
    return data.data;
}
export async function GET_PROD_TIME({ commit }, payload) {
    const data = await getRequest(
        api.PROD_TIME +
        "?departmentId=" +
        payload.departmentId +
        "&itemId=" +
        payload.itemId
    );
    return data.data;
}
export async function ADD_CHI_SO_OSCP({ commit }, payload) {
    const data = await postRequest(api.PROD_TIME, payload);
    return data.data;
}
export async function UPDATE_CHI_SO_OSCP({ commit }, payload) {
    const data = await putRequest(api.PROD_TIME + "/" + payload.id, payload);
    return data.data;
}
export async function CREATE_PLAN({ commit }, payload) {
    const data = await postRequest(api.PROD_PLAN_ORDER, payload);
    return data.data;
}
export async function GET_PROD_MARKET({ commit }, payload) {
    const data = await getRequest(
        api.PROD_MARKET + "?factoryId=" + payload.value
    );
    return data.data;
}
export async function ADD_KH({ commit }, payload) {
    // commit('INIT_MARKET',payload.market)
    const data = await postRequestWithoutProgress(api.PROD_PLAN_ORDER, payload);
    return data.data;
}
export async function SAVE_STATE_MARKET({ commit }, payload) {
    commit("INIT_MARKET", payload);
}
export async function GET_DINH_MUC_TON({ commit }, payload) {
    const data = await getRequest(
        api.PROD_DINH_MUC_TON + "?departmentId=" + payload.departmentId
    );
    return data.data;
}
export const getBCNhanThanhPham = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bc-nhan-thanh-pham?end=${payload.toDate}`
    );

    return data;
};
export async function GET_BIEN_BAN_LO_SAY({ commit }, kilnId) {
    const data = await getRequest(
        api.PROD_CHO_SAY + "/bien-ban" +
        "?kilnId=" + kilnId
    );
    return data.data;
}

export async function GET_KILN_BY_FACTORYID({ commit }, factoryId) {
    const data = await getRequest(
        api.PROD_CHO_SAY + "/bien-ban/kiln" +
        "?factoryId=" + factoryId
    );
    return data.data;
}
export async function GET_KILN_BY_FACTORYID_HISTORY({ commit }, factoryId) {
    const data = await getRequest(
        api.PROD_CHO_SAY + "/bien-ban/kiln-history" +
        "?factoryId=" + factoryId
    );
    return data.data;
}


export async function GET_DATE_BY_KILN_ID_DO_AM({ commit }, payload) {
    const data = await getRequest(
        api.PROD_CHO_SAY + `/bien-ban/date-by-kilnId-do-am?kilnId=${payload.kilnId}&from=${payload.from}&to=${payload.to}`
    );
    return data.data;
}
// export async function GET_DATE_BY_KILN_ID_KHUYET_TAT({ commit }, payload) {
//     const data = await getRequest(
//         api.PROD_CHO_SAY + `/bien-ban/date-by-kilnId-khuyet-tat?kilnId=${payload.kilnId}&from=${payload.from}&to=${payload.to}`
//     );
//     return data.data;
// }
export async function GET_BB_KIEM_TRA_DO_AM({ commit }, kilnBatchId) {
    const data = await getRequest(
        api.PROD_CHO_SAY + "/bien-ban/bb-kiem-tra-do-am" +
        "?kilnBatchId=" + kilnBatchId
    );
    return data.data;
}

export async function GET_BB_KIEM_TRA_LO_SAY({ commit }, kilnBatchId) {
    const data = await getRequest(
        api.PROD_CHO_SAY + "/bien-ban/bb-kiem-tra-lo-say" +
        "?kilnBatchId=" + kilnBatchId
    );
    return data.data;
}

// export async function GET_BB_KS_TY_LE_KHUYET_TAT({ commit }, kilnBatchId) {
//     const data = await getRequest(
//         api.PROD_CHO_SAY + "/bien-ban/bb-ks-ty-le-khuyet-tat" +
//         "?kilnBatchId=" + kilnBatchId
//     );
//     return data.data;
// }
// export async function GET_PALLET_IN_BB_KHUYET_TAT({ commit }, payload) {
//     const data = await getRequest(
//         api.PROD_CHO_SAY + "/bien-ban/pallet-in-bb-khuyet-tat" +
//         "?palletCode=" + payload.palletCode
//     );
//     return data.data;
// }

export async function GET_BB_RA_LO_SAY({ commit }, payload) {
    const data = await getRequest(
        api.PROD_CHO_SAY + `/bien-ban/bb-ra-lo-say?kilnId=${payload.kilnId}&from=${payload.from}&to=${payload.to}`
    );
    return data.data;
}

export async function GET_DATE_BY_KILN_ID({ commit }, payload) {
    const data = await getRequest(
        api.PROD_CHO_SAY + `/bien-ban/date-by-kilnId?kilnId=${payload.kilnId}&from=${payload.from}&to=${payload.to}`
    );
    return data.data;
}
export async function GET_DATE_IN_KILN({ commit }, payload) {
    const data = await getRequest(
        api.PROD_CHO_SAY + `/bien-ban/date-in-kiln?kilnId=${payload.kilnId}&from=${payload.from}&to=${payload.to}`
    );
    return data.data;
}
export const createBCNhanThanhPham = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/bc-nhan-thanh-pham`, payload
    );

    return data;
};
export const  updatesuaPO = async({ commit }, payload) => {
    const data = await postRequest(`/api/v2/packages/update-sua-po`, payload);
    return data.data;
}
export async function ADD_DINH_MUC_TON({ commit }, payload) {
    const data = await postRequest(api.PROD_DINH_MUC_TON, payload);
    return data.data;
}
export async function UPDATE_DINH_MUC_TON({ commit }, payload) {
    const data = await putRequest(
        api.PROD_DINH_MUC_TON + "/" + payload.id,
        payload
    );
    return data.data;
}
export async function DEL_DINH_MUC_TON({ commit }, id) {
    const data = await delRequest(api.PROD_DINH_MUC_TON + "/" + id);
    return data.data;
}
export async function GET_PLAN_MARKET({ commit }, payload) {
    const data = await getRequest(
        api.PROD_PLAN_ORDER +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&departmentId=" +
        payload.departmentId +
        "&factoryId=" +
        payload.factoryId
    );
    if (data) {
        return data.data;
    }
    return data;
}
export async function GET_PLAN_STEPS({ commit }, payload) {
    let url = api.PROD_PLAN_ORDER + "/steps?test=true";
    payload.forEach(i => (url += `&productIds[]=${i}`));
    const data = await getRequest(url);
    if (data) {
        return data.data;
    }
    return data;
}
export async function UPDATE_PLAN({ commit }, payload) {
    const data = await putRequest(api.PROD_PLAN_ORDER, payload);
    return data.data;
}
export async function GET_BOM_V2({ commit }, itemId) {
    const data = await getRequest(api.BOM + "/" + itemId + "/root");
    return data.data;
}
export async function XUAT_VAT_TU({ commit }, payload) {
    const data = await getRequest(`/api/v2/production-order/xuat-vat-tu?number=${payload.number}`);
    return data.data;
}
export const getBomByItemId = async({ commit }, payload) => {
    const { data } = await getRequest(`/api/v2/boms/${payload.itemId}/materials`);
    data.map(async b => {
        if (b.parentId === 0 && payload.itemId !== b.ITEM_ID) {
            let foundBom = await data.find(
                f => f.MATERIALS_ID === b.ITEM_ID && f.parentId !== 0
            );
            let foundBom2 = await data.find(
                f => f.ITEM_ID === foundBom.ITEM_ID && f.parentId === 0
            );
            b.parentId = foundBom2.ID;
        }

        return b;
    });
    return data;
};
export const getBomTempByItemId = async({ commit }, payload) => {
    const { data } = await getRequest(`/api/v2/boms/${payload.itemId}/bom-temp`);
    data.map(async b => {
        if (b.parentId === 0 && payload.itemId !== b.ITEM_ID) {
            let foundBom = await data.find(
                f => f.MATERIALS_ID === b.ITEM_ID && f.parentId !== 0
            );
            let foundBom2 = await data.find(
                f => f.ITEM_ID === foundBom.ITEM_ID && f.parentId === 0
            );
            b.parentId = foundBom2.ID;
        }

        return b;
    });
    return data;
};

export const insertBomTemp = async({ commit }, payload) => {
    const { data } = await postRequest(`/api/v2/boms/insert-bom-temp`, payload);
    return data;
};
export const getItemBomPending = async({ commit }, payload) => {
    const { data } = await getRequest(`/api/v2/boms/temp/pending?accountId=${payload.accountId}`);
    return data;
};
export const getBomItemRemove = async({ commit }, payload) => {
    const { data } = await getRequest(`/api/v2/boms/temp/remove?itemId=${payload.itemId}`);
    data.map(async b => {
        if (b.parentId === 0 && payload.itemId !== b.ITEM_ID) {
            let foundBom = await data.find(
                f => f.MATERIALS_ID === b.ITEM_ID && f.parentId !== 0
            );
            let foundBom2 = await data.find(
                f => f.ITEM_ID === foundBom.ITEM_ID && f.parentId === 0
            );
            b.parentId = foundBom2.ID;
        }

        return b;
    });
    return data;
};
export const checkSendBomTempByItemId = async({ commit }, payload) => {
    const { data } = await getRequest(`/api/v2/boms/bomTemp/check-send-bom-temp?itemId=${payload.itemId}`);
    return data;
};
export const addBomTemp = async({ commit }, payload) => {
    const { data } = await postRequest(`/api/v2/boms/add-bom-temp`, payload);
    return data;
};
export const updateBomTemp = async({ commit }, payload) => {
    const { data } = await postRequest(`/api/v2/boms/update-bom-temp`, payload);
    return data;
};

export const removeBomTemp = async({ commit }, payload) => {
    const { data } = await postRequest(`/api/v2/boms/remove-bom-temp`, payload);
    return data;
};
export const sendBomTempApprove = async({ commit }, payload) => {
    const { data } = await postRequest(`/api/v2/boms/send-bom-temp-approve`, payload);
    return data;
};

export const approveBomTemp = async({ commit }, payload) => {
    const { data } = await postRequest(`/api/v2/boms/approve-bom-temp`, payload);
    return data;
};

export const deleteBom = async({ commit }, payload) => {
    const { data } = await postRequest(`/api/v2/boms/delete-bom`, payload);
    return data;
};

export const getItemsInBomTemp = async({ commit }) => {
    const { data } = await getRequest(`/api/v2/boms/bomTemp/item-bom-temp`);
    return data;
};

export const getParentItemsInBom = async({ commit }, payload) => {
    const { data } = await getRequest(`/api/v2/boms/bomTemp/parent-item-bom?itemId=${payload.itemId}`);
    return data;
};
export const getParentItemsInBomTemp = async({ commit }, payload) => {
    const { data } = await getRequest(`/api/v2/boms/bomTemp/parent-item-bom-temp?itemId=${payload.itemId}`);
    return data;
};

export const deleteBomTemp = async({ commit }, payload) => {
    const { data } = await postRequest(`/api/v2/boms/delete-bom-temp`, payload);
    return data;
};

export const getRoutingsByItemId = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v3/routings/${payload.itemId}/boms?factoryId=${payload.factoryId}`
    );
    commit("setRoutings", data);
    return data;
};
export const getListItemInRoutingTemp = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v3/routings/temp/item-in-routing?factoryId=${payload.factoryId}`
    );
    return data;
};
export const getRoutingTempByItemId = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v3/routings/temp/${payload.itemId}/boms?factoryId=${payload.factoryId}`
    );
    return data;
};
export const getItemRoutingPending = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v3/routings/temp/pending?accountId=${payload.accountId}`
    );
    return data;
};

export const getItemInRoutingTemp = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v3/routings/temp/${payload.itemId}/item?factoryId=${payload.factoryId}`
    );
    return data;
};

export const deleteRoutingTemp = async({ commit }, payload) => {
    const { data } = await delRequest(
        `/api/v3/routings/temp/${payload.ID}`
    );
    return data;
};
export const deleteRoutingTempByItemId = async({ commit }, payload) => {
    const { data } = await delRequest(
        `/api/v3/routings/temp/${payload.itemId}/item`
    );
    return data;
};

export const addRouting = async({ commit }, payload) => {
    await postRequest(`/api/v3/routings/${payload.itemId}/boms`, payload);
};

export const addRoutingTemp = async({ commit }, payload) => {
    await postRequest(`/api/v3/routings/temp/${payload.itemId}/boms`, payload);
};

export const updateRoutingTemp = async({ commit }, payload) => {
    await putRequest(`/api/v3/routings/temp/${payload.ID}/boms`, payload);
};

export const updateSendApprove = async({ commit }, payload) => {
    await putRequest(`/api/v3/routings/temp/${payload.accountId}/send`, payload);
};

export const addRoutingToRoutingTemp = async({ commit }, payload) => {
    await postRequest(`/api/v3/routings/routing-to-temp/${payload.itemId}`, payload);
};
export const acceptRoutingChange = async({ commit }, payload) => {
    const { data } = await postRequest(`/api/v3/routings/routing-to-accept?itemId=${payload.itemId}&factoryId=${payload.factoryId}`)
    return data;
};

export const saveRouting = async({ commit }, payload) => {
    await putRequest(`/api/v3/routings/${payload.itemId}/boms`, payload);
};

export const removeRouting = async({ commit }, payload) => {
    await delRequest(`/api/v3/routings/${payload.ID}/boms`);
};

export const removeRoutingTemp = async({ commit }, payload) => {
    await delRequest(`/api/v3/routings/temp/${payload.ID}/boms`);
};

export const themDinhMuc = async({ commit }, payload) => {
    await postRequest(
    `/api/v3/boms/${payload.itemId}/materials`,
        payload.materials
    );
    return "Ok";
};

export const capNhatDinhMuc = async({ commit }, payload) => {
    await putRequest(`/api/v3/boms/${payload.id}`, { rate: payload.rate });
    return "Cap nhat";
};

export const xoaDinhMuc = async({ commit }, payload) => {
    await delRequest(`/api/v3/boms/${payload.id}`);
    return "Xoa";
};

export const getTonTaiTo = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/ton-tai-to?start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};
export const getTonVanity = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/ton-Vanity?start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};
export const getGiaoNhan = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/khoi-luong-giao-nhan?start=${payload.fromDate}&end=${payload.toDate}&factoryId=${payload.factoryId}`
    );

    return data;
};
export const getbuocgiacong = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-buoc-gia-cong?ITEM_ID=${payload.ITEM_ID}&factoryId=${payload.factoryId}&ID_TO=${payload.ID_TO}`
    );

    return data;
};
export const getsosanhnsld = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-so-sanh-nsld?ITEM_ID=${payload.ITEM_ID}&ID_CONG_VIEC=${payload.ID_CONG_VIEC}&ID_TO=${payload.ID_TO}
        &fromDate=${payload.fromDate}&toDate=${payload.toDate}`
    );

    return data;
};
export const getdulieuvattu = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-du-lieu-vt?ID_SP=${payload.ID_SP}&ID_TO=${payload.ID_TO}`
    );

    return data;
};
export const getbomvt = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bom-dm-vt?ITEM_ID=${payload.ITEM_ID}&factoryId=${payload.factoryId}&ID_TO=${payload.ID_TO}`
    );

    return data;
};
export const getbuocgiacongALL = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-buoc-gia-cong-all?ITEM_ID=${payload.ITEM_ID}&factoryId=${payload.factoryId}`
    );

    return data;
};
export const getghinhanbuocgiacongALL = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-ghi-nhan-buoc-gia-cong-all?factoryId=${payload.factoryId}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const getghinhannangsuatLDALL = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-ghi-nang-suat-lao-dong-all?factoryId=${payload.factoryId}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const getghinhannangsuatLDCBGALL = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-ghi-nang-suat-lao-dong-cbg-all?factoryId=${payload.factoryId}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const getghinhannangsuatLDCBGALLCT = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-ghi-nang-suat-lao-dong-cbg-all-chi-tiet?factoryId=${payload.factoryId}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const getghinhannangsuatLDCBGALLCTQR = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-ghi-nang-suat-lao-dong-cbg-all-chi-tiet-qr?factoryId=${payload.factoryId}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const getchamcongnangsuatLDCBGALLCTQR = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-cham-cong-nang-suat-lao-dong-cbg-all-chi-tiet-qr?factoryId=${payload.factoryId}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const getghinhannangsuatLDALLTONG = async({ commit }, payload) => {
    const { data } = await getRequest(
    `/api/v2/packages/get-ghi-nang-suat-lao-dong-all-tong?factoryId=${payload.factoryId}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const getghinhannangsuatLDCBGALLTONG = async({ commit }, payload) => {
    const { data } = await getRequest(
    `/api/v2/packages/get-ghi-nang-suat-lao-dong-cbg-all-tong?factoryId=${payload.factoryId}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const getghinhannangsuatLDALLTONGTH = async({ commit }, payload) => {
    const { data } = await getRequest(
    `/api/v2/packages/get-ghi-nang-suat-lao-dong-all-tong-tong-hop?factoryId=${payload.factoryId}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const getsanphamdobuocgiacongALL = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-san-pham-buoc-gia-cong-all?factoryId=${payload.factoryId}&startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const getbaocaobinhchonvp = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bao-cao-binh-chon-vp?factoryId=${payload.factoryId}`
    );

    return data;
};
export const getbaocaobinhchonvpcanhan = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bao-cao-binh-chon-vp-ca-nhan?factoryId=${payload.factoryId}`
    );

    return data;
};
export const getbaocaobinhchonvpphongban = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bao-cao-binh-chon-vp-phong-ban?factoryId=${payload.factoryId}`
    );

    return data;
};
export const getbaocaobinhchon = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bao-cao-binh-chon?factoryId=${payload.factoryId}&year=${payload.year}`
    );

    return data;
};
export const getbaocaobinhchonCB = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bao-cao-binh-chon-cb?factoryId=${payload.factoryId}&year=${payload.year}`
    );

    return data;
};
export const getbaocaobinhchonchitiet = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bao-cao-binh-chon-chi-tiet?factoryId=${payload.factoryId}&year=${payload.year}`
    );

    return data;
};
export const getbaocaobinhchonchitietCB = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bao-cao-binh-chon-chi-tiet-cb?factoryId=${payload.factoryId}&year=${payload.year}`
    );

    return data;
};
export const getbaocaobinhchonchitietVP = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bao-cao-binh-chon-chi-tiet-vp?factoryId=${payload.factoryId}`
    );

    return data;
};
export const getbaocaobinhchonchitietVPCN = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bao-cao-binh-chon-chi-tiet-vp-ca-nhan?factoryId=${payload.factoryId}`
    );

    return data;
};
export const getbaocaobinhchonchitietVPPB = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-bao-cao-binh-chon-chi-tiet-vp-phong-ban?factoryId=${payload.factoryId}`
    );

    return data;
};
export const getXacNhanQC = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/xac-nhan-qc?start=${payload.fromDate}&end=${payload.toDate}&factoryId=${payload.factoryId}`
    );

    return data;
};
export const nhapdongia = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/nhap-don-gia`,payload
    );

    return data;
};
export const CREATE_BUOC_GIA_CONG = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/nhap-buoc-gia-cong`,payload
    );

    return data;
};
export const CREATE_BOM_VT = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/nhap-bom-dm-vt`,payload
    );

    return data;
};
export const UPDATE_BUOC_GIA_CONG = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/update-buoc-gia-cong`,payload
    );

    return data;
};
export const UPDATE_DM_VT = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/update-dm-vt`,payload
    );

    return data;
};
export const deletebuocgiacong = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/del-buoc-gia-cong`,payload
    );

    return data;
};
export const deletebomvt = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/del-bom-vt`,payload
    );

    return data;
};
export const updatexacnhanqc = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/update-xac-nhan-qc`,payload
    );

    return data;
};
export const getKlQuyLuong = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/khoi-luong-quy-luong?strWeek=${payload.strWeek}&start=${payload.fromDate}&end=${payload.toDate}
        &factoryId=${payload.factoryId}`
    );

    return data;
};
export const getKlQuyLuongLuaPhoiOD = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/khoi-luong-quy-luong-lua-phoi?strWeek=${payload.strWeek}&start=${payload.fromDate}&end=${payload.toDate}
        &factoryId=${payload.factoryId}`
    );

    return data;
};
export const getKlQuyLuongLuaPhoiX5 = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/khoi-luong-quy-luong-lua-phoi-x5?strWeek=${payload.strWeek}&start=${payload.fromDate}&end=${payload.toDate}
        &factoryId=${payload.factoryId}`
    );

    return data;
};
export const getKlQuyLuongSayPhoi = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/khoi-luong-quy-luong-say-phoi?strWeek=${payload.strWeek}&start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};
export const getKlQuyLuongSoche = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/khoi-luong-quy-luong-so-che-x1?strWeek=${payload.strWeek}&start=${payload.fromDate}&end=${payload.toDate}
        &factoryId=${payload.factoryId}`
    );

    return data;
};
export const getKllosay = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/khoi-luong-lo-say?strWeek=${payload.strWeek}&start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};
export const getKllosayngay = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/khoi-luong-lo-say-ngay`, payload
    );

    return data;
};
export const getSLlosay = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/tong-khoi-luong-lo-say?strWeek=${payload.strWeek}&start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};
export const getSLloi = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/tong-so-luong-loi?start=${payload.fromWeek}&end=${payload.toWeek}&year=${payload.year}`
    );

    return data;
};
export const getChartSLloi = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/chart-so-luong-loi`, payload
    );

    return data;
};
export const getSLTheoThangSL = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/san-luong-theo-thang-sl?strWeek=${payload.strWeek}&start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};
export const getSLTheoThangSL2 = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-theo-thang-sl-2`, payload
    );

    return data;
};
export const getSLTheoThangM32 = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-theo-thang-m3-2`, payload
    );

    return data;
};
export const getSLTheoDay = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-theo-ngay`,payload
    );

    return data;
};
export const getSLTheoDayloi = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-theo-ngay-loi`,payload
    );

    return data;
};
export const getSLngoaiKH = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages2/ngoai-ke-hoach`,payload
    );

    return data;
};
export const getChartSLTheoDay = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/chart-san-luong-theo-ngay`,payload
    );

    return data;
};
export const getSLTheoTuanSL = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-theo-tuan-sl`,payload
    );

    return data;
};
export const getSLTheoTuanM3 = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-theo-tuan-m3`, payload
    );

    return data;
};
export const getSLTheoTuanM3_quidoi = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-theo-tuan-m3-qui-doi`, payload
    );

    return data;
};
export const getSLTheoNamSL_quidoi = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-theo-thang-m3-qui-doi`, payload
    );

    return data;
};
export const getSLQuyDoiTungNhaMay = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-quy-doi-tung-nha-may`, payload
    );

    return data;
};
export const getBieuDoSLQuyDoiTungNhaMay = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/bieu-do-san-luong-quy-doi-tung-nha-may`, payload
    );

    return data;
};
export const getBieuDososanhFASTSAP = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/bieu-do-so-sanh-fast-sap`, payload
    );

    return data;
};
export const getBieuDososanhFASTSAPDONHANGMUA = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/bieu-do-so-sanh-fast-sap-don-hang-mua`, payload
    );

    return data;
};
export const getSLTheoNamSL = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-theo-nam-sl`,payload
    );

    return data;
};
export const getChartSLTheoNam = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/chart-san-luong-theo-nam-sl`,payload
    );

    return data;
};
export const getChartSLTheoTuanSS = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages2/chart-san-luong-theo-tuan-sl-ss`,payload
    );

    return data;
};
export const getCongSuatInDepartment = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages2/cong-doan-in-department?departmentId=${payload.departmentId}`
    );

    return data;
};
export const getChartSLTheoThangSS = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages2/chart-san-luong-theo-thang-sl-ss`,payload
    );

    return data;
};
export const getSocongdoan = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages2/so-cong-doan`,payload
    );

    return data;
};
export const getChartSLTheoWeek = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/chart-san-luong-theo-week`,payload
    );

    return data;
};
export const getSLTheoThangM3 = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/san-luong-theo-thang-m3?strWeek=${payload.strWeek}&start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};
export const getSLSayTheoThang = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages2/san-luong-say-theo-thang?year=${payload.year}&departmentId=${payload.departmentId}`
    );

    return data;
};
export const getChartSLSayTheoThang = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages2/chart-san-luong-say-theo-thang?year=${payload.year}&departmentId=${payload.departmentId}`
    );

    return data;
};
export const getChartSLSayTheoThangsaylai = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages2/chart-san-luong-say-theo-thang-say-lai?year=${payload.year}&departmentId=${payload.departmentId}`
    );

    return data;
};

export const getSLCongDoanThang = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-cong-doan-thang`, payload
    );

    return data;
};
export const getSLCongDoanQuy = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-cong-doan-quy`, payload
    );

    return data;
};
export const getSLCongDoanNam = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-cong-doan-nam`, payload
    );

    return data;
};
export const getSLTheoNamM3 = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-theo-nam-m3`,payload
    );

    return data;
};
export const getSLKhoiCBG = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/san-luong-khoi-cbg?year=${payload.year}`
    );

    return data;
};
export const getGroupDepartment = async({ commit }) => {
    const { data } = await getRequest(
        `/api/v2/packages/group-department`
    );

    return data;
};
export const taobangtoncd = async({ commit },payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/tao-bang-ton?startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const taobangtoncd1 = async({ commit },payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/tao-bang-ton-1?startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const nhapbangtoncd = async({ commit },payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/nhap-bang-ton1?startDate=${payload.startDate}&endDate=${payload.endDate}`
    );

    return data;
};
export const INSERT_GROUP_DEPARTMENT = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/group-department`, payload
    );

    return data;
};
export const DELETE_GROUP_DEPARTMENT = async({ commit }, payload) => {
    const { data } = await delRequest(
        `/api/v2/packages/group-department/`+payload.departmentId
    );

    return data;
};
export const getListGroupDepartment = async({ commit }) => {
    const { data } = await getRequest(
        `/api/v2/packages/list-group-department`
    );

    return data;
};
export const getDepartmentCongSuat = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages2/department-cong-suat?factoryId=${payload.factoryId}`
    );

    return data;
};
export const getloadbom = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages2/load-bom?factoryId=${payload.factoryId}`
    );

    return data;
};
export const updateCongSuatTuan = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages2/cong-suat-tuan`, payload
    );

    return data;
};
export const getTongCongWithDepartment = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/tong-cong-with-department?factoryId=${payload.factoryId}&nam=${payload.nam}&thang=${payload.thang}`
    );

    return data;
};
export const getbaocaotongcongWithDepartment = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bao-cao-tong-cong-with-department?factoryId=${payload.factoryId}&nam=${payload.nam}`
    );

    return data;
};
export const getbaocaoNSLD = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bao-cao-nang-suat-lao-dong?factoryId=${payload.factoryId}&nam=${payload.nam}&from=${payload.from}&to=${payload.to}`
    );

    return data;
};
export const getbaocaoNSLDMonth = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bao-cao-nang-suat-lao-dong-theo-thang?factoryId=${payload.factoryId}&year=${payload.year}&month=${payload.month}`
    );

    return data;
};
export async function GET_REPORT_TON_SON({ commit }, payload) {
    const data = await getRequest(
        api.PROD_REPORT_SON +
        "?year=" +
        payload.year +
        "&week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId
    );
    return data.data;
}
export async function GET_NHAP_SO_DIEN({ commit }, payload) {
    const data = await getRequest(`/api/v2/production-order/get-nhap-so-dien?factoryId=${payload.factoryId}&nam=${payload.nam}&thang=${payload.thang}`);
    return data.data;
}

export async function GET_NHAP_DM_DIEN({ commit }, payload) {
    const data = await getRequest(`/api/v2/production-order/get-nhap-dm-dien?factoryId=${payload.factoryId}&nam=${payload.nam}&thang=${payload.thang}`);
    return data.data;
}
export const getTongCongByDepartment = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/tong-cong-by-department?departmentId=${payload.departmentId}&nam=${payload.nam}&thang=${payload.thang}`
    );

    return data;
};
export const getsanluongquidoi = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/ty-le-san-luong-qui-doi?nam=${payload.nam}`
    );

    return data;
};
export const insertTongCong = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/tong-cong`, payload
    );
    return data;
};
export const insertlaitoncongdoan = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages2/insert-them-ton-cong-doan`, payload
    );
    return data;
};
export const xoanhaptoncongdoan = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages2/xoa-nhap-ton-cong-doan`, payload
    );
    return data;
};
export const insertHesoquidoi = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/he-so-qui-doi`, payload
    );
    return data;
};
export const insertHesoquidoiTL = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/he-so-qui-doi-tl`, payload
    );
    return data;
};
export const insertToncongdoan = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages2/insert-ton-cong-doan`, payload
    );
    return data;
};
export const updateTongCong = async({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/tong-cong`, payload
    );
    return data;
};
export const deleteTongCong = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/xoa-tong-cong`, payload
    );
    return data;
};
export const xoaHesoquidoi = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/xoa-he-so-qui-doi`, payload
    );
    return data;
};
export const getBangGiaBaoCat = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bang-gia-cat-bao`
    );

    return data;
};
export const getBangGiaBaoCatNotVerifyByMaSP = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bang-gia-cat-bao-not-verify-by-masp?maSp=${payload.maSP}`
    );

    return data;
};
export const getBangGiaBaoCatNotVerify = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/bang-gia-cat-bao-not-verify`
    );

    return data;
};
export const insertBangGiaBaoCat = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/bang-gia-cat-bao`,payload
    );

    return data;
};

export const approveBangGiaBaoCat = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/approve-bang-gia-cat-bao`,payload
    );

    return data;
};
export const rejectBangGiaBaoCat = async({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/reject-bang-gia-cat-bao`,payload
    );

    return data;
};

export const getDepartmentByFactoryId = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/department-by-factoryId?factoryId=${payload.factoryId}`
    );

    return data;
};
export const getDepartmentCatBao = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/department-bao-cat?factoryId=${payload.factoryId}`
    );

    return data;
};
export const getlosayByFactoryId = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/losay-by-factoryId?factoryId=${payload.factoryId}`
    );

    return data;
};

export const getGiaoNhan2 = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/khoi-luong-giao-nhan-2?start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};

export const getPerformTable = async({ commit }, payload) => {
    try {
        const data = await getRequest(
            `/api/v2/packages/getPerformTable?week=${payload.week}&year=${payload.year}&factoryId=${payload.factoryId}`
        );
        console.log(data.data.data.recordset);
        return data.data.data.recordset;

    } catch (e) {
        console.log(e)
    }
};

export const getPerformTableByStep = async({ commit }, payload) => {
    try {
        const data = await getRequest(
            `/api/v2/packages/getPerformTableByStep?week=${payload.week}&year=${payload.year}&stepId=${payload.stepId}`
        );
        console.log(data.data.data.recordset);
        return data.data.data.recordset;

    } catch (e) {
        console.log(e)
    }
};
export const getExportVanity = async({ commit }, payload) => {
    try {
        const data = await getRequest(
            `/api/v2/packages/getExportVanity?itemId=${payload.itemId}&factoryId=${payload.factoryId}`
        );
        console.log(data.data.data.recordset);
        return data.data.data.recordset;

    } catch (e) {
        console.log(e)
    }
};
export const getPerformTableByStepPaint = async({ commit }, payload) => {
    try {
        const data = await getRequest(
            `/api/v2/packages/getPerformTableByStepPaint?week=${payload.week}&year=${payload.year}&stepId=${payload.stepId}`
        );
        console.log(data.data.data.recordset);
        return data.data.data.recordset;

    } catch (e) {
        console.log(e)
    }
};
export const getCapPhoi = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/lich-su-xuat-phoi-ton?start=${payload.fromDate}&end=${payload.toDate}`
    );

    return data;
};

export const stockdepartment = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/ton-dau-ky/stockdepartment?start=${payload.startDate}&end=${payload.endDate}`
    );
    return data;
};
export const stockAfterDrying = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/ton-dau-ky/stockAfterDrying?start=${payload.startDate}&end=${payload.endDate}`
    );
    return data;
};
export const stockAfterDryingchoose = async({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/ton-dau-ky/stockAfterDryingchoose?start=${payload.startDate}&end=${payload.endDate}`
    );
    return data;
};

export const GET_NHA_MAY_DONG_GOI = async ({ commit }) => {
    const { data } = await getRequest(
        `/api/v2/packages/nha-may-dong-goi`
    );

    return data;
};
export const GET_REPORT_CHART_SAN_LUONG_WEEK = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/chart-san-luong-week?fromWeek=${payload.fromWeek}&toWeek=${payload.toWeek}&year=${payload.year}`
    );

    return data;
};
export const GET_REPORT_CHART_SAN_LUONG_WITH_CONG_DOAN = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/chart-san-luong-with-cong-doan`, payload
    );

    return data;
};
export const GET_REPORT_CHART_SAN_LUONG_WITH_CONG_DOAN2 = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/chart-san-luong-with-cong-doan-2`, payload
    );

    return data;
};
export const GET_SAN_LUONG_IN_FACTORY = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/san-luong-in-factory`, payload
    );

    return data;
};
export const GET_REPORT_SO_SANH_KHOI_LUONG_SAY_PHOI = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/kiln-batch/so-sanh-khoi-luong-say-phoi`, payload
    );

    return data;
};
export const GET_REPORT_KHOI_LUONG_SAY_PHOI_THEO_LOAI = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/kiln-batch/khoi-luong-say-phoi-theo-loai`, payload
    );

    return data;
};
export const GET_REPORT_KHOI_LUONG_SAY_PHOI_THEO_NHA_MAY = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/kiln-batch/chart-khoi-luong-say-phoi-theo-nha-may`, payload
    );

    return data;
};
export const GET_REPORT_CHART_SAN_LUONG_WEEK_CONG_DOAN = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/chart-san-luong-week-cong-doan`, payload
    );

    return data;
};
export const GET_REPORT_CHART_SAN_LUONG_CONG_DOAN_WEEK = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/chart-san-luong-cong-doan-week?start=${payload.fromDate}&end=${payload.toDate}&factoryId=${payload.factoryId}`
    );

    return data;
};
export const GET_REPORT_CHART_TON_CONG_DOAN_WEEK = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/chart-ton-cong-doan-week?end=${payload.toDate}&factoryId=${payload.factoryId}`
    );

    return data;
};
export const GET_ITEM_IN_DEPARTMENT_NAME = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/item-in-department-name?departmentName=${payload.departmentName}&fromDate=${payload.fromDate}&toDate=${payload.toDate}`
    );

    return data;
};
export const GET_ITEM_IN_TON_DEPARTMENT_NAME = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/item-in-ton-department-name?departmentName=${payload.departmentName}&toDate=${payload.toDate}`
    );

    return data;
};
export const GET_ITEM_IN_TON_DEPARTMENT_NAME_DETAIL = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/item-in-ton-department-name-detail?departmentName=${payload.departmentName}&itemId=${payload.itemId}&toDate=${payload.toDate}`
    );

    return data;
};
export const GET_DEPARTMENT_BY_FACTORY = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/department-by-factory?factoryId=${payload.factoryId}`
    );

    return data;
};
export const GET_DEPARTMENT_TON_BY_FACTORY = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/department-ton-by-factory?factoryId=${payload.factoryId}`
    );

    return data;
};
export const GET_ITEM_TON = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/item-ton`
    );

    return data;
};
export const GET_DEPARTMENT_ITEM_TON = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/department-item-ton?itemId=${payload.itemId}`
    );

    return data;
};
export const GET_REPORT_CHART_ITEM_TON_CONG_DOAN = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/chart-item-ton-cong-doan?itemId=${payload.itemId}&toDate=${payload.toDate}`
    );

    return data;
};

export const getMenuOfAccount = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/role-menu/permission/menu-of-account?accountId=${payload.accountId}`
    );

    return data;
};

export const getAccountPermission = async ({ commit }) => {
    const { data } = await getRequest(
        `/api/v2/role-menu/permission/get-account-permission`
    );

    return data;
};

export const insertAccountPermission = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/role-menu/permission/insert-account-permission`, payload
    );

    return data;
};

export const updateAccountPermission = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/role-menu/permission/update-account-permission`, payload
    );

    return data;
};

export const deleteAccountPermission = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/role-menu/permission/delete-account-permission`, payload
    );

    return data;
};

export const getAllPermission = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/role-menu/permission/permission-all`
    );

    return data;
};
export const getUserPermission = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/role-menu/permission/menu-permission?menuId=${payload.id}`
    );

    return data;
};
export const insertMenuPermission = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/role-menu/permission/menu-permission`, payload
    );

    return data;
};
export const getMenuPermissionMenuId = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/role-menu/menu-permission/get-by-menuId?menuId=${payload.menuId}`
    );

    return data;
};
export const deleteMenuPermission = async ({ commit }, payload) => {
    const { data } = await delRequest(
        `/api/v2/role-menu/permission/menu-permission/${payload.id}`
    );

    return data;
};

export const getById = async ({ commit }, id) => {
    const { data } = await getRequest(
        `/api/v2/role-menu/${id}`
    );

    return data;
};

export const getPermissionInScreen = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/role-menu/permission/in/screen?path=${payload.path}&accountId=${payload.accountId}`
    );

    return data;
};

export const deleteRoleMenu = async ({ commit }, id) => {
    const { data } = await delRequest(
        `/api/v2/role-menu/${id}`
    );

    return data;
};

export const insertRoleMenu = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/role-menu`, payload
    );

    return data;
};

export const GET_REPORT_DINH_MUC_DIEN_TIEU_THU = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/dinh-muc-dien-tieu-thu?factoryId=${payload.factoryId}&month=${payload.month}&year=${payload.year}`
    );

    return data;
};
export const ADD_TIEU_THU_DIEN_GHI_CHU = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/tieu-thu-dien-ghi-chu`, payload
    );

    return data;
};
export const GET_BIEU_DO_TIEU_THU_DIEN = async ({ commit }, payload) => {
    const { data } = await postRequest(
        `/api/v2/packages/bieu-do-tieu-thu-dien`, payload
    );

    return data;
};
export const GET_XUONG_TIEU_THU_DIEN = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/xuong-tieu-thu-dien?factoryId=${payload.factoryId}&month=${payload.month}&year=${payload.year}`
    );

    return data;
};
//get all items
export const getAllItem = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-all-items`, payload
  );
  return data;
};
export const getDepartment = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-all-department`, payload
  );
  return data;
};
export const getRoutingByItemID = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-routing-by-itemid?itemID=${payload.itemID}`,
  );
  return data;
};
export const getBom = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-bom`,
  );
  return data;
};
export const insertBom = async ({ commit }, payload) => {
  const { data } = await postRequest(
    `/api/v2/packages/insert-bom`, payload
  );

  return data;
};
export const removeBom = async ({ commit }, payload) => {
  const { data } = await delRequest(
      `/api/v2/packages/remove-bom?itemID=${payload.itemID}&materialsID=${payload.materialsID}`
  );

  return data;
};
export const updateBom = async ({ commit }, payload) => {
  const { data } = await putRequest(
      `/api/v2/packages/update-bom`, payload
  );

  return data;
};

export const insertRou = async ({ commit }, payload) => {
  const { data } = await postRequest(
    `/api/v2/packages/insert-routing`, payload
  );

  return data;
};
export const removeRou = async ({ commit }, payload) => {
  const { data } = await delRequest(
      `/api/v2/packages/remove-rou?itemID=${payload.itemID}&stepID=${payload.stepID}`
  );

  return data;
};
export const getBomItemID = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-bom-byItemID?itemID=${payload.itemID}`,
  );
  return data;
};

export const g_tree_GetBom = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-all-bom`, payload
  );
  return data;
};

export const g_tree_GetItemInBom = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-item-in-bom`, payload
  );
  return data;
};

export const getNameMaterial = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-name-material`, payload
  );
  return data;
};
export const g_insertBomTemp = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/g-insert-bom-temp`, payload
  );
  return data;
};

export const updateHeSoCauThanh = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-rate-bom-temp`, payload
  );
  return data;
};
export const gdeleteBom = async ({ commit }, payload) => {
  const { data } = await delRequest(
      `/api/v2/packages/gdeleteBom?idbom=${payload[0].idbom}`
  );

  return data;
};

export const g_insertRou = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/g_insertRou`, payload
  );
  return data;
};

export const updateThuTuDinhTuyen = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-order-routing`, payload
  );
  return data;
};
export const gdeleteRou = async ({ commit }, payload) => {
  const { data } = await delRequest(
      `/api/v2/packages/gdeleteRou?idrou=${payload[0].idrou}`
  );
  return data;
};

export const getRoutingTemplate = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-routingtemplate`, payload
  );
  return data;
};

export const getAllRouting = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-all-routing`, payload
  );
  return data;
};

export const getAllRoutingTemplate = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-all-temprouting`, payload
  );
  return data;
};

export const pheDuyetDinhTuyen = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/phe-duyet-dinh-tuyen`, payload
  );
  return data;
};

export const tuChoiPheDuyetDinhTuyen = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/tu-choi-phe-duyet-dinh-tuyen`, payload
  );
  return data;
};

export const insertInToBomTemp = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/insert-into-bomtemp`, payload
  );
  return data;
};

export const getAllBomTem = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-all-bom-temp`, payload
  );
  return data;
};

export const insertSanPham = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/insert-san-pham`, payload
  );
  return data;
};

export const insertCum = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/insert-cum`, payload
  );
  return data;
};

export const insertChiTiet = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/insert-chi-tiet`, payload
  );
  return data;
};

export const getAllDepartmetHaveCode = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-all-department-have-code`, payload
  );
  return data;
};
export const getAllSanPhamvcn = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-all-san-pham-vcn`, payload
    );
    return data;
  };
export const getAllSanPham = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-all-san-pham`, payload
  );
  return data;
};
export const getAllSanPhamgiacong = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-all-san-pham-gia-cong`, payload
    );
    return data;
  };
  export const getAllSanPhamNM = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-all-san-pham-nm?factoryId=${payload.factoryId}`, payload
    );
    return data;
  };
  export const suacvtc = async ({ commit }, payload) => {
    const { data } = await putRequest(
        `/api/v2/packages/sua-cvtc`, payload
    );
    return data;
  };
  export const getAlltobinhchon = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-all-to-binh-chon?factoryId=${payload.factoryId}`, payload
    );
    return data;
  };
export const getMamau = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-ma-mau`, payload
    );
    return data;
  };
export const getAllSanPhamduyet = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-all-san-pham-duyet`, payload
    );
    return data;
  };
export const updateChiTiet = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-chi-tiet`, payload
  );
  return data;
};
export const laymausanpham = async ({ commit }, payload) => {
    const {data}  = await getRequest(
        `/api/v2/packages/lay-mau-san-pham?masp=${payload.masp}`, payload
    );
    return data;
  };
export const updateChiTietmau = async ({ commit }, payload) => {
    const {data}  = await putRequest(
        `/api/v2/packages/update-chi-tiet-mau`, payload
    );
    return data;
  };
  export const insertspmau = async ({ commit }, payload) => {
    const {data}  = await putRequest(
        `/api/v2/packages/insert-sp-mau`, payload
    );
    return data;
  };
export const insertDinhTuyenTemplate = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/insert-dinh-tuyen-templadte`, payload
  );
  return data;
};
export const getAllRoutingTempvcn = async ({ commit }, payload) => {
    const { data } = await getRequest(
        `/api/v2/packages/get-all-routing-temp-vcn`, payload
    );
    return data;
  };
export const getAllRoutingTemp = async ({ commit }, payload) => {
  const { data } = await getRequest(
      `/api/v2/packages/get-all-routing-temp`, payload
  );
  return data;
};
export const updateTrangThaiSanPham = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-trang-thai-sp`, payload
  );
  return data;
};
export const updateTrangThaiEDIT = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-trang-thai-edit`, payload
  );
  return data;
};
export const tuchoiSanPham = async ({ commit }, payload) => {
  const { data } = await putRequest(
      `/api/v2/packages/tuchoi-SP-TEMP`, payload
  );
  return data;
};
export const delRoutingTemp = async ({ commit }, payload) => {
  const { data } = await putRequest(
      `/api/v2/packages/delete-routing-TEMP`, payload
  );
  return data;
};
export const duyetSanPham = async ({ commit }, payload) => {
  const { data } = await putRequest(
      `/api/v2/packages/duyet-SP-TEMP`, payload
  );
  return data;
};

export const rejectSanPham = async ({ commit }, payload) => {
  const { data } = await delRequest(
      `/api/v2/packages/reject-San-Pham?payload=${payload}`
  );
  return data;
};
export const approveSanPham = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/approve-trang-thai-sp`, payload
  );
  return data;
};
export const insertSuaSanPham = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/insert-sua-sp`, payload
  );
  return data;
};

export const delSP = async ({ commit }, payload) => {
  const { data } = await putRequest(
      `/api/v2/packages/delete-sanpham`, payload
  );
  return data;
};
export const updataTypeEdit = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-type-eidt`, payload
  );
  return data;
};
export const updateSoLuongCum = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-soluong-cum`, payload
  );
  return data;
};

export const updateEditSanPham = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-edit-sp`, payload
  );
  return data;
};

export const updateCumOfChiTiet = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-edit-cum-of-chitiet`, payload
  );
  return data;
};

export const updateCongSuatMay = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-cong-suat-may`, payload
  );
  return data;
};

export const pheDuyetCSM = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/phe-duyet-cong-suat-may`, payload
  );
  return data;
};

export const IMPORT_KYGUI = async({ commit }, payload) => {
  const { data } = await postRequest(
      `/api/v2/packages/import_kehoachxuathang`, payload
  );
  return data;
};

export const GET_KYGUI = async ({ commit }, payload) => {
  const { data } = await getRequest(
  `/api/v2/packages/get_kehoachxuathang?ngay=${payload}`
  );
  return data;
};

export const getConsigments = async ({ commit }, payload) => {
  const { data } = await getRequest(
    `/api/v2/packages/get_Consigments?ngay=${payload}`
  );
  return data;
};

export const updateConsigments = async ({ commit }, payload) => {
  const {data}  = await putRequest(
      `/api/v2/packages/update-consigments`, payload
  );
  return data;
};
export const getBienBanGiaoNhanHangHoa = async({ commit },payload) => {
  console.log('payload',payload)
  const { data } = await getRequest(
    `/api/v2/packages/bien-ban-giao-nhan-hang-hoa?daungay=${payload.daungay}&cuoingay=${payload.cuoingay}`
  );
  return data;
};
export const updateRowImportKHXH = async({ commit }, payload) => {
  const { data } = await putRequest(
      `/api/v2/packages/update-row-importKHXH`, payload
  );

  return data;
};

export const deleteRowImportKHXH = async({ commit }, payload) => {
  const { data } = await putRequest(
      `/api/v2/packages/delete-row-importKHXH`, payload
  );

  return data;
};

export const getBCNHAPXUATTONTHANHPHAM = async({ commit },payload) => {
  console.log('payload',payload)
  const { data } = await getRequest(
    `/api/v2/packages/bc-nhap-xuat-ton-thanh-pham?tuNgay=${payload.tuNgay}&denNgay=${payload.denNgay}`
  );
  return data;
};

export const updateHSLP = async({ commit }, payload) => {
  console.log('payload',payload)
  const { data } = await putRequest(
      `/api/v2/packages/update-he-so-lua-phoi`, payload
  );

  return data;
};

// ── Chấm công ZKTeco ──────────────────────────────────
export const getAttendanceMachines = async ({ commit }) => {
  const { data } = await getRequest(`/api/v2/attendance/machines`);
  return data;
};
export const addAttendanceMachine = async ({ commit }, payload) => {
  const { data } = await postRequest(`/api/v2/attendance/machines`, payload);
  return data;
};
export const updateAttendanceMachine = async ({ commit }, payload) => {
  const { data } = await putRequest(`/api/v2/attendance/machines/${payload.id}`, payload);
  return data;
};
export const syncAttendanceAll = async ({ commit }) => {
  const { data } = await postRequest(`/api/v2/attendance/sync`, {});
  return data;
};
export const syncAttendanceOne = async ({ commit }, machineId) => {
  const { data } = await postRequest(`/api/v2/attendance/sync/${machineId}`, {});
  return data;
};
export const getAttendanceLogs = async ({ commit }, params) => {
  const q = new URLSearchParams(params).toString();
  const { data } = await getRequest(`/api/v2/attendance/logs?${q}`);
  return data;
};
export const testAttendanceMachine = async ({ commit }, machineId) => {
  const { data } = await postRequest(`/api/v2/attendance/test/${machineId}`, {});
  return data;
};
export const debugAttendanceMachine = async ({ commit }, machineId) => {
  const { data } = await postRequest(`/api/v2/attendance/debug/${machineId}`, {});
  return data;
};
export const syncAttendanceRange = async ({ commit }, { machineId, fromDate, toDate }) => {
  const res = await postRequest(`/api/v2/attendance/sync-range/${machineId}`, { fromDate, toDate });
  return res?.data;
};
export const getAttendanceSummary = async ({ commit }, params) => {
  const q = new URLSearchParams(params).toString();
  const { data } = await getRequest(`/api/v2/attendance/summary?${q}`);
  return data;
};