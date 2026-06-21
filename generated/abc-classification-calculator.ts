// Auto-generated from abc-classification-calculator-schema.json
import * as z from 'zod';

export interface Abc_classification_calculatorInput {
  yillikTalep: number;
  birimMaliyet: number;
  dataConfidence?: number;
}

export const Abc_classification_calculatorInputSchema = z.object({
  yillikTalep: z.number().min(0).default(10000),
  birimMaliyet: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Abc_classification_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.yillikTalep * input.birimMaliyet; results["yillikDeger"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yillikDeger"] = Number.NaN; }
  try { const v = input.yillikTalep * input.birimMaliyet; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAbc_classification_calculator(input: Abc_classification_calculatorInput): Abc_classification_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inventory turnover metrics monthly.","Factor in seasonality for safety stock."];
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


export interface Abc_classification_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Abc_classification_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

