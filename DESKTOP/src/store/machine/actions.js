
import { getRequest, postRequest, putRequest, delRequest} from "../../utils/utils";
import { api } from "../../ultils/api";

export async function GET_MACHINE({ commit }) {
    const { data } = await getRequest(api.PROD_MACHINE);
    return data.data;
}

export async function ADD_MACHINE({ commit }, payload) {
    const { data } = await postRequest(api.PROD_MACHINE+"/add", payload);
    return data;
}
export async function DELETE_MACHINE({ commit }, id) {
  console.log('id',id)
  const data = await delRequest(api.PROD_MACHINE + "/" + id);
  return data.data;
}
export async function UPDATE_MACHINE({ commit }, payload) {
    const { data } = await putRequest(api.PROD_MACHINE + "/" + payload.id, payload);
    return data;
}

export async function getDepartmentByFactotyId({ commit }, factoryId) {
    const { data } = await getRequest(
        `/api/v2/machine/departmentByFactoryId?factoryId=${factoryId}`
    );
    return data.data;
}

export async function GET_HIEU_SUAT_MAY({ commit }, factoryId) {
    const { data } = await getRequest(`/api/v2/machine/cong-suat-may?factoryId=${factoryId}`);
    return data.data;
}

export async function ADD_HIEU_SUAT_MAY({ commit }, payload) {
    const { data } = await postRequest(api.PROD_MACHINE+"/cong-suat-may", payload);
    return data;
}

export async function UPDATE_HIEU_SUAT_MAY({ commit }, payload) {
    const { data } = await putRequest(api.PROD_MACHINE+"/cong-suat-may/"+payload.id, payload);
    return data;
}

export async function GET_MACHINE_BY_FACTORY_ID({ commit }, factoryId) {
    const { data } = await getRequest(api.PROD_MACHINE+"/machine-by-factoryId?factoryId="+factoryId);
    return data.data;
}
export async function GET_MACHINE_BY_FACTORY_ID_MAY({ commit }, factoryId) {
    const { data } = await getRequest(api.PROD_MACHINE+"/machine-by-factoryId-3?factoryId="+factoryId);
    return data.data;
}


export async function updateCongSuatChung({ commit }, payload) {
    const { data } = await postRequest(api.PROD_MACHINE+"/cong-suat-may-chung", payload);
    return data;
}

export async function GET_ITEMS({ commit }, factoryId) {
    const { data } = await getRequest(api.PROD_MACHINE+"/items");
    return data.data;
}

export async function GET_REPORT_HIEU_SUAT_MAY({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/hieu-suat-may`, payload);
    return data.data;
}
export async function GET_REPORT_BAO_DUONG_CAP_3({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/get-bao-duong-cap-3`, payload);
    return data.data;
}export async function GET_REPORT_NANG_SUAT_LD_1({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/get-nang-suat-lao-dong-1`, payload);
    return data.data;
}
export async function GET_REPORT_BAO_DUONG_CAP_1({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/get-bao-duong-cap-1`, payload);
    return data.data;
}
export async function GET_REPORT_BAO_DUONG_CAP_2({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/get-bao-duong-cap-2`, payload);
    return data.data;
}
export async function GET_REPORT_BAO_DUONG_CAP_1_LOI({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/get-bao-duong-cap-1-loi`, payload);
    return data.data;
}
export async function GET_REPORT_BAO_DUONG_CAP_2_LOI({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/get-bao-duong-cap-2-loi`, payload);
    return data.data;
}
export async function GET_REPORT_BAO_DUONG_CAP_3_LOI({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/get-bao-duong-cap-3-loi`, payload);
    return data.data;
}
export async function GET_REPORT_BAO_DUONG_CAP_1_DAT({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/get-bao-duong-cap-1-dat`, payload);
    return data.data;
}
export async function GET_REPORT_BAO_DUONG_CAP_2_DAT({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/get-bao-duong-cap-2-dat`, payload);
    return data.data;
}
export async function GET_REPORT_SAN_LUONG_MAY({ commit }, payload) {
    const data = await postRequest(api.PROD_SAN_LUONG_MAY, payload);
    return data.data;
}

export async function GET_REPORT_CHART_MD({ commit }, payload) {
    const data = await getRequest(`/api/v2/machine/chart-md?machineName=${payload.machineName}&start=${payload.fromDate}&end=${payload.toDate}`);
    return data.data;
}
export async function GET_REPORT_CHART_M3({ commit }, payload) {
    const data = await getRequest(`/api/v2/machine/chart-m3?machineName=${payload.machineName}&start=${payload.fromDate}&end=${payload.toDate}`);
    return data.data;
}
export async function GET_REPORT_CHART_SL({ commit }, payload) {
    const data = await getRequest(`/api/v2/machine/chart-sl?machineName=${payload.machineName}&start=${payload.fromDate}&end=${payload.toDate}`);
    return data.data;
}

export async function GET_REPORT_CHART_MD_MONTH({ commit }, payload) {
    const data = await getRequest(`/api/v2/machine/chart-md-month?machineName=${payload.machineName}&start=${payload.fromDate}&end=${payload.toDate}`);
    return data.data;
}
export async function GET_REPORT_CHART_M3_MONTH({ commit }, payload) {
    const data = await getRequest(`/api/v2/machine/chart-m3-month?machineName=${payload.machineName}&start=${payload.fromDate}&end=${payload.toDate}`);
    return data.data;
}
export async function GET_REPORT_CHART_SL_MONTH({ commit }, payload) {
    const data = await getRequest(`/api/v2/machine/chart-sl-month?machineName=${payload.machineName}&start=${payload.fromDate}&end=${payload.toDate}`);
    return data.data;
}

export async function GET_REPORT_SU_CO_MAY({ commit }, payload) {
    const data = await postRequest(`/api/v2/machine/su-co-may`, payload);
    return data.data;
}

// export async function getAllDepartment({ commit }) {
//     const { data } = await getRequest(
//         `/api/v2/machine/department`
//     );
//     return data.data;
// }

export async function getMachineName({ commit }, payload) {
    const data = await getRequest(`/api/v2/machine/machine-name`, payload);
    return data.data;
}
// export async function GET_REPORT_HIEU_SUAT_BY_DAY({ commit }, payload) {
//     const data = await getRequest(`/api/v2/machine/cong-suat-may-by-day?machineName=${payload.machineName}&start=${payload.fromDate}&end=${payload.toDate}`);
//     return data.data;
// }