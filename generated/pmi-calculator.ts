// Auto-generated from pmi-calculator-schema.json
import * as z from 'zod';

export interface Pmi_calculatorInput {
  krediTutari: number;
  pmiOrani: number;
  dataConfidence?: number;
}

export const Pmi_calculatorInputSchema = z.object({
  krediTutari: z.number().min(0).default(1000000),
  pmiOrani: z.number().min(0).default(0.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pmi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.krediTutari * input.pmiOrani / 100) / 12; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculatePmi_calculator(input: Pmi_calculatorInput): Pmi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify all property data with official documents.","Consult a mortgage broker for personalized rates."];
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


export interface Pmi_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pmi_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

