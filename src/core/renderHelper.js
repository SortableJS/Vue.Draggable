import { isHtmlTag, isTransition as isTransitionName } from "../util/tags";
import { resolveComponent } from "vue";

function getSlot(slots, key) {
  const slotValue = slots[key];
  return slotValue ? slotValue() : [];
}

function isTransition(nodes) {
  if (nodes.length !== 1) {
    return false;
  }
  const [{ type }] = nodes;
  return !!type && (isTransitionName(type) || isTransitionName(type.name));
}

function computeChildrenAndNodes(slots) {
  const [header, defaultNodes, footer] = [
    "header",
    "default",
    "footer"
  ].map(name => getSlot(slots, name));
  const transitionMode = isTransition(defaultNodes);
  return {
    children: [...header, ...defaultNodes, ...footer],
    transitionMode,
    nodes: {
      header,
      footer,
      default: defaultNodes
    },
    offsets: {
      header: header.length,
      footer: footer.length
    }
  };
}

function solveTag(tag) {
  const externalComponent = !isHtmlTag(tag) && !isTransitionName(tag);
  const realRoot = externalComponent ? resolveComponent(tag) : tag;
  return {
    tag: realRoot,
    externalComponent
  };
}

function computeRenderContext({ $slots, tag }) {
  const childrenAndNodes = computeChildrenAndNodes($slots);
  const tagInformation = solveTag(tag);

  return {
    ...tagInformation,
    ...childrenAndNodes
  };
}

export { computeRenderContext };
