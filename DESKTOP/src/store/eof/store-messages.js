import { v4 as uuidv4 } from "uuid";
import client from "../../utils";

const state = {
  message: {},
  messages: {}
};

const mutations = {
  deleteMessage(state, id) {
    let index = state.messages.data.findIndex(item => item.id === id);
    state.messages.data.splice(index, 1);
  },

  addMessage(state, payload) {
    state.messages.data.push(payload.data);
  },

  resetMessage(state) {
    state.message = {
      ...state.message.data,
      id: "",
      code: "",
      name: ""
    };
  },

  selectMessage: (state, message) => (state.message = message),
  setMessages: (state, messages) => (state.messages = messages)
};

const actions = {
  selectMessage({ commit }, payload) {
    commit("selectMessage", payload);
  },

  deleteMessage({ commit }, id) {
    commit("deleteMessage", id);
  },

  addMessage: async ({ commit }, message) => {
    if (message.id) {
      let data = await client.put("/api/v1/messages/" + message.id, message);
      if (data) message = data.data;
    } else {
      console.log(message);
      let data = await client.post("/api/v1/messages/", {
        ...message,
        id: uuidv4()
      });
      console.log(data);
      if (data) commit("addMessage", data.data);
    }
  },
  getAllMessages: async ({ commit }) => {
    let data = await client.get("/api/v1/messages/");
    if (data) commit("setMessages", data.data);
  },

  resetMessage({ commit }) {
    commit("resetMessage");
  },

  sendErrorTimeMail: async ({ commit },payload) => {
    let data = await client.post("/api/v1/send-mail-errorTime",payload);
    return data;
  },  
  sendPaySplitMail: async ({ commit },payload) => {
    let data = await client.post("/api/v1/send-mail-payslip",payload);
    return data;
  },  
  sendNotificationMail: async ({ commit },payload) => {
    let data = await client.post("/api/v1/send-mail", payload);
    return data;
  },  

};

const getters = {
  messages: state => {
    return state.messages;
  },
  message: state => {
    return state.message;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
