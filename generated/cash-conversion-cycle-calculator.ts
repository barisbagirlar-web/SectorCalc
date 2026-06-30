// Auto-generated from cash-conversion-cycle-calculator-schema.json
import * as z from 'zod';

export interface Cash_conversion_cycle_calculatorInput {
  dataConfidence?: number;
  stokGun: number;
  alacakGun: number;
  borcGun: number;
}

export const Cash_conversion_cycle_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  stokGun: z.number().min(0).default(60),
  alacakGun: z.number().min(0).default(45),
  borcGun: z.number().min(0).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cash_conversion_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["stokGun"] + input["alacakGun"] - input["borcGun"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCash_conversion_cycle_calculator(input: Cash_conversion_cycle_calculatorInput): Cash_conversion_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "days",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Cash_conversion_cycle_calculatorOutput {
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

export const Cash_conversion_cycle_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "days",
  breakdownKeys: [],
} as const;
