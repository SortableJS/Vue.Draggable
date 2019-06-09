import Sortable from 'sortablejs';

function getConsole() {
  if (typeof window !== "undefined") {
    return window.console;
  }

  return global.console;
}

var console = getConsole();

function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

var regex = /-(\w)/g;
var camelize = cached(function (str) { return str.replace(regex, function (_, c) { return c ? c.toUpperCase() : ""; }); });

function removeNode(node) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node);
  }
}

function insertNodeAt(fatherNode, node, position) {
  var refNode = position === 0 ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling;
  fatherNode.insertBefore(node, refNode);
}

function buildAttribute(object, propName, value) {
  if (value === undefined) {
    return object;
  }

  object = object || {};
  object[propName] = value;
  return object;
}

function computeVmIndex(vnodes, element) {
  return vnodes.map(function (elt) { return elt.elm; }).indexOf(element);
}

function computeIndexes(slots, children, isTransition, footerOffset) {
  if (!slots) {
    return [];
  }

  var elmFromNodes = slots.map(function (elt) { return elt.elm; });
  var footerIndex = children.length - footerOffset;
  var rawIndexes = [].concat( children ).map(function (elt, idx) { return idx >= footerIndex ? elmFromNodes.length : elmFromNodes.indexOf(elt); });
  return isTransition ? rawIndexes.filter(function (ind) { return ind !== -1; }) : rawIndexes;
}

function emit(evtName, evtData) {
  var this$1 = this;

  this.$nextTick(function () { return this$1.$emit(evtName.toLowerCase(), evtData); });
}

function delegateAndEmit(evtName) {
  var this$1 = this;

  return function (evtData) {
    if (this$1.realList !== null) {
      this$1["onDrag" + evtName](evtData);
    }

    emit.call(this$1, evtName, evtData);
  };
}

function isTransition(slots) {
  if (!slots || slots.length !== 1) {
    return false;
  }

  var componentOptions = slots[0].componentOptions;

  if (!componentOptions) {
    return false;
  }

  return ["transition-group", "TransitionGroup"].includes(componentOptions.tag);
}

function computeChildrenAndOffsets(children, ref) {
  var header = ref.header;
  var footer = ref.footer;

  var headerOffset = 0;
  var footerOffset = 0;

  if (header) {
    headerOffset = header.length;
    children = children ? header.concat( children) : [].concat( header );
  }

  if (footer) {
    footerOffset = footer.length;
    children = children ? children.concat( footer) : [].concat( footer );
  }

  return {
    children: children,
    headerOffset: headerOffset,
    footerOffset: footerOffset
  };
}

function getComponentAttributes($attrs, componentData) {
  var attributes = null;

  var update = function (name, value) {
    attributes = buildAttribute(attributes, name, value);
  };

  var attrs = Object.keys($attrs).filter(function (key) { return key === "id" || key.startsWith("data-"); }).reduce(function (res, key) {
    res[key] = $attrs[key];
    return res;
  }, {});
  update("attrs", attrs);

  if (!componentData) {
    return attributes;
  }

  var on = componentData.on;
  var props = componentData.props;
  var componentDataAttrs = componentData.attrs;
  update("on", on);
  update("props", props);
  Object.assign(attributes.attrs, componentDataAttrs);
  return attributes;
}

