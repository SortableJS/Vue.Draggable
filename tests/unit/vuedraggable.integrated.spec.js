import { mount } from "@vue/test-utils";
import Sortable from "sortablejs";
jest.genMockFromModule('sortablejs');
jest.mock('sortablejs');
const SortableFake = {
  destroy: jest.fn(),
  option: jest.fn()
};
const SortableFake2 = {
  destroy: jest.fn(),
  option: jest.fn()
};
Sortable.mockImplementationOnce(() => SortableFake)
  .mockImplementationOnce(() => SortableFake2);

import Vue from "vue";
import DraggableWithList from "./helper/DraggableWithList"
import draggable from "@/vuedraggable";

let wrapper;
let element;
let vm;

function getEvent(name) {
  return Sortable.mock.calls[0][1][name];
}

describe("draggable.vue when working list", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    wrapper = mount(DraggableWithList, {
      attachToDocument: true
    });
    vm = wrapper.vm;
    element = wrapper.element;
  });

  describe("when handling sort", () => {
    let item;

    beforeEach(async () => {
      item = element.children[2];
      const startEvt = { item };
      getEvent("onStart")(startEvt);
      await Vue.nextTick();

      const firstDraggable = element.children[1];
      element.removeChild(item);
      element.insertBefore(item, firstDraggable);
      getEvent("onUpdate")({
        item,
        oldIndex: 2,
        newIndex: 7,
        from: element
      });
      await Vue.nextTick();
    })

    it("sends a change event", async () => {
      const draggableWrapper = wrapper.find(draggable);
      const expectedEvt = { moved: { element: 2, oldIndex: 2, newIndex: 7 } };
      expect(draggableWrapper.emitted().change).toEqual([[expectedEvt]]);
    });

    it("update list", async () => {
      expect(wrapper.vm.array).toEqual([0, 1, 3, 4, 5, 6, 7, 2, 8, 9]);
    });

    it("updates DOM", async () => {
      const expectedArray = [0, 1, 3, 4, 5, 6, 7, 2, 8, 9];
      const expectedDom = `<div>${expectedArray.map(nu => `<div>${nu}</div>`).join('')}</div>`;
      expect(wrapper.html()).toEqual(expectedDom);
    });
  });
});