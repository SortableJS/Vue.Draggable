import { isHtmlTag, isTransition as isTransitionName } from "../util/tags";
import { resolveComponent } from "vue";

function getSlot(slots, key) {
  const slotValue = slots[key];
  return slotValue ? slotValue() : [];
}

function computeChildrenAndNodes(slots) {
  const [header, defaultNodes, footer] = [
    "header",
    "default",
    "footer"
  ].map(name => getSlot(slots, name));
  return {
    children: [...header, ...defaultNodes, ...footer],
    nodes: {
      header,
      footer,
      default: defaultNodes
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
  const {
    nodes: { header, footer }
  } = childrenAndNodes;
  const tagInformation = solveTag(tag);

  return {
    ...tagInformation,
    ...childrenAndNodes,
    offsets: {
      header: header.length,
      footer: footer.length
    }
  };
}

export { computeRenderContext };
