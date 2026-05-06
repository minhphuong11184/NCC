import { v4 as uuidv4 } from "uuid";
import client from "../../utils";

const state = {
    orders: {},
    requests: [],
    messages: [],
    orderMeta: {},
    order: {},
    metaValue: []
};

const mutations = {
    setRequests(state, payload) {
        state.requests = payload;
    },

    getAllCars: (state, payload) => {
        state.cars = payload;
    },

    addMessage(state, payload) {
        state.order.Messages.push(payload.data);
    },
    deleteOrder(state, id) {
        let index = state.orders.data.findIndex(item => item.id === id);
        state.orders.data.splice(index, 1);
    },

    addOrder(state, payload) {
        state.orders.data.push(payload.data);
        state.order = payload.data;
    },

    resetOrder(state, payload) {
        state.order = {
            ...state.order,
            id: "",
            costcenterId: "e378f3b1-9e35-4090-bc0a-92297d41a9e3",
            companyId: "c4ced5f1-06bb-49ed-bbf0-cfd3732bb696",
            code: "202011/8TH",
            name: "Phiếu đề xuất mua hàng",
            note: "Mô tả đề xuất nếu có",
            status: "Mới",
            completed: false,
            ...payload
        };
    },

    selectOrder: (state, order) => {
        state.order = order;
        state.metaValue = JSON.parse(order.OrderMeta[0].metaValue);
    },
    setOrders: (state, orders) => (state.orders = orders),
    resetRequests: (state, payload) => {
        let tmp = [];
        let nextId = null;
        state.requests.forEach(item => {
            let id = uuidv4();
            item = {
                ...payload,
                ...item,
                id,
                nextId,
                orderableType: "order"
            };
            tmp.push(item);
            nextId = id;
        });
        state.requests = tmp;
    },

    setRequest: (state, payload) => {
        state.order.Requests = payload;
    }
};

const actions = {
    resetRequests: async({ commit }, payload) => {
        await commit("resetRequests", payload);
    },

    getAllRequests: async({ commit }, approvalableId) => {
        let data = await client.get(
            "/api/v1/approval-steps/?approvalableId=" + approvalableId
        );
        if (data) {
            await commit("setRequests", data.data.data);
        }
    },

    selectOrder({ commit }, payload) {
        commit("selectOrder", payload);
    },

    deleteOrder: async({ commit }, id) => {
        let data = await client.delete("/api/v1/orders/" + id);
        if (data) commit("deleteOrder", id);
    },
    addMessage: async({ commit }, message) => {
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

    addOrder: async({ commit }, order) => {
        delete order.OrderLines;
        delete order.Requests;
        delete order.Messages;
        delete order.number;
        delete order.OrderMeta;
        if (order.id) {
            let data = await client.put("/api/v1/orders/" + order.id, order);
            if (data) order = data.data;
        } else {
            console.log(order);
            let data = await client.post("/api/v1/orders/", {
                ...order,
                id: uuidv4()
            });
            console.log(data);
            if (data) commit("addOrder", data.data);
            return data.data;
        }
    },
    getAllOrders: async({ commit }, accountId) => {
        let data = await client.get("/api/v1/orders/?accountId=" + accountId);
        if (data) commit("setOrders", data.data);
    },
    getAllOrder: async({ commit }) => {
        let data = await client.get("/api/v2/orders/getAllOrders");
        return data.data;
    },
    searchOrder: async({ commit }, payload) => {
        let data = await client.post("/api/v2/orders/getAllOrders?dateStart=" + payload.dateStart + "&dateEnd=" + payload.dateEnd);
        return data.data;
    },
    getOneOrder: async({ commit }, id) => {
        let data = await client.get("/api/v1/orders/" + id);
        if (data) commit("selectOrder", data.data.data);
        return data;
    },

    activeSeenOrder: async({ commit }, payload) => {
        let data = await client.post(`/api/v2/orders/${payload.id}/activeSeen?activeSeen=${payload.activeSeen}`);
        return data;
    },
    activeSuccessOrder: async({ commit }, payload) => {
        let data = await client.post(`/api/v2/orders/${payload.id}/activeSuccess?activeSuccess=${payload.activeSuccess}&nameSuccess=${payload.nameSuccess}`);
        return data;
    },

    resetOrder({ commit }, payload) {
        commit("resetOrder", payload);
    },

    getAllCars: async({ commit }) => {
        let { data } = await client.get("/api/v3/cars");
        if (data) commit("getAllCars", data.data);
    },

    sendToApproved: async({ commit }, payload) => {
        console.log("send request");
        console.log(payload);
        let data = await client.import("/api/v1/requests/import", payload);
        if (data) commit("setRequest", data.data.data);
    },
    getAllAccounts: async({ commit }) => {
        let { data } = await client.get("/api/v3/accounts/raw");
        return data.data;
    },
};

const getters = {
    orders: state => {
        return state.orders;
    },
    requests: state => {
        return state.requests;
    },
    messages: state => {
        return state.order.Messages;
    },
    order: state => {
        return state.order;
    },
    metaValue: state => {
        return state.metaValue;
    },
    cars: state => state.cars,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};