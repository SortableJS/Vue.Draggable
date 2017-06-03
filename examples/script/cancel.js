var vm = new Vue({
	el: "#main",
	data: {
		list: [
			{name: "apple"}, 
			{name: "banana"}, 
			{name: "pinapple"},
			{name: "grape"},
			{name: "strawberry"},
			{name: 'odd'},
			{name: 'pair'}
		],
		list2: [],
		dragging: false,
		targetElement: null,
		canDrag:null,
		futureIndex:null
	},
	methods:{
		privateCheckMove: function(evt){
			this.targetElement = evt.relatedContext.element

			// if (evt.draggedContext.element.name=='odd'){
			// 	return evt.draggedContext.futureIndex % 2 === 1
			// }

			// if (evt.draggedContext.element.name=='pair'){
			// 	return evt.draggedContext.futureIndex % 2 === 0
			// }

			// if (evt.draggedContext.element.name=='apple'){
			// 	return false
			// }

			// if (evt.relatedContext.element && evt.relatedContext.element.name=='strawberry'){
			// 	return false
			// }

			// if (evt.relatedContext.list.length==2){
			// 	return false
			// }
			return true;
		},
		checkMove: function(evt){
			res = this.privateCheckMove(evt)
			this.canDrag=res;
			this.futureIndex = evt.draggedContext.futureIndex;
			return res;
		},
		endDrag: function () {
			this.canDrag=null;
			this.targetElement=null;
			this.futureIndex =null;
		},
		startDrag: function (evt) {
			console.log(evt)
		}
	}
});
