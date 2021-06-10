import { mount, shallowMount } from "@vue/test-utils";
import Sortable from "sortablejs";

import draggable from "@/vuedraggable";
import Vue from "vue";
import Fake from "./helper/FakeComponent.js";
import FakeFunctional from "./helper/FakeFunctionalComponent.js";

function create(options) {
  const { propsData: { list: items = [] } } = options;
  const opts = Object.assign({
    attrs: {
      sortableOption: "value",
      "to-be-camelized": true,
    },
    slots: {
      default: items.map((item) => `<div class="item">${item}</div>`),
      header: "<header/>",
      footer: "<footer/>",
    },
  }, options);
  const wrapper = shallowMount(draggable, opts);
  const { vm, element } = wrapper;
  const { $options: { props } } = vm;
  return { wrapper, vm, props, element };
}

/**
 * @param {"addEventListener" | "removeEventListener"} listnerName 
 * @param {GlobalEventHandlers[listnerName]} callback 
 * @returns {jest.SpyInstance}
 */
function eventListnerDelegationMock(listnerName, callback) {
  const instance = jest.spyOn(document, listnerName);
  const actual = instance.getMockImplementation();
  return instance.mockImplementation((type, listener, options) => {
    actual.call(document, type, listener, options);
    callback && callback(type, listener, options);
  });
}

