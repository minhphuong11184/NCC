import { postRequest, putRequest, getRequest, delRequest } from "../../ultils";
import { api } from "../../ultils/api";
export async function GET_DS_PHIEU_NHAP_KHO({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO + "?kho=" + payload.kho + "&guid=" + payload.guid
    );
    return data.data;
}
export async function GET_DS_PHIEU_NHAP_KHO_SO_SANH({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT1 + "/so-sanh" + "?startDate=" + payload.startDate + "&endDate=" + payload.endDate
    );
    return data.data;
}
export async function GET_DS_PHIEU_NHAP_KHO_SO_SANH_PHIEU({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT1 + "/so-sanh-phieu" + "?startDate=" + payload.startDate + "&endDate=" + payload.endDate
    );
    return data.data;
}
export async function GET_DS_PHIEU_NHAP_LAI({ commit }, payload) {
    console.log(payload);
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT1 + "/nhap-lai" + "?kho=" + payload.kho
    );
    return data.data;
}
export async function getPhieuNhapKhos({ commit }, payload) {
    let { data } = await getRequest(
        `/api/v2/nlg-phieu-nhap-kho/${payload.kho}?start=${payload.fromDate}&end=${payload.toDate}`
    );
    commit("setPhieuNhapKhos", data);
}
export async function GET_DS_PHIEU_NHAP_KHO1({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO1 + "?kho=" + payload.kho + "&guid=" + payload.guid
    );
    return data.data;
}
export async function VIEW_XUAT_GO_THEO_NGAY({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + `/viewxuatgotheongay?start=${payload.fromDate}&end=${payload.toDate}&number=${payload.number}&destinationId=${payload.destinationId}`);
    return data.data;
}
export async function VIEW_XUAT_GO_THEO_NGAY_2M({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + `/viewxuatgotheongay2m?start=${payload.fromDate}&end=${payload.toDate}&number=${payload.number}&destinationId=${payload.destinationId}`);
    return data.data;
}
export async function GET_LSX_XUAT_GO_THEO_NGAY({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + `/getLSXxuatgotheongay?start=${payload.fromDate}&end=${payload.toDate}`);
    return data.data;
}
export async function GET_LX_XUAT_GO_THEO_NGAY_2M({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + `/getLSXxuatgotheongay2m?start=${payload.fromDate}&end=${payload.toDate}`);
    return data.data;
}

