import { camelize } from "@/util/helper";


describe("camelize", () => {
  test.each([
    ["MyProp", "MyProp"],
    ["MyProp", "MyProp"],
    ["kebab-case", "kebabCase"],
    ["multi-hyphen-string", "multiHyphenString"],
    ["drag-class", "dragClass"]
  ])(
    "transfoem %s into %s",
    (value, expected) =>{
      const actual = camelize(value);
      expect(actual).toEqual(expected);
    }
  )
});