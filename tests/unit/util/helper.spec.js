import { camelize, console, insertNodeAt } from "@/util/helper";

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

describe('insertNodeAt', () => {
  const node = document.createElement('div');
  const nextSibling = document.createElement('div');
  const child = { nextSibling };
  const mockInsertBefore = jest.fn();
  const fatherNode = {
    insertBefore: mockInsertBefore,
    children: [child]
  }
  test('Inserts node at 0 position', () => {
    insertNodeAt(fatherNode, node, 0);
    expect(mockInsertBefore).toHaveBeenCalledWith(node, child);
  })
  test('Inserts node at 1 position', () => {
    insertNodeAt(fatherNode, node, 1);
    expect(mockInsertBefore).toHaveBeenCalledWith(node, nextSibling);
  })
  test("Inserts node at the end of node's child nodes", () => {
    insertNodeAt(fatherNode, node, 2);
    expect(mockInsertBefore).toHaveBeenCalledWith(node, undefined);
  })
});
