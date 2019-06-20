import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./route";
import rawDisplayer from "./components/infra/raw-displayer.vue";
import ElementUI from "element-ui";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";

require("bootstrap");

const router = new VueRouter({
  routes
});

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.component("rawDisplayer", rawDisplayer);
Vue.use(ElementUI);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
