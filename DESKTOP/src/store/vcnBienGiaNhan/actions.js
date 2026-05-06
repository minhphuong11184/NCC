import apiConfig from "../../configs/api";
import axios from "axios";
import { getRequest, postRequest, putRequest , delRequest} from "../../utils/utils";

// bang vcn.WOOD_TRANSFAR_DOCUMENT
export async function POST_WOOD_TRANSFAR_DOCUMENT({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-wood-transfar-document`,payload);
    return res.data;
}

export async function PUT_WOOD_TRANSFAR_DOCUMENT_EMAIL({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-transfar-document-email`,payload);
    return res.data;
}

export async function GET_WOOD_TRANSFAR_DOCUMENT({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-transfar-document?id=${payload.id}&duyet=${payload.duyet}&nm=${payload.nm}&tg=${payload.tg}&nam=${payload.nam}`);
    return res.data;
}
export async function GET_SUPPLIED({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-supplied`);
    return res.data;
}
export async function POST_SUPPLIED({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-supplied`,payload);
    return res.data;
}
export async function POST_WOOD_SAVE_MINUTES({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-wood-save-minutes`,payload);
    return res.data;
}
export async function GET_WOOD_TRANSFAR_DOCUMENT_ID({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-transfar-document-id?id=${payload}`);
    return res.data;
}
export async function GET_WOOD_TRANSFAR_DOCUMENT_DUYET({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-transfar-document-duyet?nm=${payload.nm}`);
    return res.data;
}
export async function GET_WOOD_PRODUCT_DIMENSIONS({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-product-dimensions`);
    return res.data;
}

export async function GET_BASE_DEPARTMENT_CODE_TYPE({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-base-department-code-type/`+payload);
    return res.data;
}
export async function GET_DANH_SACH_VAN_BOC({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-danh-sach-van-boc`);
    return res.data;
}

//bang vcn.WOOD_LOGISTICS

export async function POST_WOOD_PRODUCT_DIMENSIONS({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-wood-product-dimensions`,payload);
    return res.data;
}

export async function PUT_SO_LUONG_WOOD_TRANSFAR_DOCUMENT({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-so-luong-wood-transfar-document`,payload);
    return res.data;
}
export async function PUT_TRANG_THAI_WOOD_TRANSFAR_DOCUMENT_ID({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-trang-thai-wood-transfar-document`,payload);
    return res.data;
}

//BANG DIEU KIEN DAC BIET CHO BANG NHAP
export async function POST_DIEU_KIEN_GIA({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-dieu-kien-gia`,payload);
    return res.data;
}
export async function PUT_DIEU_KIEN_GIA({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-dieu-kien-gia`,payload);
    return res.data;
}
export async function PUT_WOOD_TRANSFAR_DOCUMENT_DUYET({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-transfar-document-duyet`,payload);
    return res.data;
}
export async function PUT_WOOD_TRANSFAR_DOCUMENT_HOITRO({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-transfar-document-hoitro`,payload);
    return res.data;
}

export async function GET_DIEU_KIEN_GIA({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-dieu-kien-gia/`+payload);
    return res.data;
}

//BANG GIA
export async function POST_DG_GIA({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-dg-gia`,payload);
    return res.data;
}
export async function PUT_DG_GIA({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-dg-gia`,payload);
    return res.data;
}
export async function GET_DG_GIA({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-dg-gia/`+payload);
    return res.data;
}



export async function GET_DIEU_KIEN_ID({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-dieu-kien-id/`+payload);
    return res.data;
}


export async function GET_ALL_THANH_TIEN({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-all-tinh-tien?id=${payload.id}&nm=${payload.nm}&ngay=${payload.ngay}&sp=${payload.sp}&loai=${payload.loai}`);
    return res.data;
}


export async function GET_DG_BANG_GIA({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-dg-danh-gia`);
    return res.data;
}

export async function GET_WOOD_TRANSFAR_DOCUMENT_ALL({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-transfar-document-all`);
    return res.data;
}

export async function GET_WOOD_DOCUMENT_EDIT_MONEY({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-product-documents-edit-money?nm=${payload.nm}`);
    return res.data;
}

export async function PUT_WOOD_TRASFAR_DOCUMENT_THUKHO({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-transfar-document-thukho`,payload);
    return res.data;
}

export async function GET_WOOD_TRASFAR_DOCUMENT_SORTDEST({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-transfar-document-sortdesc`,payload);
    return res.data;
}

export async function GET_WOOD_DIEUKIENVANBOC({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-dieukienvanboc?nhamay=${payload.nm}&ngay=${payload.ngay}&sp=${payload.sp}&id=${payload.id}`,);
    return res.data;
}

