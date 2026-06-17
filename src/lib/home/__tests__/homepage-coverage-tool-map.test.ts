import { describe, expect, it } from "vitest";
import {
  HOMEPAGE_COVERAGE_IDS,
  type HomepageCoverageId,
} from "@/lib/home/homepage-positioning-data";
import {
  countToolsForHomepageCoverage,
  HOMEPAGE_COVERAGE_FILTER_SLUG,
  HOMEPAGE_COVERAGE_TOOL_MATCHERS,
} from "@/lib/home/homepage-coverage-tool-map";
import type { ToolData } from "@/lib/tools/all-tools-data";

function makeTool(partial: Partial<ToolData> & Pick<ToolData, "categoryKey" | "sectorKey">): ToolData {
  return {
    slug: partial.slug ?? "sample-tool",
    name: partial.name ?? "Sample Tool",
    category: partial.category ?? "Category",
    categoryKey: partial.categoryKey,
    sector: partial.sector ?? "Sector",
    sectorKey: partial.sectorKey,
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

  it("counts tools by category or sector key", () => {
    const tools = [
      makeTool({ categoryKey: "malzeme-fire-oee", sectorKey: "diger" }),
      makeTool({ categoryKey: "diger", sectorKey: "atolye-tamir" }),
      makeTool({ categoryKey: "finans-ik", sectorKey: "diger" }),
    ];

    expect(countToolsForHomepageCoverage("production", tools)).toBe(1);
    expect(countToolsForHomepageCoverage("industrial", tools)).toBe(1);
    expect(countToolsForHomepageCoverage("finance", tools)).toBe(1);
    expect(countToolsForHomepageCoverage("foodRetail", tools)).toBe(0);
  });
});
