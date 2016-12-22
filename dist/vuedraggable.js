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
      if (!slots) {
        return [];
      }
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
        var res = _this['onDrag' + evtName](evtData);
        if (res) {
          emit.call(_this, evtName, evtData);
        }
        return res;
      };
    }

    var eventsListened = ['Start', 'Add', 'Remove', 'Update', 'Move', 'End'];
    var eventsToEmit = ['Choose', 'Sort', 'Filter', 'Clone'];
    var readonlyProperties = eventsListened.concat(eventsToEmit).map(function (evt) {
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

        var options = merge(this.options, optionsAdded);
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
        onDragStart: function onDragStart(evt) {
          if (!this.list) {
            return true;
          }
          this.context = this.getUnderlyingVm(evt.item);
          evt.item._underlying_vm_ = this.clone(this.context.element);
          return true;
        },
        onDragAdd: function onDragAdd(evt) {
          var element = evt.item._underlying_vm_;
          if (!this.list || element === undefined) {
            return true;
          }
          removeNode(evt.item);
          var indexes = this.visibleIndexes;
          var domNewIndex = evt.newIndex;
          var numberIndexes = indexes.length;
          var newIndex = domNewIndex > numberIndexes - 1 ? numberIndexes : indexes[domNewIndex];
          this.list.splice(newIndex, 0, element);
          this.computeIndexes();
          return true;
        },
        onDragRemove: function onDragRemove(evt) {
          if (!this.list) {
            return true;
          }
          insertNodeAt(this.rootContainer, evt.item, evt.oldIndex);
          var isCloning = !!evt.clone;
          if (isCloning) {
            removeNode(evt.clone);
            return true;
          }
          var oldIndex = this.context.currentIndex;
          this.list.splice(oldIndex, 1);
          return true;
        },
        onDragUpdate: function onDragUpdate(evt) {
          if (!this.list) {
            return true;
          }
          removeNode(evt.item);
          insertNodeAt(evt.from, evt.item, evt.oldIndex);
          var oldIndexVM = this.context.currentIndex;
          var newIndexVM = this.visibleIndexes[evt.newIndex];
          updatePosition(this.list, oldIndexVM, newIndexVM);
          return true;
        },
        onDragMove: function onDragMove(evt) {
          var validate = this.validateMove;
          if (!validate || !list) {
            return true;
          }

          var targetComponent = evt.to.__vue__;
          if (targetComponent) {
            var destination = targetComponent.getUnderlyingVm(evt.related);
            console.log('destination', destination);
          }
          console.log('source', this.context);
          return validate(evt);
        },
        onDragEnd: function onDragEnd(evt) {
          this.computeIndexes();
          return true;
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