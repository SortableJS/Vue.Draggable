import { mount, shallowMount } from "@vue/test-utils";
import Sortable from "sortablejs";
jest.genMockFromModule('sortablejs');
jest.mock('sortablejs');
const SortableFake = {
  destroy: jest.fn(),
  option: jest.fn()
};
Sortable.mockImplementation(() => SortableFake);
import draggable from "@/vuedraggable";
import Vue from "vue";
import Fake from "./helper/FakeComponent.js"

let wrapper;
let vm;
let props;
let items;
let item;
let element;
let input;
const initialRender = "<div><header></header><div>a</div><div>b</div><div>c</div><footer></footer></div>";
const initialRenderRaw = "<div><div>a</div><div>b</div><div>c</div></div>";
const initialRenderTransition = "<div><span><div>a</div><div>b</div><div>c</div></span></div>";

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
    wrapper = shallowMount(draggable, {
      attachToDocument: true,
      propsData: {
        list: items
      },
      attrs: {
        sortableOption: "value",
        "to-be-camelized": true
      },
      slots: {
        default: items.map(item => `<div>${item}</div>`),
        header: "<header/>",
        footer: "<footer/>"
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
    })

    it("log an error when list and value are both not null", () => {
      wrapper = shallowMount(draggable, {
        attachToDocument: true,
        propsData: {
          list: [],
          value: []
        },
        slots: {
          default: ""
        }
      });
      expect(console.error).toBeCalledWith("Value and list props are mutually exclusive! Please set one or another.");
    });

    it("warns when options is used", () => {
      wrapper = shallowMount(draggable, {
        attachToDocument: true,
        propsData: {
          options: {
            group: "led zeppelin"
          }
        },
        slots: {
          default: ""
        }
      });
      expect(console.warn).toBeCalledWith("Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props");
    });

    it("warns when element is used", () => {
      wrapper = shallowMount(draggable, {
        attachToDocument: true,
        propsData: {
         element: "li"
        },
        slots: {
          default: ""
        }
      });
      expect(console.warn).toBeCalledWith( "Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props");
    });

  });

  it("instantiate without error", () => {
    expect(wrapper).not.toBeUndefined();
  });

  it("has draggable name", () => {
    expect(vm.name).not.toBe("draggable");
  });

  test.each([
    ["options", { type: Object }],
    ["list", {
      type: Array,
      required: false,
      default: null
    }],
    ["value", {
      type: Array,
      required: false,
      default: null
    }],
    ["noTransitionOnDrag", {
      type: Boolean,
      default: false
    }],
    ["element", {
      type: String,
      default: "div"
    }],
    ["tag", {
      type: String,
      default: null
    }],
    ["move", {
      type: Function,
      default: null
    }],
    ["componentData", {
      type: Object,
      required: false,
      default: null
    }]
  ])(
    "should have props %s equal to %o",
    (name, value) => {
      const propsValue = props[name];
      expect(propsValue).toEqual(value);
    }
  )

  it("has a clone props, defaulting with identity function", () => {
    const expected = {};
    const { clone } = props;
    expect(clone.type).toBe(Function);
    expect(clone.default(expected)).toBe(expected);
  })

  it("renders root element correctly", () => {
    expect(wrapper.html()).toMatch(/^<div>.*<\/div>$/);
  })

  it("renders footer slot element correctly", () => {
    expect(wrapper.html()).toMatch(/<footer><\/footer><\/div>$/);
  })

  it("renders header slot element correctly", () => {
    expect(wrapper.html()).toMatch(/^<div><header><\/header>/);
  })

  it("renders default slot element correctly", () => {
    expect(wrapper.html()).toContain("<div>a</div><div>b</div><div>c</div>");
  })

  it("renders correctly", () => {
    expect(wrapper.html()).toEqual(initialRender);
  })

  test.each([
    "ul",
    "span",
    "div"
  ])(
    "renders tag %s as root element",
    (tag) => {
      wrapper = shallowMount(draggable, {
        propsData: { tag }
      });
      const expectedRegex = new RegExp(`^<${tag}>.*<\/${tag}>$`);
      expect(wrapper.html()).toMatch(expectedRegex);
    }
  )

  it("computes indexes", async () => {
    await Vue.nextTick();
    //To be altered
    expect(vm.visibleIndexes).toEqual([-1, 0, 1, 2, -1]);
  });

  it("update indexes", async () => {
    await Vue.nextTick();
    const computeIndexes = jest.fn();
    wrapper.setMethods({ computeIndexes })
    wrapper.setProps({ list: ["c", "d", "e", "f", "g"] });
    expect(computeIndexes).toHaveBeenCalled()
  });

  it("set realList", () => {
    expect(vm.realList).toEqual(["a", "b", "c"]);
  });

  describe("when using component as tag", () => {
    beforeEach(() => {
      input = jest.fn();
      wrapper = mount(draggable, {
        propsData: {
          tag: "child",
          componentData: {
            on: {
              input
            },
            props: {
              prop1: "info",
              prop2: true
            }
          }
        },
        stubs: {
          child: Fake
        }
      });
    });

    it("instantiate child component", async () => {
      const child = wrapper.find(Fake);
      expect(child).not.toBeNull();
    })

    it("pass data to tag child", async () => {
      const fakeChild = wrapper.find(Fake);
      expect(fakeChild.props("prop1")).toEqual("info");
    })

    it("pass data to tag child", async () => {
      const child = wrapper.find(Fake);
      const evt = { data: 33 };
      child.vm.$emit('input', evt);
      expect(input).toHaveBeenCalledWith(evt);
    })
  });

  it("keeps a reference to Sortable instance", () => {
    expect(vm._sortable).toBe(SortableFake);
  })

  it("creates sortable instance with options", () => {
    expect(Sortable.mock.calls.length).toBe(1);
    const parameters = Sortable.mock.calls[0];
    expect(parameters[0]).toBe(element);
    expect(parameters[1]).toMatchObject({
      draggable: ">*",
      sortableOption: "value",
      toBeCamelized: true
    });
  })

  test.each(
    [
      ["onChoose", "choose"],
      ["onSort", "sort"],
      ["onFilter", "filter"],
      ["onClone", "clone"]
    ]
  )(
    "when event %s is emitted from sortable",
    async (evt, vueEvt) => {
      const callBack = getEvent(evt);
      const evtInfo = {
        data: {}
      };
      callBack(evtInfo);
      await Vue.nextTick();
      expect(wrapper.emitted()).toEqual({
        [vueEvt]: [[evtInfo]]
      });
    }
  );

  it("creates sortable instance with options", () => {
    expect(Sortable.mock.calls.length).toBe(1);
    const parameters = Sortable.mock.calls[0];
    expect(parameters[0]).toBe(element);
    expect(parameters[1]).toMatchObject({
      draggable: ">*",
      sortableOption: "value",
      toBeCamelized: true
    });
  })

  describe("when add is called", () => {
    let newItem;
    beforeEach(async () => {
      await Vue.nextTick();
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
    })

    it("DOM changes should be reverted", async () => {
      await Vue.nextTick();
      expect(wrapper.html()).toEqual(initialRender);
    })

    it("list should be updated", async () => {
      await Vue.nextTick();
      expect(vm.list).toEqual(["a", "b", "d", "c",]);
    })

    it("sends a update event", async () => {
      await Vue.nextTick();
      const expectedEvt = {
        item: newItem,
        newIndex: 3
      };
      expect(wrapper.emitted().add).toEqual([[expectedEvt]]);
    })

    it("sends a change event", async () => {
      await Vue.nextTick();
      const expectedEvt = { added: { element: "d", newIndex: 2 } };
      expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
    })
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
      await Vue.nextTick();
      expect(wrapper.emitted()).toEqual({
        start: [[evt]]
      });
    })

    it("sets context", async () => {
      await Vue.nextTick();
      expect(vm.context).toEqual({
        element: "b",
        index: 1
      });
    })

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
          [3, true, 2, { element: "c", index: 2 }],
        ])(
          "when context is of index %n with insert after %o has futureIndex: %n and context: %o",
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
        )

        test.each([
          true,
          false
        ])(
          "returns move result %o",
          (result) => {
            move.mockImplementation(() => result)
            const actual = doMove();
            expect(actual).toBe(result);
          }
        )
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
      })

      it("DOM changes should be reverted", async () => {
        await Vue.nextTick();
        expect(wrapper.html()).toEqual(initialRender);
      })

      it("list should be updated", async () => {
        await Vue.nextTick();
        expect(vm.list).toEqual(["a", "c"]);
      })

      it("sends a remove event", async () => {
        await Vue.nextTick();
        const expectedEvt = { item, oldIndex: 2 };
        expect(wrapper.emitted().remove).toEqual([[expectedEvt]]);
      })

      it("sends a change event", async () => {
        await Vue.nextTick();
        const expectedEvt = { removed: { element: "b", oldIndex: 1 } };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      })
    })

    describe("when update is called", () => {
      beforeEach(() => {
        const firstDraggable = element.children[1];
        element.removeChild(item);
        element.insertBefore(item, firstDraggable);
        const update = getEvent("onUpdate");
        update({
          item,
          oldIndex: 2,
          newIndex: 1,
          from: element
        });
      })

      it("DOM changes should be reverted", async () => {
        await Vue.nextTick();
        expect(wrapper.html()).toEqual(initialRender);
      })

      it("list should be updated", async () => {
        await Vue.nextTick();
        expect(vm.list).toEqual(["b", "a", "c"]);
      })

      it("sends a update event", async () => {
        await Vue.nextTick();
        const expectedEvt = {
          item,
          oldIndex: 2,
          newIndex: 1,
          from: element
        };
        expect(wrapper.emitted().update).toEqual([[expectedEvt]]);
      })

      it("sends a change event", async () => {
        await Vue.nextTick();
        const expectedEvt = { moved: { element: "b", oldIndex: 1, newIndex: 0 } };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      })
    });

    describe("when sending DragEnd", () => {
      let endEvt;
      beforeEach(() => {
        endEvt = {
          data: "data"
        };
        const onEnd = getEvent("onEnd");
        onEnd(endEvt);
      })

      it("sends a update event", async () => {
        await Vue.nextTick();
        expect(wrapper.emitted().end).toEqual([[endEvt]]);
      })
    })
  });

  describe("when attribute changes:", () => {
    const { error } = console;
    beforeEach(() => {
      console.error = () => { };
    });
    afterEach(() => {
      console.error = error;
    })

    test.each([
      ["sortableOption", "newValue", "sortableOption"],
      ["to-be-camelized", 1, "toBeCamelized"]
    ])(
      "attribute %s change for value %o, calls sortable option with %s attribute",
      (attribute, value, sortableAttribute) => {
        vm.$attrs = { [attribute]: value };
        expect(SortableFake.option).toHaveBeenCalledWith(sortableAttribute, value);
      }
    );

    test.each(["Start", "Add", "Remove", "Update", "End", "Choose", "Sort", "Filter", "Clone", "Move"])
    ("do not call option when updating option on%s",
    (callBack) =>{
      vm.$attrs = { [`on${callBack}`]: jest.fn() };
      expect(SortableFake.option).not.toHaveBeenCalled();
    });



  });

  test.each([
    ["sortableOption", "newValue", "sortableOption"],
    ["to-be-camelized", 1, "toBeCamelized"]
  ])(
    "when option %s change for value %o, calls sortable option with %s attribute",
    (attribute, value, sortableAttribute) => {
      wrapper.setProps({ options: { [attribute]: value } });
      expect(SortableFake.option).toHaveBeenCalledWith(sortableAttribute, value);
    }
  );

  it("does calls Sortable destroy when mounted", () => {
    expect(SortableFake.destroy.mock.calls.length).toBe(0);
  });

  it("calls Sortable destroy when destroyed", () => {
    wrapper.destroy();
    expect(SortableFake.destroy).toHaveBeenCalled();
    expect(SortableFake.destroy.mock.calls.length).toBe(1);
  });

  it("does not throw when sortable is not set", () => {
    delete vm._sortable;
    expect(() =>wrapper.destroy()).not.toThrow();
  });
})

