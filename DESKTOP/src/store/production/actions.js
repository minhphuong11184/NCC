import apiConfig from "../../configs/api";
import axios from "axios";
import { getRequest, postRequest, putRequest } from "../../utils/utils";
import { Notify } from "quasar";
import { bienban } from "../../configs/constants";

export function ACTION_SELECT_SOURCE({ commit }, source) {
    commit("SELECT_SOURCE", source);
}
//chon chuc nang

export async function LOGIN({ commit, getters }, userReq) {
    commit("REQUEST_PENDING");
    let data = await postRequest(apiConfig.AUTHENTICATION, userReq);
    if (data) {
        const user = data.data.data;
        localStorage.setItem("user_info", JSON.stringify(user));
        let last_login = new Date().toISOString().slice(0, 10);
        localStorage.setItem("last_login", last_login);
        commit("REQUEST_DONE");
        commit("AUTH_SUCCESS_INIT", {
            user,
            getters
        });
        commit("AUTH_SUCCESS", {
            user,
            getters
        }); //AUTH_SUCCESS_INIT
    } else {
        commit("REQUEST_DONE");
        localStorage.removeItem("user_info");
    }
}
export function ACTION_LOGOUT({ commit }) {
    commit("LOGOUT");
}

export async function GET_SAN_LUONG_TH({ commit }, payload) {
    const data = await getRequest(
         `/api/v2/san-luong/san-luong-TH?start=${payload.fromDate}&end=${payload.toDate}&NM=${payload.NM}`
    );
    return data.data;
}  
export async function GET_SAN_LUONG_NGOAI_BAI({ commit }, payload) {
    const data = await getRequest(
         `/api/v2/san-luong/san-luong-ngoai-bai?start=${payload.fromDate}&end=${payload.toDate}&NM=${payload.NM}`
    );
    return data.data;
} 

export async function GET_XUAT_GO_BAO({ commit }, payload) {
    const data = await getRequest(
         `/api/v2/san-luong/san-luong-xuat-go-bao?start=${payload.fromDate}&end=${payload.toDate}&departmentId=${payload.departmentId}`
    );
    return data.data;
} 



export async function GET_TIEU_THU_DIEN({ commit }, payload) {
    const data = await getRequest(
         `/api/v2/san-luong/tieu-thu-dien?start=${payload.fromDate}&end=${payload.toDate}&NM=${payload.NM}`
    );
    return data.data;
}

export async function GET_SAN_LUONG_THEO_TUAN({ commit }, payload) {
    const data = await getRequest(
         `/api/v2/san-luong/san-luong-theo-tuan?start=${payload.fromDate}&end=${payload.toDate}&factoryId=${payload.factoryId}`
    );
    return data.data;
}

