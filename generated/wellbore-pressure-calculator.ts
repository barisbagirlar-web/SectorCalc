// Auto-generated from wellbore-pressure-calculator-schema.json
import * as z from 'zod';

export interface Wellbore_pressure_calculatorInput {
  dataConfidence?: number;
  dikeyDerinlik: number;
  camurYogunlugu: number;
}

export const Wellbore_pressure_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  dikeyDerinlik: z.number().min(0).default(3000),
  camurYogunlugu: z.number().min(0).default(1500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wellbore_pressure_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["camurYogunlugu"] * 9.81 * input["dikeyDerinlik"]) / 1000000; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateWellbore_pressure_calculator(input: Wellbore_pressure_calculatorInput): Wellbore_pressure_calculatorOutput {
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
    unit: "MPa",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Wellbore_pressure_calculatorOutput {
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

export const Wellbore_pressure_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "MPa",
  breakdownKeys: [],
} as const;
