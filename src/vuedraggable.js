import Sortable from "sortablejs";
import { insertNodeAt, camelize, capitalize, console, removeNode } from "./util/helper";
import { isHtmlTag } from "./util/tags";
import { h, defineComponent, nextTick, resolveComponent } from "vue";

function buildAttribute(object, propName, value) {
  if (value === undefined) {
    return object;
  }
  object = object || {};
  object[propName] = value;
  return object;
}

function computeVmIndex(vnodes, element, mainNode) {
  const index = vnodes.map((elt) => elt.el).indexOf(element);
  if (index === -1) {
    throw new Error("node not found", {
      nodes: vnodes.map((elt) => elt.el),
      element,
      index,
      mainNode,
    });
  }
  return index;
}

function computeIndexes(slots, children, isTransition, footerOffset) {
  if (!slots) {
    return [];
  }

  const elmFromNodes = slots.map(({ el }) => el);
  const footerIndex = children.length - footerOffset;
  const rawIndexes = [...children].map((elt, idx) =>
    idx >= footerIndex ? elmFromNodes.length : elmFromNodes.indexOf(elt)
  );
  return isTransition ? rawIndexes.filter(ind => ind !== -1) : rawIndexes;
}

function emit(evtName, evtData) {
  nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
}

function delegateAndEmit(evtName) {
  return evtData => {
    if (this.realList !== null) {
      this["onDrag" + evtName](evtData);
    }
    emit.call(this, evtName, evtData);
  };
}


function isTransitionName(name) {
  return ["transition-group", "TransitionGroup"].includes(name);
}

function isTransition(slots) {
  if (!slots || slots.length !== 1) {
    return false;
  }
  const [{ type }] = slots;
  if (!type) {
    return false;
  }
  return isTransitionName(type);
}

function getSlot(slot, key) {
  const slotValue = slot[key];
  return slotValue ? slotValue() : undefined;
}

function computeChildrenAndOffsets(children, slot) {
  let headerOffset = 0;
  let footerOffset = 0;
  const header = getSlot(slot, "header");
  if (header) {
    headerOffset = header.length;
    children = children ? [...header, ...children] : [...header];
  }
  const footer = getSlot(slot, "footer");
  if (footer) {
    footerOffset = footer.length;
    children = children ? [...children, ...footer] : [...footer];
  }
  return { children, headerOffset, footerOffset };
}

function getComponentAttributes($attrs, componentData) {
  const attrs = Object.entries($attrs)
    .filter(([key, _]) => key === "id" || key.startsWith("data-"))
    .reduce((res, [key, value]) => {
      res[key] = value;
      return res;
    }, {});

  if (!componentData) {
    return attrs;
  }
  const { on: rawOn, props, attrs: componentDataAttrs } = componentData;
  const on = Object.entries(rawOn || {}).reduce((res, [key, value]) => {
    res[`on${capitalize(key)}`] = value;
    return res;
  }, {});
  return { ...attrs, ...componentDataAttrs, ...on, ...props };
}

const eventsListened = ["Start", "Add", "Remove", "Update", "End"];
const eventsToEmit = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];
const readonlyProperties = ["Move", ...eventsListened, ...eventsToEmit].map(
  evt => "on" + evt
);
var draggingElement = null;

const props = {
  list: {
    type: Array,
    required: false,
    default: null,
  },
  modelValue: {
    type: Array,
    required: false,
    default: null,
  },
  noTransitionOnDrag: {
    type: Boolean,
    default: false,
  },
  clone: {
    type: Function,
    default: original => {
      return original;
    },
  },
  tag: {
    type: String,
    default: "div",
  },
  move: {
    type: Function,
    default: null,
  },
  componentData: {
    type: Object,
    required: false,
    default: null,
  },
};

