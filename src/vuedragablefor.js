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
        options = _.merge(options,{
          onUpdate: function (evt) {
              var collection = ctx.collection;
              if (!!collection)
                collection.splice(evt.newIndex, 0, collection.splice(evt.oldIndex, 1)[0] );
          },
          onAdd: function (evt) {
              var itemEl = evt.item;  // dragged HTMLElement
              var directive = evt.from.__directive;  // previous list
              if (!directive)
                return;
             ctx.collection.splice(evt.newIndex, 0, directive.collection[evt.oldIndex]);
          },
          onRemove: function (evt) {
          }
        });
        var parent = this.el.parentElement;
        parent.__directive = this;
        console.log(options);
        //var option =
        this.sortable = new Sortable(parent, options);
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
