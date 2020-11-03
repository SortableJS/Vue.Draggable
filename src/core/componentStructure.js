import { nextTick } from "vue";
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
    this.rootTransition = root.transition;
    this.tag = root.tag;
    this.setHtmlRoot($el);
  }

  get _domChildrenFromNodes() {
    return this._getChildrenNodes().map(getHtmlElementFromNode);
  }

  get _isRootComponent() {
    return this.externalComponent || this.rootTransition;
  }

  render(h, attributes) {
    const { tag, children, _isRootComponent } = this;
    const option = !_isRootComponent ? children : { default: () => children };
    return h(tag, attributes, option);
  }

  setHtmlRoot($el) {
    if (!$el) {
      return;
    }
    this.$el = $el;
    this.rootContainer = getRootContainer(this);
    nextTick(() => {
      this.visibleIndexes = this._computeIndexes();
    });
    return this;
  }

  _getChildrenNodes() {
    const {
      transitionMode,
      nodes: { default: defaultNodes }
    } = this;

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

  _computeIndexes() {
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

  computeVmIndex(domElement) {
    return this._domChildrenFromNodes.indexOf(domElement);
  }

  getVmIndexFromDomIndex(domIndex) {
    const { visibleIndexes } = this;
    const numberIndexes = visibleIndexes.length;
    return domIndex > numberIndexes - 1
      ? numberIndexes
      : visibleIndexes[domIndex];
  }
}

export { ComponentStructure };
