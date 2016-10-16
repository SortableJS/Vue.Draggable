'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  "use strict";

  function buildDraggable(Sortable) {
    function removeNode(node) {
      node.parentElement.removeChild(node);
    }

    function insertNodeAt(fatherNode, node, position) {
      if (position < fatherNode.children.length) {
        fatherNode.insertBefore(node, fatherNode.children[position]);
      } else {
        fatherNode.appendChild(node);
      }
    }

    function computeVmIndex(vnodes, element) {
      return vnodes.map(function (elt) {
        return elt.elm;
      }).indexOf(element);
    }

    function updatePosition(collection, oldIndex, newIndex) {
      if (collection) {
        collection.splice(newIndex, 0, collection.splice(oldIndex, 1)[0]);
      }
    }

    function _computeIndexes(slots, children) {
      return Array.prototype.map.call(children, function (elt) {
        return computeVmIndex(slots, elt);
      });
    }

    function merge(target, source) {
      var output = Object(target);
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
      return output;
    }

    function emit(evtName, evtData) {
      this.$emit(evtName.toLowerCase(), evtData);
    }

    function delegateAndEmit(evtName) {
      var _this = this;

      return function (evtData) {
        _this['onDrag' + evtName](evtData);
        emit.call(_this, evtName, evtData);
      };
    }

    var props = {
      options: Object,
      list: {
        type: Array,
        required: false,
        default: null
      }
    };

    var draggableComponent = {
      props: props,

      render: function render(h) {
        return h('div', null, this.$slots.default);
      },
      mounted: function mounted() {
        var _this2 = this;

        var optionsAdded = {};
        ['Start', 'Add', 'Remove', 'Update', 'End'].forEach(function (elt) {
          optionsAdded['on' + elt] = delegateAndEmit.call(_this2, elt);
        });

        ['Choose', 'Sort', 'Filter', 'Move', 'Clone'].forEach(function (elt) {
          optionsAdded['on' + elt] = emit.bind(_this2, elt);
        });

        var options = merge(this.options, optionsAdded);
        this._sortable = new Sortable(this.$el, options);
        this.computeIndexes();
      },
      beforeDestroy: function beforeDestroy() {
        this._sortable.destroy();
      },
      updated: function updated() {
        this.computeIndexes();
      },


      methods: {
        computeIndexes: function computeIndexes() {
          var _this3 = this;

          this.$nextTick(function () {
            _this3.visibleIndexes = _computeIndexes(_this3.$slots.default, _this3.$el.children);
          });
        },
        onDragStart: function onDragStart(evt) {
          if (!this.list) {
            return;
          }
          var currentIndex = computeVmIndex(this.$slots.default, evt.item);
          var element = this.list[currentIndex];
          this.context = {
            currentIndex: currentIndex,
            element: element
          };
          evt.item._underlying_vm_ = element;
        },
        onDragAdd: function onDragAdd(evt) {
          var element = evt.item._underlying_vm_;
          if (!this.list || element === undefined) {
            return;
          }
          removeNode(evt.item);
          var indexes = this.visibleIndexes;
          var domNewIndex = evt.newIndex;
          var numberIndexes = indexes.length;
          var newIndex = domNewIndex > numberIndexes - 1 ? numberIndexes : indexes[domNewIndex];
          this.list.splice(newIndex, 0, element);
          this.computeIndexes();
        },
        onDragRemove: function onDragRemove(evt) {
          if (!this.list) {
            return;
          }
          insertNodeAt(this.$el, evt.item, evt.oldIndex);
          var isCloning = !!evt.clone;
          if (isCloning) {
            removeNode(evt.clone);
            return;
          }
          var oldIndex = this.context.currentIndex;
          this.list.splice(oldIndex, 1);
        },
        onDragUpdate: function onDragUpdate(evt) {
          if (!this.list) {
            return;
          }
          removeNode(evt.item);
          insertNodeAt(evt.from, evt.item, evt.oldIndex);
          var oldIndexVM = this.context.currentIndex;
          var newIndexVM = this.visibleIndexes[evt.newIndex];
          updatePosition(this.list, oldIndexVM, newIndexVM);
        },
        onDragEnd: function onDragEnd(evt) {
          this.computeIndexes();
        }
      }
    };

    return draggableComponent;
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