import { describe, expect, it } from "vitest";
import { listGlobalCategories, resolveGlobalCategoryTitle } from "@/lib/catalog/global-tool-category-taxonomy";

describe("resolveGlobalCategoryTitle", () => {
  const lean = listGlobalCategories().find((c) => c.slug === "lean-production");
  if (!lean) throw new Error("lean-production missing");

  it("returns Turkish title for tr", () => {
    expect(resolveGlobalCategoryTitle(lean, "tr")).toBe(lean.trTitle);
  });

  it("returns German override for de", () => {
    expect(resolveGlobalCategoryTitle(lean, "de")).toBe("Lean-Produktion & Linieneffizienz");
  });

  it("returns French override for fr", () => {
    expect(resolveGlobalCategoryTitle(lean, "fr")).toContain("lean");
  });

  it("returns Arabic override for ar", () => {
    expect(resolveGlobalCategoryTitle(lean, "ar")).toMatch(/[\u0600-\u06FF]/);
  });
});

describe("buildCategorizedToolIndex seed integration", () => {
  it("includes 152 premium-152 seed tools", async () => {
    const { buildCategorizedToolIndex } = await import(
      "@/lib/catalog/build-categorized-tool-index"
    );
    const seedCount = buildCategorizedToolIndex().filter(
      (item) => item.source === "user-premium-152",
    ).length;
    expect(seedCount).toBe(152);
  });
});
