// Auto-generated from gage-r-and-r-calculator-schema.json
import * as z from 'zod';

export interface Gage_r_and_r_calculatorInput {
  dataConfidence?: number;
  parcaVaryans: number;
  olcumVaryans: number;
}

export const Gage_r_and_r_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  parcaVaryans: z.number().min(0).default(100),
  olcumVaryans: z.number().min(0).default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gage_r_and_r_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["parcaVaryans"] + input["olcumVaryans"]; results["toplamVaryans"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["toplamVaryans"] = Number.NaN; }
  try { const v = (input["olcumVaryans"] / Math.max(0.0001, (input["parcaVaryans"] + input["olcumVaryans"]))) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateGage_r_and_r_calculator(input: Gage_r_and_r_calculatorInput): Gage_r_and_r_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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

export interface Gage_r_and_r_calculatorOutput {
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

export const Gage_r_and_r_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: ["toplamVaryans"],
} as const;
