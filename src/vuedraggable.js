import Sortable from "sortablejs";
import { console, camelize } from "./util/helper";

function buildAttribute(object, propName, value) {
  if (value == undefined) {
    return object;
  }
  object = object == null ? {} : object;
  object[propName] = value;
  return object;
}

function removeNode(node) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node);
  }
}

function insertNodeAt(fatherNode, node, position) {
  const refNode =
    position === 0
      ? fatherNode.children[0]
      : fatherNode.children[position - 1].nextSibling;
  fatherNode.insertBefore(node, refNode);
}

function computeVmIndex(vnodes, element) {
  return vnodes.map(elt => elt.elm).indexOf(element);
}

function computeIndexes(slots, children, isTransition) {
  if (!slots) {
    return [];
  }

  const elmFromNodes = slots.map(elt => elt.elm);
  const rawIndexes = [...children].map(elt => elmFromNodes.indexOf(elt));
  return isTransition ? rawIndexes.filter(ind => ind !== -1) : rawIndexes;
}

function emit(evtName, evtData) {
  this.$nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
}

function delegateAndEmit(evtName) {
  return evtData => {
    if (this.realList !== null) {
      this["onDrag" + evtName](evtData);
    }
    emit.call(this, evtName, evtData);
  };
}

function groupIsClone(group) {
  if (!group) {
    return false;
  }
  const { pull } = group;
  if (typeof pull === "function") {
    return pull() === "clone";
  }
  return pull === "clone";
}

const eventsListened = ["Start", "Add", "Remove", "Update", "End"];
const eventsToEmit = ["Choose", "Sort", "Filter", "Clone"];
const readonlyProperties = ["Move", ...eventsListened, ...eventsToEmit].map(
  evt => "on" + evt
);
var draggingElement = null;

