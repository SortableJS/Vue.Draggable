import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

import routes from "./route";
import rawDisplayer from "./components/infra/raw-displayer";
import store from "./store";
import ElementPlus from "element-plus";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";
import "element-plus/lib/theme-chalk/index.css";

require("bootstrap");

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .component("rawDisplayer", rawDisplayer);
router.isReady().then(() => app.mount("#app"));
