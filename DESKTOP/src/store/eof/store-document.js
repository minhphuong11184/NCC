import { v4 as uuidv4 } from "uuid";
import client from "../../utils";

const state = {
 
};

const mutations = {
  
};

const actions = {
    getDocument:async({ commit}, payload)=>{
        console.log('getDocument');
        let data = await client.get("/api/v2/document?account="+ payload.account);
        return data.data
    },
    importDocument:async({ commit}, payload)=>{
        console.log('importDocument');
        let data = await client.import("/api/v2/document",payload)
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