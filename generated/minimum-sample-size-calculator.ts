// Auto-generated from minimum-sample-size-calculator-schema.json
import * as z from 'zod';

export interface Minimum_sample_size_calculatorInput {
  Z: number;
  stdSapma: number;
  hataPayi: number;
  dataConfidence?: number;
}

export const Minimum_sample_size_calculatorInputSchema = z.object({
  Z: z.number().min(0).default(1.96),
  stdSapma: z.number().min(0).default(10),
  hataPayi: z.number().min(0).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Minimum_sample_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(Math.pow((input.Z * input.stdSapma / Math.max(0.0001, input.hataPayi)), 2)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateMinimum_sample_size_calculator(input: Minimum_sample_size_calculatorInput): Minimum_sample_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify statistical assumptions before making decisions.","Use larger sample sizes for better accuracy."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "samples",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Minimum_sample_size_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Minimum_sample_size_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "samples",
  breakdownKeys: ["sonuc"],
} as const;

