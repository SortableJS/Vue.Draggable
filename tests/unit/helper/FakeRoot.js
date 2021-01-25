export default {
  name: "FakeRoot",
  props: {
    prop1: {
      type: String,
      default: "string"
    }
  },
  template: `<div class="fake-root" :id="prop1"><slot></slot></div>`
}