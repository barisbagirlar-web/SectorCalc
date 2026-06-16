import { describe, expect, test } from "vitest";
import { buildCatalogFilterHref } from "@/lib/navigation/catalog-filter-href";

describe("buildCatalogFilterHref", () => {
  test("returns pathname for empty filter value", () => {
    expect(buildCatalogFilterHref("/free-tools", "category", "")).toBe("/free-tools");
  });

  test("uses explicit all query for all filter value", () => {
    expect(buildCatalogFilterHref("/free-tools", "category", "all")).toBe(
      "/free-tools?category=all",
    );
  });

  test("appends encoded category query param", () => {
    expect(buildCatalogFilterHref("/premium-tools", "category", "lean-production")).toBe(
      "/premium-tools?category=lean-production",
    );
  });
});