const draggableComponent = defineComponent({
  name: "draggable",

  inheritAttrs: false,

  props,

  data() {
    return {
      transitionMode: false,
      noneFunctionalComponentMode: false,
    };
  },

  render() {
    const { $slots, $attrs, tag } = this;
    const defaultSlots = getSlot($slots, "default") || [];
    this.transitionMode = isTransition(defaultSlots);
    const { children, headerOffset, footerOffset } = computeChildrenAndOffsets(
      defaultSlots,
      $slots
    );
    this.headerOffset = headerOffset;
    this.footerOffset = footerOffset;
    const attributes = getComponentAttributes($attrs, this.componentData);
    this.defaultSlots = defaultSlots;
    const realRoot = isHtmlTag(tag) ? tag : resolveComponent(tag);
    const mainNode = h(realRoot, attributes, children);
    this.mainNode = mainNode;
    return mainNode;
  },

  created() {
    if (this.list !== null && this.modelValue !== null) {
      console.error(
        "modelValue and list props are mutually exclusive! Please set one or another."
      );
    }
  },

  mounted() {
    const { tag } = this;
    this.noneFunctionalComponentMode =
      tag.toLowerCase() !== this.$el.nodeName.toLowerCase() &&
      !this.getIsFunctional();
    if (this.noneFunctionalComponentMode && this.transitionMode) {
      throw new Error(
        `Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${tag}`
      );
    }
    const optionsAdded = {};
    eventsListened.forEach((elt) => {
      optionsAdded["on" + elt] = delegateAndEmit.call(this, elt);
    });

    eventsToEmit.forEach((elt) => {
      optionsAdded["on" + elt] = emit.bind(this, elt);
    });

    const attributes = Object.entries(this.$attrs).reduce(
      (res, [key, value]) => {
        res[camelize(key)] = value;
        return res;
      },
      {}
    );

    const options = {
      draggable: ">*",
      ...attributes,
      ...optionsAdded,
      ...{
        onMove: (evt, originalEvent) => {
          return this.onDragMove(evt, originalEvent);
        },
      },
    };
    const { rootContainer } = this;
    this._sortable = new Sortable(rootContainer, options);
    rootContainer.__draggable_component__ = this;
    this.computeIndexes();
  },

  beforeUnmount() {
    if (this._sortable !== undefined) this._sortable.destroy();
  },

  computed: {
    rootContainer() {
      return this.transitionMode ? this.$el.children[0] : this.$el;
    },

    realList() {
      return this.list ? this.list : this.modelValue;
    },
  },

  watch: {
    $attrs: {
      handler(newOptionValue) {
        this.updateOptions(newOptionValue);
      },
      deep: true,
    },

    realList() {
      this.computeIndexes();
    },
  },

  methods: {
    getIsFunctional() {
      //TODO check this logic
      const { fnOptions } = this.mainNode;
      return fnOptions && fnOptions.functional;
    },

    updateOptions(newOptionValue) {
      for (var property in newOptionValue) {
        const value = camelize(property);
        if (readonlyProperties.indexOf(value) === -1) {
          this._sortable.option(value, newOptionValue[property]);
        }
      }
    },

    getChildrenNodes() {
      const {
        noneFunctionalComponentMode,
        transitionMode,
        defaultSlots,
      } = this;
      if (noneFunctionalComponentMode) {
        //TODO check
        return this.defaultSlots[0].children;
        //return this.$children[0].$slots.default();
      }
      //const rawNodes = this.defaultSlots;
      if (transitionMode) {
        //TODO check
        //rawNodes[0].child.$slots.default()
        return defaultSlots[0].children;
      }
      return defaultSlots.length === 1 && defaultSlots[0].el.nodeType === 3
        ? defaultSlots[0].children
        : defaultSlots;
    },

    computeIndexes() {
      nextTick(() => {
        this.visibleIndexes = computeIndexes(
          this.getChildrenNodes(),
          this.rootContainer.children,
          this.transitionMode,
          this.footerOffset
        );
      });
    },

    getUnderlyingVm(htmlElt) {
      const index = computeVmIndex(
        this.getChildrenNodes() || [],
        htmlElt,
        this.mainNode
      );
      if (index === -1) {
        //Edge case during move callback: related element might be
        //an element different from collection
        return null;
      }
      const element = this.realList[index];
      return { index, element };
    },

    getUnderlyingPotencialDraggableComponent(htmElement) {
      //TODO check case where you need to see component children
      return htmElement.__draggable_component__;
    },

    emitChanges(evt) {
      nextTick(() => {
        this.$emit("change", evt);
      });
    },

    alterList(onList) {
      if (this.list) {
        onList(this.list);
        return;
      }
      const newList = [...this.modelValue];
      onList(newList);
      this.$emit("update:modelValue", newList);
    },

    spliceList() {
      const spliceList = (list) => list.splice(...arguments);
      this.alterList(spliceList);
    },

    updatePosition(oldIndex, newIndex) {
      const updatePosition = (list) =>
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
      return this.$slots.default()[0].componentInstance;
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
      if (evt.pullMode === "clone") {
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
        (el) => el.style["display"] !== "none"
      );
      const currentDOMIndex = domChildren.indexOf(evt.related);
      const currentIndex = relatedContext.component.getVmIndex(currentDOMIndex);
      const draggedInList = domChildren.indexOf(draggingElement) !== -1;
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
      const sendEvt = Object.assign({}, evt, {
        relatedContext,
        draggedContext,
      });
      return onMove(sendEvt, originalEvent);
    },

    onDragEnd() {
      this.computeIndexes();
      draggingElement = null;
    },
  },
});

export default draggableComponent;
