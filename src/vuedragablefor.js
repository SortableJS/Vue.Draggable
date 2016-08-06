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

    function getRootFragment(elt){
      return getCollectionFragment(getFragment(elt));
    }

    function getVmObject(elt){
      var fragment = getRootFragment(elt);
      return fragment.scope.element;
    }

    function removeNode(node){
      node.parentElement.removeChild(node);
    }

    function insertNodeBefore(fatherNode, node, beforeNode){
      if (!!beforeNode)
        fatherNode.insertBefore(node, beforeNode);
      else
        fatherNode.appendChild(node);
    }

    function computeIndexes(nodes){
      return nodes.map(getRootFragment).filter(function(elt){return !!elt;}).map(function (elt){return (elt).scope.$index;}).value();
    }
    
    var vueDragFor = {
      install : function(Vue) {
        var forDirective = Vue.directive('for');
        var dragableForDirective = _.clone(forDirective);
        dragableForDirective.params = dragableForDirective.params.concat('root', 'options');
        var rightElement;

        function insertAtOriginalPlace(evt){
          removeNode(evt.item);
          insertNodeBefore(evt.from, evt.item, rightElement) 
        }

        mix(dragableForDirective, {
          bind : function () {    
            var ctx = this;    
            var options = this.params.options;
            var indexes;

            function updatePosition(collection, newIndex, oldIndex ){
              var realnew = indexes[newIndex], realOld = indexes[oldIndex];
              if (!!collection){
                collection.splice(realnew, 0, collection.splice(realOld, 1)[0] );
              }
            }

            options = _.isString(options)? JSON.parse(options) : options;
            options = _.merge(options,{
              onStart: function (evt) {
                rightElement = evt.item.nextSibling;
                indexes = computeIndexes(_.chain(evt.from.children));
              },
              onUpdate: function (evt) {
                updatePosition(ctx.collection, evt.newIndex, evt.oldIndex);
                insertAtOriginalPlace(evt);
              },
              onAdd: function (evt) {
                indexes =  computeIndexes(_.chain(evt.to.children).filter(function(elt){return elt!==evt.item;}));
                if (!!ctx.collection){
                  var addElement= getVmObject(evt.item);
                  var length = indexes.length;
                  if (evt.newIndex>= length){
                    ctx.collection.push(addElement);
                  }
                  else{
                    var newIndex =  indexes[evt.newIndex];
                    ctx.collection.splice(newIndex, 0, addElement);
                  }
                  insertAtOriginalPlace(evt);            
                }
              },
              onRemove: function (evt) {
                var collection = ctx.collection, cloning = !!evt.clone;
                if (!!collection && !cloning){
                  var realOld = indexes[evt.oldIndex];
                  collection.splice(realOld, 1);
                }
                if (cloning){    
                  removeNode(evt.clone);           
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
