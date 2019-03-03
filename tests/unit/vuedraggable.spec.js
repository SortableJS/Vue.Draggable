import { shallowMount } from "@vue/test-utils";
import draggable from "@/vuedraggable";

let wrapper;
let vm;
let props;
let items;
let html;

describe("draggable.vue", () => {
  beforeEach(() => {
    items= ["a", "b", "c"];
    wrapper = shallowMount(draggable,{
      propsData:{
        list: items
      },
      slots:{
        default: items.map(item => `<div>${item}</div>`),
        header: "<h1/>",
        footer: "<footer/>"
      }
    });
    vm = wrapper.vm;
    props = vm.$options.props;
    html = wrapper.element;
  });

  it("should instantiate without error", () => {
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

  it("has a clone props, defaulting with identity function", () => {
    const expected = {};
    const { clone } = props;
    expect(clone.type).toBe(Function);
    expect(clone.default(expected)).toBe(expected);
  })

  it("renders correctly", () => {
    expect(wrapper.html()).toMatch(/^<div>.*<\/div>$/);
  })

  test.each([
    "ul",
    "span",
    "div"
  ])(
    "renders tag %s as root element",
    (tag) => {
      wrapper = shallowMount(draggable, {
        propsData: { tag }
      });
      const expectedRegex = new RegExp(`^<${tag}>.*<\/${tag}>$`);
      expect(wrapper.html()).toMatch(expectedRegex);
    }
  )
});