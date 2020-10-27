import { capitalize } from "../util/string";
import { camelize } from "../util/string";
import { events, isReadOnlyEvent } from "./sortableEvents";

function isHtmlAttribute(value) {
  return ["id", "class"].includes(value) || value.startsWith("data-");
}

function getComponentAttributes({ $attrs, componentData }) {
  const attributes = Object.entries($attrs)
    .filter(([key, _]) => isHtmlAttribute(key))
    .reduce((res, [key, value]) => {
      res[key] = value;
      return res;
    }, {});

  if (!componentData) {
    return attributes;
  }
  const { on, props, attrs } = componentData;
  Object.entries(on || {}).forEach(([key, value]) => {
    attributes[`on${capitalize(key)}`] = value;
  });
  return { ...attributes, ...attrs, ...props };
}

function createSortableOption({ $attrs, callBackBuilder }) {
  const options = {
    draggable: ">*"
  };
  Object.entries($attrs)
    .filter(([key, _]) => !isHtmlAttribute(key))
    .map(([key, value]) => [camelize(key), value])
    .filter(([key, _]) => !isReadOnlyEvent(key))
    .forEach(([key, value]) => {
      options[key] = value;
    });
  Object.entries(callBackBuilder).forEach(([eventType, eventBuilder]) => {
    events[eventType].forEach(event => {
      options[`on${event}`] = eventBuilder(event);
    });
  });
  return options;
}

function getValidSortableEntries(value) {
  return Object.entries(value)
    .map(([key, value]) => [camelize(key), value])
    .filter(([key, _]) => !isReadOnlyEvent(key));
}

export {
  getComponentAttributes,
  createSortableOption,
  getValidSortableEntries
};
