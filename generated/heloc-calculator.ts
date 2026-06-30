// Auto-generated from heloc-calculator-schema.json
import * as z from 'zod';

export interface Heloc_calculatorInput {
  dataConfidence?: number;
  evDegeri: number;
  kalanBorc: number;
  maksOran: number;
}

export const Heloc_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  evDegeri: z.number().min(0).default(1500000),
  kalanBorc: z.number().min(0).default(500000),
  maksOran: z.number().min(0).max(100).default(80),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Heloc_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["evDegeri"] * input["maksOran"] / 100) - input["kalanBorc"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateHeloc_calculator(input: Heloc_calculatorInput): Heloc_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
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

export interface Heloc_calculatorOutput {
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

export const Heloc_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
