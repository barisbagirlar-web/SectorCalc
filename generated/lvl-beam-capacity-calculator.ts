// Auto-generated from lvl-beam-capacity-calculator-schema.json
import * as z from 'zod';

export interface Lvl_beam_capacity_calculatorInput {
  dataConfidence?: number;
  kesitModulu: number;
  egilmeDayanimi: number;
}

export const Lvl_beam_capacity_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kesitModulu: z.number().min(0).default(0.00025),
  egilmeDayanimi: z.number().min(0).default(40000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Lvl_beam_capacity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["kesitModulu"] * input["egilmeDayanimi"]; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateLvl_beam_capacity_calculator(input: Lvl_beam_capacity_calculatorInput): Lvl_beam_capacity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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
    unit: "N.m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Lvl_beam_capacity_calculatorOutput {
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

export const Lvl_beam_capacity_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "N.m",
  breakdownKeys: [],
} as const;
