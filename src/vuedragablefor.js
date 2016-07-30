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

    function getFragment(elt){
      return elt.__v_frag;
    }

    function getCollectionFragment(fr){
      if (!fr || !!fr.forId){
        return fr;
      }
      return getCollectionFragment(fr.parentFrag);
    }

    function getVmObject(evt){
      var fragment = getCollectionFragment(getFragment(evt.item));
      return fragment.raw;
    }

    function updatePosition(collection, newIndex, oldIndex ){
      if (!!collection){
        collection.splice(newIndex, 0, collection.splice(oldIndex, 1)[0] );
      }
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
            options = _.isString(options)? JSON.parse(options) : options;
            options = _.merge(options,{
              onUpdate: function (evt) {
                updatePosition(ctx.collection, evt.newIndex, evt.oldIndex);
              },
               onAdd: function (evt) {
                if (!!ctx.collection){
                  var addElement= getVmObject(evt);
                  ctx.collection.splice(evt.newIndex, 0, addElement);
                }
              },
              onRemove: function (evt) {
                var collection = ctx.collection;
                if (!!collection && !evt.clone)
                  collection.splice(evt.oldIndex, 1);
                if (!!evt.clone){
                  //if cloning mode: replace cloned element by orginal element (with original vue binding information)+
                  //re-order element as sortablejs may re-order without sending events 
                  var newIndex = _.indexOf(evt.from.children, evt.clone), oldIndex = evt.oldIndex;
                  evt.from.replaceChild(evt.item, evt.clone);
                  if (newIndex != oldIndex){
                    updatePosition(collection, newIndex, oldIndex);
                  }
                }
              }
            });
            var parent = (!!this.params.root) ? document.getElementById(this.params.root) : this.el.parentElement;
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
    var _ = require("lodash");
    var Sortable =  require("Sortablejs");
    module.exports = buildVueDragFor(_, Sortable);
  } else if (typeof define == "function" && define.amd) {
    define(['lodash', 'Sortable'], function(_, Sortable){ return buildVueDragFor(_, Sortable);});
  } else if ((window.Vue) && (window._) && (window.Sortable)) {
    window.vueDragFor = buildVueDragFor(window._, window.Sortable);
    Vue.use(window.vueDragFor);
  }
})();
