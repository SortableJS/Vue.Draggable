/**
 * @jest-environment node
 */

const { createSSRApp } = require("vue");
const { renderToString } = require("@vue/server-renderer");
const draggable = require("@/vuedraggable").default;

const app = createSSRApp({
  name: "test-app",
  template: `<draggable :list="items" :item-key="k => k"><template #item="{element}"><div>{{element}}</div></template></draggable>`,
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
    const expected =`<div><div data-draggable="true">a</div><div data-draggable="true">b</div><div data-draggable="true">c</div></div>`;
    expect(html).toEqual(expected);
  });
});
