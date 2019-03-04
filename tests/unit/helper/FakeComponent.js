export default {
  name: "Fake",
  props: {
    prop1: {
      type: String,
      default: "string"
    }
  },
  template: "<div>{{prop1}}</div>"
}