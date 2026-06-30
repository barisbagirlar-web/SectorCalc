// Auto-generated from antenna-length-calculator-schema.json
import * as z from 'zod';

export interface Antenna_length_calculatorInput {
  dataConfidence?: number;
  frekans: number;
  tip: number;
}

export const Antenna_length_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  frekans: z.number().min(0).default(100),
  tip: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Antenna_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 300 / Math.max(0.0001, input["frekans"]); results["dalgaBoyu"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dalgaBoyu"] = Number.NaN; }
  try { const v = input["tip"] === 1 ? 300 / Math.max(0.0001, input["frekans"]) / 2 : 300 / Math.max(0.0001, input["frekans"]) * 0.45; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateAntenna_length_calculator(input: Antenna_length_calculatorInput): Antenna_length_calculatorOutput {
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

export interface Antenna_length_calculatorOutput {
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

export const Antenna_length_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["dalgaBoyu"],
} as const;
