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
      const ctx = this
      return function (evtData) {
        ctx['onDrag' + evtName].call(ctx, evtData)
        emit.call(ctx, evtName, evtData)
      }
    }

    function install (Vue) {
      const props = {
        options: Object,
        list: Array
      }

      const draggableComponent = {
        props,

        render (h) {
          return h('div', null, this.$slots.default)
        },

        mounted () {
          var optionsAdded = {};
          ['Start', 'Add', 'Remove', 'Update', 'End'].forEach( elt => {
            optionsAdded['on' + elt] = delegateAndEmit.call(this, elt)
          });

          ['Choose', 'Sort', 'Filter', 'Move', 'Clone'].forEach( elt => {
            optionsAdded['on' + elt] = emit.bind(this, elt)
          });

          const options = merge(this.options, optionsAdded)
          this._sortable = new Sortable(this.$el, options)
          this.computeIndexes()
        },

        beforeDestroy () {
          this._sortable.destroy()
        },

        methods: {

          computeIndexes () {
            this.$nextTick( () => {
               this.visibleIndexes = computeIndexes(this.$slots.default, this.$el.children)
            })
          },

          onDragStart (evt) {
            if (!this.list) {
              return
            }         
            const currentIndex = computeVmIndex(this.$slots.default, evt.item)
            const element = this.list[currentIndex]
            this.context = {
              currentIndex,
              element
            }
            evt.item._underlying_vm_ = element
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
            insertNodeAt(this.$el, evt.item, evt.oldIndex)
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
      
      Vue.component('draggable', draggableComponent)
    }
    
    const vueDraggable = {
      install
    }

    return vueDraggable
  }

  if (typeof exports == "object") {
    var Sortable =  require("sortablejs")
    module.exports = buildDraggable(Sortable)
  } else if (typeof define == "function" && define.amd) {
    define(['Sortable'], function(Sortable) { return buildDraggable(Sortable);});
  } else if ( window && (window.Vue) && (window.Sortable)) {
    var draggable = buildDraggable(window.Sortable)
    Vue.use(draggable)
  }
})();
