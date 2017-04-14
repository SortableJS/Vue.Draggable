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
    jobs2: [
      {
        jobNumber: "14055-23"
      },
      {
        jobNumber: "14089-10"
      }
    ],
    drag: false
  },
  methods: {
    removeJob: function (arr, index) {
      // Remove job from GUI
      arr.splice(index, 1);
    },
    add: function () {
      this.jobs.push({jobNumber: "14022-"+ count++})
    },
    add2: function () {
      this.jobs2.push({jobNumber: "14046-"+ count++})
    }
  }
})