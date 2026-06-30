import { describe, expect, test } from "vitest";
import {
  readHomepageMessageList,
  readHomepageStringArray,
  resolveHomepageMessage,
} from "@/lib/home/homepage-component-utils";

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

describe("resolveHomepageMessage", () => {
  test("uses fallback when primary key is absent", () => {
    const t = Object.assign(
      (key: string) => (key.endsWith(".title") ? "Title" : key),
      {
        has: (key: string) => key.endsWith(".title"),
        raw: () => null,
      },
    );
    expect(
      resolveHomepageMessage(t, "coverage.items.production.shortTitle", "coverage.items.production.title"),
    ).toBe("Title");
  });
});

describe("readHomepageMessageList", () => {
  test("reads values from fallback object", () => {
    const t = Object.assign((key: string) => key, {
      has: (key: string) => key === "freePremium.freeItems",
      raw: (key: string) =>
        key === "freePremium.freeItems"
          ? { fast: "Fast results", formula: "Core formulas" }
          : [],
    });
    expect(readHomepageMessageList(t, "freePremium.freeHighlights", "freePremium.freeItems")).toEqual([
      "Fast results",
      "Core formulas",
    ]);
  });
});
