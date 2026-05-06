import { v4 as uuidv4 } from "uuid";
import client from "../../utils";

const state = {
 
};

const mutations = {
  
};

const actions = {
    selectRequest({ commit }, payload) {
        commit("selectRequest", payload);
    },

    deleteRequest: async({ commit }, orderId) => {
        console.log('deleteRequest')
        let data = await client.put("/api/v1/requests?orderId=" + orderId);
        if (data) {
            commit("deleteRequest", data.data);
        }
    },
    getAllDataDashboard:async({ commit}, payload)=>{
        console.log('getAllDataDashboard');
        let data = await client.post("/api/v1/reportDashboard",payload)
        return data.data
    }

};

const getters = {
  
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};