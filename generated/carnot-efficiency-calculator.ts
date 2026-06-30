// Auto-generated from carnot-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Carnot_efficiency_calculatorInput {
  dataConfidence?: number;
  sicakKaynak: number;
  sogukKaynak: number;
}

export const Carnot_efficiency_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  sicakKaynak: z.number().min(0).default(500),
  sogukKaynak: z.number().min(0).default(300),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Carnot_efficiency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 - (input["sogukKaynak"] / Math.max(0.0001, input["sicakKaynak"])); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateCarnot_efficiency_calculator(input: Carnot_efficiency_calculatorInput): Carnot_efficiency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Low SNR indicates poor signal quality.","High Q indicates narrow bandwidth."];
  const suggestedActions: string[] = ["Use proper shielding for sensitive measurements.","Consider efficiency losses in energy calculations."];
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

export interface Carnot_efficiency_calculatorOutput {
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

export const Carnot_efficiency_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "%",
  breakdownKeys: [],
} as const;