const props = {
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
    default: original => {
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

const draggableComponent = {
  name: "draggable",

  inheritAttrs: false,

  props,

  data() {
    return {
      transitionMode: false,
      noneFunctionalComponentMode: false,
      init: false,
      isCloning: false
    };
  },

  render(h) {
    const slots = this.$slots.default;
    if (slots && slots.length === 1) {
      const child = slots[0];
      if (
        child.componentOptions &&
        ["transition-group", "TransitionGroup"].includes(
          child.componentOptions.tag
        )
      ) {
        this.transitionMode = true;
      }
    }
    let headerOffset = 0;
    let children = slots;
    const { header, footer } = this.$slots;
    if (header) {
      headerOffset = header.length;
      children = children ? [...header, ...children] : [...header];
    }
    if (footer) {
      children = children ? [...children, ...footer] : [...footer];
    }
    this.headerOffset = headerOffset;
    var attributes = null;
    const update = (name, value) => {
      attributes = buildAttribute(attributes, name, value);
    };
    if (this.componentData) {
      const { on, props } = this.componentData;
      update("on", on);
      update("props", props);
    }
    return h(this.getTag(), attributes, children);
  },

  created() {
    if (this.list !== null && this.value !== null) {
      console.error(
        "Value and list props are mutually exclusive! Please set one or another."
      );
    }

    if (this.element !== "div") {
      console.warn(
        "Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props"
      );
    }

    if (this.options !== undefined) {
      console.warn(
        "Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props"
      );
    }
  },

  mounted() {
    this.noneFunctionalComponentMode =
      this.getTag().toLowerCase() !== this.$el.nodeName.toLowerCase();
    if (this.noneFunctionalComponentMode && this.transitionMode) {
      throw new Error(
        `Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${this.getTag()}`
      );
    }
    var optionsAdded = {};
    eventsListened.forEach(elt => {
      optionsAdded["on" + elt] = delegateAndEmit.call(this, elt);
    });

    eventsToEmit.forEach(elt => {
      optionsAdded["on" + elt] = emit.bind(this, elt);
    });

    const attributes = Object.keys(this.$attrs).reduce((res, key) => {
      res[camelize(key)] = this.$attrs[key];
      return res;
    }, {});

    const options = Object.assign({}, this.options, attributes, optionsAdded, {
      onMove: (evt, originalEvent) => {
        return this.onDragMove(evt, originalEvent);
      }
    });
    !("draggable" in options) && (options.draggable = ">*");
    this._sortable = new Sortable(this.rootContainer, options);
    this.computeIndexes();
  },

  beforeDestroy() {
    if (this._sortable !== undefined) this._sortable.destroy();
  },

  computed: {
    rootContainer() {
      return this.transitionMode ? this.$el.children[0] : this.$el;
    },

    realList() {
      return this.list ? this.list : this.value;
    }
  },

  watch: {
    options: {
      handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },
      deep: true
    },

    $attrs: {
      handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },
      deep: true
    },

    realList() {
      this.computeIndexes();
    }
  },

  methods: {
    getTag() {
      return this.tag || this.element;
    },

    getIsCloning() {
      const { group } = this.$attrs;
      const groupConsideringOption = group || this.getOptionGroup();
      return groupIsClone(groupConsideringOption);
    },

    getOptionGroup() {
      const { options } = this;
      if (!options) {
        return undefined;
      }
      return options.group;
    },

    updateOptions(newOptionValue) {
      for (var property in newOptionValue) {
        const value = camelize(property);
        if (readonlyProperties.indexOf(value) == -1) {
          this._sortable.option(value, newOptionValue[property]);
        }
      }
    },

    getChildrenNodes() {
      if (!this.init) {
        this.noneFunctionalComponentMode =
          this.noneFunctionalComponentMode && this.$children.length == 1;
        this.init = true;
      }

      if (this.noneFunctionalComponentMode) {
        return this.$children[0].$slots.default;
      }
      const rawNodes = this.$slots.default;
      return this.transitionMode ? rawNodes[0].child.$slots.default : rawNodes;
    },

    computeIndexes() {
      this.$nextTick(() => {
        this.visibleIndexes = computeIndexes(
          this.getChildrenNodes(),
          this.rootContainer.children,
          this.transitionMode
        );
      });
    },

    getUnderlyingVm(htmlElt) {
      const index = computeVmIndex(this.getChildrenNodes() || [], htmlElt);
      if (index === -1) {
        //Edge case during move callback: related element might be
        //an element different from collection
        return null;
      }
      const element = this.realList[index];
      return { index, element };
    },

    getUnderlyingPotencialDraggableComponent({ __vue__ }) {
      if (
        !__vue__ ||
        !__vue__.$options ||
        __vue__.$options._componentTag !== "transition-group"
      ) {
        return __vue__;
      }
      return __vue__.$parent;
    },

    emitChanges(evt) {
      this.$nextTick(() => {
        this.$emit("change", evt);
      });
    },

    alterList(onList) {
      if (this.list) {
        onList(this.list);
        return;
      }
      const newList = [...this.value];
      onList(newList);
      this.$emit("input", newList);
    },

    spliceList() {
      const spliceList = list => list.splice(...arguments);
      this.alterList(spliceList);
    },

    updatePosition(oldIndex, newIndex) {
      const updatePosition = list =>
        list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
      this.alterList(updatePosition);
    },

    getRelatedContextFromMoveEvent({ to, related }) {
      const component = this.getUnderlyingPotencialDraggableComponent(to);
      if (!component) {
        return { component };
      }
      const list = component.realList;
      const context = { list, component };
      if (to !== related && list && component.getUnderlyingVm) {
        const destination = component.getUnderlyingVm(related);
        if (destination) {
          return Object.assign(destination, context);
        }
      }
      return context;
    },

    getVmIndex(domIndex) {
      const indexes = this.visibleIndexes;
      const numberIndexes = indexes.length;
      return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex];
    },

    getComponent() {
      return this.$slots.default[0].componentInstance;
    },

    resetTransitionData(index) {
      if (!this.noTransitionOnDrag || !this.transitionMode) {
        return;
      }
      var nodes = this.getChildrenNodes();
      nodes[index].data = null;
      const transitionContainer = this.getComponent();
      transitionContainer.children = [];
      transitionContainer.kept = undefined;
    },

    onDragStart(evt) {
      this.context = this.getUnderlyingVm(evt.item);
      this.isCloning = this.getIsCloning();
      evt.item._underlying_vm_ = this.clone(this.context.element);
      draggingElement = evt.item;
    },

    onDragAdd(evt) {
      const element = evt.item._underlying_vm_;
      if (element === undefined) {
        return;
      }
      removeNode(evt.item);
      const newIndex = this.getVmIndex(evt.newIndex);
      this.spliceList(newIndex, 0, element);
      this.computeIndexes();
      const added = { element, newIndex };
      this.emitChanges({ added });
    },

    onDragRemove(evt) {
      insertNodeAt(this.rootContainer, evt.item, evt.oldIndex);
      if (this.isCloning) {
        removeNode(evt.clone);
        return;
      }
      const oldIndex = this.context.index;
      this.spliceList(oldIndex, 1);
      const removed = { element: this.context.element, oldIndex };
      this.resetTransitionData(oldIndex);
      this.emitChanges({ removed });
    },

    onDragUpdate(evt) {
      removeNode(evt.item);
      insertNodeAt(evt.from, evt.item, evt.oldIndex);
      const oldIndex = this.context.index;
      const newIndex = this.getVmIndex(evt.newIndex);
      this.updatePosition(oldIndex, newIndex);
      const moved = { element: this.context.element, oldIndex, newIndex };
      this.emitChanges({ moved });
    },

    updateProperty(evt, propertyName) {
      evt.hasOwnProperty(propertyName) &&
        (evt[propertyName] += this.headerOffset);
    },

    computeFutureIndex(relatedContext, evt) {
      if (!relatedContext.element) {
        return 0;
      }
      const domChildren = [...evt.to.children].filter(
        el => el.style["display"] !== "none"
      );
      const currentDOMIndex = domChildren.indexOf(evt.related);
      const currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
      const draggedInList = domChildren.indexOf(draggingElement) != -1;
      return draggedInList || !evt.willInsertAfter
        ? currentIndex
        : currentIndex + 1;
    },

    onDragMove(evt, originalEvent) {
      const onMove = this.move;
      if (!onMove || !this.realList) {
        return true;
      }

      const relatedContext = this.getRelatedContextFromMoveEvent(evt);
      const draggedContext = this.context;
      const futureIndex = this.computeFutureIndex(relatedContext, evt);
      Object.assign(draggedContext, { futureIndex });
      const sendEvt = Object.assign({}, evt, { relatedContext, draggedContext });
      return onMove(sendEvt, originalEvent);
    },

    onDragEnd() {
      this.computeIndexes();
      draggingElement = null;
    }
  }
};

if (typeof window !== "undefined" && "Vue" in window) {
  window.Vue.component("draggable", draggableComponent);
}

export default draggableComponent;
