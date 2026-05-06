import { v4 as uuidv4 } from "uuid";
import client from "../../utils";

const state = {
    calendarWork: {},
    calendarWorks: {}
};

const mutations = {
    deleteCalendarWork(state, id) {
        let index = state.calendarWorks.data.findIndex(item => item.id === id);
        state.calendarWorks.data.splice(index, 1);
    },

    addCalendarWork(state, payload) {
        state.calendarWorks.data.push(payload.data);
    },

    resetCalendarWorks(state) {
        state.calendarWorks = {
            ...state.calendarWorks.data,
            id: "",
            code: "",
            name: ""
        };
    },

    selectCalendarWork: (state, calendarWork) => (state.calendarWork = calendarWork),
    setCalendarWorks: (state, calendarWorks) => (state.calendarWorks = calendarWorks)
};

const actions = {
    selectCalendarWork({ commit }, payload) {
        commit("selectCalendarWork", payload);
    },

    deleteCalendarWork({ commit }, id) {
        commit("deleteCalendarWork", id);
    },

    addCalendarWork: async({ commit }, calendarWork) => {
        if (calendarWork.id) {
            let data = await client.put("/api/v1/calendarWork/" + calendarWork.id, calendarWork);
            if (data) calendarWork = data.data;
        } else {
            console.log(calendarWork);
            let data = await client.post("/api/v1/calendarWork/", {
                ...calendarWork
            });
            console.log(data);
            if (data) commit("addCalendarWork", data.data);
        }
    },
    getAllCalendarWork: async({ commit }) => {
        let data = await client.get("/api/v1/calendarWork/");
        if (data) commit("setCalendarWorks", data.data);
    },

    resetCalendarWork({ commit }) {
        commit("resetCalendarWork");
    }
};

const getters = {
    calendarWork: state => {
        return state.calendarWork;
    },
    calendarWorks: state => {
        return state.calendarWorks;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};