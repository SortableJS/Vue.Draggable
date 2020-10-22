import { nested } from "./components/nested/nested-store";
import { createStore } from "vuex";

const store = createStore({
  namespaced: true,
  modules: {
    nested
  }
});

export default store;
