import { postRequest,putRequest,  getRequest} from '../../ultils'
import {api} from '../../ultils/api'
export async function PROD_RESULT_BY_PROD_ORDER({commit},payload) {
    let data = await getRequest(api.PROD_REPORT_RESULT_BY_PROD_ORDER+'?year='+payload.year+'&month='+payload.month)
    return data.data
}