export async function GET_TIEN_DO_BAO({ commit }, payload) {
    const data = await getRequest(
         `/api/v2/san-luong/tien-do-bao?start=${payload.fromDate}&end=${payload.toDate}&factoryId=${payload.factoryId}`
    );
    return data.data;
}
export async function GET_SL_DO_BAO({ commit }, payload) {
    const data = await getRequest(
         `/api/v2/san-luong/san-luong-bao?start=${payload.fromDate}&end=${payload.toDate}&factoryId=${payload.factoryId}`
    );
    return data.data;
}
export async function GIAO_SAN_LUONG_NM({ commit }, payload) {
    const data = await getRequest(
         `/api/v2/san-luong/giao-san-luong-nm?start=${payload.fromDate}&end=${payload.toDate}&factoryId=${payload.NM}`
    );
    return data.data;
}
export async function ACTION_GET_PALLET_IN_LINE({ commit }, params) {
    commit("REQUEST_PENDING");
    let res = await getRequest(
        apiConfig.PALLETS_IN_LINE + params.sourceId + "/not-out"
    );
    commit("FETCH_PALLETS_IN_LINE", res.data.data.pallet);
    commit("REQUEST_DONE");
    return res.data.data;
}
// lấy thông tin chi tiết của pallet và chọn luôn pallet đó
export async function ACTION_GET_DETAIL_PALLET({ commit }, params) {
    let url = apiConfig.DETAIL_PALLET + params.palletCode;
    const data = await getRequest(url);
    commit("FETCH_PALLET_DETAIL", data.data.data);
    return data.data;
}
//item
export async function ACTION_FETCH_ITEMS({ commit }, payload) {
    let res = await getRequest(
        "/api/v2/items?factoryId=" + payload.factoryId
    );
    commit("FETCH_ALL_ITEM", res.data.data);
    return res.data.data;
}
export async function ACTION_FETCH_ITEMS_BY_TYPE({ commit }, typeid) {
    let res = await getRequest(apiConfig.GET_ITEM + "?typeId=" + typeid);
    commit("FETCH_ALL_ITEM", res.data.data);
    return res.data.data;
}
export async function GET_ITEMS({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_ITEM +
        "?factoryId=" +
        payload.factoryId +
        "&typeId=" +
        payload.typeId
    );
    commit("FETCH_ALL_ITEM", res.data.data);
    return res.data.data;
}
//Chọn qui cách tinh
export function ACTION_CHOOSE_ITEM({ commit }, item) {
    commit("CHOOSE_ITEM", item);
}
//xóa qui cách tinh đã chọn
export function ACTION_REMOVE_ITEM({ commit }) {
    commit("REMOVE_ITEM");
}
//update qty item chooose when input qty
export function ACTION_UPDATE_QTY({ commit }, payload) {
    commit("UPDATE_QTY_ITEM", payload);
}
//lấy loại package
export async function ACTION_GET_PACKAGE_TYPE({ commit }) {
    let data = await getRequest(apiConfig.GET_PACKAGE_TYPE);
    commit("FETCH_PACKAGE_TYPE", data.data.data);
    return data.data;
}
export function ACTION_LOAD_DONE_CREATE_PALLET({ commit }) {
    commit("LOAD_DONE_CREATE_PALLET");
}
export function ACTION_LOAD_DONE_CREATE_PALLET_INIT({ commit }) {
    commit("LOAD_DONE_INIT");
}
//fetch data woods
export async function ACTION_FETCH_WOOD_ITEMS({ commit }, factoryId) {
    let data = await getRequest(
        apiConfig.GET_ONLY_WOODS_ITEMS + "?factoryId=" + factoryId
    );
    commit("FETCH_WOODS_ITEM_ONLY", data.data.data);
    return data.data;
}
export function MERGE_ITEMS_WITH_WOODS({ commit }) {
    commit("PUSH_ITEMS");
}
export function ACTION_LOAD_XEP_SAY_DONE({ commit }, status) {
    commit("CHANGE_XEP_SAY_DONE", status);
}
//select loai pallet xep say
export function ACTION_SELECT_TYPE_IN_OUT({ commit }, type) {
    commit("CHANGE_TYPE_PALLET_XEP_SAY", type);
}

//add wood in array woodsSelected
export function ACTION_CHOOSE_WOODS({ commit }, wood) {
    commit("ADD_WOODS_SELECT", wood);
}
//remove wood from woodsSelected
export function ACTION_REMOVE_WOOD({ commit }, wood) {
    commit("REMOVE_WOOD", wood);
}
//remove all woodsSelected
export function ACTION_REMOVE_ALL_WOOD({ commit }) {
    commit("REMOVE_ALL_WOODSELECTED");
}