var eventsListened = ["Start", "Add", "Remove", "Update", "End"];
var eventsToEmit = ["Choose", "Sort", "Filter", "Clone"];
var readonlyProperties = ["Move" ].concat( eventsListened, eventsToEmit).map(function (evt) { return "on" + evt; });
var draggingElement = null;
var props = {
  options: Object,
  list: {
    type: Array,
    required: false,
    default: null
  },
  value: {
    type: Array,
    required: false,
    default: null
  },
  noTransitionOnDrag: {
    type: Boolean,
    default: false
  },
  clone: {
    type: Function,
    default: function (original) {
      return original;
    }
  },
  element: {
    type: String,
    default: "div"
  },
  tag: {
    type: String,
    default: null
  },
  move: {
    type: Function,
    default: null
  },
  componentData: {
    type: Object,
    required: false,
    default: null
  }
};
var draggableComponent = {
  name: "draggable",
  inheritAttrs: false,
  props: props,

  data: function data() {
    return {
      transitionMode: false,
      noneFunctionalComponentMode: false,
      init: false
    };
  },

  render: function render(h) {
    var slots = this.$slots.default;
    this.transitionMode = isTransition(slots);
    var ref = computeChildrenAndOffsets(slots, this.$slots);
    var children = ref.children;
    var headerOffset = ref.headerOffset;
    var footerOffset = ref.footerOffset;
    this.headerOffset = headerOffset;
    this.footerOffset = footerOffset;
    var attributes = getComponentAttributes(this.$attrs, this.componentData);
    return h(this.getTag(), attributes, children);
  },

  created: function created() {
    if (this.list !== null && this.value !== null) {
      console.error("Value and list props are mutually exclusive! Please set one or another.");
    }

    if (this.element !== "div") {
      console.warn("Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props");
    }

    if (this.options !== undefined) {
      console.warn("Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props");
    }
  },

  mounted: function mounted() {
    var this$1 = this;

    this.noneFunctionalComponentMode = this.getTag().toLowerCase() !== this.$el.nodeName.toLowerCase();

    if (this.noneFunctionalComponentMode && this.transitionMode) {
      throw new Error(("Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: " + (this.getTag())));
    }

    var optionsAdded = {};
    eventsListened.forEach(function (elt) {
      optionsAdded["on" + elt] = delegateAndEmit.call(this$1, elt);
    });
    eventsToEmit.forEach(function (elt) {
      optionsAdded["on" + elt] = emit.bind(this$1, elt);
    });
    var attributes = Object.keys(this.$attrs).reduce(function (res, key) {
      res[camelize(key)] = this$1.$attrs[key];
      return res;
    }, {});
    var options = Object.assign({}, this.options, attributes, optionsAdded, {
      onMove: function (evt, originalEvent) {
        return this$1.onDragMove(evt, originalEvent);
      }
    });
    !("draggable" in options) && (options.draggable = ">*");
    this._sortable = new Sortable(this.rootContainer, options);
    this.computeIndexes();
  },

  beforeDestroy: function beforeDestroy() {
    if (this._sortable !== undefined) { this._sortable.destroy(); }
  },

  computed: {
    rootContainer: function rootContainer() {
      return this.transitionMode ? this.$el.children[0] : this.$el;
    },

    realList: function realList() {
      return this.list ? this.list : this.value;
    }

  },
  watch: {
    options: {
      handler: function handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },

      deep: true
    },
    $attrs: {
      handler: function handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },

      deep: true
    },

    realList: function realList() {
      this.computeIndexes();
    }

  },
  methods: {
    getTag: function getTag() {
      return this.tag || this.element;
    },

    updateOptions: function updateOptions(newOptionValue) {
      for (var property in newOptionValue) {
        var value = camelize(property);

        if (readonlyProperties.indexOf(value) === -1) {
          this._sortable.option(value, newOptionValue[property]);
        }
      }
    },

    getChildrenNodes: function getChildrenNodes() {
      if (!this.init) {
        this.noneFunctionalComponentMode = this.noneFunctionalComponentMode && this.$children.length === 1;
        this.init = true;
      }

      if (this.noneFunctionalComponentMode) {
        return this.$children[0].$slots.default;
      }

      var rawNodes = this.$slots.default;
      return this.transitionMode ? rawNodes[0].child.$slots.default : rawNodes;
    },

    computeIndexes: function computeIndexes$1() {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.visibleIndexes = computeIndexes(this$1.getChildrenNodes(), this$1.rootContainer.children, this$1.transitionMode, this$1.footerOffset);
      });
    },

    getUnderlyingVm: function getUnderlyingVm(htmlElt) {
      var index = computeVmIndex(this.getChildrenNodes() || [], htmlElt);

      if (index === -1) {
        //Edge case during move callback: related element might be
        //an element different from collection
        return null;
      }

      var element = this.realList[index];
      return {
        index: index,
        element: element
      };
    },

    getUnderlyingPotencialDraggableComponent: function getUnderlyingPotencialDraggableComponent(ref) {
      var __vue__ = ref.__vue__;

      if (!__vue__ || !__vue__.$options || __vue__.$options._componentTag !== "transition-group") {
        return __vue__;
      }

      return __vue__.$parent;
    },

    emitChanges: function emitChanges(evt) {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.$emit("change", evt);
      });
    },

    alterList: function alterList(onList) {
      if (this.list) {
        onList(this.list);
        return;
      }

      var newList = [].concat( this.value );
      onList(newList);
      this.$emit("input", newList);
    },

    spliceList: function spliceList() {
      var arguments$1 = arguments;

      var spliceList = function (list) { return list.splice.apply(list, arguments$1); };

      this.alterList(spliceList);
    },

    updatePosition: function updatePosition(oldIndex, newIndex) {
      var updatePosition = function (list) { return list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]); };

      this.alterList(updatePosition);
    },

    getRelatedContextFromMoveEvent: function getRelatedContextFromMoveEvent(ref) {
      var to = ref.to;
      var related = ref.related;

      var component = this.getUnderlyingPotencialDraggableComponent(to);

      if (!component) {
        return {
          component: component
        };
      }

      var list = component.realList;
      var context = {
        list: list,
        component: component
      };

      if (to !== related && list && component.getUnderlyingVm) {
        var destination = component.getUnderlyingVm(related);

        if (destination) {
          return Object.assign(destination, context);
        }
      }

      return context;
    },

    getVmIndex: function getVmIndex(domIndex) {
      var indexes = this.visibleIndexes;
      var numberIndexes = indexes.length;
      return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex];
    },

    getComponent: function getComponent() {
      return this.$slots.default[0].componentInstance;
    },

    resetTransitionData: function resetTransitionData(index) {
      if (!this.noTransitionOnDrag || !this.transitionMode) {
        return;
      }

      var nodes = this.getChildrenNodes();
      nodes[index].data = null;
      var transitionContainer = this.getComponent();
      transitionContainer.children = [];
      transitionContainer.kept = undefined;
    },

    onDragStart: function onDragStart(evt) {
      this.context = this.getUnderlyingVm(evt.item);
      evt.item._underlying_vm_ = this.clone(this.context.element);
      draggingElement = evt.item;
    },

    onDragAdd: function onDragAdd(evt) {
      var element = evt.item._underlying_vm_;

      if (element === undefined) {
        return;
      }

      removeNode(evt.item);
      var newIndex = this.getVmIndex(evt.newIndex);
      this.spliceList(newIndex, 0, element);
      this.computeIndexes();
      var added = {
        element: element,
        newIndex: newIndex
      };
      this.emitChanges({
        added: added
      });
    },

    onDragRemove: function onDragRemove(evt) {
      insertNodeAt(this.rootContainer, evt.item, evt.oldIndex);

      if (evt.pullMode === "clone") {
        removeNode(evt.clone);
        return;
      }

      var oldIndex = this.context.index;
      this.spliceList(oldIndex, 1);
      var removed = {
        element: this.context.element,
        oldIndex: oldIndex
      };
      this.resetTransitionData(oldIndex);
      this.emitChanges({
        removed: removed
      });
    },

    onDragUpdate: function onDragUpdate(evt) {
      removeNode(evt.item);
      insertNodeAt(evt.from, evt.item, evt.oldIndex);
      var oldIndex = this.context.index;
      var newIndex = this.getVmIndex(evt.newIndex);
      this.updatePosition(oldIndex, newIndex);
      var moved = {
        element: this.context.element,
        oldIndex: oldIndex,
        newIndex: newIndex
      };
      this.emitChanges({
        moved: moved
      });
    },

    updateProperty: function updateProperty(evt, propertyName) {
      evt.hasOwnProperty(propertyName) && (evt[propertyName] += this.headerOffset);
    },

    computeFutureIndex: function computeFutureIndex(relatedContext, evt) {
      if (!relatedContext.element) {
        return 0;
      }

      var domChildren = [].concat( evt.to.children ).filter(function (el) { return el.style["display"] !== "none"; });
      var currentDOMIndex = domChildren.indexOf(evt.related);
      var currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
      var draggedInList = domChildren.indexOf(draggingElement) !== -1;
      return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1;
    },

    onDragMove: function onDragMove(evt, originalEvent) {
      var onMove = this.move;

      if (!onMove || !this.realList) {
        return true;
      }

      var relatedContext = this.getRelatedContextFromMoveEvent(evt);
      var draggedContext = this.context;
      var futureIndex = this.computeFutureIndex(relatedContext, evt);
      Object.assign(draggedContext, {
        futureIndex: futureIndex
      });
      var sendEvt = Object.assign({}, evt, {
        relatedContext: relatedContext,
        draggedContext: draggedContext
      });
      return onMove(sendEvt, originalEvent);
    },

    onDragEnd: function onDragEnd() {
      this.computeIndexes();
      draggingElement = null;
    }

  }
};

if (typeof window !== "undefined" && "Vue" in window) {
  window.Vue.component("draggable", draggableComponent);
}

export default draggableComponent;