describe("draggable.vue when initialized with value", () => {
  beforeEach(() => {
    Sortable.mockClear();
    items = ["a", "b", "c"];
    wrapper = shallowMount(draggable, {
      attachToDocument: true,
      propsData: {
        value: items
      },
      slots: {
        default: items.map(item => `<div>${item}</div>`),
      }
    });
    vm = wrapper.vm;
    props = vm.$options.props;
    element = wrapper.element;
  });

  it("computes indexes", async () => {
    await Vue.nextTick();
    expect(vm.visibleIndexes).toEqual([0, 1, 2]);
  });

  it("renders correctly", () => {
    expect(wrapper.html()).toEqual(initialRenderRaw);
  })

  it("update indexes", async () => {
    await Vue.nextTick();
    const computeIndexes = jest.fn();
    wrapper.setMethods({ computeIndexes })
    wrapper.setProps({ value: ["c", "d", "e", "f", "g"] });
    expect(computeIndexes).toHaveBeenCalled()
  });

  it("set realList", () => {
    expect(vm.realList).toEqual(["a", "b", "c"]);
  });

  it("transition mode should be false", () => {
    expect(vm.transitionMode).toBe(false);
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
      await Vue.nextTick();
      expect(wrapper.emitted()).toEqual({
        start: [[evt]]
      });
    })

    it("sets context", async () => {
      await Vue.nextTick();
      expect(vm.context).toEqual({
        element: "b",
        index: 1
      });
    })

    describe("when remove is called", () => {
      beforeEach(() => {
        element.removeChild(item);
        const remove = getEvent("onRemove");
        remove({
          item,
          oldIndex: 1
        });
      })

      it("DOM changes should be reverted", async () => {
        await Vue.nextTick();
        expect(wrapper.html()).toEqual(initialRenderRaw);
      })

      it("input should with updated value", async () => {
        await Vue.nextTick();
        const expected = ["a", "c"];
        expect(wrapper.emitted().input).toEqual([[expected]]);
      })

      it("sends a remove event", async () => {
        await Vue.nextTick();
        const expectedEvt = { item, oldIndex: 1 };
        expect(wrapper.emitted().remove).toEqual([[expectedEvt]]);
      })

      it("sends a change event", async () => {
        await Vue.nextTick();
        const expectedEvt = { removed: { element: "b", oldIndex: 1 } };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      })
    })

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
      })

      it("DOM changes should be reverted", async () => {
        await Vue.nextTick();
        expect(wrapper.html()).toEqual(initialRenderRaw);
      })

      it("send an input event", async () => {
        await Vue.nextTick();
        const expected = ["b", "a", "c"];
        expect(wrapper.emitted().input).toEqual([[expected]]);
      })

      it("sends a update event", async () => {
        await Vue.nextTick();
        const expectedEvt = {
          item,
          oldIndex: 1,
          newIndex: 0,
          from: element
        };
        expect(wrapper.emitted().update).toEqual([[expectedEvt]]);
      })

      it("sends a change event", async () => {
        await Vue.nextTick();
        const expectedEvt = { moved: { element: "b", oldIndex: 1, newIndex: 0 } };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      })
    });

    describe("when sending DragEnd", () => {
      let endEvt;
      beforeEach(() => {
        endEvt = {
          data: "data"
        };
        const onEnd = getEvent("onEnd");
        onEnd(endEvt);
      })

      it("sends a update event", async () => {
        await Vue.nextTick();
        expect(wrapper.emitted().end).toEqual([[endEvt]]);
      })
    })
  });
});

