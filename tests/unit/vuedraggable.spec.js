import { mount, config } from "@vue/test-utils";
import Sortable from "sortablejs";
jest.genMockFromModule("sortablejs");
jest.mock("sortablejs");
const SortableFake = {
  destroy: jest.fn(),
  option: jest.fn()
};
Sortable.mockImplementation(() => SortableFake);
import draggable from "@/vuedraggable";
import { nextTick, h } from "vue";

import Fake from "./helper/FakeRoot.js";
import DraggableOption from "./helper/DraggableOption.vue";
import FakeFunctional from "./helper/FakeFunctionalComponent.js";

let wrapper;
let vm;
let props;
let items;
let item;
let element;
let input;
const initialRender =
  "<div><header></header><div>a</div><div>b</div><div>c</div><footer></footer></div>";
const initialRenderRaw = "<div><div>a</div><div>b</div><div>c</div></div>";
const initialRenderTransition =
  "<div><transition-group><div>a</div><div>b</div><div>c</div></transition-group></div>";

function normalizeHTML(wrapper) {
  return wrapper.html().replace(/(\r\n\t|\n|\r\t| )/gm, "");
}

function expectHTML(wrapper, expected) {
  const htmlStripped = normalizeHTML(wrapper);
  expect(htmlStripped).toEqual(expected);
}

function getEvent(name) {
  return Sortable.mock.calls[0][1][name];
}

function resetMocks() {
  Sortable.mockClear();
  SortableFake.destroy.mockClear();
  SortableFake.option.mockClear();
}

