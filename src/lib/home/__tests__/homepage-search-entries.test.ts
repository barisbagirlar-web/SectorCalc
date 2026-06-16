import { describe, expect, test } from "vitest";
import { HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES } from "@/lib/home/homepage-search-entries";

describe("homepage-search-entries", () => {
  test("excludes daily-life and generic catalog tabs from homepage search", () => {
    expect(HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES.has("everyday-life")).toBe(true);
    expect(HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES.has("math-statistics")).toBe(true);
    expect(HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES.has("conversion")).toBe(true);
    expect(HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES.has("health-body")).toBe(true);
    expect(HOMEPAGE_SEARCH_EXCLUDED_FREE_CATEGORIES.has("manufacturing")).toBe(false);
  });
});
