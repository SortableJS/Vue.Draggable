/**
 * @jest-environment node
 */

const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();
const draggable = require("@/vuedraggable").default;
Vue.component('draggable', draggable);
const app = new Vue({
  name: "test-app",
  template: `<draggable :list="items"><div v-for="item in items" :key="item"></div></draggable>`,
  data:{
    items:["a","b","c"]
  }
});

let html;

describe("vuedraggable in a SSR context", () => {
  beforeEach(async () => {
    html = await renderer.renderToString(app);
  });

  it("can be rendered", () => {
    expect(html).not.toBeNull();
  })
})