// Auto-generated from asset-allocation-calculator-schema.json
import * as z from 'zod';

export interface Asset_allocation_calculatorInput {
  dataConfidence?: number;
  portfoy: number;
  hisse: number;
  tahvil: number;
  nakit: number;
}

export const Asset_allocation_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  portfoy: z.number().min(0).default(500000),
  hisse: z.number().min(0).max(100).default(60),
  tahvil: z.number().min(0).max(100).default(30),
  nakit: z.number().min(0).max(100).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Asset_allocation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["portfoy"] * (input["hisse"] / 100); results["hisseTutar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hisseTutar"] = Number.NaN; }
  try { const v = input["portfoy"] * (input["tahvil"] / 100); results["tahvilTutar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tahvilTutar"] = Number.NaN; }
  try { const v = input["portfoy"] * (input["nakit"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateAsset_allocation_calculator(input: Asset_allocation_calculatorInput): Asset_allocation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "hisseTutar": toNumericFormulaValue(values["hisseTutar"]),
    "tahvilTutar": toNumericFormulaValue(values["tahvilTutar"])
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

export interface Asset_allocation_calculatorOutput {
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

export const Asset_allocation_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["hisseTutar","tahvilTutar"],
} as const;
