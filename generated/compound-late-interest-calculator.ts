// Auto-generated from compound-late-interest-calculator-schema.json
import * as z from 'zod';

export interface Compound_late_interest_calculatorInput {
  dataConfidence?: number;
  anapara: number;
  yillikFaiz: number;
  gecikmeGun: number;
  bilesimSikligi: number;
}

export const Compound_late_interest_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  anapara: z.number().min(0).default(10000),
  yillikFaiz: z.number().min(0).default(24),
  gecikmeGun: z.number().min(0).default(90),
  bilesimSikligi: z.number().min(0).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Compound_late_interest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["anapara"] * Math.pow((1 + (input["yillikFaiz"] / 100) * (input["bilesimSikligi"] / 365)), input["gecikmeGun"] / Math.max(1, input["bilesimSikligi"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCompound_late_interest_calculator(input: Compound_late_interest_calculatorInput): Compound_late_interest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["High asymmetry increases injury risk.","Low H-index may indicate limited academic impact."];
  const suggestedActions: string[] = ["Balance training for injury prevention.","Use peer review to validate research quality."];
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
    unit: "TL",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Compound_late_interest_calculatorOutput {
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

export const Compound_late_interest_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "TL",
  breakdownKeys: [],
} as const;
