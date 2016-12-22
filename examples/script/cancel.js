var vm = new Vue({
	el: "#main",
	data: {
		list: [
			{name: "apple"}, 
			{name: "banana"}, 
			{name: "pinapple"},
			{name: "grape"},
			{name: "strawberry"},
		],
		list2: [],
		dragging: false
	},
	methods:{
		checkMove: function(evt){
			console.log(evt)

			if (evt.draggedContext.element.name=='apple'){
				return false;
			}

			if (evt.relatedContext.element && evt.relatedContext.element.name=='strawberry'){
				return false;
			}

			if (evt.relatedContext.list.length==2){
				return false;
			}

			return true;
		}
	}
});
