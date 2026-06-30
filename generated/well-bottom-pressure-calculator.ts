// Auto-generated from well-bottom-pressure-calculator-schema.json
import * as z from 'zod';

export interface Well_bottom_pressure_calculatorInput {
  dataConfidence?: number;
  camurYogunlugu: number;
  derinlik: number;
}

export const Well_bottom_pressure_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  camurYogunlugu: z.number().min(0).default(1500),
  derinlik: z.number().min(0).default(2000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Well_bottom_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["camurYogunlugu"] * 9.81 * input["derinlik"]) / 1000000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateWell_bottom_pressure_calculator(input: Well_bottom_pressure_calculatorInput): Well_bottom_pressure_calculatorOutput {
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
    unit: "MPa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Well_bottom_pressure_calculatorOutput {
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

export const Well_bottom_pressure_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "MPa",
  breakdownKeys: [],
} as const;
