import type { ToolDefinition } from "@/data/tool-schema";
import type { ToolSlug, ToolTier } from "@/data/tools";
import { machineHourEstimatorDefinition } from "@/data/tool-definitions/machine-hour-estimator";
import { cncMinimumSafeQuoteAnalyzerDefinition } from "@/data/tool-definitions/cnc-minimum-safe-quote-analyzer";
import { projectCostEstimatorDefinition } from "@/data/tool-definitions/project-cost-estimator";
import { cleaningCostEstimatorDefinition } from "@/data/tool-definitions/cleaning-cost-estimator";
import { foodCostCalculatorDefinition } from "@/data/tool-definitions/food-cost-calculator";
import { productMarginCalculatorDefinition } from "@/data/tool-definitions/product-margin-calculator";
import { changeOrderImpactAnalyzerDefinition } from "@/data/tool-definitions/change-order-impact-analyzer";
import { officeCleaningBidOptimizerDefinition } from "@/data/tool-definitions/office-cleaning-bid-optimizer";
import { menuProfitLeakDetectorDefinition } from "@/data/tool-definitions/menu-profit-leak-detector";
import { returnRateProfitErosionToolDefinition } from "@/data/tool-definitions/return-rate-profit-erosion-tool";
import { indicatedHorsepowerCalculatorDefinition } from "@/data/tool-definitions/indicated-horsepower-calculator";

const TOOL_DEFINITIONS: ToolDefinition[] = [
 machineHourEstimatorDefinition,
 cncMinimumSafeQuoteAnalyzerDefinition,
 projectCostEstimatorDefinition,
 cleaningCostEstimatorDefinition,
 foodCostCalculatorDefinition,
 productMarginCalculatorDefinition,
 changeOrderImpactAnalyzerDefinition,
 officeCleaningBidOptimizerDefinition,
 menuProfitLeakDetectorDefinition,
 returnRateProfitErosionToolDefinition,
 indicatedHorsepowerCalculatorDefinition,
];

const definitionKey = (tier: ToolTier, slug: ToolSlug): string =>
 `${tier}:${slug}`;

const DEFINITION_MAP = new Map<string, ToolDefinition>(
 TOOL_DEFINITIONS.map((d) => [definitionKey(d.tier, d.slug), d])
);

export function getToolDefinition(
 tier: ToolTier,
 slug: ToolSlug
): ToolDefinition | undefined {
 return DEFINITION_MAP.get(definitionKey(tier, slug));
}

export function getAllToolDefinitions(): ToolDefinition[] {
 return [...TOOL_DEFINITIONS];
}

export function isValidToolTier(tier: string): tier is ToolTier {
  return tier === "free" || tier === "premium" || tier === "generated";
}
