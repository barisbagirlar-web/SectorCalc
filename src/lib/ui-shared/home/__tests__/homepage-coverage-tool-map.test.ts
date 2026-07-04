import { describe, expect, it } from "vitest";
import {
  HOMEPAGE_COVERAGE_IDS,
  type HomepageCoverageId,
} from "@/lib/ui-shared/home/homepage-positioning-data";
import {
  countToolsForHomepageCoverage,
  HOMEPAGE_COVERAGE_FILTER_SLUG,
  HOMEPAGE_COVERAGE_TOOL_MATCHERS,
} from "@/lib/ui-shared/home/homepage-coverage-tool-map";
import type { ToolData } from "@/lib/features/tools/all-tools-data";

function makeTool(partial: Record<string, any> & { categoryKey: string; sectorKey: string }): ToolData {
  return {
    slug: partial.slug ?? "sample-tool",
    name: partial.name ?? "Sample Tool",
    title: partial.title ?? "Sample Tool",
    description: partial.description ?? "Sample tool description",
    category: partial.category ?? "Category",
    categoryKey: partial.categoryKey,
    categorySlug: partial.categorySlug ?? partial.categoryKey,
    sector: partial.sector ?? "Sector",
    sectorKey: partial.sectorKey as any,
    tier: "premium",
    premiumRequired: partial.premiumRequired ?? false,
    href: partial.href ?? "/tools/sample-tool",
  };
}

describe("homepage-coverage-tool-map", () => {
  it("defines matchers and filter slugs for every homepage coverage id", () => {
    for (const id of HOMEPAGE_COVERAGE_IDS) {
      expect(HOMEPAGE_COVERAGE_TOOL_MATCHERS[id as HomepageCoverageId].length).toBeGreaterThan(0);
      expect(HOMEPAGE_COVERAGE_FILTER_SLUG[id as HomepageCoverageId]).toBeTruthy();
    }
  });

  it("counts tools by category key only (no sector-key cross-match)", () => {
    const tools = [
      makeTool({ categoryKey: "quality-six-sigma", sectorKey: "diger" }),
      makeTool({ categoryKey: "diger", sectorKey: "daily-renovation" }),
      makeTool({ categoryKey: "finance-sales-working-capital", sectorKey: "diger" }),
    ];

    expect(countToolsForHomepageCoverage("production", tools)).toBe(1);
    expect(countToolsForHomepageCoverage("construction", tools)).toBe(0);
    expect(countToolsForHomepageCoverage("finance", tools)).toBe(1);
    expect(countToolsForHomepageCoverage("foodRetail", tools)).toBe(0);
  });
});
