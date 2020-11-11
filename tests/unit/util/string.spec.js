import { camelize } from "@/util/string";

describe("camelize", () => {
  test.each([
    ["MyProp", "MyProp"],
    ["MyProp", "MyProp"],
    ["kebab-case", "kebabCase"],
    ["multi-hyphen-string", "multiHyphenString"],
    ["drag-class", "dragClass"],
    ["test-", "test-"]
  ])(
    "transform %s into %s",
    (value, expected) =>{
      const actual = camelize(value);
      expect(actual).toEqual(expected);
    }
  )
});