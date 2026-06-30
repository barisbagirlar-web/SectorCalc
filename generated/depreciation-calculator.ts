// Auto-generated from depreciation-calculator-schema.json
import * as z from 'zod';

export interface Depreciation_calculatorInput {
  dataConfidence?: number;
  bedel: number;
  kalinti: number;
  omur: number;
}

export const Depreciation_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  bedel: z.number().min(0).default(50000),
  kalinti: z.number().min(0).default(5000),
  omur: z.number().min(1).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["bedel"] - input["kalinti"]) / Math.max(1, input["omur"]); results["dogrusal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dogrusal"] = Number.NaN; }
  try { const v = (input["bedel"] - input["kalinti"]) / Math.max(1, input["omur"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDepreciation_calculator(input: Depreciation_calculatorInput): Depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "dogrusal": toNumericFormulaValue(values["dogrusal"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    ["sonuc"]: totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Depreciation_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: Record<string, number>;
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
  [key: string]: unknown;
}

export const Depreciation_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["dogrusal"],
} as const;
