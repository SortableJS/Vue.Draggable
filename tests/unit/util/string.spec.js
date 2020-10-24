import { camelize, capitalize } from "@/util/string";

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

describe("capitalize", () => {
  test.each([
    ["myProp", "MyProp"],
    ["abcdde", "Abcdde"],
    ["123456", "123456"]
  ])(
    "transform %s into %s",
    (value, expected) =>{
      const actual = capitalize(value);
      expect(actual).toEqual(expected);
    }
  )
});