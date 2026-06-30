// Auto-generated from compton-shift-calculator-schema.json
import * as z from 'zod';

export interface Compton_shift_calculatorInput {
  dataConfidence?: number;
  sacilmaAcisi: number;
}

export const Compton_shift_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  sacilmaAcisi: z.number().min(0).max(180).default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Compton_shift_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2.426e-12 * (1 - Math.cos(input["sacilmaAcisi"] * Math.PI / 180)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCompton_shift_calculator(input: Compton_shift_calculatorInput): Compton_shift_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Quantum effects are only observable at microscopic scales.","These are idealized models."];
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Compton_shift_calculatorOutput {
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

export const Compton_shift_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: [],
} as const;
