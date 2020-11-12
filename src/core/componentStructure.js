const getHtmlElementFromNode = ({ el }) => el;
const addContext = (domElement, context) =>
  (domElement.__draggable_context = context);
const getContext = domElement => domElement.__draggable_context;

class ComponentStructure {
  constructor({
    nodes: { header, default: defaultNodes, footer },
    root,
    realList
  }) {
    this.nodes = { header, default: defaultNodes, footer };
    this.children = [...header, ...defaultNodes, ...footer];
    this.externalComponent = root.externalComponent;
    this.rootTransition = root.transition;
    this.tag = root.tag;
    this.realList = realList;
  }

  get _domChildrenFromNodes() {
    return this.nodes.default.map(getHtmlElementFromNode);
  }

  get _isRootComponent() {
    return this.externalComponent || this.rootTransition;
  }

  render(h, attributes) {
    const { tag, children, _isRootComponent } = this;
    const option = !_isRootComponent ? children : { default: () => children };
    return h(tag, attributes, option);
  }

  updated() {
    const {
      nodes: { default: defaultNodes },
      realList
    } = this;
    defaultNodes.forEach((node, index) => {
      addContext(getHtmlElementFromNode(node), {
        element: realList[index],
        index
      });
    });
  }

  getUnderlyingVm(domElement) {
    return getContext(domElement);
  }

  getVmIndexFromDomIndex(domIndex, $el) {
    const domChildren = $el.children;
    const domElement = domChildren.item(domIndex);
    const context = getContext(domElement);
    if (context) {
      return context.index;
    }
    const {
      nodes: { default: defaultNodes }
    } = this;
    const { length } = defaultNodes;

    if (length === 0) {
      return -1;
    }

    const firstDomListElement = getHtmlElementFromNode(defaultNodes[0]);
    const indexFirstDomListElement = [...domChildren].findIndex(
      element => element === firstDomListElement
    );
    return domIndex < indexFirstDomListElement ? -1 : length;
  }
}

export { ComponentStructure };
