import { h } from "vue";

const FakeFunctional = (props, context) => {
  return h("button", "Click me");
};

FakeFunctional.props = {
  prop1: {
    type: String,
    default: "string",
  },
};

export default FakeFunctional;
