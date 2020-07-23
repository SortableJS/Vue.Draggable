import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import routes from "./route";

import rawDisplayer from "./components/infra/raw-displayer.vue";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.css";

require("bootstrap");

const router = createRouter({
  history: createWebHistory(),
  routes
});

createApp(App)
  .use(router)
  .use(store)
  .component("rawDisplayer", rawDisplayer)
  .mount("#app");
