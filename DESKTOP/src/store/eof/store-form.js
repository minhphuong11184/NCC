import { v4 as uuidv4 } from "uuid";
import client from "../../utils";
import moment from "moment";

const state = {};

const mutations = {};

const actions = {
  insertFormRegister: async ({ commit }, payload) => {
    let data = await client.post("/api/v1/form-register", payload);
    return data.data.data;
  },
  getFormRegister: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/form-register?from=${payload.fromDate}&to=${payload.toDate}`);
    return data.data.data;
  },
  getFormRegisterById: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/form-register/form-register-by-id?formId=${payload.formId}`);
    return data.data.data;
  },
  getUserFormRegisterByFormId: async ({ commit }, payload) => {
    let data = await client.get("/api/v1/form-register/user-form-register-by-formId?formId="+payload.formId);
    return data.data.data;
  },
  getReportUserViewedForm: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/form-register/report-user-viewed?from=${payload.fromDate}&to=${payload.toDate}`);
    return data.data.data;
  },
  getReportFormDetail: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/form-register/report-form-detail?from=${payload.fromDate}&to=${payload.toDate}`);
    return data.data.data;
  },
  getUserAnswerByForm: async ({ commit }, payload) => {
    let data = await client.get(`/api/v1/form-register/user-answer-by-form?userFormId=${payload.userFormId}`);
    return data.data.data;
  },
  insertFormQuestion: async ({ commit }, payload) => {
    let data = await client.post("/api/v1/form-register/question", payload);
    return data.data.data;
  },
  insertQuestionOption: async ({ commit }, payload) => {
    let data = await client.post("/api/v1/form-register/question-option", payload);
    return data.data.data;
  },
  insertFormRoleDepartment: async ({ commit }, payload) => {
    let data = await client.post("/api/v1/form-register/form-role-department", payload);
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
