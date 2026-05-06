import {
  postRequest
} from '../../ultils'
import {
  api
} from '../../ultils/api'
export async function getAllPackage({
  commit
}, payload) {
  let data = await postRequest(api.P_PACKAGES + '/none/package', payload)
  commit('setPackages', data.data)
}

export async function getAllTonDauKy({
  commit
}, payload) {
  let data = await postRequest(api.P_PACKAGES + '/none/ton-dau-ky', payload)
  commit('setTonDauKys', data.data)
}
export async function getAllTonCuoiKy({
  commit
}, payload) {
  let data = await postRequest(api.P_PACKAGES + '/none/ton-cuoi-ky', payload)
  commit('setTonCuoiKys', data.data)
}
