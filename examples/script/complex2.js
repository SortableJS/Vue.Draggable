var vm = new Vue({
	el: "#main",
	data: {
		list1:[{name:"John", id:1}, 
				{name:"Joao", id:2}, 
				{name:"Jean", id:3},
				{name:"Gerard", id:4} ],
		list2:[]
		},
	methods:{
			add: function(){
				this.list.push({name:'Juan'});
			},
			replace: function(){
				this.list=[{name:'Edgard'}]
			},
			clone: function(el){
				return {
					name : el.name + ' cloned'
				}
			},
			log: function (evt){
				console.log(evt)
			}
		}
	});
