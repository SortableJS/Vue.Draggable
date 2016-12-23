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
      return !slots ? [] : Array.prototype.map.call(children, function (elt) {
        return computeVmIndex(slots, elt);
      });
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

    var eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End'];
    var eventsToEmit = ['Choose', 'Sort', 'Filter', 'Clone'];
    var readonlyProperties = ['Move'].concat(eventsListened).concat(eventsToEmit).map(function (evt) {
      return 'on' + evt;
    });

    var props = {
      options: Object,
      list: {
        type: Array,
        required: false,
        default: null
      },
      clone: {
        type: Function,
        default: function _default(original) {
          return original;
        }
      },
      element: {
        type: String,
        default: 'div'
      },
      validateMove: {
        type: Function,
        default: null
      }
    };

    var draggableComponent = {
      props: props,

      data: function data() {
        return {
          transitionMode: false
        };
      },
      render: function render(h) {
        if (this.$slots.default && this.$slots.default.length === 1) {
          var child = this.$slots.default[0];
          if (child.componentOptions && child.componentOptions.tag === "transition-group") {
            this.transitionMode = true;
          }
        }
        return h(this.element, null, this.$slots.default);
      },
      mounted: function mounted() {
        var _this2 = this;

        var optionsAdded = {};
        eventsListened.forEach(function (elt) {
          optionsAdded['on' + elt] = delegateAndEmit.call(_this2, elt);
        });

        eventsToEmit.forEach(function (elt) {
          optionsAdded['on' + elt] = emit.bind(_this2, elt);
        });

        var options = Object.assign({}, this.options, optionsAdded, { onMove: function onMove(evt) {
            return _this2.onDragMove(evt);
          } });
        this._sortable = new Sortable(this.rootContainer, options);
        this.computeIndexes();
      },
      beforeDestroy: function beforeDestroy() {
        this._sortable.destroy();
      },
      updated: function updated() {
        this.computeIndexes();
      },


      computed: {
        rootContainer: function rootContainer() {
          return this.transitionMode ? this.$el.children[0] : this.$el;
        }
      },

      watch: {
        options: function options(newOptionValue) {
          for (var property in newOptionValue) {
            if (readonlyProperties.indexOf(property) == -1) {
              this._sortable.option(property, newOptionValue[property]);
            }
          }
        }
      },

      methods: {
        getChildrenNodes: function getChildrenNodes() {
          var rawNodes = this.$slots.default;
          return this.transitionMode ? rawNodes[0].child.$slots.default : rawNodes;
        },
        computeIndexes: function computeIndexes() {
          var _this3 = this;

          this.$nextTick(function () {
            _this3.visibleIndexes = _computeIndexes(_this3.getChildrenNodes(), _this3.rootContainer.children);
          });
        },
        getUnderlyingVm: function getUnderlyingVm(htmlElt) {
          var currentIndex = computeVmIndex(this.getChildrenNodes(), htmlElt);
          var element = this.list[currentIndex];
          return { currentIndex: currentIndex, element: element };
        },
        getUnderlyingPotencialDraggableComponent: function getUnderlyingPotencialDraggableComponent(_ref) {
          var __vue__ = _ref.__vue__;

          if (!__vue__) {
            return __vue__;
          }

          if (__vue__.$options._componentTag === "transition-group") {
            return __vue__.$parent;
          }

          return __vue__;
        },
        getRelatedContextFromMoveEvent: function getRelatedContextFromMoveEvent(_ref2) {
          var to = _ref2.to;
          var related = _ref2.related;

          var component = this.getUnderlyingPotencialDraggableComponent(to);
          if (!component) {
            return { component: component };
          }
          var list = component.list;
          var context = { list: list, component: component };
          if (to !== related && list && component.getUnderlyingVm) {
            var destination = component.getUnderlyingVm(related);
            Object.assign(destination, context);
            return destination;
          }

          return context;
        },
        onDragStart: function onDragStart(evt) {
          if (!this.list) {
            return;
          }
          this.context = this.getUnderlyingVm(evt.item);
          evt.item._underlying_vm_ = this.clone(this.context.element);
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
          insertNodeAt(this.rootContainer, evt.item, evt.oldIndex);
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
        onDragMove: function onDragMove(evt) {
          var validate = this.validateMove;
          if (!validate || !this.list) {
            return true;
          }

          var relatedContext = this.getRelatedContextFromMoveEvent(evt);
          var draggedContext = this.context;
          Object.assign(evt, { relatedContext: relatedContext, draggedContext: draggedContext });
          return validate(evt);
        },
        onDragEnd: function onDragEnd(evt) {
          this.computeIndexes();
        }
      }
    };
    return draggableComponent;
  }

  if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) == "object") {
    var Sortable = require("sortablejs");
    module.exports = buildDraggable(Sortable);
  } else if (typeof define == "function" && define.amd) {
    define(['Sortable'], function (Sortable) {
      return buildDraggable(Sortable);
    });
  } else if (window && window.Vue && window.Sortable) {
    var draggable = buildDraggable(window.Sortable);
    Vue.component('draggable', draggable);
  }
})();