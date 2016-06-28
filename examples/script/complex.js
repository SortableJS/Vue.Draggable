var vm = new Vue({
	el: "#main",
	data: {
		list1:[{name:"John"}, 
				{name:"Joao"}, 
				{name:"Jean"} ],
		list2:[{name:"Juan"}, 
				{name:"Edgard"}, 
				{name:"Johnson"} ]
		},
	methods:{
			add: function(){
				this.list.push({name:'Juan'});
			},
			replace: function(){
				this.list=[{name:'Edgard'}]
			}
		}
	});
