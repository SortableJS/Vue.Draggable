var vm = new Vue({
    el: '#main',
    name: 'mfgActivity',
    data: {
    	machines: [
      	{
        	name: "H1",
          id: 1,
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
          ]
        }
      ]
    },
    methods: {
  		removeJob: function(machineId, jobNumber, jobs, index) {
      	// Remove job from GUI
        jobs.splice(index, 1);
      }
    }
})