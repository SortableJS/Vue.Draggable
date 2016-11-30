(function() {
  "use strict";

  function buildDraggable(Sortable) {
    function removeNode (node) {
      node.parentElement.removeChild(node)
    }

    function insertNodeAt (fatherNode, node, position) {
      if (position < fatherNode.children.length) {
        fatherNode.insertBefore(node, fatherNode.children[position])
      } else {
        fatherNode.appendChild(node)
      }
    }

    function computeVmIndex (vnodes, element) {
      return vnodes.map(elt => elt.elm).indexOf(element)
    }

    function updatePosition (collection, oldIndex, newIndex) {
      if (collection) {
        collection.splice(newIndex, 0, collection.splice(oldIndex, 1)[0])
      }
    }

    function computeIndexes (slots, children) {
      if (!slots){
        return []
      }
      return Array.prototype.map.call(children, elt => computeVmIndex(slots, elt))
    }

    function merge (target, source) {
      var output = Object(target)
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey]
        }
      }
      return output
    }

    function emit (evtName, evtData) {
      this.$emit( evtName.toLowerCase(), evtData)
    }

    function delegateAndEmit (evtName) {
      return (evtData) => {
        this['onDrag' + evtName](evtData)
        emit.call(this, evtName, evtData)
      }
    }
  
    const props = {
      options: Object,
      list: { 
        type: Array,
        required: false,
        default: null
      },
      clone: {
        type: Function,
        default : (original) => { return original;}
      },
      element: {
        type: String,
        default: 'div'
      }
    }

    const draggableComponent = {
      props,

      data() {
        return {
          transitionMode: false
        }
      },

      render (h) {
        if (this.$slots.default && this.$slots.default.length===1) {
          const child = this.$slots.default[0]
          if (child.componentOptions && child.componentOptions.tag==="transition-group") { 
            this.transitionMode = true
          }
        }
        return h(this.element, null, this.$slots.default);
      },

      mounted () {
        this._sortable = new Sortable(this.rootContainer, this.computedOptions)
        this.computeIndexes()
      },

      beforeDestroy () {
        this._sortable.destroy()
      },

      updated () {
        this.computeIndexes()
      },

      computed : {
        rootContainer () {
          return this.transitionMode? this.$el.children[0] : this.$el;
        },

        computedOptions () {
          var optionsAdded = {};
          ['Start', 'Add', 'Remove', 'Update', 'End'].forEach( elt => {
            optionsAdded['on' + elt] = delegateAndEmit.call(this, elt)
          });

          ['Choose', 'Sort', 'Filter', 'Move', 'Clone'].forEach( elt => {
            optionsAdded['on' + elt] = emit.bind(this, elt)
          });

          return merge(this.options, optionsAdded);
        }
      },

      watch: {
        computedOptions (newValue){
          for(var property in newValue){
            this._sortable.option(property, newValue[property]);
          }         
        }
      },

      methods: {
        getChildrenNodes () {
          const rawNodes = this.$slots.default
          return this.transitionMode? rawNodes[0].child.$slots.default : rawNodes
        },

        computeIndexes () {
          this.$nextTick( () => {
             this.visibleIndexes = computeIndexes(this.getChildrenNodes(), this.rootContainer.children)
          })
        },

        onDragStart (evt) {
          if (!this.list) {
            return
          }         
          const currentIndex = computeVmIndex(this.getChildrenNodes(), evt.item)
          const element = this.list[currentIndex]
          this.context = {
            currentIndex,
            element
          }
          evt.item._underlying_vm_ = this.clone(element)
        },

        onDragAdd (evt) {
          const element = evt.item._underlying_vm_
          if (!this.list || element === undefined) {
            return
          }
          removeNode(evt.item)
          const indexes = this.visibleIndexes
          const domNewIndex = evt.newIndex
          const numberIndexes = indexes.length
          const newIndex = (domNewIndex > numberIndexes - 1) ? numberIndexes : indexes[domNewIndex]
          this.list.splice(newIndex, 0, element)
          this.computeIndexes()
        },

        onDragRemove (evt) {
          if (!this.list) {
            return
          }
          insertNodeAt(this.rootContainer, evt.item, evt.oldIndex)
          const isCloning = !!evt.clone
          if (isCloning) {
            removeNode(evt.clone)
            return
          }
          const oldIndex = this.context.currentIndex
          this.list.splice(oldIndex, 1)
        },

        onDragUpdate (evt) {
          if (!this.list) {
            return
          }
          removeNode(evt.item)
          insertNodeAt(evt.from, evt.item, evt.oldIndex)
          const oldIndexVM = this.context.currentIndex
          const newIndexVM = this.visibleIndexes[evt.newIndex]
          updatePosition(this.list, oldIndexVM, newIndexVM)
        },

        onDragEnd (evt) {
          this.computeIndexes()
        }
      }
    }    
    return draggableComponent
  }

  if (typeof exports == "object") {
    var Sortable =  require("sortablejs")
    module.exports = buildDraggable(Sortable)
  } else if (typeof define == "function" && define.amd) {
    define(['Sortable'], function(Sortable) { return buildDraggable(Sortable);});
  } else if ( window && (window.Vue) && (window.Sortable)) {
    var draggable = buildDraggable(window.Sortable)
    Vue.component('draggable', draggable)
  }
})();
