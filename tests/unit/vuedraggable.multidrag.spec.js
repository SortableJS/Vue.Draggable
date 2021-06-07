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
});
