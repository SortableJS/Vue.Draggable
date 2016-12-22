var vm = new Vue({
	el: "#main",
	data: {
		list: [
			{name: "John"}, 
			{name: "Joao"}, 
			{name: "Jean"} 
		],
		list2: [],
		dragging: false
	},
	methods:{
		checkMove: function(evt){
			return false;
		}
	}
});
