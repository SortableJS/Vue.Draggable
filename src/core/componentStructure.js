import { isTransition as isTransitionName } from "../util/tags";

function isTransition(nodes) {
  if (nodes.length !== 1) {
    return false;
  }
  const [{ type }] = nodes;
  return !!type && (isTransitionName(type) || isTransitionName(type.name));
}

class ComponentStructure {
  constructor({ nodes: { header, default: defaultNodes, footer }, root }) {
    this.nodes = { header, default: defaultNodes, footer };
    this.children = [...header, ...defaultNodes, ...footer];
    this.offsets = {
      header: header.length,
      footer: footer.length
    };
    this.transitionMode = isTransition(defaultNodes);
    this.externalComponent = root.externalComponent;
    this.tag = root.tag;
    this.noneFunctional =
      this.externalComponent && typeof this.tag !== "function";
  }

  checkCoherence() {
    if (this.noneFunctional && this.transitionMode) {
      throw new Error(
        `Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${this.tag}`
      );
    }
    return this;
  }
}

export { ComponentStructure };
