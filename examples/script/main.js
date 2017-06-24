var id=2;

var vm = new Vue({
	el: "#main",
	data: {
		list: [ {name: "John", id:0}, 
				{name: "Joao", id:1}, 
				{name: "Jean", id:2} ],
		dragging: false
	},
	methods:{
			add: function(){
				this.list.push({name:'Juan '+id, id: id++});
			},
			replace: function(){
				this.list=[{name:'Edgard', id: id++}]
			}
		}
	});
