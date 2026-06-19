import type { ToolData } from "@/lib/tools/all-tools-data";
import type { HomepageCoverageId } from "@/lib/home/homepage-positioning-data";

/**
 * Category-key-based matchers for homepage coverage cards.
 *
 * Each entry lists one or more taxonomy category slugs that should be
 * counted under that homepage sector card. Every tool has exactly one
 * categoryKey, so no double-counting across cards.
 *
 * ECMI / ISO 9001 — deterministic, verifiable classification.
 *
 * LOCKED: `as const satisfies` ensures every key is a valid
 * HomepageCoverageId and every value is a known categoryKey.
 * Do NOT add sectorKey values here — only categoryKey.
 */
export const HOMEPAGE_COVERAGE_TOOL_MATCHERS = {
  production: [
    "quality-six-sigma",
    "cnc-additive-manufacturing",
    "metal-plastics-forming",
    "lean-production",
    "textile-print-lab",
    "digital-factory-automation",
  ],
  industrial: [
    "hse-ergonomics",
    "maintenance-reliability",
  ],
  technical: [
    "technology-ai-cloud-cyber",
    "electrical-power-systems",
    "process-chemical",
    "mechanical-hvac-energy-loss",
  ],
  construction: [
    "project-construction-management",
  ],
  logistics: [
    "procurement-supply-chain",
  ],
  energy: [
    "sustainability-resource-esg",
  ],
  finance: [
    "finance-sales-working-capital",
    "workforce-hr",
    "global-compliance-trade",
  ],
  foodRetail: [
    "food-cold-chain-hygiene",
    "packaging-local-business",
  ],
} as const satisfies Record<HomepageCoverageId, readonly string[]>;

/**
 * Primary free-tools catalog filter slug for each homepage coverage card.
 * These are real categoryKey values that exist in the tool data.
 *
 * LOCKED: `as const satisfies` ensures every slug is a valid categoryKey.
 */
export const HOMEPAGE_COVERAGE_FILTER_SLUG = {
  production: "quality-six-sigma",
  industrial: "hse-ergonomics",
  technical: "technology-ai-cloud-cyber",
  construction: "project-construction-management",
  logistics: "procurement-supply-chain",
  energy: "sustainability-resource-esg",
  finance: "finance-sales-working-capital",
  foodRetail: "food-cold-chain-hygiene",
} as const satisfies Record<HomepageCoverageId, string>;

/**
 * Count tools belonging to a homepage coverage card.
 * Matches only by categoryKey — no sectorKey cross-matching —
 * so each tool is counted in exactly one card.
 */
export function countToolsForHomepageCoverage(
  coverageId: HomepageCoverageId,
  tools: readonly ToolData[],
): number {
  const keys = new Set(HOMEPAGE_COVERAGE_TOOL_MATCHERS[coverageId]);
  return tools.filter((tool) => keys.has(tool.categoryKey)).length;
}
