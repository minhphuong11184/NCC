import { isObjectEmpty, postRequest,putRequest,setToken,delRequest ,setBaseUrl, getRequest, getRequestWithProgressIndicator} from '../../ultils'
import {api} from '../../ultils/api'
export async function GET_LIST_PAYMENT({commit},payload){
    let data = await getRequest(api.NL_PAYMENT)
    return data.data
}
export async function GET_DETAIL_RECEIPT({commit},id) {
    let res = await getRequest(api.NL_RECEIPT+'/'+id)
    return res.data
}
export function STORE_PAY_CALCUTALOR({commit},payload){
    commit('STORE_PAY',payload)
}
export async function GET_PAYMENT_DETAIL_BY_RECEIPT_ID ({commit},id) {
    let res = await getRequest(api.NL_PAYMENT+'/'+id)
    return res.data
}
export async function GET_REGION({commit},payload){
    let res = await getRequest(api.NL_REGION+'?module='+payload.module)
    return res.data
}
export async function CHANGE_MAP_CONDITION({commit},payload) {
    let res = await postRequest(api.NL_PRICE,payload)
    return res.data
}
export async function GET_PRICE_RAW_DATA ({commit},payload) {
    let res = await getRequest(api.NL_PRICE+'?moduleCode='+payload.moduleCode+'&regionId='+payload.regionId)
    return res.data
}
export async function CREATE_REQ_PRICE({commit},payload) {
    let res = await postRequest(api.NL_REQUEST_PRICE,payload)
    return res.data
}
export async function GET_MY_REQUEST({commit},id) {
    let res
    if (id) {
        res = await getRequest(api.NL_REQUEST_PRICE+'?uid='+id)
    }else {
        res  = await getRequest(api.NL_REQUEST_PRICE)
    }
    return res.data
}
export async function GET_DTYPE({commit},moduleCode) {
    let res = await getRequest(api.NL_DTYPE+'?moduleCode='+moduleCode)
    return res.data
}
export async function GET_WOOD_TYPE({commit}) {
    let res = await getRequest(api.NL_WOOD_TYPE)
    return res.data
}
export async function GET_INPUT_TYPE({commit},payload) {
    let res = await getRequest(api.NL_INPUT_TYPE+'?moduleCode='+payload.moduleCode+'&type='+payload.type)
    return res.data
}
export async function GET_PRICE_BY_REQID({commit},id) {
    let res = await getRequest(api.NL_REQUEST_PRICE+'/'+id)
    return res.data
}
export async function APPROVAL_PRICE({commit},payload){
    let res = await putRequest(api.NL_REQUEST_PRICE,payload)
    return res.data
}
export async function COMPLETED_PAYMENT({commit},payload) {
    let res = await postRequest(api.NL_PAYMENT+'/'+payload.id,payload.data)
    // if (res.data.meta.success) {
    //     // let resCreatePallet = await postRequest(apiConfig.POST_CREATE_PALLET,payload.pallet)
    // }
    return res.data
}
export async function VIEW_COMPLETED_PAYMENT({commit},id){
    let res = await getRequest(api.GET_PAYMENT_DETAIL+id+'/view')
    return res.data
}
export async function REJECT_BB({commit},id){
    const data = await putRequest(api.NL_PAYMENT+'/'+id)
    return data.data
}
export async function GET_REPORT_THEO_DOI_NHAP_VAN({commit},payload){
    const data = await getRequest(api.NL_REPORT_THEO_DOI_NHAP_VAN+'?month='+payload.month+'&year='+payload.year+'&warehouseId='+payload.warehouseId)
    return data.data
}