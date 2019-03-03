import Vue from "vue";
window.Vue = Vue;

describe("draggable when used with script tag", () => {
  it("register draggable component", () => {
    const draggable = require("@/vuedraggable").default._Ctor[0];
    const component = Vue.component("draggable");
    expect(component).toBe(draggable);
  });
});