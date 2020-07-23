import { nested } from "./components/nested/nested-store";
import { createStore } from "vuex";

export default createStore({
  namespaced: true,
  modules: {
    nested
  }
});
