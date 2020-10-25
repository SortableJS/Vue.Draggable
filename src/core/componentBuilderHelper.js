import { capitalize } from "../util/string";
import { camelize } from "../util/string";
import { events } from "./sortableEvents";

function getComponentAttributes($attrs, componentData) {
  const attributes = Object.entries($attrs)
    .filter(
      ([key, _]) => ["id", "class"].includes(key) || key.startsWith("data-")
    )
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

function getDraggableOption({
  $attrs,
  callBackBuilder: { manageAndEmit, emit, manage }
}) {
  const options = {
    draggable: ">*"
  };
  Object.entries($attrs).forEach(([key, value]) => {
    options[camelize(key)] = value;
  });
  const builders = {
    emit,
    manageAndEmit,
    manage
  };
  Object.entries(builders).forEach(([eventType, eventBuilder]) => {
    events[eventType].forEach(event => {
      options[`on${event}`] = eventBuilder(event);
    });
  });
  return options;
}

export { getComponentAttributes, getDraggableOption };
