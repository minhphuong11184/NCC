// import { v4 as uuidv4 } from "uuid";
import client from "../../utils";

const state = {
  cars: []
};

const mutations = {
  getAllCars: async (state, cars) => {
    state.cars = cars;
  },
  addCar: (state, car) => {
    state.cars.push(car);
  },
  updateCar: async (state, car) => {
    let foundCar = await state.cars.find(x => x.id === car.id);
    if (foundCar) Object.assign(foundCar, car);
  },
  removeCar: async (state, key) => {
    let index = await state.cars.findIndex(x => x.id === key);
    if (index !== -1) state.cars.splice(index, 1);
  }
};

const actions = {
  getAllCars: async ({ commit }) => {
    const { data } = await client.get("/api/v2/cars");
    if (data) await commit("getAllCars", data.data);
  },
  addCar: async ({ commit }, values) => {
    const { data } = await client.post("/api/v2/cars", values);
    if (data) await commit("addCar", data.data);
  },
  updateCar: async ({ commit }, payload) => {
    const { key, values } = payload;
    const { data } = await client.put(`/api/v2/cars/${key}`, values);
    if (data) commit("updateCar", data.data);
  },
  removeCar: async ({ commit }, key) => {
    const { data } = await client.delete(`/api/v2/cars/${key}`);
    if (data) commit("removeCar", key);
  }
};

const getters = {
  cars: state => state.cars
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
