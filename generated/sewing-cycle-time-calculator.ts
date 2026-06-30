// Auto-generated from sewing-cycle-time-calculator-schema.json
import * as z from 'zod';

export interface Sewing_cycle_time_calculatorInput {
  dataConfidence?: number;
  dikisUzunluk: number;
  devirSayisi: number;
  dikisSikligi: number;
}

export const Sewing_cycle_time_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  dikisUzunluk: z.number().min(0).default(500),
  devirSayisi: z.number().min(0).default(4000),
  dikisSikligi: z.number().min(0).default(3),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sewing_cycle_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["dikisUzunluk"] * input["dikisSikligi"]) / Math.max(0.0001, (input["devirSayisi"] / 60)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSewing_cycle_time_calculator(input: Sewing_cycle_time_calculatorInput): Sewing_cycle_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["Waste in material or time indicates process improvement opportunity."];
  const suggestedActions: string[] = ["Optimize drying/cooling parameters for cycle time reduction.","Monitor defects and adjust process conditions accordingly."];
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Sewing_cycle_time_calculatorOutput {
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

export const Sewing_cycle_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: [],
} as const;
