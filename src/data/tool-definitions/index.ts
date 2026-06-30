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

import { getRevenueToolByFreeSlug, getRevenueToolByPaidSlug, revenueTools } from "@/lib/features/tools/revenue-tools";
import type { ToolInput, ToolInputType } from "@/data/tool-schema";

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
 const hardcoded = DEFINITION_MAP.get(definitionKey(tier, slug));
 if (hardcoded) return hardcoded;

 const revTool = tier === "free" ? getRevenueToolByFreeSlug(slug) : getRevenueToolByPaidSlug(slug);
 if (!revTool) return undefined;

 const inputs: ToolInput[] = (tier === "free" ? revTool.freeInputs : revTool.paidInputs).map(ri => ({
   id: ri.key,
   label: ri.label,
   type: (ri.type === "select" ? "select" : "number") as ToolInputType,
   unit: ri.unit,
   required: ri.required,
   defaultValue: ri.defaultValue ?? (ri.type === "select" ? (ri.options?.[0]?.value || "") : 0),
   helperText: ri.helperText || "",
   options: ri.options ? ri.options.map(o => ({ value: o.value, label: o.label })) : undefined
 }));

 return {
   id: slug as ToolSlug,
   slug: slug as ToolSlug,
   tier: tier,
   industryId: revTool.sector as any,
   title: tier === "free" ? revTool.freeTitle : revTool.paidTitle,
   shortDescription: tier === "free" ? revTool.freeValue : revTool.paidValue,
   longDescription: tier === "free" ? revTool.painStatement : revTool.paidValue,
   inputs,
   outputs: [],
   relatedToolIds: [],
   seo: {
     title: tier === "free" ? revTool.freeTitle : revTool.paidTitle,
     description: revTool.painStatement,
     canonicalPath: tier === "free" ? `/tools/free/${slug}` : `/pricing?tool=${slug}`,
   },
   calculatorId: (revTool as any).id,
   interpretationNote: revTool.legalDisclaimer,
   features: tier === "premium" ? { decisionReport: true } : undefined,
 };
}

export function getAllToolDefinitions(): ToolDefinition[] {
  // Combine hardcoded with generated free and premium tool definitions
  const generatedFree = revenueTools.map(r => getToolDefinition("free", r.freeSlug as ToolSlug)).filter(Boolean) as ToolDefinition[];
  const generatedPaid = revenueTools.map(r => getToolDefinition("premium", r.paidSlug as ToolSlug)).filter(Boolean) as ToolDefinition[];
  return [...TOOL_DEFINITIONS, ...generatedFree, ...generatedPaid];
}

export function isValidToolTier(tier: string): tier is ToolTier {
 return tier === "free" || tier === "premium";
}
