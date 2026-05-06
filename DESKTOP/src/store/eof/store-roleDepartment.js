import { v4 as uuidv4 } from "uuid";
import client from "../../utils";
import moment from "moment";

const state = {};

const mutations = {};

const actions = {
  getBophanLamViec: async ({ commit }, id) => {
    let data = await client.get(`/api/v1/role-department/role?accountId=${id}`);
    return data.data.data;
  },
  getAccountByDepartmentId: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/role-department/account-by-department?departmentId=${payload.departmentId}`);
    return data.data.data;
  },
  getPosition: async ({ commit }) => {
    let data = await client.get(`/api/v1/role-department/position`);
    return data.data.data;
  },
  getUser: async ({ commit }) => {
    let data = await client.get(`/api/v1/role-department/user`);
    return data.data.data;
  },
  insertRoleDepartment: async ({ commit }, payload) => {
    let data = await client.post(`/api/v1/role-department`, payload);
    return data.data.data;
  },
  deleteRoleDepartmentByDepartmentId: async ({ commit }, payload) => {
    let data = await client.post(`/api/v1/role-department/delete-by-department`, payload);
    return data.data.data;
  },
  updateRoleDepartment: async ({ commit }, payload) => {
    let data = await client.put(`/api/v1/role-department`, payload);
    return data.data.data;
  },
  updateDeskManagerInRoleDepartment: async ({ commit }, payload) => {
    let data = await client.put(`/api/v1/role-department/desk-manager`, payload);
    return data.data.data;
  },
  deleteRoleDepartment: async ({ commit }, id) => {
    let data = await client.delete(`/api/v1/role-department/`+id);
    return data.data.data;
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
