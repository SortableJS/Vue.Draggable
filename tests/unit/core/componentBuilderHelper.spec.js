import {
  getComponentAttributes,
  getSortableOption,
} from "@/core/componentBuilderHelper";

describe("getComponentAttributes", () => {
  test.each([
    [{ $attrs: {}, componentData: {} }, {}],
    [
      {
        $attrs: {},
        componentData: {
          attrs: {
            value: 89,
          },
        },
      },
      {
        value: 89,
      },
    ],
    [
      {
        $attrs: {},
        componentData: {
          props:{
            prop1: "value"
          },
          attrs: {
            value: 89,
          },
        },
      },
      {
        value: 89,
        prop1: "value"
      },
    ],
    [
      {
        $attrs: {
          filtered: true,
          id: 68,
          "data-application": "app",
          class: "my-class",
          other: "will be filtered"
        },
        componentData: {
          attrs: {
            value: 89,
          },
        },
      },
      {
        id: 68,
        class: "my-class",
        "data-application": "app",
        value: 89,
      },
    ],
  ])("for %o returns %o", (value, expected) => {
    const actual = getComponentAttributes(value);
    expect(actual).toEqual(expected);
  });
});

describe("getSortableOption", () => {
  test.each([
    [{ $attrs: {}, callBackBuilder: {} }, { draggable: ">*" }],
    [{ $attrs: { onStart: 23 }, callBackBuilder: {} }, { draggable: ">*" }],
    [{ $attrs: { onEnd: 23 }, callBackBuilder: {} }, { draggable: ">*" }],
    [
      {
        $attrs: { id: "id", class: "class", "data-app": "app" },
        callBackBuilder: {},
      },
      { draggable: ">*" },
    ],
    [
      {
        $attrs: { value: "43" },
        callBackBuilder: {},
      },
      { value: "43", draggable: ">*" },
    ],
    [
      {
        $attrs: {
          value: "43",
          "ghost-class": "phantom",
          draggable: ".draggable",
        },
        callBackBuilder: {},
      },
      {
        value: "43",
        ghostClass: "phantom",
        draggable: ".draggable",
      },
    ],
  ])("for %o returns %o", (value, expected) => {
    const actual = getSortableOption(value);
    expect(actual).toEqual(expected);
  });
});
