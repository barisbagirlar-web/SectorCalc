/**
 * Builds a minimal GeneratedToolSchema from Industrial Formula revenue tool data.
 * Enables free-stub pages for the 18 industrial formulas without requiring
 * a pre-generated schema JSON file in generated/schemas/.
 *
 * ECMI / ISO 9001 — TÜV-certifiable engineering quality.
 */

import type { GeneratedToolSchema, GeneratedToolInput } from "@/lib/features/generated-tools/types";
import { industrialFormulaTools } from "@/lib/features/tools/revenue-tools-industrial-formulas";

/**
 * Maps RevenueToolInput type to GeneratedToolInput type.
 */
function mapInputType(type: string): "number" | "select" | "boolean" {
  if (type === "currency" || type === "percent") return "number";
  if (type === "select") return "select";
  return "number";
}

/**
 * Build a minimal GeneratedToolSchema from a revenue tool freeSlug.
 * Returns null if slug does not match any industrial formula tool.
 */
export function buildIndustrialFreeToolSchema(slug: string): GeneratedToolSchema | null {
  const tool = industrialFormulaTools.find((t) => t.freeSlug === slug);
  if (!tool) return null;

  const inputs: GeneratedToolInput[] = tool.freeInputs.map((input) => ({
    id: input.key,
    label: input.label,
    type: mapInputType(input.type),
    unit: input.unit ?? "",
    default: input.defaultValue ?? (input.type === "percent" ? 10 : undefined),
    min: null,
    max: null,
    options: input.options
      ? input.options.map((o) => o.value)
      : null,
    optionLabels: input.options
      ? Object.fromEntries(input.options.map((o) => [o.value, o.label]))
      : undefined,
    businessContext: input.helperText ?? input.label,
  }));

  return {
    toolName: tool.freeTitle,
    sectorSlug: tool.sector,
    inputs,
    validation: {
      rules: ["Inputs are validated as positive numbers where applicable."],
      thresholds: {},
    },
    formulas: {
      main: tool.freeResultPromise,
    },
    outputs: {
      primary: "risk_signal",
      unit: "",
      breakdown: {
        risk_signal: tool.freeResultPromise,
      },
      hiddenLossDrivers: [...tool.freeMissingFactors],
      suggestedActions: [
        `Upgrade to ${tool.paidTitle} for full industrial-grade analysis.`,
        `Contact SectorCalc support for custom enterprise implementation.`,
      ],
      dataConfidenceAdjusted: "Free-tier estimate — not suitable for production decisions.",
    },
    premiumFeatures: [
      ...tool.freeMissingFactors.map((f) => `Full ${f} analysis`),
      "Detailed report with Trust Trace verification",
      "PDF export with legal disclaimer",
    ],
    premiumRequired: false,
    about: {
      description: {
        short: tool.freeValue,
        long: `${tool.painStatement} ${tool.freeValue} The premium version (${tool.paidTitle}) provides ${tool.paidValue.toLowerCase()}`,
      },
      faqs: [
        {
          question: "What does this free estimation include?",
          answer: tool.freeResultPromise,
        },
        {
          question: "What is missing from the free version?",
          answer: `The free version does not include: ${tool.freeMissingFactors.join(", ")}.`,
        },
        {
          question: "What does the premium version offer?",
          answer: tool.paidResultPromise,
        },
      ],
    },
  };
}

/**
 * Check if a slug matches an industrial formula tool freeSlug.
 */
export function isIndustrialFreeToolSlug(slug: string): boolean {
  return industrialFormulaTools.some((t) => t.freeSlug === slug);
}
