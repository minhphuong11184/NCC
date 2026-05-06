import axios from 'axios'
import apiConfig from '../../configs/api'

// ===== MACHINES =====
export async function GET_MACHINES({ commit }) {
    const { data } = await axios.get(apiConfig.ATTENDANCE_MACHINE)
    const machines = data.data || []
    commit('SET_MACHINES', machines)
    return machines
}

export async function ADD_MACHINE({ commit }, payload) {
    const { data } = await axios.post(apiConfig.ATTENDANCE_MACHINE, payload)
    return data.data
}

export async function UPDATE_MACHINE({ commit }, payload) {
    const { data } = await axios.put(`${apiConfig.ATTENDANCE_MACHINE}/${payload.id}`, payload)
    return data.data
}

export async function DELETE_MACHINE({ commit }, id) {
    await axios.delete(`${apiConfig.ATTENDANCE_MACHINE}/${id}`)
}

// ===== LOGS =====
export async function GET_ATTENDANCE_LOGS({ commit }, { from, to, machineIp }) {
    let url = `${apiConfig.ATTENDANCE_LOG}?from=${from}&to=${to}`
    if (machineIp) url += `&machineIp=${encodeURIComponent(machineIp)}`
    const { data } = await axios.get(url)
    const logs = data.data || []
    commit('SET_LOGS', logs)
    return logs
}

// ===== SYNC =====
export async function SYNC_ATTENDANCE({ commit }, payload) {
    const { data } = await axios.post(apiConfig.ATTENDANCE_SYNC, payload)
    return data.data
}
