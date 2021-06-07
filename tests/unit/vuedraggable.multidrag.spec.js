import { mount, shallowMount } from "@vue/test-utils";
import Sortable from "sortablejs";

jest.genMockFromModule("sortablejs");
jest.mock("sortablejs");
const SortableFake = {
  destroy: jest.fn(),
  option: jest.fn(),
};
Sortable.mockImplementation(() => SortableFake);

import draggable from "@/vuedraggable";
import Vue from "vue";
import Fake from "./helper/FakeComponent.js";
import FakeFunctional from "./helper/FakeFunctionalComponent.js";

function resetMocks() {
  Sortable.mockClear();
  SortableFake.destroy.mockClear();
  SortableFake.option.mockClear();
}

describe("draggable.vue with multidrag plugin", () => {
  beforeEach(() => {
    resetMocks();
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

    it("warns when multiDrag is true but selectedClass is not set", () => {
      const wrapper = shallowMount(draggable, {
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
});
