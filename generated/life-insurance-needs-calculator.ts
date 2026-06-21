// Auto-generated from life-insurance-needs-calculator-schema.json
import * as z from 'zod';

export interface Life_insurance_needs_calculatorInput {
  yillikGelir: number;
  bagimliSayisi: number;
  borclar: number;
  birikim: number;
  dataConfidence?: number;
}

export const Life_insurance_needs_calculatorInputSchema = z.object({
  yillikGelir: z.number().min(0).default(200000),
  bagimliSayisi: z.number().min(0).default(2),
  borclar: z.number().min(0).default(500000),
  birikim: z.number().min(0).default(100000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Life_insurance_needs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, (input.yillikGelir * 10 * input.bagimliSayisi) + input.borclar - input.birikim); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateLife_insurance_needs_calculator(input: Life_insurance_needs_calculatorInput): Life_insurance_needs_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review insurance coverage annually.","Consult a retirement planner for personalized strategy."];
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Life_insurance_needs_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Life_insurance_needs_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

