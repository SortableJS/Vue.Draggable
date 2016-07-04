(function(){
  function buildVueDragFor(_, Sortable){

    function mix(source, functions){
      _.forEach(['bind', 'update', 'unbind'],function(value){
          var original = source[value];
          source[value] = function(){
            functions[value].apply(this, arguments);
            return original.apply(this, arguments);
          };
      });
    }
    
    var vueDragFor = {
      install : function(Vue) {
        var forDirective = Vue.directive('for');
        var dragableForDirective = _.clone(forDirective);
        dragableForDirective.params = dragableForDirective.params.concat('root', 'options');

        mix(dragableForDirective, {
          bind : function () {    
            var ctx = this;    
            var options = this.params.options;
            options = (typeof options === "string") ? JSON.parse(options) : options;
            options = _.merge(options,{
              onUpdate: function (evt) {
                var collection = ctx.collection;
                if (!!collection)
                  collection.splice(evt.newIndex, 0, collection.splice(evt.oldIndex, 1)[0] );
              },
              onAdd: function (evt) {
                var directive = evt.from.__directive;
                if ((!!directive) && (!!ctx.collection))
                  ctx.collection.splice(evt.newIndex, 0, directive.collection[evt.oldIndex]);
              },
              onRemove: function (evt) {
                if (!!ctx.collection)
                  ctx.collection.splice(evt.oldIndex, 1);
              }
            });
            var parent = (!!this.params.root) ? document.getElementById(this.params.root) : this.el.parentElement;
            parent.__directive = this;
            this._sortable = new Sortable(parent, options);
          },
          update : function (value){
            if ((!!value) && (!Array.isArray(value)))
              throw new Error('should received an Array');

            this.collection = value;
          },
          unbind : function (){
            this._sortable.destroy();
          }
        });

        Vue.directive('dragable-for', dragableForDirective);
      }
    };
    return vueDragFor;
  }

  if (typeof exports == "object") {
    var _ = require("lodash.js");
    var Sortable =  require("Sortable.js");
    module.exports = buildVueDragFor(_, Sortable);
  } else if (typeof define == "function" && define.amd) {
    define(['lodash', 'Sortable'], function(_, Sortable){ return buildVueDragFor(_, Sortable);});
  } else if ((window.Vue) && (window._) && (window.Sortable)) {
    window.vueDragFor = buildVueDragFor(window._, window.Sortable);
    Vue.use(window.vueDragFor);
  }
})();