export async function GET_WOOD_DIEUKIENVANBOC_ALL({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-dieukienvanboc-all`,);
    return res.data;
}


/**Them sua xoa cho QC */
export async function GET_WOOD_TRANSFAS_DOCUMET_QC({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-trasfas-documet-qc?nm=${payload.nm}&tt=${payload.tt}&duyet=${payload.duyet}`,);
    return res.data;
}

export async function PUT_WOOD_TRANSFAS_DOCUMET_QC({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-trasfas-documet-qc`,payload);
    return res.data;
}

export async function DELETE_WOOD_TRANSFAS_DOCUMET_QC({ commit },payload) {
    const res = await delRequest(`/api/v2/vcn-bienban/del-wood-trasfas-documet-qc/${payload.id}`,);
    return res.data;
}
/**Them sua xoa cho QC */


export async function POST_WOOD_DIEUKIENVANBOC({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-wood-dieukienvanboc`,payload);
    return res.data;
}


export async function PUT_WOOD_TRANSFAR_DOCUMENT_TRA_BB_TK({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-transfar-document-tra-bb-tk`,payload);
    return res.data;
}

export async function PUT_WOOD_TRANSFAR_DOCUMENT_VAT({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-transfar-document-vat`,payload);
    return res.data;
}

export async function getPermissionInScreen ({ commit }, payload) {
    const res = await getRequest(`/api/v2/role-menu/permission/in/screen?path=${payload.path}&accountId=${payload.accountId}`);
    return res.data;
};
export async function DELETE_WOOD_PRODUCT_DIMENSIONS ({ commit }, payload) {
    const res = await delRequest(`/api/v2/vcn-bienban/delete-wood-product-dimensions?id=${payload.id}`);
    return res.data;
};

export async function PUT_MONEY_TRANG_THAI_WOOD_TRANSFAR_DOCUMENT({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-money-trang-thai-wood-transfar-document`,payload);
    return res.data;
}
export async function DELETE_WOOD_PHAN_CAP_SP({ commit },payload) {
    const res = await delRequest(`/api/v2/vcn-bienban/delete-wood-phan-cap-sp?id=${payload.id}`);
    return res.data;
}
export async function POST_WOOD_PHAN_CAP_SP({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-wood-phan-cap-sp`,payload);
    return res.data;
}
export async function GET_WOOD_PHAN_CAP_SP({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-phan-cap-sp?id_sp=${payload.id}`);
    return res.data;
}
export async function GET_DISTINCT_WOOD_PHAN_CAP_SP({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-distinct-wood-phan-cap-sp`,payload);
    return res.data;
}
//bang non ly luon ly  do am
export async function GET_WOOD_NONLY_LUONLY_DOAM({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-nonly-luonly-doam?tenloai=${payload.tenloai}&id=${payload.id}`);
    return res.data;
}
export async function POST_WOOD_NONLY_LUONLY_DOAM({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-wood-nonly-luonly-doam`,payload);
    return res.data;
}
export async function PUT_WOOD_NONLY_LUONLY_DOAM({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-nonly-luonly-doam`,payload);
    return res.data;
}
export async function DELETE_WOOD_NONLY_LUONLY_DOAM({ commit },payload) {
    const res = await delRequest(`/api/v2/vcn-bienban/delete-wood-nonly-luonly-doam?id=${payload.id}`,);
    return res.data;
}
export async function DELETE_WOOD_NONLY_LUONLY_DOAM_ID_PHIEU_NHAP({ commit },payload) {
    const res = await delRequest(`/api/v2/vcn-bienban/delete-wood-nonly-luonly-doam-idphieunhap?id=${payload.id}`,);
    return res.data;
}
//bang san pham pha loai
export async function POST_WOOD_PHAN_LOAISP({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-wood-phan-loaisp`,payload);
    return res.data;
}
export async function PUT_WOOD_PHAN_LOAISP({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-phan-loaisp`,payload);
    return res.data;
}
export async function GET_WOOD_PHAN_LOAISP({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-phan-loaisp?id=${payload.id}`);
    return res.data;
}
export async function GET_NHOMSP_CAPSP_WOOD({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-nhomsp-capsp_wood`);
    return res.data;
}
export async function WOOD_ID_SP_PRODUCT_DIMENSIONS({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-id-sp-product-dimensions?id=${payload.id}`);
    return res.data;
}
//WOOD_LOOKUP_CAP
export async function POST_WOOD_LOOKUP_CAP({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-wood-looup-cap`,payload);
    return res.data;
}
export async function PUT_WOOD_LOOKUP_CAP({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-looup-cap`,payload);
    return res.data;
}
export async function DELETE_WOOD_LOOKUP_CAP({ commit },payload) {
    const res = await delRequest(`/api/v2/vcn-bienban/delete-wood-looup-cap?id=${payload.id}`);
    return res.data;
}
export async function GET_WOOD_LOOKUP_CAP({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-looup-cap`);
    return res.data;
}
export async function GET_DG_BANG_GIA_IDSP({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-dg-bang-gia-idsp?id=${payload.id}&nm=${payload.nm}&loai=${payload.loai}`);
    return res.data;
}
export async function PUT_WOOD_SUPPLIED({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-supplied`,payload);
    return res.data;
}
export async function DELETE_WOOD_SUPPLIED({ commit },payload) {
    const res = await delRequest(`/api/v2/vcn-bienban/delete-wood-supplied?ID=${payload.ID}`);
    return res.data;
}
export async function DELETE_WOOD_PHAN_LOAISP({ commit },payload) {
    const res = await delRequest(`/api/v2/vcn-bienban/delete-wood-phan-loaisp?id=${payload.id}`,);
    return res.data;
}
export async function GET_WOOD_SAVE_MINUTES({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-save-minutes?id=${payload}`);
    return res.data;
}
export async function DELETE_WOOD_SAVE_MINUTES({ commit },payload) {
    const res = await delRequest(`/api/v2/vcn-bienban/delete-wood-save-minutes?id=${payload.id}`);
    return res.data;
}
export async function GET_WOOD_IDWOODSLAND20_WOOD_TRANSFAR_DOCUMENT({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-idwoodslanh20-wood-transfar-document?nm=${payload.nm}`);
    return res.data;
}
//gui tin nhan
export async function sendNotificationMail ({ commit },payload)  {
    let data = await postRequest("/api/v1/send-mail", payload);
    return data;
}
export async function PUT_TIN_HIEU_BAO_LOI_WOOD_TRANSFAR_DOCUMENT_ID({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-tin-hieu-bao-loi-wood-transfar-document-it`,payload);
    return res.data;
}
export async function PUT_WOOD_PRODUCT_DIMENSIONS({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-product-dimensions`,payload);
    return res.data;
}
export async function PUT_WOOD_TRANSFAS_DOCUMET_THONG_TIN_PHIEU({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-transfas-document-thong-tin-phieu`,payload);
    return res.data;
}

