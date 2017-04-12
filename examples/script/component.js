Vue.use(VueMaterial)

var App = new Vue({
  el: '#app',
  data() {
    return {
      sortOptions: {
        group: 'sample',
        animation: 150,
      },
      listA: [
        { id: 1, name: 'some'},
        { id: 2, name: 'more'},
        { id: 2, name: 'samples'},
      ],
      listB: [
        { id: 3, name: 'other'},
        { id: 4, name: 'examples'},
      ],
    };
  }
})