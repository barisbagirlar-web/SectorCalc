// Auto-generated from simple-interest-calculator-schema.json
import * as z from 'zod';

export interface Simple_interest_calculatorInput {
  dataConfidence?: number;
  anapara: number;
  faiz: number;
  sure: number;
}

export const Simple_interest_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  anapara: z.number().min(0).default(10000),
  faiz: z.number().min(0).default(10),
  sure: z.number().min(0).default(3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Simple_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["anapara"] * (input["faiz"] / 100) * input["sure"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSimple_interest_calculator(input: Simple_interest_calculatorInput): Simple_interest_calculatorOutput {
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
    unit: "USD",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Simple_interest_calculatorOutput {
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

export const Simple_interest_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
