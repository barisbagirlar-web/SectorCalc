import type { ToolData } from "@/lib/tools/all-tools-data";
import type { HomepageCoverageId } from "@/lib/home/homepage-positioning-data";

export const HOMEPAGE_COVERAGE_TOOL_MATCHERS: Readonly<
  Record<HomepageCoverageId, readonly string[]>
> = {
  production: [
    "lean-production",
    "process-chemical",
    "textile-print-lab",
  ],
  industrial: [
    "mechanical-hvac-energy-loss",
  ],
  technical: [
    "technology-ai-cloud-cyber",
    "electrical-power-systems",
  ],
  construction: [
    "project-construction-management",
  ],
  logistics: [
    "automotive-transport",
  ],
  energy: [
    "sustainability-resource-esg",
  ],
  finance: [
    "finance-sales-working-capital",
  ],
  foodRetail: [
    "agriculture-food-beverage",
  ],
  general: [
    "health-fitness-daily-life",
    "mathematics-statistics",
    "other",
  ],
};

export const HOMEPAGE_COVERAGE_FILTER_SLUG: Readonly<
  Record<HomepageCoverageId, string>
> = {
  production: "lean-production",
  industrial: "mechanical-hvac-energy-loss",
  technical: "technology-ai-cloud-cyber",
  construction: "project-construction-management",
  logistics: "automotive-transport",
  energy: "sustainability-resource-esg",
  finance: "finance-sales-working-capital",
  foodRetail: "agriculture-food-beverage",
  general: "other",
};

export function countToolsForHomepageCoverage(
  coverageId: HomepageCoverageId,
  tools: readonly ToolData[],
): number {
  const keys: ReadonlySet<string> = new Set(HOMEPAGE_COVERAGE_TOOL_MATCHERS[coverageId]);
  return tools.filter((tool) => keys.has(tool.categoryKey)).length;
}
