// Auto-generated from real-return-calculator-schema.json
import * as z from 'zod';

export interface Real_return_calculatorInput {
  dataConfidence?: number;
  nominalGetiri: number;
  enflasyon: number;
}

export const Real_return_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  nominalGetiri: z.number().min(0).default(20),
  enflasyon: z.number().min(0).default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Real_return_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((1 + input["nominalGetiri"] / 100) / Math.max(0.0001, (1 + input["enflasyon"] / 100)) - 1) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateReal_return_calculator(input: Real_return_calculatorInput): Real_return_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Real_return_calculatorOutput {
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

export const Real_return_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
