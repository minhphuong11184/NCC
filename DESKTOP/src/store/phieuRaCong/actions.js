import apiConfig from "../../configs/api";
import axios from "axios";
import { getRequest, postRequest, putRequest,delRequest } from "../../utils/utils";


// hien thi phong ban trong cong ty
export async function GET_DEPARTMENT_TYPE2({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-department-type2`);
    return res.data;
}
//hien thi nhom phe duyet 
export async function GET_GATE_PASS_EXCEL_PHEDUYET({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-excel-pheduyet?npd=${payload.npd}&nm=${payload.nm}`);
    return res.data;
}


export async function PUT_PHEDUYET_GATE_PASS_LICHSU({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/put-pheduyet-gate-pass-lichsu?count=${payload.count}&dieu_xe=${payload.dieu_xe}
        &id=${payload.id}&id_phieu=${payload.id_phieu}&loai_phieu=${payload.loai_phieu}&nha_may=${payload.nha_may}&nhom_pd=${payload.nhom_pd}
        &id_user=${payload.id_user}&stt=${payload.stt}&duyet=${payload.duyet}`);
    return res.data;
}

//them du lieu thong tin loai phieu
export async function POST_GATE_PASS({ commit },payload) {
    const res = await postRequest(`api/v2/gatepass/post-gate-pass`,payload);
    return res.data;
}
export async function GET_ID_GATE_PASS({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-id-gate-pass?idp=${payload.idp}`);
    return res.data;
}
export async function GET_GATE_PASS({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass?pd=${payload.pd}&act=${payload.act}`);
    return res.data;
}
export async function PUT_PHEDUYET_GATE_PASS({ commit },payload) {
    const res = await putRequest(`api/v2/gatepass/put-pheduyet-gate-pass`,payload);
    return res.data;
}
//them du lieu thong tin san pham
export async function POST_GATE_PASS_SANPHAM({ commit },payload) {
    const res = await postRequest(`api/v2/gatepass/post-gate-pass-sanpham`,payload);
    return res.data;
}
export async function POST_GATE_PASS_LICHSU({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/post-gate-pass-lichsu?IP_BLK=${payload.IP_BLK}&NHOM_PHE_DUYET=${payload.NHOM_PHE_DUYET}&LOAI_PHIEU=${payload.LOAI_PHIEU}&NHA_MAY=${payload.NHA_MAY}`);
    return res.data;
}
export async function GET_GATE_PASS_LICHSU({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-lichsu?idp=${payload.idp}`);
    return res.data;
}
export async function GET_TENTIME_GATE_PASS_LICHSU({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-tentime-gate-pass-lichsu?idp=${payload.idp}&phanCap=${payload.phanCap}`);
    return res.data;
}
export async function GET_GATE_PASS_SANPHAM({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-sanpham?idp=${payload.idp}`);
    return res.data;
}

export async function PUT_SL_THUTE_GATE_PASS_SANPHAM({ commit },payload) {
    const res = await putRequest(`api/v2/gatepass/put-sl-thucte-gate-pass-sanpham`,payload);
    return res.data;
}
export async function DELETE_GATE_PASS({ commit },payload) {
    const res = await delRequest(`api/v2/gatepass/delete-gate-pass?id=${payload.id}`);
    return res.data;
}
export async function getPermissionInScreen ({ commit }, payload) {
    const res = await getRequest(`/api/v2/role-menu/permission/in/screen?path=${payload.path}&accountId=${payload.accountId}`);
    return res.data;
};
export async function GET_BASE_ACCOUNT_GATE_PASS({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-base-account-gate-pass`);
    return res.data;
}
export async function GET_GATE_PASS_FING_USER({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-find-user?act=${payload.act}&iduser=${payload.iduser}&pd=${payload.pd}`);
    return res.data;
}
export async function GET_GATE_PASS_USER_CREATE({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-user-create?iduser=${payload.iduser}&day=${payload.day}&month=${payload.month}&year=${payload.year}`);
    return res.data;
}
export async function GET_ALL_GATE_PASS({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-all-gate-pass`);
    return res.data;
}
export async function GET_GATE_PASS_CREATE_NUMBER({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-id-bbrc?id=${payload.id}`);
    return res.data;
}
//show GATE_PASS_NHOM_PHE_DUYET
export async function POST_GATE_PASS_NHOM_PHE_DUYET({ commit },payload) {
    const res = await postRequest(`api/v2/gatepass/post-gate-pass-nhom-phe-duyet`,payload);
    return res.data;
}
export async function PUT_GATE_PASS_NHOM_PHE_DUYET({ commit },payload) {
    const res = await putRequest(`api/v2/gatepass/put-gate-pass-nhom-phe-duyet`,payload);
    return res.data;
}
export async function DELETE_GATE_PASS_NHOM_PHE_DUYET({ commit },payload) {
    const res = await delRequest(`api/v2/gatepass/delete-gate-pass-nhom-phe-duyet?id=${payload.id}`);
    return res.data;
}
export async function GET_GATE_PASS_NHOM_PHE_DUYET({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-nhom-phe-duyet`);
    return res.data;
}
export async function GET_GATE_PASS_NHOM_PHE_DUYET_ID_PHONG({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-nhom-phe-duyet-id-phong?loai=${payload.loai}&phong_ban=${payload.phong_ban}&nm=${payload.nm}`);
    return res.data;
}

