import { describe, expect, test } from "vitest";
import { readHomepageStringArray } from "@/lib/home/homepage-component-utils";

describe("readHomepageStringArray", () => {
  test("returns only string items from arrays", () => {
    expect(readHomepageStringArray(["CNC", "OEE", 1, null, "Fire"])).toEqual([
      "CNC",
      "OEE",
      "Fire",
    ]);
  });

  test("returns empty array for non-array input", () => {
    expect(readHomepageStringArray(null)).toEqual([]);
    expect(readHomepageStringArray("CNC")).toEqual([]);
    expect(readHomepageStringArray({ tags: ["CNC"] })).toEqual([]);
  });
});
