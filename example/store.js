import { nestedA } from "./components/nested/nested1";
import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  modules: {
    nestedA
  }
});
