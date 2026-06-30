// Auto-generated from bilge-discharge-time-calculator-schema.json
import * as z from 'zod';

export interface Bilge_discharge_time_calculatorInput {
  dataConfidence?: number;
  tankHacim: number;
  pompaDebi: number;
}

export const Bilge_discharge_time_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  tankHacim: z.number().min(0).default(50),
  pompaDebi: z.number().min(0).default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bilge_discharge_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input["tankHacim"] / Math.max(0.0001, input["pompaDebi"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateBilge_discharge_time_calculator(input: Bilge_discharge_time_calculatorInput): Bilge_discharge_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "hours",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Bilge_discharge_time_calculatorOutput {
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

export const Bilge_discharge_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "hours",
  breakdownKeys: [],
} as const;
