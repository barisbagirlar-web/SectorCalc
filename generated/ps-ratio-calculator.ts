// Auto-generated from ps-ratio-calculator-schema.json
import * as z from 'zod';

export interface Ps_ratio_calculatorInput {
  piyasaDegeri: number;
  toplamSatislar: number;
  dataConfidence?: number;
}

export const Ps_ratio_calculatorInputSchema = z.object({
  piyasaDegeri: z.number().min(0).default(5000000),
  toplamSatislar: z.number().min(0).default(4000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ps_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.piyasaDegeri / Math.max(1, input.toplamSatislar); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePs_ratio_calculator(input: Ps_ratio_calculatorInput): Ps_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify inputs before making financial decisions.","Consult a licensed financial advisor for personalized advice."];
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
    unit: "ratio",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ps_ratio_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Ps_ratio_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "ratio",
  breakdownKeys: ["sonuc"],
} as const;

