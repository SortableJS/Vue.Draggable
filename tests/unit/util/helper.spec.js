import { camelize, console } from "@/util/helper";

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

describe("console", () => {
  test.each([
    ["log"],
    ["warn"],
    ["error"],
    ["info"],
  ])(
    "has %s function",
    (key) =>{
      const actual = console[key];
      expect(typeof actual).toEqual("function");
    }
  )
});