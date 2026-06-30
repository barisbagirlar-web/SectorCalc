// Auto-generated from drug-half-life-calculator-schema.json
import * as z from 'zod';

export interface Drug_half_life_calculatorInput {
  dataConfidence?: number;
  yarilanmaOmru: number;
  dozAraligi: number;
}

export const Drug_half_life_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  yarilanmaOmru: z.number().min(0).default(12),
  dozAraligi: z.number().min(0).default(8),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Drug_half_life_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 0.693 / Math.max(0.0001, input["yarilanmaOmru"]); results["k"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["k"] = Number.NaN; }
  try { const v = 1 / Math.max(0.0001, (1 - Math.exp(-(0.693 / Math.max(0.0001, input["yarilanmaOmru"])) * input["dozAraligi"]))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateDrug_half_life_calculator(input: Drug_half_life_calculatorInput): Drug_half_life_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low SLA indicates service reliability issue.","High latency degrades user experience."];
  const suggestedActions: string[] = ["Monitor system performance regularly.","Implement redundancy for critical infrastructure."];
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
    unit: "factor",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Drug_half_life_calculatorOutput {
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

export const Drug_half_life_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "factor",
  breakdownKeys: ["k"],
} as const;
