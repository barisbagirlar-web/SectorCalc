// Auto-generated from debt-consolidation-calculator-schema.json
import * as z from 'zod';

export interface Debt_consolidation_calculatorInput {
  dataConfidence?: number;
  toplamBorc: number;
  yeniFaiz: number;
  vade: number;
}

export const Debt_consolidation_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  toplamBorc: z.number().min(0).default(100000),
  yeniFaiz: z.number().min(0).default(10),
  vade: z.number().min(1).default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Debt_consolidation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["toplamBorc"] * ((input["yeniFaiz"] / 1200) * Math.pow(1 + input["yeniFaiz"] / 1200, input["vade"])) / (Math.pow(1 + input["yeniFaiz"] / 1200, input["vade"]) - 1); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDebt_consolidation_calculator(input: Debt_consolidation_calculatorInput): Debt_consolidation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Compare multiple loan offers before committing.","Consider total cost including fees."];
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

export interface Debt_consolidation_calculatorOutput {
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

export const Debt_consolidation_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "USD",
  breakdownKeys: [],
} as const;
