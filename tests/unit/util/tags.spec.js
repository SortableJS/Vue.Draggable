import { isHtmlTag, isTransition } from "@/util/tags";

describe("isHtmlTag", () => {
  test.each([
    ["div", true],
    ["ul", true],
    ["li", true],
    ["a", true],
    ["keep-alive", false],
    ["not an element", false],
  ])(
    "for %s returns %s",
    (value, expected) =>{
      const actual = isHtmlTag(value);
      expect(actual).toEqual(expected);
    }
  )
});

describe("isTransition", () => {
  test.each([
    ["TransitionGroup", true],
    ["transition-group", true],
    ["transition", false],
    ["div", false],
    ["li", false]
  ])(
    "for %s returns %s",
    (value, expected) =>{
      const actual = isTransition(value);
      expect(actual).toEqual(expected);
    }
  )
});
