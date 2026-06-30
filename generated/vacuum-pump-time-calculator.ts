// Auto-generated from vacuum-pump-time-calculator-schema.json
import * as z from 'zod';

export interface Vacuum_pump_time_calculatorInput {
  dataConfidence?: number;
  posetHacim: number;
  pompaDebi: number;
  baslangicBasinc: number;
  hedefBasinc: number;
}

export const Vacuum_pump_time_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  posetHacim: z.number().min(0).default(0.01),
  pompaDebi: z.number().min(0).default(0.0005),
  baslangicBasinc: z.number().min(0).default(101325),
  hedefBasinc: z.number().min(0).default(5000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vacuum_pump_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["posetHacim"] / Math.max(0.0001, input["pompaDebi"])) * Math.log(Math.max(0.0001, input["baslangicBasinc"] / Math.max(0.0001, input["hedefBasinc"]))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateVacuum_pump_time_calculator(input: Vacuum_pump_time_calculatorInput): Vacuum_pump_time_calculatorOutput {
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

export interface Vacuum_pump_time_calculatorOutput {
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

export const Vacuum_pump_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: [],
} as const;
