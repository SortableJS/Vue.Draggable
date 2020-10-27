import Sortable from "sortablejs";
import { insertNodeAt, removeNode } from "./util/htmlHelper";
import { console } from "./util/console";
import { camelize } from "./util/string";
import { isHtmlTag, isTransition as isTransitionName } from "./util/tags";
import {
  getComponentAttributes,
  getSortableOption
} from "./core/componentBuilderHelper";
import { isReadOnlyEvent } from "./core/sortableEvents";

import { h, defineComponent, nextTick, resolveComponent } from "vue";

function computeVmIndex(vnodes, element, mainNode) {
  const index = vnodes.map(({ el }) => el).indexOf(element);
  if (index === -1) {
    throw new Error("node not found", {
      nodes: vnodes.map(({ el }) => el),
      element,
      index,
      mainNode
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

function manage(evtName) {
  return (evtData, originalElement) => {
    if (this.realList !== null) {
      return this[`onDrag${evtName}`](evtData, originalElement);
    }
  };
}

function manageAndEmit(evtName) {
  const delegateCallBack = manage.call(this, evtName);
  return (evtData, originalElement) => {
    delegateCallBack.call(this, evtData, originalElement);
    emit.call(this, evtName, evtData);
  };
}

function isTransition(slots) {
  if (!slots || slots.length !== 1) {
    return false;
  }
  const [{ type }] = slots;
  if (!type) {
    return false;
  }
  return !!type && (isTransitionName(type) || isTransitionName(type.name));
}

function getSlot(slot, key) {
  const slotValue = slot[key];
  return slotValue ? slotValue() : undefined;
}

function computeChildrenAndOffsets(defaultNodes, slot) {
  let children = [...defaultNodes];
  let headerOffset = 0;
  let footerOffset = 0;
  const header = getSlot(slot, "header");
  if (header) {
    headerOffset = header.length;
    children = [...header, ...children];
  }
  const footer = getSlot(slot, "footer");
  if (footer) {
    footerOffset = footer.length;
    children = [...children, ...footer];
  }
  return { children, headerOffset, footerOffset };
}

var draggingElement = null;

const props = {
  list: {
    type: Array,
    required: false,
    default: null
  },
  modelValue: {
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
  tag: {
    type: String,
    default: "div"
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

const draggableComponent = defineComponent({
  name: "draggable",

  inheritAttrs: false,

  props,

  data() {
    return {
      transitionMode: false,
      noneFunctionalComponentMode: false
    };
  },

  render() {
    const { $slots, $attrs, tag, componentData } = this;
    const defaultSlots = getSlot($slots, "default") || [];
    this.transitionMode = isTransition(defaultSlots);
    const { children, headerOffset, footerOffset } = computeChildrenAndOffsets(
      defaultSlots,
      $slots
    );
    this.headerOffset = headerOffset;
    this.footerOffset = footerOffset;
    const attributes = getComponentAttributes({ $attrs, componentData });
    this.defaultSlots = defaultSlots;
    const realRoot =
      isHtmlTag(tag) || isTransitionName(tag) ? tag : resolveComponent(tag);
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
    const { tag, $attrs, rootContainer } = this;
    this.noneFunctionalComponentMode =
      tag.toLowerCase() !== this.$el.nodeName.toLowerCase() &&
      !this.getIsFunctional();
    if (this.noneFunctionalComponentMode && this.transitionMode) {
      throw new Error(
        `Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${tag}`
      );
    }
    const sortableOptions = getSortableOption({
      $attrs,
      callBackBuilder: {
        manageAndEmit: event => manageAndEmit.call(this, event),
        emit: event => emit.bind(this, event),
        manage: event => manage.call(this, event)
      }
    });

    this._sortable = new Sortable(rootContainer, sortableOptions);
    rootContainer.__draggable_component__ = this;
    this.computeIndexes();
  },

  beforeUnmount() {
    if (this._sortable !== undefined) this._sortable.destroy();
  },

  computed: {
    rootContainer() {
      const { $el, transitionMode } = this;
      if (!transitionMode) {
        return $el;
      }
      const { children } = $el;
      if (children.length !== 1) {
        return $el;
      }
      const firstChild = children.item(0);
      return !!firstChild.__vnode.transition ? $el : firstChild;
    },

    realList() {
      return this.list ? this.list : this.modelValue;
    }
  },

  watch: {
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
    getIsFunctional() {
      //TODO check this logic
      const { fnOptions } = this.mainNode;
      return fnOptions && fnOptions.functional;
    },

    updateOptions(newOptionValue) {
      const { _sortable } = this;
      Object.entries(newOptionValue).forEach(([key, value]) => {
        const normalizedKey = camelize(key);
        if (!isReadOnlyEvent(normalizedKey)) {
          _sortable.option(normalizedKey, value);
        }
      });
    },

    getChildrenNodes() {
      const {
        noneFunctionalComponentMode,
        transitionMode,
        defaultSlots
      } = this;
      if (noneFunctionalComponentMode) {
        //TODO check
        return this.defaultSlots[0].children;
        //return this.$children[0].$slots.default();
      }
      //const rawNodes = this.defaultSlots;
      if (transitionMode) {
        const [{ children }] = defaultSlots;
        if (Array.isArray(children)) {
          return children;
        }
        //TODO check transition with tag
        return [...this.rootContainer.children]
          .map(c => c.__vnode)
          .filter(node => !!node.transition);
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

    computeFutureIndex(relatedContext, evt) {
      if (!relatedContext.element) {
        return 0;
      }
      const domChildren = [...evt.to.children].filter(
        el => el.style["display"] !== "none"
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
        draggedContext
      });
      return onMove(sendEvt, originalEvent);
    },

    onDragEnd() {
      this.computeIndexes();
      draggingElement = null;
    }
  }
});

export default draggableComponent;
