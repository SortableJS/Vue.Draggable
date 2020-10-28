import { isHtmlTag, isTransition as isTransitionName } from "../util/tags";
import { resolveComponent } from "vue";

function getSlot(slots, key) {
  const slotValue = slots[key];
  return slotValue ? slotValue() : [];
}

function computeChildren(slots) {
  const defaultNodes = getSlot(slots, "default");
  const header = getSlot(slots, "header");
  const footer = getSlot(slots, "footer");
  return {
    children: [...header, ...defaultNodes, ...footer],
    nodes: {
      header,
      footer,
      default: defaultNodes
    }
  };
}

function computeRenderContext({ $slots, tag }) {
  const children = computeChildren($slots);
  const {
    nodes: { header, footer }
  } = children;
  const realRoot =
    isHtmlTag(tag) || isTransitionName(tag) ? tag : resolveComponent(tag);

  return {
    tag: realRoot,
    offsets: {
      header: header.length,
      footer: footer.length
    },
    ...children
  };
}

export { computeRenderContext };
