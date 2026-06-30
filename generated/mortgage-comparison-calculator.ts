// Auto-generated from mortgage-comparison-calculator-schema.json
import * as z from 'zod';

export interface Mortgage_comparison_calculatorInput {
  dataConfidence?: number;
  kredi1: number;
  faiz1: number;
  kredi2: number;
  faiz2: number;
  vade: number;
}

export const Mortgage_comparison_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kredi1: z.number().min(0).default(1000000),
  faiz1: z.number().min(0).default(12),
  kredi2: z.number().min(0).default(1000000),
  faiz2: z.number().min(0).default(10),
  vade: z.number().min(1).default(120),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Mortgage_comparison_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["faiz1"] === 0 ? input["kredi1"] / Math.max(1, input["vade"]) : input["kredi1"] * ((input["faiz1"] / 1200) / (1 - Math.pow(1 + input["faiz1"] / 1200, -input["vade"]))); results["taksit1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taksit1"] = Number.NaN; }
  try { const v = input["faiz2"] === 0 ? input["kredi2"] / Math.max(1, input["vade"]) : input["kredi2"] * ((input["faiz2"] / 1200) / (1 - Math.pow(1 + input["faiz2"] / 1200, -input["vade"]))); results["taksit2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taksit2"] = Number.NaN; }
  try { const v = (input["faiz1"] === 0 ? input["kredi1"] / Math.max(1, input["vade"]) : input["kredi1"] * ((input["faiz1"] / 1200) / (1 - Math.pow(1 + input["faiz1"] / 1200, -input["vade"])))) - (input["faiz2"] === 0 ? input["kredi2"] / Math.max(1, input["vade"]) : input["kredi2"] * ((input["faiz2"] / 1200) / (1 - Math.pow(1 + input["faiz2"] / 1200, -input["vade"])))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateMortgage_comparison_calculator(input: Mortgage_comparison_calculatorInput): Mortgage_comparison_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {
    "taksit1": toNumericFormulaValue(values["taksit1"]),
    "taksit2": toNumericFormulaValue(values["taksit2"])
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

export interface Mortgage_comparison_calculatorOutput {
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

export const Mortgage_comparison_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: ["taksit1","taksit2"],
} as const;
