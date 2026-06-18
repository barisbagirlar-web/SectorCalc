import type { ToolData } from "@/lib/tools/all-tools-data";
import type { HomepageCoverageId } from "@/lib/home/homepage-positioning-data";

/** Schema category / sector keys that belong to each homepage coverage card. */
export const HOMEPAGE_COVERAGE_TOOL_MATCHERS: Readonly<
  Record<HomepageCoverageId, readonly string[]>
> = {
  production: [
    "malzeme-fire-oee",
    "lean-production",
    "uretim-imalat",
    "cnc-manufacturing",
    "cnc-additive-manufacturing",
    "metal-plastics-forming",
    "quality-six-sigma",
    "textile-print-lab",
    "digital-factory-automation",
  ],
  industrial: [
    "atolye-tamir",
    "auto-repair-shop",
    "maintenance-reliability",
    "hse-ergonomics",
  ],
  technical: [
    "teknik-muhendislik",
    "olcum-donusum",
    "electrical-power-systems",
    "mechanical-hvac-energy-loss",
    "technology-ai-cloud-cyber",
    "process-chemical",
  ],
  construction: [
    "insaat-saha",
    "construction",
    "project-construction-management",
    "daily-renovation",
    "landscaping-lawn-care",
  ],
  logistics: [
    "rota-lojistik",
    "lojistik-sevkiyat",
    "procurement-supply-chain",
    "logistics-transport",
  ],
  energy: ["enerji-karbon", "energy-consumption", "sustainability-resource-esg"],
  finance: [
    "finans-ik",
    "finans-kredi",
    "maliyet-marj",
    "finance-sales-working-capital",
    "workforce-hr",
    "global-compliance-trade",
  ],
  foodRetail: [
    "perakende-gida",
    "restaurant",
    "food-cold-chain-hygiene",
    "ecommerce",
    "retail",
    "packaging-local-business",
  ],
};

/** Primary free-tools catalog filter slug for each homepage coverage card. */
export const HOMEPAGE_COVERAGE_FILTER_SLUG: Readonly<
  Record<HomepageCoverageId, string>
> = {
  production: "malzeme-fire-oee",
  industrial: "atolye-tamir",
  technical: "teknik-muhendislik",
  construction: "insaat-saha",
  logistics: "rota-lojistik",
  energy: "enerji-karbon",
  finance: "finans-ik",
  foodRetail: "perakende-gida",
};

export function countToolsForHomepageCoverage(
  coverageId: HomepageCoverageId,
  tools: readonly ToolData[],
): number {
  const keys = new Set(HOMEPAGE_COVERAGE_TOOL_MATCHERS[coverageId]);
  return tools.filter((tool) => keys.has(tool.categoryKey) || keys.has(tool.sectorKey)).length;
}
