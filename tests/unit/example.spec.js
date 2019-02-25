import { shallowMount } from "@vue/test-utils";
import draggable from "@/vuedraggable";

let wrapper;

describe("draggable.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(draggable);
  });

  it("should instanciate without error", () => {
    expect(wrapper).not.toBeUndefined();
  });
});