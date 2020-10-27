import {
  getComponentAttributes,
  createSortableOption,
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
          props: {
            prop1: "value",
          },
          attrs: {
            value: 89,
          },
        },
      },
      {
        value: 89,
        prop1: "value",
      },
    ],
    [
      {
        $attrs: {
          filtered: true,
          id: 68,
          "data-application": "app",
          class: "my-class",
          other: "will be filtered",
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

describe("createSortableOption", () => {
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
    [
      {
        $attrs: {
          value: "7",
          draggable: ".draggable",
        },
        callBackBuilder: {
          emit: eventName => eventName
        },
      },
      {
        value: "7",
        draggable: ".draggable",
        onChoose: "Choose",
        onClone: "Clone",
        onFilter: "Filter",
        onSort: "Sort",
        onUnchoose: "Unchoose",
      },
    ],
    [
      {
        $attrs: {
          property: "property",
        },
        callBackBuilder: {
          emit: eventName => `emit-${eventName}`,
          manage: eventName => `manage-${eventName}`,
          manageAndEmit: eventName => `manageAndEmit-${eventName}`
        },
      },
      {
        property: "property",
        draggable: ">*",
        onChoose: "emit-Choose",
        onClone: "emit-Clone",
        onFilter: "emit-Filter",
        onSort: "emit-Sort",
        onUnchoose: "emit-Unchoose",
        onMove: "manage-Move",
        onAdd: "manageAndEmit-Add",
        onEnd: "manageAndEmit-End",
        onStart: "manageAndEmit-Start",
        onRemove: "manageAndEmit-Remove",
        onUpdate: "manageAndEmit-Update",
      },
    ],
  ])("for %o returns %o", (value, expected) => {
    const actual = createSortableOption(value);
    expect(actual).toEqual(expected);
  });
});
