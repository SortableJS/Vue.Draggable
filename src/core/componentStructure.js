import { isTransition as isTransitionName } from "../util/tags";

const getHtmlElementFromNode = ({ el }) => el;
const getNodeFromHtmlElement = ({ __vnode: node }) => node;

function isTransition(nodes) {
  if (nodes.length !== 1) {
    return false;
  }
  const [{ type }] = nodes;
  return !!type && (isTransitionName(type) || isTransitionName(type.name));
}

function getRootContainer({ $el, transitionMode }) {
  if (!transitionMode) {
    return $el;
  }
  const { children } = $el;
  if (children.length !== 1) {
    return $el;
  }
  const firstChild = children.item(0);
  return !getNodeFromHtmlElement(firstChild).transition ? firstChild : $el;
}

class ComponentStructure {
  constructor({ nodes: { header, default: defaultNodes, footer }, root, $el }) {
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
    this.setHtmlRoot($el);
    this._checkCoherence();
  }

  get _domChildrenFromNodes() {
    return this._getChildrenNodes().map(getHtmlElementFromNode);
  }

  _checkCoherence() {
    if (this.noneFunctional && this.transitionMode) {
      throw new Error(
        `Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${this.tag}`
      );
    }
  }

  _getChildrenNodes() {
    const {
      noneFunctional,
      transitionMode,
      nodes: { default: defaultNodes }
    } = this;

    if (noneFunctional) {
      //TODO check problem here
      return defaultNodes[0].children;
    }

    if (!transitionMode) {
      return defaultNodes.length === 1 && defaultNodes[0].el.nodeType === 3
        ? defaultNodes[0].children
        : defaultNodes;
    }

    const [{ children }] = defaultNodes;
    if (Array.isArray(children)) {
      return children;
    }
    return [...this.rootContainer.children]
      .map(getNodeFromHtmlElement)
      .filter(node => !!node.transition);
  }

  computeIndexes() {
    const {
      _domChildrenFromNodes,
      transitionMode,
      offsets: { footer: footerOffset }
    } = this;

    const domChildren = this.rootContainer.children;
    const footerIndex = domChildren.length - footerOffset;
    const rawIndexes = [...domChildren].map((elt, idx) =>
      idx >= footerIndex
        ? _domChildrenFromNodes.length
        : _domChildrenFromNodes.indexOf(elt)
    );
    return transitionMode ? rawIndexes.filter(ind => ind !== -1) : rawIndexes;
  }

  setHtmlRoot($el) {
    if (!$el) {
      return;
    }
    this.$el = $el;
    this.rootContainer = getRootContainer(this);
    return this;
  }

  computeVmIndex(htmlElement) {
    return this._domChildrenFromNodes.indexOf(htmlElement);
  }
}

export { ComponentStructure };
