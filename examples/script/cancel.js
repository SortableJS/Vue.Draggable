var vm = new Vue({
	el: "#main",
	data: {
		list: [ {name: "John"}, 
				{name: "Joao"}, 
				{name: "Jean"} ],
		dragging: false
	},
	methods:{
		checkMove: function(evt){
			console.log(evt);
			return false;
		}
	}
});
