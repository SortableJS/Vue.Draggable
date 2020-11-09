import { nextTick } from "vue";

const getHtmlElementFromNode = ({ el }) => el;

class ComponentStructure {
  constructor({ nodes: { header, default: defaultNodes, footer }, root, $el }) {
    this.nodes = { header, default: defaultNodes, footer };
    this.children = [...header, ...defaultNodes, ...footer];
    this.offsets = {
      header: header.length,
      footer: footer.length
    };
    this.externalComponent = root.externalComponent;
    this.rootTransition = root.transition;
    this.tag = root.tag;
    this.setHtmlRoot($el);
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

  setHtmlRoot($el) {
    if (!$el) {
      return;
    }
    this.$el = $el;
    nextTick(() => {
      this.visibleIndexes = this._computeIndexes();
    });
    return this;
  }

  _computeIndexes() {
    const {
      _domChildrenFromNodes,
      offsets: { footer: footerOffset }
    } = this;

    const domChildren = this.$el.children;
    const footerIndex = domChildren.length - footerOffset;
    const rawIndexes = [...domChildren].map((elt, idx) =>
      idx >= footerIndex
        ? _domChildrenFromNodes.length
        : _domChildrenFromNodes.indexOf(elt)
    );
    return rawIndexes;
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
