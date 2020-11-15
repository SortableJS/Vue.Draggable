import {
  getComponentAttributes,
  createSortableOption,
  getValidSortableEntries
} from "@/core/componentBuilderHelper";

describe("getComponentAttributes", () => {
  test.each([
    [{ $attrs: {} }, {}],
    [{ $attrs: {}, componentData: {} }, {}],
    [
      {
        $attrs: {},
        componentData: {
          value: 89
        }
      },
      {
        value: 89
      }
    ],
    [
      {
        $attrs: {},
        componentData: {
          prop1: "value",
          value: 89
        }
      },
      {
        value: 89,
        prop1: "value"
      }
    ],
    [
      {
        $attrs: {
          id: "value",
          value: 89
        }
      },
      {
        id: "value"
      }
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
          value: 89
        }
      },
      {
        id: 68,
        class: "my-class",
        "data-application": "app",
        value: 89
      }
    ]
  ])("for %o returns %o", (value, expected) => {
    const actual = getComponentAttributes(value);
    expect(actual).toEqual(expected);
  });
});

describe("createSortableOption", () => {
  test.each([
    [{ $attrs: {}, callBackBuilder: {} }, { draggable: "[data-draggable]" }],
    [
      { $attrs: { onStart: 23 }, callBackBuilder: {} },
      { draggable: "[data-draggable]" }
    ],
    [
      { $attrs: { onEnd: 23 }, callBackBuilder: {} },
      { draggable: "[data-draggable]" }
    ],
    [
      {
        $attrs: { id: "id", class: "class", "data-app": "app" },
        callBackBuilder: {}
      },
      { draggable: "[data-draggable]" }
    ],
    [
      {
        $attrs: { value: "43" },
        callBackBuilder: {}
      },
      { value: "43", draggable: "[data-draggable]" }
    ],
    [
      {
        $attrs: {
          value: "43",
          "ghost-class": "phantom",
          draggable: ".draggable"
        },
        callBackBuilder: {}
      },
      {
        value: "43",
        ghostClass: "phantom",
        draggable: "[data-draggable].draggable"
      }
    ],
    [
      {
        $attrs: {
          value: "7",
          draggable: ".draggable"
        },
        callBackBuilder: {
          emit: eventName => eventName
        }
      },
      {
        value: "7",
        draggable: "[data-draggable].draggable",
        onChoose: "Choose",
        onClone: "Clone",
        onFilter: "Filter",
        onSort: "Sort",
        onUnchoose: "Unchoose"
      }
    ],
    [
      {
        $attrs: {
          property: "property"
        },
        callBackBuilder: {
          emit: eventName => `emit-${eventName}`,
          manage: eventName => `manage-${eventName}`,
          manageAndEmit: eventName => `manageAndEmit-${eventName}`
        }
      },
      {
        property: "property",
        draggable: "[data-draggable]",
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
        onUpdate: "manageAndEmit-Update"
      }
    ]
  ])("for %o returns %o", (value, expected) => {
    const actual = createSortableOption(value);
    expect(actual).toEqual(expected);
  });
});

describe("getValidSortableEntries", () => {
  test.each([
    [{ newValue: 1 }, [["newValue", 1]]],
    [{ onStart: 1 }, []],
    [{ onStart: 1, newValue: 11 }, [["newValue", 11]]],
    [{ onStart: 1, id: "newId", attribute: "yes" }, [["attribute", "yes"]]],
    [{ onStart: 1, "data-bind": "value", boolean: true }, [["boolean", true]]]
  ])("for %o returns %o", (value, expected) => {
    const actual = getValidSortableEntries(value);
    expect(actual).toEqual(expected);
  });
});
