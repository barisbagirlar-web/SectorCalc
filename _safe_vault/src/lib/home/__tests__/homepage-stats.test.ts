import { describe, expect, test } from "vitest";
import { getHomepageCatalogToolCounts } from "@/lib/home/homepage-stats";

describe("getHomepageCatalogToolCounts", () => {
  test("returns positive free and premium calculator counts", () => {
    const counts = getHomepageCatalogToolCounts();

    expect(counts.freeCount).toBeGreaterThan(0);
    expect(counts.premiumCount).toBeGreaterThan(0);
    expect(Number.isInteger(counts.freeCount)).toBe(true);
    expect(Number.isInteger(counts.premiumCount)).toBe(true);
  });
});
