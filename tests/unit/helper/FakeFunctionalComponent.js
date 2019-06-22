export default {
  name: "FakeFunctional",
  functional:true,
  props: {
    prop1: {
      type: String,
      default: "string"
    }
  },
  render(createElement, context) {
    return createElement('button', 'Click me');
  }
}