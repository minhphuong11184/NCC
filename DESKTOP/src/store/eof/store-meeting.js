import { v4 as uuidv4 } from "uuid";
import client from "../../utils";
import moment from "moment";

const state = {};

const mutations = {};

const actions = {
  updateMeetingRoom: async ({ commit }, payload) => {
    if (payload.id) {
      let data = await client.put("/api/v1/meetingRoom/" + payload.id, payload);
      return data.data.data;
    }
  },

  deleteMeetingRoom: async ({ commit }, payload) => {
    if (payload.id) {
      let data = await client.delete("/api/v1/meetingRoom/" + payload.id);
      return data.data.data;
    }
  },

  createMeetingRoom: async ({ commit }, payload) => {
    let data = await client.post("/api/v1/meetingRoom", payload);
    return data.data.data;
  },

  getMeetingRooms: async ({ commit }, payload) => {
    let data = await client.get("/api/v1/meetingRoom");
    return data.data.data;
  },

  getMeetingRoom: async ({ commit }, payload) => {
    let data = await client.get("/api/v1/meetingRoom/" + payload.id);
    return data.data.data;
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
