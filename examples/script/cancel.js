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
		dragging: false,
		targetElement: null,
		canDrag:null
	},
	methods:{
		checkMove: function(evt){
			var res = true
			this.targetElement = evt.relatedContext.element

			if (evt.draggedContext.element.name=='apple'){
				res = false
			}

			if (evt.relatedContext.element && evt.relatedContext.element.name=='strawberry'){
				res = false
			}

			if (evt.relatedContext.list.length==2){
				res = false
			}
			this.canDrag=res;
			return res;
		},
		endDrag: function () {
			this.canDrag=null;
			this.targetElement=null;
		}
	}
});
