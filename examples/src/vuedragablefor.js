(function(){

  var forDirective = Vue.directive('for');
  var dragableForDirective = _.clone(forDirective);
  dragableForDirective.params = dragableForDirective.params.concat('root', 'options');

  function mix(source, functions){
    _.forEach(['bind', 'update', 'unbind'],function(value){
        var original = source[value];
        source[value] = function(){
          functions[value].apply(this, arguments);
          return original.apply(this, arguments);
        };
    });
  }

   mix(dragableForDirective, {
      bind : function () {    
        var ctx = this;    
        var options = this.params.options;
        if (typeof options === "string")
          options = JSON.parse(options);
        console.log(options);
        options = _.merge(options,{
          onUpdate: function (evt) {
              console.log(evt.oldIndex, evt.newIndex);
              var collection = ctx.collection;
              if (!!collection)
                collection.splice(evt.newIndex, 0, collection.splice(evt.oldIndex, 1)[0] );
          },
          onAdd: function (evt) {
              var itemEl = evt.item;  // dragged HTMLElement
              evt.from;  // previous list
          },
          onRemove: function (evt) {
          }
        });
        console.log(options);
        //var option =
        this.sortable = new Sortable(this.el.parentElement, options);
      },
      update : function (value){

        if ((value!==null) && (!Array.isArray(value)))
          throw new Error('should received an Array');

        console.log('update', value);
        this.collection = value;
      },
      unbind : function (){}
   });
     
  Vue.directive('dragable-for', dragableForDirective);

})();