//call request create pallet
export function ACTION_CREATE_PALLET({ commit }, body) {
    commit("REQUEST_PENDING");
    return new Promise((reslove, reject) => {
        const url = apiConfig.POST_CREATE_PALLET;
        axios
            .post(url, body)
            .then(res => {
                commit("REQUEST_DONE");
                reslove(res.data);
            })
            .catch(err => {
                commit("REQUEST_DONE");
                reslove(err.response.data);
            });
    });
}
//chon 1 qui cach tho
export function ACTION_SELECT_ONE_MATERIAL({ commit }, material) {
    commit("SELECT_MATERIAL", material);
}
export function ACTION_REMOVE_MATERIAL_SELECTED({ commit }) {
    commit("REMOVE_MATERIAL_SELECTED");
}
export function ACTION_UPDATE_MATERIAL_QTY({ commit }, payload) {
    commit("UPDATE_QTY_MATERIAL", payload);
}
// chọn pallet
export function ACTION_CHOOSE_PALLET({ commit }, pallet) {
    commit("", pallet);
}
//lấy keo hóa chất
export async function ACTION_GET_SUPPLIES({ commit }, token) {
    let data = await getRequest(apiConfig.GET_SUPPILES);
    commit("FETCH_SUPPLIES", data.data.data);
    return data.data.data;
}
//lấy thông tin nhà cung cấp
export async function ACTION_GET_PROVIDERS({ commit }) {
    let res = await getRequest(apiConfig.GET_PROVIDERS);
    commit("FETCH_PROVIDERS", res.data.data);
    return res.data.data;
}
// lấy thông tin số lô
export async function ACTION_GET_PARCELS({ commit }) {
    let res = await getRequest(apiConfig.GET_PARCELS);
    commit("FETCH_PARCELS", res.data.data);
    return res.data.data;
}
//thêm thông tin lô, keo hóa chất vào pallet vag công đoạn
export function ACTION_ADD_SUPPLIES_TO_PALLET({ commit }, payload) {
    const url =
        apiConfig.POST_ADD_SUPPLIES_TO_PL + "/" + payload.palletCode + "/supplies";
    const data = {
        suppliesId: payload.suppliesId,
        stepOfPalletId: payload.stepOfPalletId,
        quantity: payload.quantity || 1,
        parcel: payload.parcelCode,
        vendorId: payload.vendorId,
        token: payload.token
    };
    return new Promise((resolve, reject) => {
        axios
            .post(url, data)
            .then(res => {
                if (res.data.meta.success === true) {
                    Notify.create({
                        message: "Thêm thành công !",
                        color: "cyan"
                    });
                    resolve(res.data.data);
                } else {
                    Notify.create({
                        message: res.data.meta.messages.message,
                        color: "red"
                    });
                    reject(res.data.meta.messages.message);
                }
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
//lấy danh sachs pallêt đang chờ nhận
export async function ACTION_FETCH_PALLET_WAIT_RECIVE({ commit }, params) {
    let res = await getRequest(
        apiConfig.GET_PALLET_WAIT_RECIVE + params.stepId + "/in-not-verify"
    );
    commit("FETCH_PALLET_WAIT_RECIVE", res.data.data.pallet);
    return res.data;
}
// lấy danh sách pallet đã xuất nhưng chưa nhận
export function ACTION_FETCH_PALLET_OUT_STOCK({ commit }, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                apiConfig.GET_PALLET_WAIT_RECIVE +
                params.sourceId +
                "/out-not-verify?token=" +
                params.token
            )
            .then(res => {
                if (res.data.meta.success === true) {
                    commit("FETCH_PALLET_OUT_STOCK", res.data.data.pallet);
                    resolve(res.data.data.pallet);
                } else {
                    reject(res.data.meta.messages.message || "*&@^!&*^*!");
                }
            });
    }).catch(err => {
        console.log(err);
    });
}
// nhận pallet về công đoạn
export function ACTION_RECIVED_PALLET({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_RECIVED_PALLET + payload.packageId + "/verify", {
                token: payload.token
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
export function ACTION_STEP_PALLET({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(
                apiConfig.POST_STEP_PALLET + payload.palletCode + "/move",
                payload.data
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}

// lấy thông tin các mẻ sấy(kế hoạch sấy)
export async function ACTION_GET_BATCH({ commit }, payload) {
    let data = await getRequest(apiConfig.GET_BATCHS + payload.queryGetBatch);
    if (data.data.data) {
        let params = {
            batchs: data.data.data,
            factoryId: payload.factoryId
        };
        commit("GET_BATCH", params);
    }
    return data.data;
}
//chọn mẻ sấy
export function ACTION_SELECT_BATCH({ commit }, batch) {
    commit("SELECT_BATCH", batch);
}
// lấy danh sách lò sấy
export async function ACTION_GET_KILNS({ commit }, payload) {
    let res = await getRequest(apiConfig.GET_KILNS);
    let params = {
        kilns: res.data.data,
        factoryId: payload.factoryId
    };
    commit("FETCH_KILNS", params);
    return res.data.data;
}
export async function ACTION_GET_RANGES_BATCH({ commit }) {
    let res = await getRequest(apiConfig.GET_RANGES_BATCH);
    commit("FETCH_RANGES", res.data.data);
    return res.data.data;
}
// TẠO MẺ SẤY
export function ACTION_CREATE_BATCH({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(
                apiConfig.POST_CREATE_BATCH + payload.kilnId + "/batch",
                payload.data
            )
            .then(res => {
                if (res.data.meta.success === true) {
                    Notify.create({
                        message: "Tạo kế hoạch sấy thành công !",
                        color: "green"
                    });
                    resolve(res.data);
                } else {
                    Notify.create({
                        message: res.data.meta.messages.message,
                        color: "red"
                    });
                    reject(res.data);
                }
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
//LẤY TỒN QC
export function ACTION_GET_INVENTORY_QC({ commit }, payload) {
    return new Promise((resolve, reject) => {
        const url = apiConfig.GET_TON_QC + "?stepId=" + payload.stepId;
        axios
            .get(url)
            .then(res => {
                commit("FETCH_INVENTORY_QC", res.data.data);
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
export async function deletePackageloi({ commit }, payload) {
    const data = await postRequest("/api/v2/packages/xoa-qc-loi", payload);
    return data.data;
}
export function ACTION_SELECT_INVENTORY_QC({ commit }, inv) {
    commit("SELECT_INVENTORY_QC", inv);
}
//lấy danh sách biện pháp xử lý hàng lỗi
export function ACTION_GET_SOLUTION_QC({ commit }, token) {
    return new Promise((resolve, reject) => {
        axios
            .get(apiConfig.GET_SOLUTIONS_QC)
            .then(res => {
                commit("FETCH_SOLUTION_QC", res.data.data);
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
export function ACTION_CREATE_PACKAGE({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_CREATE_PACKAGE, payload)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                Notify.create({
                    message: err.response,
                    color: "red"
                });
                reject(err.response);
            });
    });
}
// QC Xác nhận mẻ sấy đạt chất lượng ra lò
export function ACTION_QC_CONFIRM_BATCH({ commit }, payload) {
    commit("REQUEST_PENDING");
    return new Promise((resolve, reject) => {
        axios
            .post(
                apiConfig.POST_QC_CONFIRM_BATCH + payload.batchId + "/verify",
                payload.data
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
        commit("REQUEST_DONE");
    });
}
export function ACTION_IN_BATCH({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_VAO_LO + payload.palletCode + "/move", payload.data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                console.log(err);
                reject(err.response);
            });
    });
}
// RA LÒ
export function ACTION_OUT_BATCH({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_RA_LO + payload.batchId + "/export", payload.data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
//topic fcm
export function ACTION_GET_SUBCRIBERS({ commit }, topics) {
    commit("GET_TOPICS", topics);
}
//lấy thông tin công đoạn xuất theo item
export async function ACTION_GET_DESTINATION_BY_ITEM({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_DES_BY_ITEM + payload.itemId + "/routing"
    );
    return res.data;
}
// đổi mật khẩu
export function ACTION_CHANGE_PASS({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .put('/api/v2/password', payload.data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}
export function ACTION_GET_IKEA_SEARCH({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .get(apiConfig.IKEA_SEARCH + payload.ikeaCode + "/decode")
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
export function ACTION_CANCEL_IKEA({ commit }, payload) {
    commit("REQUEST_PENDING");
    return new Promise((resolve, reject) => {
        axios
            .delete(apiConfig.CANCEL_IKEA + payload.ikeaCode)
            .then(res => {
                commit("REQUEST_DONE");
                resolve(res.data);
            })
            .catch(err => {
                commit("REQUEST_DONE");
                resolve(err.response.data);
            });
    });
}

//lấy lệnh sản xuất
export async function ACTION_LOAD_PROD_ORDERS({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_PROD_ORDERS + "?factoryId=" + payload.factoryId
    );
    return res.data;
}
export async function ACTION_LOAD_PROD_ORDERS_BY_FACTORY({ commit },
    factoryId
) {
    let res = await getRequest(
        apiConfig.GET_PROD_ORDERS + "?factoryId=" + factoryId
    );
    return res.data;
}

// lấy thông tin loại gỗ , accaia ....
export async function ACTION_LOAD_WOOD_TYPES({ commit }, type) {
    let data = await getRequest(apiConfig.GET_WOOD_TYPES + "?type=" + type);
    return data.data;
}

//tạo biên bản kiểm tra độ ẩm
export function ACTION_CREATE_BB_MC({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_CREATE_BB_MC, payload)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}

// load biên bản kiểm tra độ ẩm theo mẻ sấy
export function ACTION_LOAD_BB_MC_BY_BATCHID({ commit }, batchId) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                apiConfig.GET_BB_MC_BY_BATCHID +
                batchId +
                "/" +
                bienban.BB_KIEM_TRA_DO_AM_LO_SAY
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
// load biên bản kiểm tra khuyết tật theo mẻ sấy
export function ACTION_LOAD_BB_KT_BY_BATCHID({ commit }, batchId) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                apiConfig.GET_BB_KT_BY_BATCHID +
                batchId +
                "/" +
                bienban.BB_KHAO_SAT_KHUYET_TAT_LO_SAY
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
// load biên bản kiểm tra cơ điện theo mẻ sấy
export function ACTION_LOAD_BB_CO_DIEN_BY_BATCHID({ commit }, batchId) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                apiConfig.GET_BB_KT_BY_BATCHID +
                batchId +
                "/" +
                bienban.BB_KIEM_TRA_LO_SAY
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
//tạo biên bản kiểm tra độ ẩm
export function ACTION_CREATE_BB_KT({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .post(apiConfig.POST_CREATE_BB_KT, payload)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}

//chọn biên bản độ ẩm để xem
export function ACTION_SELECT_BBMC({ commit }, bbmc) {
    commit("SELECT_BB_MC", bbmc);
}
//chọn biên bản khuyết tật để xem
export function ACTION_SELECT_BBKT({ commit }, bbmc) {
    commit("SELECT_BB_KT", bbmc);
}
//chọn biên bản Cơ điện để xem
export function ACTION_SELECT_BBCODIEN({ commit }, bb) {
    commit("SELECT_BB_CODIEN", bb);
}

// lấy thông tin lịch sử xuất hàng sang QC
export function ACTION_GET_QC_HISTORY_BY_STEPID({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .get(
                apiConfig.GET_QC_HISTORY_BY_STEP_ID +
                payload.qcStepId +
                "/from/" +
                payload.stepId +
                "?itemId=" +
                payload.itemId
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
// cập nhâth trangh thái của mẻ sấy
export function ACTION_KILN_BATCH_UPDATE_STATUS({ commit }, payload) {
    return new Promise((resolve, reject) => {
        axios
            .put(
                apiConfig.PUT_STATUS_BATCH + payload.kilnBatchId + "/status",
                payload.data
            )
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                resolve(err.response.data);
            });
    });
}
export async function CREATE_COC_DONG_GOI({ commit }, payload) {
    let data = await postRequest(apiConfig.CREATE_COC_DONG_GOI, payload);
    return data.data;
}
export async function GET_COC_BY_DATE({ commit }, currentDate) {
    let res = await getRequest(
        apiConfig.CREATE_COC_DONG_GOI + "?factoryId=100000"
    );
    return res.data;
}
export async function GET_PRODUCTS({ commit }) {
    let res = await getRequest(apiConfig.GET_PRODUCTS);
    commit("GET_PRODUCTS", res.data.data);
    return res.data;
}
export async function GET_COC_BY_ID({ commit }, id) {
    let res = await getRequest(apiConfig.CREATE_COC_DONG_GOI + "/" + id);
    return res.data;
}
export function SELECT_DCOC({ commit }, dcoc) {
    commit("SELECT_DCOC", dcoc);
}
export async function UPDATE_DCOC({ commit }, payload) {
    let data = await putRequest(
        apiConfig.CREATE_COC_DONG_GOI + "/" + payload.id,
        payload.data
    );
    return data.data;
}
export async function GET_WORKERS_FROM_TO({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_WORKERS +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&createBy=" +
        payload.createBy
    );
    return res.data;
}
export async function INSERT_WORK_TIME({ commit }, payload) {
    let data = await postRequest(apiConfig.GET_WORKERS, payload);
    return data.data;
}
export async function GET_TY_LE_SAN_XUAT({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_RATE_PLAN +
        "?departmentId=" +
        payload.departmentId +
        "&week=" +
        payload.week +
        "&year=" +
        payload.year
    );
    return res.data;
}
export async function GET_DETAI_PO({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_SAN_LUONG +
        "?code=" +
        payload.code +
        "&number=" +
        payload.number
    );
    return res.data;
}
export async function CONFIRM_END_PO({ commit }, payload) {
    console.log("payload", payload);
    let res = await getRequest(
        apiConfig.GET_SAN_LUONG +
        "/confirmEndPO" +
        "?number=" +
        payload.number +
        "&week=" +
        payload.week
    );
    return res.data;
}

export async function UNCOMFIRM_END_PO({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_SAN_LUONG +
        "/unConfirmEndPO" +
        "?number=" +
        payload.number +
        "&week=" +
        payload.week
    );
    return res.data;
}

export async function GET_PO({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_SAN_LUONG +
        "/getPO" +
        "?week=" +
        payload.week +
        "&factoryId=" +
        payload.factoryId
    );
    return res.data;
}

export async function POST_SAN_LUONG({ commit }, payload) {
    const data = await postRequest(apiConfig.POST_CREATE_PACKAGE, payload);
    return data.data;
}
export async function GET_LIST_SAN_LUONG({ commit }, payload) {
    let res = await getRequest(
        apiConfig.GET_SAN_LUONG +
        `?year=${payload.year}&week=${payload.week}&stepId=${payload.stepId}&number=${payload.number}`
    );
    return res.data;
}
export async function GET_VAT_TU({ commit }, token) {
    const data = await getRequest(apiConfig.GET_SUPPILES);
    return data.data;
}
export async function GET_DETAIL_PACKAGE({ commit }, packageId) {
    const data = await getRequest(
        apiConfig.POST_CREATE_PACKAGE + "?packageId=" + packageId
    );
    return data.data;
}
export async function GET_NCC({ commit }) {
    const res = await getRequest(apiConfig.GET_PROVIDERS);
    return res.data;
}
export async function GET_LICH_SU_CONFIRM({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE +
        "/lich-su" +
        "?from=" +
        payload.fromDate +
        "&to=" +
        payload.toDate +
        "&stepId=" +
        payload.stepId
    );
    return res.data;
}

export async function GET_LOT_WAIT_RECEIPT({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE + "/cho-xac-nhan?stepId=" + payload.stepId
    );
    return res.data;
}

export async function GET_LOT_WAIT_RECEIPT2({ commit }, payload) {
    const res = await getRequest(
        apiConfig.POST_CREATE_PACKAGE + "/cho-xac-nhan2?stepId=" + payload.stepId
    );
    return res.data;
}
//apiConfig.POST_RECIVED_PALLET+payload.packageId+'/verify'
export async function POST_NHAN_LOT_NO({ commit }, payload) {
    const data = await postRequest(
        apiConfig.POST_RECIVED_PALLET + payload.packageId + "/verify"
    );
    return data.data;
}

export async function POST_NHAN_LOT_NO2({ commit }, payload) {
    const data = await postRequest(
        apiConfig.POST_RECIVED_PALLET + payload.packageId + "/verify2",
        payload
    );
    return data.data;
}
export async function CAP_PHOI({ commit }, payload) {
    const data = await postRequest(
        apiConfig.GET_SAN_LUONG + "/cap-phoi",
        payload
    );
    console.log("dataCP", data);
    return data.data;
}
export async function GET_COC({ commit }, payload) {
    const res = await getRequest(apiConfig.PO + "/" + payload.po + "/supplies");
    return res.data;
}
export async function ADD_COC({ commit }, payload) {
    const res = await postRequest(
        apiConfig.PO + "/" + payload.po + "/supplies",
        payload
    );
    return res.data;
}
export async function GET_QC_PACKAGE({ commit }, payload) {
    const res = await getRequest(
        apiConfig.GET_PALLET_WAIT_RECIVE + "/" + payload.stepId + "/import"
    );
    return res.data;
}
export async function COMPLETED_PO({ commit }, payload) {
    const res = await putRequest(apiConfig.PO + "/" + payload.po, payload);
    return res.data;
}

export async function GET_NUMBER_PO({ commit }, payload) {
    const res = await getRequest(
        apiConfig.PO + "/number?year=" + payload.year + "&week=" + payload.week
    );
    return res.data;
}
export async function GET_MARKET({ commit }, payload) {
    const res = await getRequest(apiConfig.MARKET);
    return res.data;
}
export async function NHAP_TON_DAU_KY({ commit }, payload) {
    const res = await postRequest(apiConfig.TON_DAU_KY, payload);
    return res.data;
}

export async function ADD_KH({ commit }, payload) {
    const data = await postRequest("/api/v2/production-order", payload);
    return data.data;
}

export async function getAllTonDauKys({ commit }) {
    const { data } = await getRequest("/api/v2/ton-dau-ky");
    commit("setTonDauKys", data.data);
}
export async function getAlllichsucapphoi({ commit }) {
    const { data } = await getRequest("/api/v2/lich-su-cap-phoi");
    commit("lichsucapphoi", data.data);
}
export async function getAllSanLuongs({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/packages/${payload.stepId}/xac-nhan-phoi`
    );
    commit("setSanLuongs", data);
}

export async function getAllGhiNhans({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/packages/${payload.stepId}/ghi-nhan-phoi`
    );
    commit("setSanLuongs", data);
}

export async function getAllKeHoachSanXuatConLais({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.stepId}/ke-hoach-thuc-hien`
    );
    commit("setPos", data);
}

export async function getPoByCode({ commit }, payload) {
    const { data } = await getRequest(
        `/api/v2/production-order/${payload.code}/thuc-hien`
    );
    return data;
}
export async function UPDATE_STOCK_NSLD({ commit }, payload) {
    const data = await putRequest('api/v2/ton-dau-ky/update-nsld', payload);
    return data.data;
}
export async function UPDATE_STOCK_NSLD_CBG({ commit }, payload) {
    const data = await putRequest('api/v2/ton-dau-ky/update-nsld-cbg', payload);
    return data.data;
}
export async function DEL_STOCK_NSLD({ commit }, payload) {
    const data = await putRequest('api/v2/ton-dau-ky/delete-nsld', payload);
    return data.data;
}
export async function DEL_STOCK_NSLD_CBG({ commit }, payload) {
    const data = await putRequest('api/v2/ton-dau-ky/delete-nsld-cbg', payload);
    return data.data;
}
export async function UPDATE_STOCK({ commit }, payload) {
    const data = await putRequest('api/v2/ton-dau-ky', payload);
    return data.data;
}
export async function DEL_STOCK({ commit }, payload) {
    const data = await putRequest('api/v2/ton-dau-ky/delete', payload);
    return data.data;
}
export async function UPDATE_STOCK_PRODUCT({ commit }, payload) {
    const data = await putRequest('api/v2/ton-dau-ky/updateStoragePro', payload);
    return data.data;
}

export async function IMPORT_TON_DAU_KY({ commit }, payload) {
    const res = await postRequest('api/v2/ton-dau-ky/importStock', payload);
    return res.data;
}
export async function PRODUCT_STORAGE({ commit }, payload) {
    const res = await getRequest(`api/v2/ton-dau-ky/productStorage?from=${payload.fromDate}&to=${payload.toDate}`);
    return res.data;
}
export async function PRODUCT_STORAGE_DETAIL({ commit }, payload) {
    const res = await getRequest(`api/v2/ton-dau-ky/productStorageDetail?from=${payload.fromDate}&to=${payload.toDate}`);
    return res.data;
}
export async function VIEW_XUAT_GO_DETAIL({ commit }, payload) {
    const res = await getRequest(`api/v2/ton-dau-ky/view-xuat-go-chi-tiet?from=${payload.fromDate}&to=${payload.toDate}&factoryId=${payload.factoryId}`);
    return res.data;
}
export async function VIEW_XUAT_GO_DETAIL_LUA_PHOI({ commit }, payload) {
    const res = await getRequest(`api/v2/ton-dau-ky/view-xuat-go-chi-tiet-lua-phoi?from=${payload.fromDate}&to=${payload.toDate}&factoryId=${payload.factoryId}`);
    return res.data;
}
export async function INSERT_PACKAGE({ commit }, payload) {
    const data = await postRequest(
        "api/v2/packages/packageAfterDrying",
        payload
    );
    return data.data.data;
}
export async function INSERT_ITEM_IN_PACKAGE({ commit }, payload) {
    const data = await postRequest(
        "api/v2/san-luong/insert-in-package",
        payload
    );
    console.log("dataCP", data);
    return data.data;
}
export async function IMPORT_ITEMS({ commit }, payload) {
    const data = await postRequest(
        "api/v2/dinh-muc-phoi/import-items",
        payload
    );
    return data.data;
}
export async function IMPORT_MACHINES({ commit }, payload) {
    const data = await postRequest(
        "api/v2/ton-dau-ky/import-machines",
        payload
    );
    return data.data;
}
export async function GET_NHOM_TIEU_THU_DIEN({ commit }) {
    const res = await getRequest(`api/v2/cong-doan/nhom-tieu-thu-dien`);
    return res.data;
}























