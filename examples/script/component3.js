var App = new Vue({
  el: '#app',
  methods: {
    handleChange() {
      console.log('times are changing');
    },
    inputChanged(value) {
      this.activeNames = value;
    },
    getComponentData() {
      return {
        on: {
          change: this.handleChange,
          input: this.inputChanged
        },
        props: {
          value: this.activeNames
        }
      };
    }
  },
  data() {
    return {
      activeNames: ['1'],
      sortOptions: {
        group: 'sample',
        animation: 150,
      },
      list: [
        { title: "Consistency", name: '1', description: "Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to" },
        { title: "Feedback", name: '2', description: "Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects" },
        { title: "Efficiency", name: '3', description: "Simplify the process: keep operating process simple and intuitive" },
        { title: "Controllability", name: '4', description: "Decision making: giving advices about operations is acceptable, but do not make decisions for the users" },
      ]
    };
  }
})