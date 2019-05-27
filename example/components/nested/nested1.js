import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export const nestedA = {
  namespaced: true,
  state: {
    elements: [
      {
        id: 1,
        name: "Shrek",
        elements: []
      },
      {
        id: 2,
        name: "Fiona",
        elements: [
          {
            id: 4,
            name: "King",
            elements: []
          },
          {
            id: 5,
            name: "Queen",
            elements: []
          }
        ]
      },
      {
        id: 3,
        name: "Donkey",
        elements: []
      }
    ]
  },
  mutations: {
    updateElements: (state, payload) => {
      state.elements = payload;
    }
  },
  actions: {
    updateElements: ({ commit }, payload) => {
      commit("updateElements", payload);
    }
  }
}