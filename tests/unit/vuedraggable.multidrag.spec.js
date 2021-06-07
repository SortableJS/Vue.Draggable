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
    let wrapper;
    let vm;
    const { addEventListener: originalAddEventListener, removeEventListener: originalRemoveEventListener } = document;

    beforeEach(() => {
      // event listener delegation hack
      document.addEventListener = (type, listener) => {
        originalAddEventListener.call(document, type, listener);
        if (wrapper) {
          wrapper.element.addEventListener(type, listener);
        }
      };
      document.removeEventListener = (type, listener) => {
        originalRemoveEventListener.call(document, type, listener);
        if (wrapper) {
          wrapper.element.removeEventListener(type, listener);
        }
      };
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
      document.addEventListener = originalAddEventListener;
      document.removeEventListener = originalRemoveEventListener;
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
      expect(emitEvent2.items).toEqual([item1.element, item2.element]);
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
      expect(emitEvent2.items).toEqual([]);
    });
  });
});