export async function GET_DS_PHIEU_TT_NHAP_LAI({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO1 + "/nhap-lai" + "?kho=" + payload.kho + "&guid=" + payload.guid
    );
    return data.data;
}
export async function GET_DS_PHIEU_NHAP_KHO2({ commit }, payload) {
    let data = await getRequest(api.NLG_PHIEU_NHAP_KHO2 + "?kho=" + payload.kho);
    return data.data;
}
export async function GET_DS_PHIEU_NHAP_KHO3({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO3 + "?kho=" + payload.kho + "&guid=" + payload.guid
    );
    return data.data;
}
export async function GET_DS_PHIEU_NHAP_KHO4({ commit }, payload) {
    let data = await getRequest(api.NLG_PHIEU_NHAP_KHO4 + "?kho=" + payload.kho);
    return data.data;
}
export async function UPDATE_PHIEU_NHAP_KHO({ commit }, payload) {
    let data = await putRequest(
        api.NLG_PHIEU_NHAP_KHO + "/" + payload.id,
        payload
    );
    return data.data;
}
export async function UPDATE_PHIEU_NHAP_KHO_NEW({ commit }, payload) {
    let data = await putRequest(
        api.NLG_PHIEU_NHAP_KHO + "/xoa-tt",
        payload
    );
    return data.data;
}
export async function UPDATE_PHIEU_NHAP_KHO_NL({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO1 + "/NL" + "?id=" + payload.id + "&sophieu=" + payload.sophieu

    );
    return data.data;
}
export async function HUY_PHIEU_NHAP_LAI({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/huy" + "?id=" + payload.id,
        payload
    );
    return data.data;
}
export async function UPDATE_PHIEU_NHAP_KHO3({ commit }, payload) {
    let data = await putRequest(api.NLG_PHIEU_NHAP_KHO, payload);
    return data.data;
}
export async function UPDATE_PHIEU_NHAP_KHO2({ commit }, payload) {
    let data = await putRequest(
        api.NLG_PHIEU_NHAP_KHO3 + "/" + payload.id,
        payload
    );
    return data.data;
}
// export async function GET_PHIEU_NHAP_KHO_DT({ commit }, payload) {
//     // let query = ``
//     // if (payload.guid) {
//     //     query = `?guid=${payload.guid}`
//     // }
//     // if (payload.id) {
//     //     query = `?id=${payload.id}`
//     // }
//     // if (payload.delai) {
//     //     query = `?delai=${payload.delai}`
//     // }
//     let data = await getRequest(api.NLG_PHIEU_NHAP_KHO_DT1)
//     return data.data
// }
export async function GET_DS_NHA_CUNG_CAP1({ commit }, payload) {
    console.log(payload);
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT1 + "?guid=" + payload.guid
    );
    return data.data;
}
export async function GET_DS_CHU_RUNG({ commit }, payload) {
    console.log(payload);
    let data = await getRequest(api.NLG_CHU_RUNG, payload);
    return data.data;
}
export async function GET_DS_MA_LO_GO({ commit }, payload) {

    let data = await getRequest(api.NLG_MA_LO_GO, payload);
    return data.data;
}
export async function GET_DS_KL_MA_LO_GO({ commit }, payload) {

    let data = await getRequest(api.NLG_MA_LO_GO + "/klmalogo", payload);
    return data.data;
}
export async function GET_NGAY_THANG({ commit }, payload) {
    console.log(payload);
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT1 + "/ngay" + "?guid=" + payload.guid
    );
    return data.data;
}
// export async function GET_QUY_CACH({ commit }, payload) {
//     console.log(payload);
//     let data = await getRequest(api.NLG_GET_NCC_THANG + "/nqc" + "?thang=" + payload.thang + "&nam=" + payload.nam);
//     return data.data;
// }
export async function GET_NCC_THANG({ commit }, payload) {
    console.log(payload);
    let data = await getRequest(api.NLG_GET_NCC_THANG + "?guid=" + payload.guid + "&thang=" + payload.thang + "&nam=" + payload.nam);
    return data.data;
}
export async function GET_NCC_THANG3({ commit }, payload) {

    let data = await getRequest(api.NLG_GET_NCC_THANG + "/klqc" + "?nhom=" + payload.nhom);
    return data.data;
}
export async function GET_NCC_THANG1({ commit }, payload) {
    console.log(payload);
    let data = await getRequest(
        api.NLG_GET_NCC_THANG1 + "?guid=" + payload.guid + "&kho=" + payload.kho + "&thang=" + payload.thang + "&nam=" + payload.nam
    );
    return data.data;
}
export async function GET_NCC_THANG2({ commit }, payload) {
    console.log(payload);
    let data = await getRequest(api.NLG_GET_NCC_THANG2 + "?guid=" + payload.guid);
    return data.data;
}
export async function GET_NHAP_THANG({ commit }, payload) {
    console.log(payload);
    let data = await getRequest(
        api.NLG_GET_NHAP_THANG + "?guid=" + payload.guid + "&nhom=" + payload.nhom + "&thang=" + payload.thang + "&nam=" + payload.nam
    );
    return data.data;
}
export async function GET_NHAP_THANG_VUOT({ commit }, payload) {
    let data = await getRequest(
        api.NLG_GET_NHAP_THANG + "/klvuot"+ "?guid=" + payload.guid + "&nhom=" + payload.nhom + "&thang=" + payload.thang + "&nam=" + payload.nam
    );
    return data.data;
}
export async function GET_NHAP_THANG1({ commit }, payload) {
    console.log(payload);
    let data = await getRequest(
        api.NLG_GET_NHAP_THANG +
        "/khokl" +
        "?makho=" +
        payload.makho +
        "&nhom=" +
        payload.nhom + "&thang=" + payload.thang + "&nam=" + payload.nam
    );
    return data.data;
}
export async function GET_DS_NHA_CUNG_CAP({ commit }, payload) {
    let data = await getRequest(api.NLG_NHA_CUNG_CAP);
    return data.data;
}
export async function GET_DS_KHO({ commit }, payload) {
    let data = await getRequest(api.NLG_KHO);
    return data.data;
}
export async function GET_NHA_CUNG_CAP_BY_USER({ commit }, createBy) {
    let data = await getRequest(api.NLG_NHA_CUNG_CAP + "?staff=" + createBy);
    return data.data;
}
export async function GET_DS_STAFF({ commit }, payload) {
    let data = await getRequest(api.NLG_STAFF + "/raw?typeUser=staff_nlg");
    return data.data;
}
export async function ADD_NHA_CUNG_CAP({ commit }, payload) {
    let data = await postRequest(api.NLG_NHA_CUNG_CAP, payload);
    return data.data;
}
export async function ADD_CHU_RUNG({ commit }, payload) {
    let data = await postRequest(api.NLG_CHU_RUNG, payload);
    return data.data;
}
export async function ADD_MA_LO_GO({ commit }, payload) {
    let data = await postRequest(api.NLG_MA_LO_GO, payload);
    return data.data;
}
export async function DANH_SACH_NGUOI_DUNG({ commit }, payload) {
    let data = await getRequest(api.NLG_NHA_CUNG_CAP +"/nguoidung", payload);
    return data.data;
}
export async function ADD_DS_CONG_VIEC_VCN({ commit }, payload) {
    let data = await postRequest(api.NLG_NHA_CUNG_CAP+"/add-nsld-vcn", payload);
    return data.data;
}
export async function ADD_DG_CONG_VIEC_VCN({ commit }, payload) {
    let data = await postRequest(api.NLG_NHA_CUNG_CAP+"/add-dg-nsld-vcn", payload);
    return data.data;
}
export async function UPDATE_DS_CONG_VIEC_VCN({ commit }, payload) {
    let data = await postRequest(api.NLG_NHA_CUNG_CAP+"/update-nsld-vcn", payload);
    return data.data;
}
export async function UPDATE_DG_CONG_VIEC_VCN({ commit }, payload) {
    let data = await postRequest(api.NLG_NHA_CUNG_CAP+"/update-dg-nsld-vcn", payload);
    return data.data;
}
export async function GET_DS_CONG_VIEC_VCN({ commit }, payload) {
    let data = await getRequest(api.NLG_NHA_CUNG_CAP +"/nsld-vcn", payload);
    return data.data;
}
export async function UPDATE_ITEMS({ commit }, payload) {
    const data = await postRequest(
        api.NLG_PHIEU_NHAP_KHO_DT +"/update-items",
        payload
    );
    return data.data;
}
export async function UPDATE_NHA_CUNG_CAP({ commit }, payload) {
    let data = await putRequest(
        api.NLG_NHA_CUNG_CAP + "/" + payload.key.id,
        payload.data
    );
    return data.data;
}
export async function UPDATE_CHU_RUNG({ commit }, payload) {
    let data = await putRequest(
        api.NLG_CHU_RUNG + "/" + payload.key.id,
        payload.data
    );
    return data.data;
}
export async function UPDATE_MA_LO_GO({ commit }, payload) {
    let data = await putRequest(
        api.NLG_MA_LO_GO + "/" + payload.key.id,
        payload.data
    );
    return data.data;
}
export async function DEL_MA_LO_GO({ commit }, payload) {
    let data = await getRequest(
        api.NLG_MA_LO_GO + "/delete" + "?id=" + payload.id,
        payload.data
    );
    return data.data;
}
export async function DEL_CHU_RUNG({ commit }, payload) {
    let data = await delRequest(
        api.NLG_CHU_RUNG + "/" + payload.id,
        payload.data
    );
    return data.data;
}
export async function TAO_PHIEU({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO1, payload);
    return data.data;
}
export async function GET_QUI_CACH({ commit }, payload) {
    let data = await getRequest(api.NLG_QUI_CACH + "/" + "?day=" + payload.day +
        "&rong=" + payload.rong +
        "&dai=" + payload.dai, payload);
    return data.data;
}
export async function GET_QUI_CACH_H({ commit }, payload) {
    let data = await getRequest(api.NLG_QUI_CACH + "/QC", payload);
    return data.data;
}
export async function GET_HE_SO({ commit }, payload) {
    let data = await getRequest(api.NLG_QUI_CACH + "/heso");
    return data.data;
}
export async function ADD_QUI_CACH({ commit }, payload) {
    let data = await postRequest(api.NLG_GROUP_QUI_CACH, payload);
    return data.data;
}
export async function ADD_QUI_CACH_OPTIONS({ commit }, payload) {
    let data = await postRequest(api.NLG_QUI_CACH + "/create", payload);
    return data.data;
}
export async function ADD_QUI_CACH_GIA({ commit }, payload) {
    let data = await postRequest(api.NLG_QUI_CACH + "/create-gia", payload);
    return data.data;
}
export async function DEL_QUI_CACH({ commit }, payload) {
    let data = await getRequest(
        api.NLG_QUI_CACH + "/delete" + "?id=" + payload.id,
        payload
    );
    return data.data;
}
export async function UPDATE_QUI_CACH({ commit }, payload) {
    let data = await putRequest(
        api.NLG_QUI_CACH + "/" + payload.id,
        payload
    );
    return data.data;
}
export async function GET_GROUP_QUI_CACH({ commit }, payload) {
    let data = await getRequest(api.NLG_GROUP_QUI_CACH);
    return data.data;
}
export async function GET_SAN_PHAM({ commit }, payload) {
    let data = await getRequest(api.NLG_GROUP_QUI_CACH + "/sanpham");
    return data.data;
}
export async function GET_SAN_PHAM_CHI_TIET({ commit }, payload) {
    let data = await getRequest(api.NLG_GROUP_QUI_CACH + "/sanphamchitiet");
    return data.data;
}
export async function ADD_GROUP_QUI_CACH({ commit }, payload) {
    let data = await postRequest(api.NLG_GROUP_QUI_CACH, payload);
    return data.data;
}
export async function UPDATE_GROUP_QUI_CACH({ commit }, payload) {
    let data = await putRequest(
        api.NLG_GROUP_QUI_CACH + "/" + payload.key.id,
        payload.data
    );
    return data.data;
}