describe("draggable.vue when initialized with list", () => {
  beforeEach(() => {
    resetMocks();

    items = ["a", "b", "c"];
    wrapper = mount(draggable, {
      props: {
        list: items
      },
      attrs: {
        sortableOption: "value",
        "to-be-camelized": true
      },
      slots: {
        default: () => items.map(item => h("div", { key: item }, item)),
        header: () => h("header"),
        footer: () => h("footer")
      }
    });
    vm = wrapper.vm;
    props = vm.$options.props;
    element = wrapper.element;
  });

  describe("when initialized with incorrect props", () => {
    const { error } = console;
    const { warn } = console;

    beforeEach(() => {
      console.error = jest.fn();
      console.warn = jest.fn();
    });

    afterEach(() => {
      console.error = error;
      console.warn = warn;
    });

    it("log an error when list and value are both not null", () => {
      wrapper = mount(draggable, {
        props: {
          list: [],
          modelValue: []
        },
        slots: {
          default: () => []
        }
      });
      expect(console.error).toBeCalledWith(
        "modelValue and list props are mutually exclusive! Please set one or another."
      );
    });
  });

  it("instantiate without error", () => {
    expect(wrapper).not.toBeUndefined();
  });

  it("has draggable name", () => {
    expect(vm.name).not.toBe("draggable");
  });

  test.each([
    [
      "list",
      {
        type: Array,
        required: false,
        default: null
      }
    ],
    [
      "modelValue",
      {
        type: Array,
        required: false,
        default: null
      }
    ],
    [
      "tag",
      {
        type: String,
        default: "div"
      }
    ],
    [
      "move",
      {
        type: Function,
        default: null
      }
    ],
    [
      "componentData",
      {
        type: Object,
        required: false,
        default: null
      }
    ]
  ])("should have props %s equal to %j", (name, expectedValue) => {
    const { type, required, default: _default } = props[name];
    expect({ type, required, default: _default }).toEqual(expectedValue);
  });

  it("has a clone props, defaulting with identity function", () => {
    const expected = {};
    const { clone } = props;
    expect(clone.type).toBe(Function);
    expect(clone.default(expected)).toBe(expected);
  });

  it("renders root element correctly", () => {
    expect(normalizeHTML(wrapper)).toMatch(/^<div>.*<\/div>$/);
  });

  it("renders footer slot element correctly", () => {
    expect(normalizeHTML(wrapper)).toMatch(/<footer><\/footer><\/div>$/);
  });

  it("renders header slot element correctly", () => {
    expect(normalizeHTML(wrapper)).toMatch(/^<div><header><\/header>/);
  });

  it("renders default slot element correctly", () => {
    expect(normalizeHTML(wrapper)).toContain(
      "<div>a</div><div>b</div><div>c</div>"
    );
  });

  it("renders correctly", () => {
    expectHTML(wrapper, initialRender);
  });

  describe.each(["ul", "span", "div"])("considering a tag %s", tag => {
    beforeEach(() => {
      wrapper = mount(draggable, {
        props: { tag }
      });
    });

    it("renders tag as root element", () => {
      const expectedRegex = new RegExp(`^<${tag}>.*<\/${tag}>$`);
      expect(wrapper.html()).toMatch(expectedRegex);
    });

    it("set noneFunctional to false ", () => {
      const {
        componentStructure: { noneFunctional }
      } = vm;
      expect(noneFunctional).toBe(false);
    });
  });

  it("computes indexes", async () => {
    await nextTick();
    expect(vm.componentStructure.visibleIndexes).toEqual([-1, 0, 1, 2, 3]);
  });

  it("set realList", () => {
    expect(vm.realList).toEqual(["a", "b", "c"]);
  });

  describe("when using component as tag", () => {
    beforeEach(() => {
      input = jest.fn();
      wrapper = mount(draggable, {
        slots: {
          default: () => []
        },
        props: {
          tag: "component-tag",
          componentData: {
            on: {
              ["update:modelValue"]: input
            },
            attrs: {
              attribute1: "value1"
            },
            props: {
              prop1: "info",
              prop2: true
            }
          }
        },
        global: {
          components: {
            "component-tag": Fake
          }
        }
      });
    });

    it("instantiate child component", async () => {
      const child = wrapper.findComponent(Fake);
      expect(child).not.toBeNull();
    });

    it("pass data to tag child", async () => {
      const fakeChild = wrapper.findComponent(Fake);
      expect(fakeChild.props("prop1")).toEqual("info");
    });

    it("pass event listener to tag child", async () => {
      const child = wrapper.findComponent(Fake);
      const evt = { data: 33 };
      child.vm.$emit("update:modelValue", evt);
      expect(input).toHaveBeenCalledWith(evt);
    });

    it("pass attributes to tag child", async () => {
      const child = wrapper.findComponent(Fake);
      const attrValue = child.attributes("attribute1");
      expect(attrValue).toEqual("value1");
    });
  });

  describe("when using component as tag without event listener", () => {
    beforeEach(() => {
      input = jest.fn();
      wrapper = mount(draggable, {
        slots: {
          default: () => []
        },
        props: {
          tag: "component-tag",
          componentData: {
            attrs: {
              attribute1: "value1"
            },
            props: {
              prop1: "info",
              prop2: true
            }
          }
        },
        global: {
          components: {
            "component-tag": Fake
          }
        }
      });
    });

    it("instantiate child component", async () => {
      const child = wrapper.findComponent(Fake);
      expect(child).not.toBeNull();
    });

    it("pass data to tag child", async () => {
      const fakeChild = wrapper.findComponent(Fake);
      expect(fakeChild.props("prop1")).toEqual("info");
    });

    it("pass attributes to tag child", async () => {
      const child = wrapper.findComponent(Fake);
      const attrValue = child.attributes("attribute1");
      expect(attrValue).toEqual("value1");
    });
  });

  describe("when creating a component", () => {
    test.each([
      ["Fake", true, Fake],
      ["FakeFunctional", false, FakeFunctional]
    ])(
      "when using component with tag %p compute noneFunctionalComponentMode as %p ",
      (_, expectedNoneFunctionalComponentMode, component) => {
        wrapper = mount(draggable, {
          propsData: {
            tag: "child"
          },
          slots: {
            default: () => []
          },
          global: {
            components: {
              child: component
            }
          }
        });
        const {
          vm: {
            componentStructure: { noneFunctional }
          }
        } = wrapper;
        expect(noneFunctional).toBe(expectedNoneFunctionalComponentMode);
      }
    );
  });

  it("keeps a reference to Sortable instance", () => {
    expect(vm._sortable).toBe(SortableFake);
  });

  it("creates sortable instance with options", () => {
    expect(Sortable.mock.calls.length).toBe(1);
    const parameters = Sortable.mock.calls[0];
    expect(parameters[0]).toBe(element);
    expect(parameters[1]).toMatchObject({
      draggable: ">*",
      sortableOption: "value",
      toBeCamelized: true
    });
  });

  test.each([
    ["onChoose", "choose"],
    ["onUnchoose", "unchoose"],
    ["onSort", "sort"],
    ["onFilter", "filter"],
    ["onClone", "clone"]
  ])("when event %s is emitted from sortable", async (evt, vueEvt) => {
    const callBack = getEvent(evt);
    const evtInfo = {
      data: {}
    };
    callBack(evtInfo);
    await nextTick();
    expect(wrapper.emitted()).toEqual({
      [vueEvt]: [[evtInfo]]
    });
  });

  it("creates sortable instance with options", () => {
    expect(Sortable.mock.calls.length).toBe(1);
    const parameters = Sortable.mock.calls[0];
    expect(parameters[0]).toBe(element);
    expect(parameters[1]).toMatchObject({
      draggable: ">*",
      sortableOption: "value",
      toBeCamelized: true
    });
  });

  describe("when add is called", () => {
    let newItem;
    beforeEach(async () => {
      await nextTick();
      newItem = document.createElement("div");
      const newContent = document.createTextNode("d");
      newItem.appendChild(newContent);
      newItem._underlying_vm_ = "d";
      const last = element.children[3];
      element.insertBefore(newItem, last);
      const add = getEvent("onAdd");
      add({
        item: newItem,
        newIndex: 3
      });
    });

    it("DOM changes should be reverted", async () => {
      await nextTick();
      expectHTML(wrapper, initialRender);
    });

    it("list should be updated", async () => {
      await nextTick();
      expect(vm.list).toEqual(["a", "b", "d", "c"]);
    });

    it("sends a update event", async () => {
      await nextTick();
      const expectedEvt = {
        item: newItem,
        newIndex: 3
      };
      expect(wrapper.emitted().add).toEqual([[expectedEvt]]);
    });

    it("sends a change event", async () => {
      await nextTick();
      const expectedEvt = { added: { element: "d", newIndex: 2 } };
      expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
    });
  });

  describe("when initiating a drag operation", () => {
    let evt;
    beforeEach(() => {
      item = element.children[2];
      evt = { item };
      const start = getEvent("onStart");
      start(evt);
    });

    it("sends a start event", async () => {
      await nextTick();
      expect(wrapper.emitted()).toEqual({
        start: [[evt]]
      });
    });

    it("sets context", async () => {
      await nextTick();
      expect(vm.context).toEqual({
        element: "b",
        index: 1
      });
    });

    describe("when calling onMove", () => {
      let originalEvt;
      let move;
      let doMove;

      beforeEach(() => {
        evt = {
          to: element,
          related: element.children[1],
          willInsertAfter: false
        };
        originalEvt = {
          domInfo: true
        };
        move = getEvent("onMove");
        doMove = () => move(evt, originalEvt);
      });

      it("returns true when move props is null", () => {
        const actual = doMove();
        expect(actual).toBe(true);
      });

      describe("when move is set", () => {
        let move;
        beforeEach(() => {
          move = jest.fn();
          wrapper.setProps({ move });
        });

        it("calls move with list information", () => {
          const expectedEvt = {
            draggedContext: {
              element: "b",
              futureIndex: 0,
              index: 1
            },
            relatedContext: {
              component: vm,
              element: "a",
              index: 0,
              list: ["a", "b", "c"]
            },
            to: element,
            related: element.children[1],
            willInsertAfter: false
          };
          doMove();
          expect(move.mock.calls.length).toBe(1);
          expect(move).toHaveBeenCalledWith(expectedEvt, originalEvt);
        });

        test.each([
          [1, false, 0, { element: "a", index: 0 }],
          [2, false, 1, { element: "b", index: 1 }],
          [3, false, 2, { element: "c", index: 2 }],

          // Will insert after is not taken into account if the dragging
          // element is in the target list
          [1, true, 0, { element: "a", index: 0 }],
          [2, true, 1, { element: "b", index: 1 }],
          [3, true, 2, { element: "c", index: 2 }]
        ])(
          "when context is of index %d with insert after %o has futureIndex: %d and context: %o",
          (index, willInsertAfter, futureIndex, context) => {
            evt.willInsertAfter = willInsertAfter;
            evt.related = element.children[index];

            const expectedEvt = {
              draggedContext: {
                element: "b",
                futureIndex,
                index: 1
              },
              relatedContext: {
                component: vm,
                element: context.element,
                index: context.index,
                list: ["a", "b", "c"]
              },
              to: element,
              related: element.children[index],
              willInsertAfter
            };

            doMove();
            expect(move.mock.calls.length).toBe(1);
            expect(move).toHaveBeenCalledWith(expectedEvt, originalEvt);
          }
        );

        test.each([true, false])("returns move result %o", result => {
          move.mockImplementation(() => result);
          const actual = doMove();
          expect(actual).toBe(result);
        });
      });
    });

    describe("when remove is called", () => {
      beforeEach(() => {
        element.removeChild(item);
        const remove = getEvent("onRemove");
        remove({
          item,
          oldIndex: 2
        });
      });

      it("DOM changes should be reverted", async () => {
        await nextTick();
        expectHTML(wrapper, initialRender);
      });

      it("list should be updated", async () => {
        await nextTick();
        expect(vm.list).toEqual(["a", "c"]);
      });

      it("sends a remove event", async () => {
        await nextTick();
        const expectedEvt = { item, oldIndex: 2 };
        expect(wrapper.emitted().remove).toEqual([[expectedEvt]]);
      });

      it("sends a change event", async () => {
        await nextTick();
        const expectedEvt = { removed: { element: "b", oldIndex: 1 } };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      });
    });

    describe.each([
      [1, ["b", "a", "c"]],
      [3, ["a", "c", "b"]]
    ])(
      "when update is called with new index being %i",
      (index, expectedList) => {
        beforeEach(() => {
          const firstDraggable = element.children[index];
          element.removeChild(item);
          element.insertBefore(item, firstDraggable);
          const update = getEvent("onUpdate");
          update({
            item,
            oldIndex: 2,
            newIndex: index,
            from: element
          });
        });

        it("DOM changes should be reverted", async () => {
          await nextTick();
          expectHTML(wrapper, initialRender);
        });

        it("list should be updated", async () => {
          await nextTick();
          expect(vm.list).toEqual(expectedList);
        });

        it("sends a update event", async () => {
          await nextTick();
          const expectedEvt = {
            item,
            oldIndex: 2,
            newIndex: index,
            from: element
          };
          expect(wrapper.emitted().update).toEqual([[expectedEvt]]);
        });

        it("sends a change event", async () => {
          await nextTick();
          const expectedEvt = {
            moved: { element: "b", oldIndex: 1, newIndex: index - 1 }
          };
          expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
        });
      }
    );

    describe("when sending DragEnd", () => {
      let endEvt;
      beforeEach(() => {
        endEvt = {
          data: "data"
        };
        const onEnd = getEvent("onEnd");
        onEnd(endEvt);
      });

      it("sends a update event", async () => {
        await nextTick();
        expect(wrapper.emitted().end).toEqual([[endEvt]]);
      });
    });
  });

  describe("when re-rendering", () => {
    const updatedRender= "<div><header></header><div>a</div><div>b</div><div>c</div><div>d</div><footer></footer></div>";
    beforeEach(async () => {
      items.push("d");
      wrapper.setProps({
        list: [...items]
      });
      vm.$forceUpdate();
      await nextTick();
    });

    it("updates the rendered elements", () => {
      expect(wrapper.html()).toEqual(updatedRender);
    });

    it("updates indexes", async () => {
      await nextTick();
      expect(vm.componentStructure.visibleIndexes).toEqual([-1, 0, 1, 2, 3, 4]);
    });
  });

  describe("when initiating a drag operation in clone context", () => {
    let evt;
    beforeEach(() => {
      resetMocks();
      wrapper = mount(draggable, {
        props: {
          list: items
        },
        slots: {
          default: () => items.map(item => h("div", { key: item }, item))
        }
      });
      vm = wrapper.vm;
      element = wrapper.element;
      item = element.children[1];
      evt = { item };
      const start = getEvent("onStart");
      start(evt);
    });

    describe("when remove is called", () => {
      beforeEach(() => {
        var clone = item.cloneNode(true);
        wrapper.element.insertBefore(clone, item);
        wrapper.element.removeChild(item);
        const remove = getEvent("onRemove");
        remove({
          item,
          clone,
          pullMode: "clone",
          oldIndex: 1
        });
      });

      it("DOM changes should be reverted", async () => {
        await nextTick();
        expectHTML(wrapper, initialRenderRaw);
      });

      it("list should be not updated", async () => {
        await nextTick();
        expect(vm.list).toEqual(["a", "b", "c"]);
      });

      it("sends a remove event", async () => {
        await nextTick();
        expect(wrapper.emitted().remove).toEqual([
          [
            {
              item,
              clone: item,
              pullMode: "clone",
              oldIndex: 1
            }
          ]
        ]);
      });

      it("does not send a change event", async () => {
        await nextTick();
        expect(wrapper.emitted().change).toBeUndefined();
      });
    });
  });

  describe("when initiating a drag operation in clone context using a pull function", () => {
    let evt;
    beforeEach(() => {
      resetMocks();
      wrapper = mount(draggable, {
        props: {
          list: items
        },
        attrs: {
          group: { pull: () => "clone" }
        },
        slots: {
          default: () => items.map(item => h("div", { key: item }, item))
        }
      });
      vm = wrapper.vm;
      element = wrapper.element;
      item = element.children[1];
      evt = { item };
      const start = getEvent("onStart");
      start(evt);
    });

    describe("when remove is called", () => {
      beforeEach(() => {
        var clone = item.cloneNode(true);
        wrapper.element.insertBefore(clone, item);
        wrapper.element.removeChild(item);
        const remove = getEvent("onRemove");
        remove({
          item,
          clone,
          pullMode: "clone",
          oldIndex: 1
        });
      });

      it("DOM changes should be reverted", async () => {
        await nextTick();
        expectHTML(wrapper, initialRenderRaw);
      });

      it("list should be not updated", async () => {
        await nextTick();
        expect(vm.list).toEqual(["a", "b", "c"]);
      });

      it("does not send a remove event", async () => {
        await nextTick();
        expect(wrapper.emitted().remove).toEqual([
          [
            {
              item,
              clone: item,
              pullMode: "clone",
              oldIndex: 1
            }
          ]
        ]);
      });

      it("does not send a change event", async () => {
        await nextTick();
        expect(wrapper.emitted().change).toBeUndefined();
      });
    });
  });

  describe("when attribute changes:", () => {
    const { error } = console;

    beforeEach(() => {
      console.error = () => {};
      wrapper = mount(DraggableOption, {
        props: {
          additionalData: {}
        }
      });
      vm = wrapper.vm;
    });

    afterEach(() => {
      console.error = error;
    });

    test.each([
      ["sortableOption", "newValue", "sortableOption"],
      ["to-be-camelized", 1, "toBeCamelized"]
    ])(
      "attribute %s change for value %o, calls sortable option with %s attribute",
      async (attribute, value, sortableAttribute) => {
        wrapper.setProps({
          additionalData: {
            [attribute]: value
          }
        });
        await nextTick();
        expect(SortableFake.option).toHaveBeenCalledWith(
          sortableAttribute,
          value
        );
      }
    );

    test.each([
      "Start",
      "Add",
      "Remove",
      "Update",
      "End",
      "Choose",
      "Unchoose",
      "Sort",
      "Filter",
      "Clone",
      "Move"
    ])("do not call option when updating option on%s", callBack => {
      wrapper.setProps({
        additionalData: {
          [`on${callBack}`]: jest.fn()
        }
      });
      expect(SortableFake.option).not.toHaveBeenCalled();
    });
  });

  it("does calls Sortable destroy when mounted", () => {
    expect(SortableFake.destroy.mock.calls.length).toBe(0);
  });

  it("calls Sortable destroy when destroyed", () => {
    wrapper.unmount();
    expect(SortableFake.destroy).toHaveBeenCalled();
    expect(SortableFake.destroy.mock.calls.length).toBe(1);
  });

  it("does not throw on destroy when sortable is not set", () => {
    delete vm._sortable;
    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("renders id as html attribute", () => {
    wrapper = mount(draggable, {
      props: {
        list: []
      },
      attrs: {
        id: "my-id"
      },
      slots: {
        default: () => []
      }
    });

    const wrapperElement = wrapper.find("#my-id");
    expect(wrapperElement.element.tagName.toLowerCase()).toBe("div");
    expect(wrapperElement.html()).toEqual(wrapper.html());
  });

  it("renders class as html attribute", () => {
    wrapper = mount(draggable, {
      props: {
        list: []
      },
      attrs: {
        id: "my-id",
        class: "my-class"
      },
      slots: {
        default: () => []
      }
    });

    const wrapperElement = wrapper.find("#my-id");
    expect(wrapperElement.element.className).toBe("my-class");
  });

  test.each([
    ["data-valor", "a"],
    ["data-valor2", "bd"],
    ["data-attribute", "efg"]
  ])(
    "renders attribute %s with value %s as html attribute",
    (attribute, value) => {
      wrapper = mount(draggable, {
        props: {
          list: []
        },
        attrs: {
          [attribute]: value
        },
        slots: {
          default: () => []
        }
      });
      const wrapperElement = wrapper.find(`[${attribute}='${value}']`);
      expect(wrapperElement.element.tagName.toLowerCase()).toBe("div");
      expect(wrapperElement.html()).toEqual(wrapper.html());
    }
  );
});

describe("draggable.vue when initialized with modelValue", () => {
  beforeEach(() => {
    Sortable.mockClear();

    items = ["a", "b", "c"];
    wrapper = mount(draggable, {
      props: {
        modelValue: items
      },
      slots: {
        default: () => items.map(item => h("div", { key: item }, item))
      }
    });
    vm = wrapper.vm;
    props = vm.$options.props;
    element = wrapper.element;
  });

  it("computes indexes", async () => {
    await nextTick();
    expect(vm.componentStructure.visibleIndexes).toEqual([0, 1, 2]);
  });

  it("renders correctly", () => {
    expectHTML(wrapper, initialRenderRaw);
  });

  it("set realList", () => {
    expect(vm.realList).toEqual(["a", "b", "c"]);
  });

  it("transition mode should be false", () => {
    expect(vm.componentStructure.transitionMode).toBe(false);
  });

  describe("when initiating a drag operation", () => {
    let evt;
    beforeEach(() => {
      item = element.children[1];
      evt = { item };
      const start = getEvent("onStart");
      start(evt);
    });

    it("sends a start event", async () => {
      await nextTick();
      expect(wrapper.emitted()).toEqual({
        start: [[evt]]
      });
    });

    it("sets context", async () => {
      await nextTick();
      expect(vm.context).toEqual({
        element: "b",
        index: 1
      });
    });

    describe("when remove is called", () => {
      beforeEach(() => {
        element.removeChild(item);
        const remove = getEvent("onRemove");
        remove({
          item,
          oldIndex: 1
        });
      });

      it("DOM changes should be reverted", async () => {
        await nextTick();
        expectHTML(wrapper, initialRenderRaw);
      });

      it("update:modelValue should be called with updated value", async () => {
        await nextTick();
        const expected = ["a", "c"];
        expect(wrapper.emitted()["update:modelValue"]).toEqual([[expected]]);
      });

      it("sends a remove event", async () => {
        await nextTick();
        const expectedEvt = { item, oldIndex: 1 };
        expect(wrapper.emitted().remove).toEqual([[expectedEvt]]);
      });

      it("sends a change event", async () => {
        await nextTick();
        const expectedEvt = { removed: { element: "b", oldIndex: 1 } };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      });
    });

    describe("when update is called", () => {
      beforeEach(() => {
        const firstDraggable = element.children[0];
        element.removeChild(item);
        element.insertBefore(item, firstDraggable);
        const update = getEvent("onUpdate");
        update({
          item,
          oldIndex: 1,
          newIndex: 0,
          from: element
        });
      });

      it("DOM changes should be reverted", async () => {
        await nextTick();
        expectHTML(wrapper, initialRenderRaw);
      });

      it("send an update:modelValue event", async () => {
        await nextTick();
        const expected = ["b", "a", "c"];
        expect(wrapper.emitted()["update:modelValue"]).toEqual([[expected]]);
      });

      it("sends a update event", async () => {
        await nextTick();
        const expectedEvt = {
          item,
          oldIndex: 1,
          newIndex: 0,
          from: element
        };
        expect(wrapper.emitted().update).toEqual([[expectedEvt]]);
      });

      it("sends a change event", async () => {
        await nextTick();
        const expectedEvt = {
          moved: { element: "b", oldIndex: 1, newIndex: 0 }
        };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      });
    });

    describe("when sending DragEnd", () => {
      let endEvt;
      beforeEach(() => {
        endEvt = {
          data: "data"
        };
        const onEnd = getEvent("onEnd");
        onEnd(endEvt);
      });

      it("sends a update event", async () => {
        await nextTick();
        expect(wrapper.emitted().end).toEqual([[endEvt]]);
      });
    });
  });
});

describe("draggable.vue when initialized with a transition group", () => {
  beforeEach(() => {
    Sortable.mockClear();
    items = ["a", "b", "c"];
    wrapper = mount(draggable, {
      props: {
        modelValue: items
      },
      slots: {
        default() {
          return h("transition-group", {}, [
            ...items.map(item => h("div", { key: item }, item))
          ]);
        }
      }
    });
    vm = wrapper.vm;
    props = vm.$options.props;
    element = wrapper.element;
  });

  it("computes indexes", async () => {
    await nextTick();
    expect(vm.componentStructure.visibleIndexes).toEqual([0, 1, 2]);
  });

  it("set realList", () => {
    expect(vm.realList).toEqual(["a", "b", "c"]);
  });

  it("transition mode should be true", () => {
    expect(vm.componentStructure.transitionMode).toBe(true);
  });

  it("renders correctly", () => {
    expectHTML(wrapper, initialRenderTransition);
  });

  it("creates sortable instance with options on transition root", () => {
    expect(Sortable.mock.calls.length).toBe(1);
    const parameters = Sortable.mock.calls[0];
    expect(parameters[0]).toBe(element.children[0]);
  });

  describe("when initiating a drag operation", () => {
    let evt;
    beforeEach(() => {
      item = element.children[0].children[1];
      evt = { item };
      const start = getEvent("onStart");
      start(evt);
    });

    it("sends a start event", async () => {
      await nextTick();
      expect(wrapper.emitted()).toEqual({
        start: [[evt]]
      });
    });

    it("sets context", async () => {
      await nextTick();
      expect(vm.context).toEqual({
        element: "b",
        index: 1
      });
    });

    describe("when remove is called", () => {
      beforeEach(() => {
        element.children[0].removeChild(item);
        const remove = getEvent("onRemove");
        remove({
          item,
          oldIndex: 1
        });
      });

      it("DOM changes should be reverted", async () => {
        await nextTick();
        expectHTML(wrapper, initialRenderTransition);
      });

      it("update:modelValue should be called with updated value", async () => {
        await nextTick();
        const expected = ["a", "c"];
        expect(wrapper.emitted()["update:modelValue"]).toEqual([[expected]]);
      });

      it("sends a remove event", async () => {
        await nextTick();
        const expectedEvt = { item, oldIndex: 1 };
        expect(wrapper.emitted().remove).toEqual([[expectedEvt]]);
      });

      it("sends a change event", async () => {
        await nextTick();
        const expectedEvt = { removed: { element: "b", oldIndex: 1 } };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      });
    });

    describe("when update is called", () => {
      beforeEach(() => {
        const transitionRoot = element.children[0];
        const firstDraggable = transitionRoot.children[0];
        transitionRoot.removeChild(item);
        transitionRoot.insertBefore(item, firstDraggable);
        const update = getEvent("onUpdate");
        update({
          item,
          oldIndex: 1,
          newIndex: 0,
          from: transitionRoot
        });
      });

      it("DOM changes should be reverted", async () => {
        await nextTick();
        expectHTML(wrapper, initialRenderTransition);
      });

      it("send an update:modelValue event", async () => {
        await nextTick();
        const expected = ["b", "a", "c"];
        expect(wrapper.emitted()["update:modelValue"]).toEqual([[expected]]);
      });

      it("sends a update event", async () => {
        await nextTick();
        const expectedEvt = {
          item,
          oldIndex: 1,
          newIndex: 0,
          from: element.children[0]
        };
        expect(wrapper.emitted().update).toEqual([[expectedEvt]]);
      });

      it("sends a change event", async () => {
        await nextTick();
        const expectedEvt = {
          moved: { element: "b", oldIndex: 1, newIndex: 0 }
        };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      });
    });

    describe("when calling onMove", () => {
      let originalEvt;
      let move;
      let doMove;

      beforeEach(() => {
        move = jest.fn();
        wrapper.setProps({ move });
        evt = {
          to: element.children[0],
          related: element.children[0].children[1],
          willInsertAfter: false
        };
        originalEvt = {
          domInfo: true
        };
        doMove = () => getEvent("onMove")(evt, originalEvt);
      });

      it("calls move with list information", () => {
        const expectedEvt = {
          draggedContext: {
            element: "b",
            futureIndex: 1,
            index: 1
          },
          relatedContext: {
            component: vm,
            element: "b",
            index: 1,
            list: ["a", "b", "c"]
          },
          to: element.children[0],
          related: element.children[0].children[1],
          willInsertAfter: false
        };
        doMove();
        expect(move.mock.calls).toEqual([[expectedEvt, originalEvt]]);
      });
    });

    describe("when sending DragEnd", () => {
      let endEvt;
      beforeEach(() => {
        endEvt = {
          data: "data"
        };
        const onEnd = getEvent("onEnd");
        onEnd(endEvt);
      });

      it("sends a update event", async () => {
        await nextTick();
        expect(wrapper.emitted().end).toEqual([[endEvt]]);
      });
    });
  });

  describe("draggable.vue when initialized with header and footer scoped slots", () => {
    beforeEach(() => {
      resetMocks();
      items = ["a", "b", "c"];
      wrapper = mount(draggable, {
        props: {
          list: items
        },
        attrs: {
          sortableOption: "value",
          "to-be-camelized": true
        },
        slots: {
          default: () => items.map(item => h("div", { key: item }, item)),
          header: () => h("header"),
          footer: () => h("footer")
        }
      });
      vm = wrapper.vm;
      props = vm.$options.props;
      element = wrapper.element;
    });

    it("renders correctly", () => {
      expectHTML(wrapper, initialRender);
    });
  });
});