export async function GET_ALL_ACCOUNT_BASE({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-all-account-base`,);
    return res.data;
}
export async function GET_NN_LN_DA_WOOD_TRASFAR_DOCUMENT({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-nn-ln-da-wood-trasfar-document?month=${payload.tg}&year=${payload.nam}&nm=${payload.nm}`,);
    return res.data;
}
export async function GET_PROD_MACHINER_FIND_REQ({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-prod-machiner-find-req?all=${payload.all}&start=${payload.start}&end=${payload.end}`,);
    return res.data;
}

export async function POST_WOOD_THOI_GIAN_GUI_DI({ commit },payload) {
    const res = await postRequest(`/api/v2/vcn-bienban/post-wood-thoi-gian-gui-di`,payload);
    return res.data;
}
export async function DELETE_WOOD_THOI_GIAN_GUI_DI({ commit },payload) {
    const res = await delRequest(`/api/v2/vcn-bienban/delete-wood-thoi-gian-gui-di?id=${payload.id}&trangthai=${payload.trangthai}`,);
    return res.data;
}
export async function GET_WOOD_THOI_GIAN_GUI_DI({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-thoi-gian-gui-di?id=${payload.id}`,);
    return res.data;
}
export async function GET_WOOD_TRANSFAR_DOCUMENT_BAO_CAO_NLV_1({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-transfar-document-bao-cao-nlv-1?trangthai=${payload.trangthai}&fromDate=${payload.fromDate}&toDate=${payload.toDate}`,);
    return res.data;
}
export async function GET_WOOD_TRANSFAR_DOCUMENT_BAO_CAO_NLV_2({ commit },payload) {
    const res = await getRequest(`/api/v2/vcn-bienban/get-wood-transfar-document-bao-cao-nlv-2?trangthai=${payload.trangthai}&fromDate=${payload.fromDate}&toDate=${payload.toDate}`,);
    return res.data;
}
export async function PUT_WOOD_LOAI_HANG_PHAN_TRAM({ commit },payload) {
    const res = await putRequest(`/api/v2/vcn-bienban/put-wood-loai-hang-phan-tram`,payload);
    return res.data;
}