describe("draggable.vue with multidrag plugin", () => {
  describe("when initialized", () => {
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

    describe("with incorrect props", () => {
      it("warns when multiDrag is true but selectedClass is not set", () => {
        shallowMount(draggable, {
          propsData: {
            multiDrag: true,
          },
          slots: {
            default: "",
          },
        });
        expect(console.warn).toBeCalledWith(
          "selected-class must be set when multi-drag mode. See https://github.com/SortableJS/Sortable/wiki/Dragging-Multiple-Items-in-Sortable#enable-multi-drag"
        );
      });
    });

    it("instantiate without error", () => {
      const { wrapper } = create({
        propsData: {
          multiDrag: true,
          selectedClass: 'selected',
        },
      });
      expect(wrapper).not.toBeUndefined();
      expect(console.warn).not.toBeCalled();
    });
  });

  describe("should have props", () => {
    const { props } = create({
      propsData: {
        multiDrag: true,
        selectedClass: 'selected',
      },
    });

    test.each([
      [
        "multiDrag",
        {
          type: Boolean,
          required: false,
          default: false,
        },
      ],
      [
        "multiDragKey",
        {
          type: String,
          required: false,
          default: null,
        },
      ],
      [
        "selectedClass",
        {
          type: String,
          required: false,
          default: null,
        },
      ],
    ])("%s equal to %o", (name, value) => {
      const propsValue = props[name];
      expect(propsValue).toEqual(value);
    });
  });

  describe("item select and deselect", () => {
    /** @type {import("@vue/test-utils").Wrapper<Vue>} */
    let wrapper;
    /** @type {Vue} */
    let vm;
    /** @type {jest.SpyInstance} */
    let addEventListenerMock;
    /** @type {jest.SpyInstance} */
    let removeEventListenerMock;

    beforeEach(() => {
      // event listener delegation hack
      addEventListenerMock = eventListnerDelegationMock("addEventListener", (type, listener, options) => {
        wrapper?.element?.addEventListener(type, listener, options);
      });
      removeEventListenerMock = eventListnerDelegationMock("removeEventListener", (type, listener, options) => {
        wrapper?.element?.removeEventListener(type, listener, options);
      });

      // component
      const items = ["a", "b", "c", "d"];
      const { wrapper: _w, vm: _v } = create({
        propsData: {
          list: items,
          multiDrag: true,
          selectedClass: 'selected',
        },
      });
      wrapper = _w;
      vm = _v;
    });

    afterEach(() => {
      addEventListenerMock.mockRestore();
      removeEventListenerMock.mockRestore();
    });

    it("should be selected", async () => {
      const wrapperItems = wrapper.findAll('.item');
      const item1 = wrapperItems.at(0);
      const item2 = wrapperItems.at(wrapperItems.length - 1);

      expect(item1.element.matches('.selected')).toBe(false);
      expect(item2.element.matches('.selected')).toBe(false);

      // select first item
      // simulate mouse event
      await item1.trigger('mousedown').then(() => item1.trigger('mouseup'));
      expect(item1.element.matches('.selected')).toBe(true);

      // select second item
      // simulate mouse event
      await item2.trigger('mousedown').then(() => item2.trigger('mouseup'));
      expect(item2.element.matches('.selected')).toBe(true);

      // check emit event
      const { select: selectEmit } = wrapper.emitted();
      expect(selectEmit).not.toBeUndefined();
      expect(selectEmit).toHaveLength(2);
      const [[emitEvent1], [emitEvent2]] = selectEmit;
      expect(emitEvent1.items).toEqual([item1.element]);
      expect(emitEvent1.newIndicies).toEqual([{ multiDragElement: item1.element, index: 1 }]);
      expect(emitEvent2.items).toEqual([item1.element, item2.element]);
      expect(emitEvent2.newIndicies).toEqual([{ multiDragElement: item1.element, index: 1 }, { multiDragElement: item2.element, index: 4 }]);
    });

    it("should be deselected", async () => {
      const wrapperItems = wrapper.findAll('.item');
      const item1 = wrapperItems.at(0);
      const item2 = wrapperItems.at(wrapperItems.length - 1);

      // select items for deselect
      Sortable.utils.select(item1.element);
      Sortable.utils.select(item2.element);

      expect(item1.element.matches('.selected')).toBe(true);
      expect(item2.element.matches('.selected')).toBe(true);

      // deselect first item
      // simulate mouse event
      await item1.trigger('mousedown').then(() => item1.trigger('mouseup'));
      expect(item1.element.matches('.selected')).toBe(false);

      // deselect second item
      // simulate mouse event
      await item2.trigger('mousedown').then(() => item2.trigger('mouseup'));
      expect(item2.element.matches('.selected')).toBe(false);

      // check emit event
      const { deselect: deselectEmit } = wrapper.emitted();
      expect(deselectEmit).not.toBeUndefined();
      expect(deselectEmit).toHaveLength(2);
      const [[emitEvent1], [emitEvent2]] = deselectEmit;
      expect(emitEvent1.items).toEqual([item2.element]);
      expect(emitEvent1.newIndicies).toEqual([{ multiDragElement: item2.element, index: 4 }]);
      expect(emitEvent2.items).toEqual([]);
      expect(emitEvent2.newIndicies).toEqual([]);
    });
  });

  describe("multi item drag and drop", () => {
    /** @type {import("@vue/test-utils").Wrapper<Vue>} */
    let wrapper;
    /** @type {Vue} */
    let vm;
    /** @type {jest.SpyInstance} */
    let addEventListenerMock;
    /** @type {jest.SpyInstance} */
    let removeEventListenerMock;
    /** @type {string[]} */
    let items;
    /** @type {(event: Event) => void} */
    let onStart;
    /** @type {(event: Event) => void} */
    let onUpdate;

    beforeEach(() => {
      // event listener delegation hack
      addEventListenerMock = eventListnerDelegationMock("addEventListener", (type, listener, options) => {
        wrapper?.element?.addEventListener(type, listener, options);
      });
      removeEventListenerMock = eventListnerDelegationMock("removeEventListener", (type, listener, options) => {
        wrapper?.element?.removeEventListener(type, listener, options);
      });

      // component
      items = ["a", "b", "c", "d"];
      const { wrapper: _w, vm: _v } = create({
        propsData: {
          list: items,
          multiDrag: true,
          selectedClass: 'selected',
        },
      });
      wrapper = _w;
      vm = _v;

      onStart = vm._sortable.options.onStart;
      onUpdate = vm._sortable.options.onUpdate;
    });

    afterEach(() => {
      addEventListenerMock.mockRestore();
      removeEventListenerMock.mockRestore();
    });

    describe("should work", () => {
      it("when drop first and second into last", async () => {
        const wrapperItems = wrapper.findAll('.item');
        const item1 = wrapperItems.at(0);
        const item2 = wrapperItems.at(1);
  
        // start drag from first item
        const startEvent = {
          item: item1.element,
          items: [item1.element, item2.element],
        };
        onStart(startEvent);
        await Vue.nextTick();

        // drop to last item
        const updateEvent = {
          from: wrapper.element,
          newIndex: 3,
          newDraggableIndex: 3,
          oldIndex: 1,
          oldDraggableIndex: 1,
          item: item1.element,
          items: [item1.element, item2.element],
          oldIndicies: [
            { multiDragElement: item1.element, index: 1 },
            { multiDragElement: item2.element, index: 2 },
          ],
          newIndicies: [
            { multiDragElement: item1.element, index: 3 },
            { multiDragElement: item2.element, index: 4 },
          ],
        };
        onUpdate(updateEvent);
        await Vue.nextTick();

        // check items order
        expect(vm.list).toEqual(["c", "d", "a", "b"]);

        // check emit event
        const { start: startEmit, update: updateEmit } = wrapper.emitted();
        expect(startEmit).not.toBeUndefined();
        expect(updateEmit).not.toBeUndefined();
      });
    });
  });
});
