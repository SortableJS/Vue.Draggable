/**
 * @jest-environment node
 */

const { createSSRApp } = require("vue");
const { renderToString } = require("@vue/server-renderer");
const draggable = require("@/vuedraggable").default;

const app = createSSRApp({
  name: "test-app",
  template: `<draggable :list="items"><div v-for="item in items" :key="item">{{item}}</div></draggable>`,
  data: () => ({
    items: ["a", "b", "c"]
  }),
  components: {
    draggable
  }
});

let html;

describe("vuedraggable in a SSR context", () => {
  beforeEach(async () => {
    html = await renderToString(app);
  });

  it("can be rendered", () => {
    const expected =
      "<div><!--[--><div>a</div><div>b</div><div>c</div><!--]--></div>";
    expect(html).toEqual(expected);
  });
});
