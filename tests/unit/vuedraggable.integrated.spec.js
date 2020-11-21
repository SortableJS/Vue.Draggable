import { mount, config } from "@vue/test-utils";
config.global.stubs["transition-group"] = false;
import Sortable from "sortablejs";

jest.genMockFromModule("sortablejs");
jest.mock("sortablejs");

const SortableFake = {
  destroy: jest.fn(),
  option: jest.fn()
};
Sortable.mockImplementation(() => SortableFake);

import draggable from "@/vuedraggable";

import { nextTick } from "vue";
import DraggableWithList from "./helper/DraggableWithList";
import DraggableWithComponent from "./helper/DraggableWithComponent.vue";
import DraggableWithModel from "./helper/DraggableWithList";
import DraggableWithTransition from "./helper/DraggableWithTransition";
import fake from "./helper/FakeRoot";

let wrapper;
let element;
let vm;

function getEvent(name) {
  return Sortable.mock.calls[0][1][name];
}

const expectedArray = [0, 1, 3, 4, 5, 6, 7, 2, 8, 9];
const expectedDomWithWrapper = (wrapper, attr = "") =>
  `<${wrapper}${attr}>${expectedArray
    .map((nu) => `<div data-draggable="true">${nu}</div>`)
    .join("")}</${wrapper}>`;

const expectedDomNoTransition = expectedDomWithWrapper("span");
const expectedDomTransition = expectedDomWithWrapper("div");
const expectedDomComponent = expectedDomWithWrapper(
  "div",
  ' class="fake-root" id="my-id"'
);

function normalizeHTML(wrapper) {
  return wrapper.html();
}

function expectHTML(wrapper, expected) {
  const htmlStripped = normalizeHTML(wrapper);
  expect(htmlStripped).toEqual(expected);
}

describe.each([
  ["draggable with list", DraggableWithList, expectedDomNoTransition, "span"],
  ["draggable with model", DraggableWithModel, expectedDomNoTransition, "span"],
  [
    "draggable with list and component as tag",
    DraggableWithComponent,
    expectedDomComponent,
    "div"
  ],
  [
    "draggable with transition",
    DraggableWithTransition,
    expectedDomTransition,
    "div"
  ]
])(
  "should update list and DOM with component: %s",
  (_, component, expectedDom, expectWrapper) => {
    describe("when handling sort", () => {
      beforeEach(async () => {
        jest.resetAllMocks();
        wrapper = mount(component, {
          global: {
            components: {
              fake
            }
          }
        });
        vm = wrapper.vm;
        element = wrapper.find(expectWrapper).element;

        const item = element.children[2];
        const startEvt = { item };
        getEvent("onStart")(startEvt);
        await nextTick();

        const firstDraggable = element.children[1];
        element.removeChild(item);
        element.insertBefore(item, firstDraggable);
        getEvent("onUpdate")({
          item,
          oldIndex: 2,
          newIndex: 7,
          from: element,
        });
        await nextTick();
      });

      it("sends a change event", async () => {
        const draggableWrapper = wrapper.findComponent(draggable);
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
);
