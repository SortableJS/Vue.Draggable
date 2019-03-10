import { mount } from "@vue/test-utils";
import Sortable from "sortablejs";
jest.genMockFromModule('sortablejs');
jest.mock('sortablejs');
const SortableFake = {
  destroy: jest.fn(),
  option: jest.fn()
};
Sortable.mockImplementation(() => SortableFake);

import Vue from "vue";
import DraggableWithList from "./helper/DraggableWithList"
import DraggableWithModel from "./helper/DraggableWithList"
import DraggableWithTransition from "./helper/DraggableWithTransition"

import draggable from "@/vuedraggable";

let wrapper;
let element;
let vm;

function getEvent(name) {
  return Sortable.mock.calls[0][1][name];
}

const expectedArray = [0, 1, 3, 4, 5, 6, 7, 2, 8, 9];
const expectedDomNoTransition = `<span>${expectedArray.map(nu => `<div>${nu}</div>`).join('')}</span>`;
const expectedDomTransition = `<div>${expectedDomNoTransition}</div>`;

describe.each([
  [DraggableWithList, "draggable with list", expectedDomNoTransition],
  [DraggableWithModel, "draggable with model", expectedDomNoTransition],
  [DraggableWithTransition, "draggable with transition", expectedDomTransition]
])
  (
    "should update list with component: %s %s",
    (component, _, expectedDom) => {

      beforeEach(() => {
        jest.resetAllMocks();
        wrapper = mount(component, {
          attachToDocument: true
        });
        vm = wrapper.vm;
        element = wrapper.find('span').element;
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
          expect(vm.array).toEqual(expectedArray);
        });

        it("updates DOM", async () => {
          expect(wrapper.html()).toEqual(expectedDom);
        });
      });
    }
  )