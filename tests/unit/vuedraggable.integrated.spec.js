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
const expectedDomWithWrapper = wrapper => `<${wrapper}>${expectedArray.map(nu => `<div>${nu}</div>`).join('')}</${wrapper}>`;

const expectedDomNoTransition = expectedDomWithWrapper('span');
const expectedDomTransition = `<div>${expectedDomWithWrapper('transition-group-stub')}</div>`;

function normalizeHTML(wrapper) {
  return wrapper.html().replace(/(\r\n\t|\n|\r\t| )/gm,"");
}

function expectHTML(wrapper, expected) {
  const htmlStripped = normalizeHTML(wrapper);
  expect(htmlStripped).toEqual(expected);
}

describe.each([
  [DraggableWithList, "draggable with list", expectedDomNoTransition, "span"],
  [DraggableWithModel, "draggable with model", expectedDomNoTransition, "span"],
  [DraggableWithTransition, "draggable with transition", expectedDomTransition, "transition-group-stub"]
])
  (
    "should update list and DOM with component: %s %s",
    (component, _, expectedDom, expectWrapper) => {

      describe("when handling sort", () => {

        beforeEach(async () => {
          jest.resetAllMocks();
          wrapper = mount(component);
          vm = wrapper.vm;
          element = wrapper.find(expectWrapper).element;

          const item = element.children[2];
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
        });

        it("sends a change event", async () => {
          const draggableWrapper = wrapper.find(draggable);
          const expectedEvt = { moved: { element: 2, oldIndex: 2, newIndex: 7 } };
          expect(draggableWrapper.emitted().change).toEqual([[expectedEvt]]);
        });

        it("update list", async () => {
          expect(vm.array).toEqual(expectedArray);
        });

        it("updates DOM", async () => {
          expectHTML(wrapper, expectedDom);
        });
      });
    }
  )