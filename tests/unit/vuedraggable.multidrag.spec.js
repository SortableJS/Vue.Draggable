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
});
