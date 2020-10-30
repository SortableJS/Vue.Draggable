import { ComponentStructure } from "./componentStructure";
import { isHtmlTag, isTransition } from "../util/tags";
import { resolveComponent } from "vue";

function getSlot(slots, key) {
  const slotValue = slots[key];
  return slotValue ? slotValue() : [];
}

function computeNodes(slots) {
  const [header, defaultNodes, footer] = [
    "header",
    "default",
    "footer",
  ].map((name) => getSlot(slots, name));
  return {
    header,
    footer,
    default: defaultNodes,
  };
}

function getRootInformation(tag) {
  const externalComponent = !isHtmlTag(tag) && !isTransition(tag);
  return {
    externalComponent,
    tag: externalComponent ? resolveComponent(tag) : tag
  };
}

function computeComponentStructure({ $slots, tag }) {
  const nodes = computeNodes($slots);
  const root = getRootInformation(tag);
  return new ComponentStructure({ nodes, root });
}

export { computeComponentStructure };
