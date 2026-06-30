// Auto-generated from cash-out-refinance-calculator-schema.json
import * as z from 'zod';

export interface Cash_out_refinance_calculatorInput {
  dataConfidence?: number;
  mulkDegeri: number;
  kalanBorc: number;
  yeniKredi: number;
  masraf: number;
}

export const Cash_out_refinance_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  mulkDegeri: z.number().min(0).default(1500000),
  kalanBorc: z.number().min(0).default(500000),
  yeniKredi: z.number().min(0).default(1000000),
  masraf: z.number().min(0).default(30000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cash_out_refinance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["yeniKredi"] / Math.max(1, input["mulkDegeri"])) * 100; results["ltv"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ltv"] = Number.NaN; }
  try { const v = input["yeniKredi"] - input["kalanBorc"] - input["masraf"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCash_out_refinance_calculator(input: Cash_out_refinance_calculatorInput): Cash_out_refinance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "ltv": toNumericFormulaValue(values["ltv"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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

export interface Cash_out_refinance_calculatorOutput {
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

export const Cash_out_refinance_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["ltv"],
} as const;
