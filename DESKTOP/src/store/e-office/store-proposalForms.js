import { v4 as uuidv4 } from "uuid";
import client from "../../utils";
import { api } from "../../ultils/api";

const state = {
    proposalForm: {},
    proposalForms: {
        data: []
    },
    accountForms: null
};

const mutations = {
    getAllAccountForms: async(state, accountId) => {
        let res = await client.get(api.ACCOUNTFORMS + accountId);
        state.accountForms = res.data;
    },
    syncAccountForm: async(state, payload) => {
        let res = await client.put(api.ACCOUNTFORMS + payload.accountId, payload);
        return res.data;
    },
    deleteProposalForm(state, id) {
        let index = state.proposalForms.data.findIndex(item => item.id === id);
        state.proposalForms.data.splice(index, 1);
    },

    addProposalForm(state, payload) {
        state.proposalForms.data.push(payload.data);
    },

    getAllProposalForms: async state => {
        let data = await client.get(api.PROPOSALFORMS);
        if (data) state.proposalForms = data.data;
        return state.proposalForms;
    },

    createProposalForm: async(state, e) => {
        let payload = {
            ...e.data
        };
        delete payload.id;
        console.log(payload);
        let data = await client.post(api.PROPOSALFORMS, payload);
        // if(data.data)
        console.log(data);
    },
    updateProposalForm: async(state, e) => {
        let payload = {
            ...e.data
        };
        delete payload.id;
        console.log(e.key);
        let data = await client.put(api.PROPOSALFORMS + "/" + e.key, payload);
        if (data.data) e.data = data.data;
    },

    resetProposalForm(state, payload) {
        state.proposalForm = {
            id: "",
            number: 0,
            userId: "",
            approvalableId: "",
            approvalableType: "",
            costcenterId: "",
            companyId: "TH",
            title: "",
            status: "",
            showMessages: true,
            isDisable: false,
            ...payload
        };
    },

    selectProposalForm: (state, proposalForm) =>
        (state.proposalForm = proposalForm),
    setProposalForms: (state, proposalForms) =>
        (state.proposalForms = proposalForms),

    deleteProposalForm: async(state, payload) => {
        let data = await client.delete(api.PROPOSALFORMS + "/" + payload.key);
        console.log(data);
    }
};

const actions = {
    syncAccountForm: async({ commit }, payload) => {
        let data = await commit("syncAccountForm", payload);
        return data;
    },
    getAllAccountForms: async({ commit }, payload) => {
        let res = await client.get(api.ACCOUNTFORMS + payload);
        return res.data;
    },

    selectProposalForm: async({ commit }) => {
        let data = await client.get("/api/v2/formRequests");
        return data;
    },

    // selectProposalForm: async({ commit }, id) => {
    //     let data = await client.delete(api.PROPOSALFORMS + id);
    //     if (data) commit("deleteProposalForm", id);
    // },

    addProposalForm: async({ commit }, proposalForm) => {
        if (proposalForm.id) {
            let data = await client.put(
                api.PROPOSALFORMS + proposalForm.id,
                proposalForm
            );
            if (data) proposalForm = data.data;
        } else {
            console.log(proposalForm);
            let data = await client.post(api.PROPOSALFORMS, {
                ...proposalForm,
                id: uuidv4()
            });
            console.log(data);
            if (data) commit("addProposalForm", data.data);
        }
    },
    onRowInserted: async({ commit }, payload) => {
        let data = await commit("createProposalForm", payload);
        if (data.data) data = commit("getAllProposalForms");
        return data.data;
    },
    onRowUpdated: ({ commit }, e) => {
        // console.log(e)
        commit("updateProposalForm", e);
    },
    onRowRemoved: async({ commit }, payload) => {
        let data = await commit("deleteProposalForm", payload);
        if (data.data) return await commit("getAllProposalForms");
    },

    getAllProposalForms: async({ commit }) => {
        commit("getAllProposalForms");
    },

    resetProposalForm({ commit }, payload) {
        commit("resetProposalForm", payload);
    }
};

const getters = {
    proposalForms: state => {
        return state.proposalForms;
    },
    proposalForm: state => {
        return state.proposalForm;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};