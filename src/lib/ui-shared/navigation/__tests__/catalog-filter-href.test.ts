import { describe, expect, test } from "vitest";
import { buildCatalogFilterHref } from "@/lib/ui-shared/navigation/catalog-filter-href";

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
    expect(buildCatalogFilterHref("/free-tools", "category", "lean-production")).toBe(
      "/free-tools?category=lean-production",
    );
  });
});
