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
      return (!slots)? [] : Array.prototype.map.call(children, elt => computeVmIndex(slots, elt))
    }

    function emit (evtName, evtData) {
      this.$emit( evtName.toLowerCase(), evtData)
    }

    function delegateAndEmit (evtName) {
      return (evtData) => {
        if (this.list!==null) {
          this['onDrag' + evtName](evtData)
        }
        emit.call(this, evtName, evtData)
      }
    }

    const eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End'];
    const eventsToEmit = ['Choose', 'Sort', 'Filter', 'Clone'];
    const readonlyProperties = ['Move'].concat(eventsListened).concat(eventsToEmit).map(evt => 'on'+evt);
  
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
      },
      move: {
        type: Function,
        default: null
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
        var optionsAdded = {};
        eventsListened.forEach( elt => {
          optionsAdded['on' + elt] = delegateAndEmit.call(this, elt)
        });

        eventsToEmit.forEach( elt => {
          optionsAdded['on' + elt] = emit.bind(this, elt)
        });

        const options = Object.assign({}, this.options, optionsAdded, { onMove: evt => {return this.onDragMove(evt);} })
        this._sortable = new Sortable(this.rootContainer, options)
        this.computeIndexes()
      },

      beforeDestroy () {
        this._sortable.destroy()
      },

      computed : {
        rootContainer () {
          return this.transitionMode? this.$el.children[0] : this.$el;
        }
      },

      watch: {
        options (newOptionValue){
          for(var property in newOptionValue) {
            if (readonlyProperties.indexOf(property)==-1) {
              this._sortable.option(property, newOptionValue[property] );
            }        
          }         
        },

        list(){
          this.computeIndexes()
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

        getUnderlyingVm (htmlElt) {
          const currentIndex = computeVmIndex(this.getChildrenNodes(), htmlElt)
          const element = this.list[currentIndex]
          return {currentIndex, element}
        },

        getUnderlyingPotencialDraggableComponent ({__vue__}) {
          if (!__vue__){
            return __vue__
          }

          if (__vue__.$options._componentTag==="transition-group") {
            return __vue__.$parent
          }

          return __vue__
        },

        getRelatedContextFromMoveEvent({to, related}) {
          const component = this.getUnderlyingPotencialDraggableComponent(to)
          if (!component) {
            return {component}
          }
          const list = component.list
          const context = {list, component}
          if (to !== related && list && component.getUnderlyingVm) {
            const destination = component.getUnderlyingVm(related)
            return Object.assign(destination, context)
          }

          return context
        },

        onDragStart (evt) {      
          this.context = this.getUnderlyingVm(evt.item)
          evt.item._underlying_vm_ = this.clone(this.context.element)
        },

        onDragAdd (evt) {
          const element = evt.item._underlying_vm_
          if (element === undefined) {
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
          removeNode(evt.item)
          insertNodeAt(evt.from, evt.item, evt.oldIndex)
          const oldIndexVM = this.context.currentIndex
          const newIndexVM = this.visibleIndexes[evt.newIndex]
          updatePosition(this.list, oldIndexVM, newIndexVM)
        },

        onDragMove (evt) {
          const onMove = this.move
          if (!onMove || !this.list) {
            return true
          }

          const relatedContext = this.getRelatedContextFromMoveEvent(evt)
          const draggedContext = this.context
          Object.assign(evt, {relatedContext, draggedContext})
          return onMove(evt)
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
