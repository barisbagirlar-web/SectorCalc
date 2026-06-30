// Auto-generated from irr-calculator-schema.json
import * as z from 'zod';

export interface Irr_calculatorInput {
  dataConfidence?: number;
  yatirim: number;
  ortalamaNakit: number;
  yil: number;
}

export const Irr_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yatirim: z.number().min(0).default(100000),
  ortalamaNakit: z.number().min(0).default(35000),
  yil: z.number().min(1).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Irr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.pow(1 + input["ortalamaNakit"] / Math.max(1, input["yatirim"]), 1 / Math.max(1, input["yil"])) - 1) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateIrr_calculator(input: Irr_calculatorInput): Irr_calculatorOutput {
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

export interface Irr_calculatorOutput {
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

export const Irr_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
