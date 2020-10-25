import { capitalize } from "../util/string";


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

export { getComponentAttributes }