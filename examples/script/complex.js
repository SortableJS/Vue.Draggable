var vm = new Vue({
	el: "#main",
	data: {
		list1:[{name:"John", id:1}, 
				{name:"Joao", id:2}, 
				{name:"Jean", id:3},
				{name:"Gerard", id:4} ],
		list2:[{name:"Juan", id:5}, 
				{name:"Edgard", id:6}, 
				{name:"Johnson", id:7} ]
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
