import { shallowMount } from "@vue/test-utils";
import draggable from "@/vuedraggable";

let wrapper;
let vm;
let props;

describe("draggable.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(draggable);
    vm = wrapper.vm;
    props = vm.$options.props;
  });

  it("should instanciate without error", () => {
    expect(wrapper).not.toBeUndefined();
  });

  test.each([
    ["options", { type: Object }],
    ["list", {
      type: Array,
      required: false,
      default: null
    }],
    ["value", {
      type: Array,
      required: false,
      default: null
    }],
    ["noTransitionOnDrag", {
      type: Boolean,
      default: false
    }],
    ["element", {
      type: String,
      default: "div"
    }],
    ["tag", {
      type: String,
      default: null
    }],
    ["move", {
      type: Function,
      default: null
    }],
    ["componentData", {
      type: Object,
      required: false,
      default: null
    }]
  ])(
    "should have props %s equal to %o",
    (name, value) => {
      const propsValue = props[name];
      expect(propsValue).toEqual(value);
    }
  )
});