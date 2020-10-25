/**
 * @jest-environment node
 */

import { console } from "@/util/console";

describe("console", () => {
  test.each([
    ["log"],
    ["warn"],
    ["error"],
    ["info"],
  ])(
    "has %s function",
    (key) => {
      const actual = console[key];
      expect(typeof actual).toEqual("function");
    }
  )
});