// tao chuc vu
export async function POST_GATE_PASS_CHUC_VU({ commit },payload) {
    const res = await postRequest(`api/v2/gatepass/post-gate-pass-chuc-vu`,payload);
    return res.data;
}
export async function PUT_GATE_PASS_CHUC_VU({ commit },payload) {
    const res = await putRequest(`api/v2/gatepass/put-gate-pass-chuc-vu`,payload);
    return res.data;
}
export async function DELETE_GATE_PASS_CHUC_VU({ commit },payload) {
    const res = await delRequest(`api/v2/gatepass/delete-gate-pass-chuc-vu?id=${payload.id}`);
    return res.data;
}
export async function GET_GATE_PASS_CHUC_VU({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-chuc-vu`);
    return res.data;
}
export async function GET_DEPARTMENT_USER_EMAIL({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-department-user-email?com=${payload.com}&dep=${payload.dep}&cout=${payload.cout}&cd=${payload.cd}&loai=${payload.loai}`,);
    return res.data;
}
export async function sendNotificationMail({ commit }, payload) {
    const data = await postRequest("/api/v1/send-mail", payload);
    return data.data;
}
export async function GET_FIND_KEYWODR_GATE_PASS({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-find-keywwodr-gate-pass?name=${payload.name}&key=${payload.key}&dep=${payload.dep}`);
    return res.data;
}
export async function PUT_SP_GATE_PASS({ commit },payload) {
    const res = await putRequest(`api/v2/gatepass/put-sp-gate-pass`,payload);
    return res.data;
}
export async function GET_GATE_PASS_ID_CHITIET({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-id-chitiet?id=${payload.id}`,);
    return res.data;
}
export async function RECALL_GATE_PASS({ commit },payload) {
    const res = await putRequest(`api/v2/gatepass/put-recall-gate-pass`,payload);
    return res.data;
}
export async function GET_GATE_PASS_USER_ID_CREATE({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-user-id-create?id=${payload.id}`,);
    return res.data;
}
export async function DELETE_GATE_PASS_SANPHAM({ commit },payload) {
    const res = await delRequest(`api/v2/gatepass/delete-gate-pass-sanpham?id=${payload.id}`);
    return res.data;
}
export async function GET_VIEW_PHIEU_DIEU_CHUEYN_FAST_SO_CT({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-view-phieu-dieu-chuyen-fast-so-ct?so_ct=${payload.so_ct}&cty=${payload.cty}`);
    return res.data;
}
export async function GET_GATE_PASS_FAST_SO_CT({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-fast-so-ct?so_ct=${payload.so_ct}`);
    return res.data;
}
export async function GET_DANG_KY_SIZE_AO({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-dang-ky-size-ao?id=${payload.id}`);
    return res.data;
}
export async function POST_DANG_KY_SIZE_AO_MO_KHOA({ commit },payload) {
    const res = await postRequest(`api/v2/gatepass/post-dang-ky-size-ao-mo-khoa`,payload);
    return res.data;
}
export async function GET_GATE_PASS_LICH_HC({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-lich-hc?id_phieu=${payload.id_phieu}`);
    return res.data;
}
export async function GET_GATE_PASS_XAC_NHAN_DIEU_CHUYEN_XE1({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-xac-nhan-dieu-chuyen-xe1?year= ${payload.year}&month=${payload.month}`);
    return res.data;
}
export async function GET_GATE_PASS_XAC_NHAN_DIEU_CHUYEN_XE2({ commit },payload) {
    const res = await getRequest(`api/v2/gatepass/get-gate-pass-xac-nhan-dieu-chuyen-xe2?year= ${payload.year}&month=${payload.month}&user_id=${payload.user_id}`);
    return res.data;
}
export async function PUT_GATE_PASS_LICH_HC({ commit },payload) {
    const res = await putRequest(`api/v2/gatepass/put-gate-pass-lich-hc`,payload);
    return res.data;
}
export async function PUT_GATE_PASS_LICH_EDIT_DATA({ commit },payload) {
    const res = await putRequest(`api/v2/gatepass/put-gate-pass-lich-edit-data`,payload);
    return res.data;
}