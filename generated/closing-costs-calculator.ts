// Auto-generated from closing-costs-calculator-schema.json
import * as z from 'zod';

export interface Closing_costs_calculatorInput {
  krediTutari: number;
  oran: number;
  sabitUcretler: number;
  dataConfidence?: number;
}

export const Closing_costs_calculatorInputSchema = z.object({
  krediTutari: z.number().min(0).default(1000000),
  oran: z.number().min(0).default(2),
  sabitUcretler: z.number().min(0).default(10000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Closing_costs_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.krediTutari * input.oran / 100) + input.sabitUcretler; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateClosing_costs_calculator(input: Closing_costs_calculatorInput): Closing_costs_calculatorOutput {
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


export interface Closing_costs_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Closing_costs_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["sonuc"],
} as const;

