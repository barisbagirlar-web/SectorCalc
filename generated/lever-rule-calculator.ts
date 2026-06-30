// Auto-generated from lever-rule-calculator-schema.json
import * as z from 'zod';

export interface Lever_rule_calculatorInput {
  dataConfidence?: number;
  C0: number;
  Cl: number;
  Cs: number;
}

export const Lever_rule_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  C0: z.number().min(0).default(40),
  Cl: z.number().min(0).default(25),
  Cs: z.number().min(0).default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lever_rule_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["C0"] - input["Cl"]) / Math.max(0.0001, (input["Cs"] - input["Cl"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateLever_rule_calculator(input: Lever_rule_calculatorInput): Lever_rule_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Use calibrated equipment for measurements.","Consider temperature effects on material properties."];
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
    unit: "fraction",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Lever_rule_calculatorOutput {
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

export const Lever_rule_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "fraction",
  breakdownKeys: [],
} as const;