describe("draggable.vue when initialized with a transition group", () => {
  beforeEach(() => {
    Sortable.mockClear();
    items = ["a", "b", "c"];
    const inside = items.map(item => `<div>${item}</div>`).join("");
    const template = `<transition-group>${inside}</transition-group>`
    wrapper = shallowMount(draggable, {
      attachToDocument: true,
      propsData: {
        value: items
      },
      slots: {
        default: template,
      }
    });
    vm = wrapper.vm;
    props = vm.$options.props;
    element = wrapper.element;
  });

  it("computes indexes", async () => {
    await Vue.nextTick();
    expect(vm.visibleIndexes).toEqual([0, 1, 2]);
  });

  it("set realList", () => {
    expect(vm.realList).toEqual(["a", "b", "c"]);
  });

  it("transition mode should be false", () => {
    expect(vm.transitionMode).toBe(true);
  });

  it("enders correctly", () => {
    expect(wrapper.html()).toEqual(initialRenderTransition);
  })

  it("creates sortable instance with options on transition root", () => {
    expect(Sortable.mock.calls.length).toBe(1);
    const parameters = Sortable.mock.calls[0];
    expect(parameters[0]).toBe(element.children[0]);
  })

  describe("when initiating a drag operation", () => {
    let evt;
    beforeEach(() => {
      item = element.children[0].children[1];
      evt = { item };
      const start = getEvent("onStart");
      start(evt);
    });

    it("sends a start event", async () => {
      await Vue.nextTick();
      expect(wrapper.emitted()).toEqual({
        start: [[evt]]
      });
    })

    it("sets context", async () => {
      await Vue.nextTick();
      expect(vm.context).toEqual({
        element: "b",
        index: 1
      });
    })

    describe("when remove is called", () => {
      beforeEach(() => {
        element.children[0].removeChild(item);
        const remove = getEvent("onRemove");
        remove({
          item,
          oldIndex: 1
        });
      })

      it("DOM changes should be reverted", async () => {
        await Vue.nextTick();
        expect(wrapper.html()).toEqual(initialRenderTransition);
      })

      it("input should with updated value", async () => {
        await Vue.nextTick();
        const expected = ["a", "c"];
        expect(wrapper.emitted().input).toEqual([[expected]]);
      })

      it("sends a remove event", async () => {
        await Vue.nextTick();
        const expectedEvt = { item, oldIndex: 1 };
        expect(wrapper.emitted().remove).toEqual([[expectedEvt]]);
      })

      it("sends a change event", async () => {
        await Vue.nextTick();
        const expectedEvt = { removed: { element: "b", oldIndex: 1 } };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      })
    })

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
      })

      it("DOM changes should be reverted", async () => {
        await Vue.nextTick();
        expect(wrapper.html()).toEqual(initialRenderTransition);
      })

      it("send an input event", async () => {
        await Vue.nextTick();
        const expected = ["b", "a", "c"];
        expect(wrapper.emitted().input).toEqual([[expected]]);
      })

      it("sends a update event", async () => {
        await Vue.nextTick();
        const expectedEvt = {
          item,
          oldIndex: 1,
          newIndex: 0,
          from: element.children[0]
        };
        expect(wrapper.emitted().update).toEqual([[expectedEvt]]);
      })

      it("sends a change event", async () => {
        await Vue.nextTick();
        const expectedEvt = { moved: { element: "b", oldIndex: 1, newIndex: 0 } };
        expect(wrapper.emitted().change).toEqual([[expectedEvt]]);
      })
    });

    describe("when sending DragEnd", () => {
      let endEvt;
      beforeEach(() => {
        endEvt = {
          data: "data"
        };
        const onEnd = getEvent("onEnd");
        onEnd(endEvt);
      })

      it("sends a update event", async () => {
        await Vue.nextTick();
        expect(wrapper.emitted().end).toEqual([[endEvt]]);
      })
    })
  });
});