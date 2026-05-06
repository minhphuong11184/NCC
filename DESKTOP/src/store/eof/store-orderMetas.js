import { v4 as uuidv4 } from "uuid";
import client from "../../utils";
import moment from "moment";

const state = {
    orderMeta: {},
    orderMetas: {},
    orderLine: {},
    orderLines: []
};

const mutations = {
    deleteOrderLine(state, id) {
        let index = state.orderLines.data.findIndex(item => item.id === id);
        state.orderLines.data.splice(index, 1);
    },

    addorderLine(state, payload) {
        state.orderLines.push(payload);
    },

    resetOrderLine(state, payload) {
        state.orderLine = {
            id: "",
            userId: "ae3ce99b-f31b-458a-9d8f-2eea180b8cf1",
            orderId: "7796648b-04fd-499e-b3c9-fbcde224240b",
            costcenterId: "e378f3b1-9e35-4090-bc0a-92297d41a9e3",
            companyId: "c4ced5f1-06bb-49ed-bbf0-cfd3732bb696",
            unitId: "1339e151-f315-4a37-926c-7eb6d18741b5",
            code: "TEST",
            name: "TEST",
            title: "Kỹ Thuật",
            startedAt: moment()
                .format()
                .slice(0, 10),
            finishedAt: moment()
                .format()
                .slice(0, 10),
            quantity: 0,
            note: "Lý do yêu cầu",
            status: "Mới",
            ...payload
        };
    },

    selectOrderLine: (state, orderLine) => (state.orderLine = orderLine),
    setOrderLines: (state, orderLines) => (state.orderLines = orderLines),
    //TODO
    saveOrderMeta: async state => {
        state.orderMeta.metaValue = await JSON.stringify(state.orderLines);
        let result = await client.put(
            "/api/v1/order-metas/" + state.orderMeta.id,
            state.orderMeta
        );
        if (result) {
            state.orderMeta = result.data.data;
            // state.orderLines = JSON.parse(result.data.data.metaValue);
        }
    },
    deleteOrderMeta(state, id) {
        let index = state.orderMetas.data.findIndex(item => item.id === id);
        state.orderMetas.data.splice(index, 1);
    },

    addorderMeta(state, payload) {
        console.log("Add Order Meta");
        console.log(payload);
        // state.orderMetas.data.push(payload.data);
    },

    resetOrderMeta(state) {
        state.orderMeta = {
            ...state.orderMeta,
            id: "",
            userId: "ae3ce99b-f31b-458a-9d8f-2eea180b8cf1",
            orderId: "7796648b-04fd-499e-b3c9-fbcde224240b",
            costcenterId: "e378f3b1-9e35-4090-bc0a-92297d41a9e3",
            companyId: "c4ced5f1-06bb-49ed-bbf0-cfd3732bb696",
            unitId: "1339e151-f315-4a37-926c-7eb6d18741b5",
            code: "TEST",
            name: "TEST",
            title: "Kỹ Thuật",
            startedAt: moment()
                .format()
                .slice(0, 10),
            finishedAt: moment()
                .format()
                .slice(0, 10),
            quantity: 0,
            note: "Lý do yêu cầu",
            status: "Mới"
        };
    },

    selectOrderMeta: (state, orderMeta) => (state.orderMeta = orderMeta),
    setOrderMetas: (state, orderMetas) => (state.orderMetas = orderMetas)
};

const actions = {
    selectOrderLine({ commit }, payload) {
        commit("selectOrderLine", payload);
    },

    deleteOrderLine: async({ commit }, id) => {
        commit("deleteOrderLine", id);
    },

    addorderLine: async({ commit }, orderLine) => {
        if (orderLine.id) {} else {
            commit("addorderLine", orderLine);
        }
        commit("saveOrderMeta");
    },
    getAllOrderLines: async({ commit }, payload) => {
        commit("setOrderLines", payload);
    },

    resetOrderLine({ commit }, payload) {
        commit("resetOrderLine", payload);
    },
    //TODO
    selectOrderMeta({ commit }, payload) {
        commit("selectOrderMeta", payload);
    },

    deleteOrderMeta: async({ commit }, id) => {
        let data = await client.delete("/api/v1/order-metas/" + id);
        return data;
        // if (data) commit("deleteOrderMeta", id);
    },

    deleteOrderMetaDetail: async({ commit }, id) => {
        let data = await client.put("/api/v1/order-metas?orderId=" + id);
        return data;
    },

    updateOrderMeta: async({ commit }, orderMeta) => {
        if (orderMeta.id) {
            let data = await client.put(
                "/api/v1/order-metas/" + orderMeta.id,
                orderMeta
            );
            if (data) commit("selectOrderMeta", data.data.data);
        }
    },
    taoOrderMeta: async({ commit }, orderMeta) => {
        console.log(orderMeta);
        let data = await client.post("/api/v1/order-metas/", {
            ...orderMeta,
            id: uuidv4()
        });
        console.log(data);
        if (data) commit("addorderMeta", data.data);
    },
    addorderMeta: async({ commit }, orderMeta) => {
        if (!orderMeta.id) {
            let data = await client.put(
                "/api/v1/order-metas/" + orderMeta.id,
                orderMeta
            );
            if (data) commit("selectOrderMeta", data.data.data);
        } else {
            console.log(orderMeta);
            let data = await client.post("/api/v1/order-metas/", {
                ...orderMeta,
                id: uuidv4()
            });
            console.log(data);
            if (data) commit("addorderMeta", data.data);
        }
    },
    getAllOrderMetas: async({ commit }) => {
        let data = await client.get("/api/v1/order-metas/");
        if (data) commit("setOrderMetas", data.data);
    },

    getOneOrderMeta: async({ commit }, id) => {
        let data = await client.get("/api/v1/order-metas/" + id);
        if (data) commit("selectOrderMeta", data.data.data);
        return data;
    },

    resetOrderMeta({ commit }) {
        commit("resetOrderMeta");
    }
};

const getters = {
    orderLine: state => {
        return state.orderLine;
    },
    orderMetas: state => {
        return state.orderMetas;
    },
    orderMeta: state => {
        return state.orderMeta;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};