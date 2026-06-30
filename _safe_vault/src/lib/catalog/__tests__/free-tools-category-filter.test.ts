import { describe, expect, it } from "vitest";
import { resolveFreeToolsFilterCategoryId } from "@/lib/catalog/free-tools-category-filter";

describe("resolveFreeToolsFilterCategoryId", () => {
  const allowed = new Set(["all", "finance-business", "health-body"]);

  it("resolves direct group ids", () => {
    expect(resolveFreeToolsFilterCategoryId("finance-business", allowed)).toBe("finance-business");
  });

  it("maps legacy discovery tab ids to catalog group ids", () => {
    expect(resolveFreeToolsFilterCategoryId("cost-margin", allowed)).toBe("finance-business");
  });

  it("falls back to all for unknown categories", () => {
    expect(resolveFreeToolsFilterCategoryId("unknown-tab", allowed)).toBe("all");
  });
});
