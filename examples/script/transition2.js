var count =323;

var vm = new Vue({
  el: '#main',
  name: 'mfgActivity',
  data: {
    jobs: [
      {
        jobNumber: "14037-12"
      },
      {
        jobNumber: "14038-13"
      },
      {
        jobNumber: "14048-15"
      }
    ],
    drag: false
  },
  methods: {
    removeJob: function (index) {
      // Remove job from GUI
      this.jobs.splice(index, 1);
    },
    add: function () {
      this.jobs.push({jobNumber: "14037-"+ count++})
    }
  }
})