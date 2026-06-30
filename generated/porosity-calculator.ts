// Auto-generated from porosity-calculator-schema.json
import * as z from 'zod';

export interface Porosity_calculatorInput {
  dataConfidence?: number;
  boslukHacim: number;
  toplamHacim: number;
}

export const Porosity_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  boslukHacim: z.number().min(0).default(0.2),
  toplamHacim: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Porosity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["boslukHacim"] / Math.max(0.0001, input["toplamHacim"])) * 100; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculatePorosity_calculator(input: Porosity_calculatorInput): Porosity_calculatorOutput {
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
    unit: "%",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Porosity_calculatorOutput {
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

export const Porosity_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
