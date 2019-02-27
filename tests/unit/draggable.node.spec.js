/**
 * @jest-environment node
 */

test('draggable can be required in a node environment', () => {
  const draggable = require("@/vuedraggable");
  expect(draggable).not.toBeNull();
});