export async function NHAP_KHO({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT, payload);
    return data.data;
}
export async function EDIT_NHAP_KHO({ commit }, payload) {
    let data = await putRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/" + payload.id,
        payload
    );
    return data.data;
}
export async function EDIT_NHAP_KHO_NEW({ commit }, payload) {
    let data = await putRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/gia-cp",
        payload
    );
    return data.data;
}
export async function EDIT_NHAP_KHO_NL({ commit }, payload) {
    let data = await putRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/" + payload.ID,
        payload
    );
    return data.data;
}
export async function EDIT_NHAP_KHO_DELAI({ commit }, payload1) {
    let data = await putRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/" + payload1.id,
        payload1
    );
    return data.data;
}
export async function GET_DINH_MUC_KHO({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/" + "?thang=" + payload.thang + "&nam=" + payload.nam);
    return data.data;
}
export async function GET_HE_SO_CAP_GO({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/hscg" + "?number=" + payload.number + "&factoryId=" + payload.factoryId);
    return data.data;
}
export async function GET_HE_SO_CAP_GO_THANH({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/hscgthanh" + "?number=" + payload.number + "&factoryId=" + payload.factoryId);
    return data.data;
}
export async function GET_HE_SO_CAP_GO_TP({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/hscgtp" + "?number=" + payload.number + "&factoryId=" + payload.factoryId);
    return data.data;
}
export async function GET_HE_SO_CAP_GO1({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/hscg1");
    return data.data;
}
export async function GET_PHIEU_CHI_DINH({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/pcd" + "?number=" + payload.number + "&bx="+ payload.bx);
    return data.data;
}
export async function GET_PHIEU_CHI_DINH_CHAN({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/pcd-chan" + "?number=" + payload.number + "&solan="+payload.solan);
    return data.data;
}
export async function GET_PHIEU_CHI_DINH_BS({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/pcd-bs" + "?number=" + payload.number);
    return data.data;
}
export async function XUAT_GO_THEO_NM({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/xuatgonm" + "?number=" + payload.number);
    return data.data;
}
export async function XUAT_GO_THEP_LSX({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/xuatgo" + "?number=" + payload.number);
    return data.data;
}
export async function XUAT_GO_THEP_LSX_TP({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/xuatgobtp" + "?number=" + payload.number);
    return data.data;
}
export async function XUAT_GO_THEP_LSX_BS({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/xuatgobs" + "?number=" + payload.number);
    return data.data;
}
export async function VIEW_XUAT_GO_THEP_LSX({ commit }, payload) {
    let data = await postRequest(api.NLG_DINH_MUC_KHO + "/viewxuatgo", payload);
    return data.data;
}
export async function DELETE_XUAT_GO_THE0_LSX({ commit }, payload) {
    let data = await postRequest(api.NLG_DINH_MUC_KHO + "/delete-xuat-go-theo-lsx",payload);
    return data.data;
}
export async function UPDATE__XUAT_GO_THEP_LSX({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/updatexuatgo" + "?id=" + payload.ID +
    "&luadat=" +
    payload.luadat 
    + "&SL_TH=" + payload.SL_TH + "&KLC_TH=" + payload.KLC_TH+"&GHICHU=" + payload.GHICHU
    +"&IDCONGDOAN=" + payload.IDCONGDOAN);
    return data.data;
}
export async function DEL_XUAT_GO_THEP_LSX({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/deletexuatgo" + "?id=" + payload.ID);
    return data.data;
}
export async function PUT_DINH_MUC_KHO({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/delete" +
        "?id=" + payload.id);
    return data.data;
}
export async function XOA_CHI_TIET_PCD({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/deletepcd" +
        "?id=" + payload.id);
    return data.data;
}
export async function XOA_CHI_TIET_PB2M({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/deletepb2m" +
        "?id=" + payload.id);
    return data.data;
}
export async function UPDATE_KHO({ commit }, payload) {
    let data = await putRequest(api.NLG_DINH_MUC_KHO + "/" +
        payload.ID, payload);
    return data.data;
}
export async function DEL_HE_SO({ commit }, payload) {
    let data = await getRequest(api.NLG_HE_SO + "/" +
        "?id=" + payload.id);
    return data.data;
}
export async function NLG_HE_SO_SU_DUNG({ commit }, payload) {
    let data = await getRequest(api.NLG_HE_SO + "/hssd" +
    "?factoryId=" + payload.factoryId);
    return data.data;
}
export async function NLG_HE_SO_SU_DUNG_THANG({ commit }, payload) {
    let data = await getRequest(api.NLG_HE_SO + "/hssdthang" +
    "?factoryId=" + payload.factoryId + "&fromDate=" +
    payload.fromDate + "&toDate=" +payload.toDate );
    return data.data;
}
export async function NLG_HE_SO_SU_DUNG_OUTDOOR({ commit }, payload) {
    let data = await getRequest(api.NLG_HE_SO + "/hssdoutdoor" +
    "?factoryId=" + payload.factoryId + "&fromDate=" +
    payload.fromDate + "&toDate=" +payload.toDate + "&factoryIdsc=" +payload.factoryIdsc 
    + "&congdoan=" +payload.congdoan+ "&soche=" +payload.soche
    + "&dg=" +payload.dg+ "&tc=" +payload.tc+ "&kho2m=" +payload.kho2m );
    return data.data;
}
export async function NLG_HE_SO_SU_DUNG_OUTDOOR_LP({ commit }, payload) {
    let data = await getRequest(api.NLG_HE_SO + "/hssdoutdoor-lp" +
    "?factoryId=" + payload.factoryId + "&fromDate=" +
    payload.fromDate + "&toDate=" +payload.toDate);
    return data.data;
}
export async function GET_HE_SO_2M({ commit }, payload) {
    let data = await getRequest(api.NLG_HE_SO + "/2M" +
        "?factoryId=" + payload.factoryId + "&week=" + payload.week + "&year=" + payload.year);
    return data.data;
}

export async function XUAT_GO_THEO_LSX_2M({ commit }, payload) {
    let data = await getRequest(api.NLG_HE_SO + "/X2M" +
        "?number=" + payload.number);
    return data.data;
}
export async function BANG_XUAT_GO_THEO_LSX_2M({ commit }, payload) {
    let data = await getRequest(api.NLG_HE_SO + "/BX2M" +
        "?number=" + payload.number);
    return data.data;
}
export async function UPDATE_HE_SO({ commit }, payload) {
    let data = await putRequest(api.NLG_HE_SO + "/" +
        payload.ID, payload);
    return data.data;
}
export async function GET_TONG_DINH_MUC_KHO({ commit }, payload) {
    let data = await getRequest(
        api.NLG_DINH_MUC_KHO +
        "/klkho" +
        "?makho=" +
        payload.makho +
        "&nhom=" +
        payload.nhom + "&thang=" + payload.thang + "&nam=" + payload.nam
    );
    return data.data;
}
export async function GET_TONG_DINH_MUC_KHOQC({ commit }, payload) {
    let data = await getRequest(
        api.NLG_DINH_MUC_KHO +
        "/klkhoqc" +

        "?nhom=" +
        payload.nhom
    );
    return data.data;
}
export async function GET_TONG_DINH_MUC_KHOQC2({ commit }, payload) {
    let data = await getRequest(
        api.NLG_DINH_MUC_KHO +
        "/klkhoqcfix" +

        "?nhom=" +
        payload.nhom
    );
    return data.data;
}
export async function GET_TONG_DINH_MUC_KHOQC1({ commit }, payload) {
    let data = await getRequest(
        api.NLG_DINH_MUC_KHO +
        "/klkhoqc1" +

        "?nhom=" +
        payload.nhom
    );
    return data.data;
}
export async function ADD_DINH_MUC_KHO({ commit }, payload) {
    let data = await postRequest(api.NLG_DINH_MUC_KHO, payload);
    return data.data;
}
export async function ADD_HE_SO({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO +
        "/heso" +

        "?nhom=" +
        payload.groupCode +
        "&heso=" + payload.HESO +
        "&createBy=" + payload.createBy +
        "&ITEM_ID=" + payload.ITEM_ID, payload);
    return data.data;
}
export async function ADD_HE_SO_THANH({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO +
        "/hesothanh" +

        "?nhom=" +
        payload.groupCode +
        "&heso=" + payload.HESO +
        "&createBy=" + payload.createBy +
        "&ITEM_ID=" + payload.ITEM_ID, payload);
    return data.data;
}
export async function ADD_KE_HOACH_TUAN({ commit }, payload) {
    let data = await postRequest(api.NLG_KE_HOACH_TUAN, payload);
    return data.data;
}
export async function UPDATE_DINH_MUC_KHO({ commit }, payload) {
    let data = await putRequest(
        api.NLG_DINH_MUC_KHO + "/" + payload.key.id,
        payload.data
    );
    return data.data;
}
export async function GET_CHINH_PHAM_EDIT({ commit }, guid) {
    let data = await getRequest(api.NLG_GET_CHINH_PHAM_EDIT + `?guid=${guid}`);
    return data.data;
}
export async function GET_HACAP_OPT({ commit }, guid) {
    let data = await getRequest(api.NLG_HA_CAP + "/options?guid=" + guid);
    return data.data;
}
export async function GET_HA_CAP({ commit }, detailId) {
    let data = await getRequest(
        api.NLG_HA_CAP + "?detailId=" + detailId + "&delFlag=N"
    );
    return data.data;
}
export async function GET_HA_CAP_NEW({ commit }, detailId) {
    let data = await getRequest(
        api.NLG_HA_CAP +  "/gethacap?detailId=" + detailId + "&delFlag=N"
    );
    return data.data;
}
export async function ADD_HA_CAP({ commit }, payload) {
    const data = await postRequest(api.NLG_HA_CAP, payload);
    return data.data;
}
export async function ADD_HA_CAP_NEW({ commit }, payload) {
    const data = await postRequest(api.NLG_HA_CAP + "/ha-cap-new", payload);
    return data.data;
}
export async function UPDATE_HA_CAP({ commit }, payload) {
    let data = await putRequest(api.NLG_HA_CAP + "/" + payload.id, payload);
    return data.data;
}
export async function UPDATE_HA_CAP_NEW({ commit }, payload) {
    let data = await putRequest(api.NLG_HA_CAP + "/update-ha-cap-new" , payload);
    return data.data;
}
export async function DEL_HA_CAP_NEW({ commit }, payload) {
    let data = await putRequest(api.NLG_HA_CAP + "/del-ha-cap-new" , payload);
    return data.data;
}
export async function UPDATE_HA_CAP_TT_NEW({ commit }, payload) {
    let data = await putRequest(api.NLG_HA_CAP + "/update-ha-cap-tt-new" , payload);
    return data.data;
}
export async function GET_TYPE_HA_CAP({ commit }) {
    let data = await getRequest(api.BLG_TYPE_HA_CAP);
    return data.data;
}
export async function GET_REPORT_KE_HOACH({ commit }, payload) {
    let condition = ``;
    if (payload.mancc) {
        condition += `&mancc=${payload.mancc}`;
    }
    if (payload.staff) {
        condition += `&staff=${payload.staff}`;
    }
    let data = await getRequest(
        api.NLG_REPORT +
        `/bckh2?year=${payload.year}&month=${payload.month}&fromDate=${payload.fromDate}&toDate=${payload.toDate}${condition}`
    );
    return data.data;
}
export async function GET_REPORT_KE_HOACH_TUAN({ commit }, payload) {
    let condition = ``;
    if (payload.mancc) {
        condition += `&mancc=${payload.mancc}`;
    }
    if (payload.staff) {
        condition += `&staff=${payload.staff}`;
    }
    let data = await getRequest(
        api.NLG_REPORT +
        `/bckhtuan?stepId=${payload.stepId}&month=${payload.month}&fromDate=${payload.fromDate}&toDate=${payload.toDate}${condition}`
    );
    return data.data;
}
export async function GET_REPORT_KE_HOACH2({ commit }, payload) {
    let condition = ``;
    if (payload.mancc) {
        condition += `&mancc=${payload.mancc}`;
    }
    if (payload.staff) {
        condition += `&staff=${payload.staff}`;
    }
    let data = await getRequest(
        api.NLG_REPORT +
        `/bckh1?year=${payload.year}&month=${payload.month}&fromDate=${payload.fromDate}&toDate=${payload.toDate}${condition}`
    );
    return data.data;
}
export async function GET_REPORT_DON_GIA_TB({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/dongiatrungbinh?fromDate=${payload.fromDate}&toDate=${payload.toDate}`
    );
    return data.data;
}
export async function GET_REPORT_DON_GIA_TB_NEW({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/dongiatrungbinhnew?fromDate=${payload.fromDate}&toDate=${payload.toDate}`
    );
    return data.data;
}
export async function GET_REPORT_NCC_LOAI({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/khoiluongnhacungcap?startDate=${payload.fromDate}&endDate=${payload.toDate}&cohd=${payload.cohd}`
    );
    return data.data;
}
export async function GET_REPORT_THONG_KE_KHO_NHAN({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/thong-ke-kho-nhan?from=${payload.from}&to=${payload.to}&kho=${payload.kho}`
    );
    return data.data;
}
export async function GET_REPORT_THONG_KE_BIEN_BAN({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/thong-ke-bien-ban?from=${payload.from}&to=${payload.to}&kho=${payload.kho}`
    );
    return data.data;
}
export async function GET_REPORT_THONG_KE_KHO_NHAN1({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/thong-ke-kho-nhan1?from=${payload.from}&to=${payload.to}`
    );
    return data.data;
}
export async function GET_REPORT_XEP_SAY_TRONG_LO({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/thong-ke-xep-say-trong-lo?from=${payload.from}&to=${payload.to}`
    );
    return data.data;
}
export async function GET_REPORT_TON_LUA({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/bao-cao-ton-lua?from=${payload.from}&to=${payload.to}&makho=${payload.makho}
        &ngaynhap=${payload.ngaynhap}&factoryId=${payload.factoryId}&DEPARTMENT_ID=${payload.DEPARTMENT_ID}`
        
    );
    return data.data;
}
export async function GET_REPORT_BANG_1_TON_LUA({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/bao-cao-bang-1-ton-lua?from=${payload.from}&to=${payload.to}&makho=${payload.makho}
        &ngaynhap=${payload.ngaynhap}&factoryId=${payload.factoryId}&DEPARTMENT_ID=${payload.DEPARTMENT_ID}`
        
    );
    return data.data;
}
export async function GET_REPORT_BANG_2_TON_LUA({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/bao-cao-bang-2-ton-lua?from=${payload.from}&to=${payload.to}&makho=${payload.makho}
        &ngaynhap=${payload.ngaynhap}&factoryId=${payload.factoryId}&DEPARTMENT_ID=${payload.DEPARTMENT_ID}`
        
    );
    return data.data;
}
export async function GET_REPORT_BANG_3_TON_LUA({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/bao-cao-bang-3-ton-lua?from=${payload.from}&to=${payload.to}&makho=${payload.makho}
        &ngaynhap=${payload.ngaynhap}&factoryId=${payload.factoryId}&DEPARTMENT_ID=${payload.DEPARTMENT_ID}`
        
    );
    return data.data;
}
export async function GET_REPORT_XUONG_HANG({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/tong-hop-xuong-hang?fromDate=${payload.fromDate}&toDate=${payload.toDate}&kho=${payload.kho}`
    );
    return data.data;
}
export async function GET_REPORT_KL({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/bctonghop?fromDate=${payload.fromDate}&toDate=${payload.toDate}`
    );
    return data.data;
}
export async function GET_REPORT_NCC({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/tong-hop-nha-cung-cap?startDate=${payload.fromDate}&endDate=${payload.toDate}`
    );
    return data.data;
}
export async function GET_REPORT_NCC_NL({ commit }, payload) {
    let data = await getRequest(
        api.NLG_REPORT +
        `/tong-hop-nha-cung-cap-NL?startDate=${payload.fromDate}&endDate=${payload.toDate}`
    );
    return data.data;
}
export async function GET_PLAN_BY_USER({ commit }, payload) {
    let data = await getRequest(api.NLG_KE_HOACH1 + "/" +

        "?thang=" +
        payload.thang + "&nam=" + payload.nam);
    return data.data;
}
export async function ADD_PLAN({ commit }, payload) {
    let data = await postRequest(api.NLG_KE_HOACH, payload);
    return data.data;
}
export async function UPDATE_PLAN({ commit }, payload) {
    let data = await putRequest(api.NLG_KE_HOACH + "/" + payload.ID, payload);
    return data.data;
}
export async function CHUYEN_KE_HOACH({ commit }, payload) {
    let data = await postRequest(api.NLG_KE_HOACH + "/chuyen-ke-hoach", payload);
    return data.data;
}
export async function GET_BB_NGHIEM_THU({ commit }, guid) {
    let data = await getRequest(api.NLG_BB_NGHIEMTHU + `?guid=${guid}`);
    return data.data;
}
export async function GET_BB_NGHIEM_THU_NEW({ commit }, guid) {
    let data = await getRequest(api.NLG_BB_NGHIEMTHU + "/nghiem-thu-new" +`?guid=${guid}`);
    return data.data;
}
export async function GET_BB_TINHTIEN_EDIT({ commit }, sophieuId) {
    let data = await getRequest(api.NLG_BB_TINHTIEN + `?sophieuId=${sophieuId}`);
    return data.data;
}
export async function GET_BB_TINHTIEN_EDIT_NEW({ commit }, sophieuId) {
    let data = await getRequest(api.NLG_BB_TINHTIEN + `/view-bb-new?sophieuId=${sophieuId}`);
    return data.data;
}
export async function GET_BB_TINHTIEN_EDIT1({ commit }, sophieuId) {
    let data = await getRequest(api.NLG_BB_TINHTIEN1 + `?sophieuId=${sophieuId}`);
    return data.data;
}
export async function GET_BB_TINHTIEN_EDIT1_NEW_GIA({ commit }, sophieuId) {
    let data = await getRequest(api.NLG_BB_TINHTIEN1 + "/gia-moi" + `?sophieuId=${sophieuId}`);
    return data.data;
}
export async function GET_BB_TINHTIEN_NHAP_LAI({ commit }, sophieuId) {
    let data = await getRequest(api.NLG_BB_TINHTIEN1 + "/nhap-lai" + `?sophieuId=${sophieuId}`);
    return data.data;
}
export async function GET_BB_TINHTIEN_EDIT2({ commit }, sophieuId) {
    let data = await getRequest(api.NLG_BB_TINHTIEN2 + `?sophieuId=${sophieuId}`);
    return data.data;
}
export async function GET_BB_TINHTIEN_EDIT2_NEW({ commit }, sophieuId) {
    let data = await getRequest(api.NLG_BB_TINHTIEN2 + `/view-bang-gia?sophieuId=${sophieuId}`);
    return data.data;
}
export async function GET_BB_TINHTIEN_VIEW({ commit }, guid) {
    let data = await getRequest(api.NLG_BB_TINHTIEN + "/view" + `?guid=${guid}`);
    return data.data;
}
export async function GET_BB_TINHTIEN_VIEW_NEW({ commit }, guid) {
    let data = await getRequest(api.NLG_BB_TINHTIEN + "/view-new" + `?guid=${guid}`);
    return data.data;
}
export async function COMPLETED_BB({ commit }, payload) {
    let data = await postRequest(api.NLG_BB_TINHTIEN + "/completed", payload);
    return data.data;
}
export async function COMPLETED_BB_NEW({ commit }, payload) {
    let data = await postRequest(api.NLG_BB_TINHTIEN + "/completednew", payload);
    return data.data;
}
export async function COMPLETED_BBNL({ commit }, payload) {
    let data = await postRequest(api.NLG_BB_TINHTIEN + "/completedNL", payload);
    return data.data;
}
export async function REJECT_BB({ commit }, payload) {
    let data = await postRequest(api.NLG_BB_TINHTIEN + "/reject", payload);
    return data.data;
}
export async function GET_NLG({ commit }) {
    let data = await getRequest(api.NLG_NGUYEN_LIEU_GO);
    return data.data;
}
export async function GET_NUMBER_CHUA_PHE_DUYET({ commit }) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/ncpd");
    return data.data;
}
export async function GET_BANG_GIA({ commit }, maSP) {
    let data = await getRequest(
        api.NLG_BANG_GIA + "/gia-sudung" + "?maSP=" + maSP
    );
    return data.data;
}
export async function GET_BANG_GIA_BY_REQ_NO({ commit }, no) {
    let data = await getRequest(api.NLG_BANG_GIA + "?reqNo=" + no);
    return data.data;
}
export async function ADD_BANG_GIA({ commit }, payload) {
    let data = await postRequest(api.NLG_BANG_GIA, payload);
    return data.data;
}
export async function GET_DS_DELAI({ commit }, makho) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/ds-delai" + "?makho=" + makho
    );
    return data.data;
}
export async function GET_DS_DELAI_1P({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT +
        "/ds-delai-1P" +
        "?sophieu=" +
        payload.sophieu +
        "&code=" +
        payload.code
    );
    return data.data;
}
export async function GET_BAO_CAO_NHAP_KHO({ commit }, payload) {
    let data = await getRequest(api.NLG_PHIEU_NHAP_KHO_DT + `/baocao-nhapkho?fromDate=${payload.fromDate}&toDate=${payload.toDate}`, payload);
    return data.data;
}
export async function GET_DS_TRAVE({ commit }, makho) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/ds-trave" + "?makho=" + makho
    );
    return data.data;
}
export async function GET_DS_NHAPLAI({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/ds-nhaplai" + "?from=" + payload.from + "&to=" + payload.to
    );
    return data.data;
}
export async function GET_TAO_PHIEU_TRAVE({ commit }, makho) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/tao-phieu" + "?makho=" + makho
    );
    return data.data;
}
export async function GET_TAO_PHIEU_NHAPLAI({ commit }, makho) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/tao-phieu-nhap-lai" + "?makho=" + makho
    );
    return data.data;
}
// export async function UPDATE_DINHTUYEN({ commit }, payload) {
//     const data = await postRequest(
//         api.NLG_CHU_RUNG +"/update-dinhtuyen",
//         payload
//     );
//     return data.data;
// }
// export async function UPDATE_CAUTHANH({ commit }, payload) {
//     const data = await postRequest(
//         api.NLG_CHU_RUNG +"/update-cauthanh",
//         payload
//     );
//     return data.data;
// }
export async function GET_DS_PHIEU_TRAVE({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/ds-phieu-trave" + "?guid=" + payload.guid
    );
    return data.data;
}
export async function GET_DS_PHIEU_NHAPLAI({ commit }, payload) {
    let data = await getRequest(
        api.NLG_PHIEU_NHAP_KHO_DT + "/ds-phieu-nhaplai" + "?guid=" + payload.guid
    );
    return data.data;
}
export async function TRA_VE({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/tra-ve", payload);
    return data.data;
}
export async function PHE_DUYET({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/phe-duyeths", payload);
    return data.data;
}
export async function XAC_NHAN_KHO_BTP({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/xac-nhan-kho-btp", payload);
    return data.data;
}
export async function GET_DEPARTMENT_TH({ commit }) {
    let data = await getRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/department-th");
    return data.data;
}
export async function XAC_NHAN_BG({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/xac-nhan-bg", payload);
    return data.data;
}
export async function XAC_NHAN_SX({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/xac-nhan-sx", payload);
    return data.data;
}
export async function XAC_NHAN_SX_MUA_NGOAI({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/xac-nhan-sx-mua-ngoai", payload);
    return data.data;
}
export async function XUAT_GOTH({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/xuat-goTH", payload);
    return data.data;
}
export async function XUAT_GOTQ({ commit }, payload) {
    let data = await postRequest(api.NLG_HE_SO + "/xuat-goTQ", payload);
    return data.data;
}
 export async function XUAT_GOTHNM({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/xuat-goTHNM", payload);
    return data.data;
}
export async function XUAT_GOLUANCHUYEN({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/xuat-go-luan-chuyen", payload);
    return data.data;
}
export async function XUAT_GO_2M({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/xuat-go-2M", payload);
    return data.data;
}
export async function NHAP_DONGIA({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/nhap-dongia", payload);
    return data.data;
}
export async function PHE_DUYET_PHIEU({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/phe-duyethscd", payload);
    return data.data;
}
export async function XOA_PHE_DUYET_PHIEU({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/xoa-phe-duyethscd", payload);
    return data.data;
}
export async function MUA_LAI({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT + "/mua-lai", payload);
    return data.data;
}
export async function DELAI_1_PHAN({ commit }, payload) {
    let data = await postRequest(api.NLG_PHIEU_NHAP_KHO_DT, payload);
    return data.data;
}
export async function GET_REQ_COST({ commit }) {
    let data = await getRequest(api.NLG_REQ_BANGGIA);
    return data.data;
}
export async function GET_REQ_COST_BY_NO({ commit }, no) {
    let data = await getRequest(api.NLG_REQ_BANGGIA + "/duyet" + "?no=" + no);
    return data.data;
}
export async function ADD_REQ_COST({ commit }, payload) {
    let data = await postRequest(api.NLG_REQ_BANGGIA, payload);
    return data.data;
}
export async function APPROVAL_PRICE({ commit }, payload) {
    let data = await postRequest(api.NLG_BANG_GIA + "/approval", payload);
    return data.data;
}
// export async function GET_({commit},makho) {
//     let data = await getRequest(api.NLG_PHIEU_NHAP_KHO_DT+'/ds-delai'+'?makho='+makho)
//     return data.data
// }
export async function getCodeInXuatGo({ commit }) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/code-in-xuat-go");
    return data.data;
}
export async function getItemInXuatGoNhapKhau({ commit }) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/item-in-xgnk");
    return data.data;
}
export async function getItemInXuatGoBTP({ commit }) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + "/item-in-xgbtp");
    return data.data;
}
export async function insertXuatGoNhapKhau({ commit }, payload) {
    let data = await postRequest(api.NLG_DINH_MUC_KHO + "/xuat-go-nhap-khau", payload);
    return data.data;
}
export async function getNumberInXuatGoNhapKhau({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + `/xuat-go-nhap-khau/number?from=${payload.from}&to=${payload.to}`);
    return data.data;
}
export async function getXuatGoNKByNumber({ commit }, payload) {
    let data = await getRequest(api.NLG_DINH_MUC_KHO + `/get-xuatgonk-by-number?number=${payload.number}`);
    return data.data;
}