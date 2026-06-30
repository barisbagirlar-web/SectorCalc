// Auto-generated from vehicle-top-speed-calculator-schema.json
import * as z from 'zod';

export interface Vehicle_top_speed_calculatorInput {
  dataConfidence?: number;
  guc: number;
  kutle: number;
  suratmeKatsayi: number;
}

export const Vehicle_top_speed_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  guc: z.number().min(0).default(100000),
  kutle: z.number().min(0).default(1500),
  suratmeKatsayi: z.number().min(0).default(0.015),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vehicle_top_speed_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow((input["guc"] / input["suratmeKatsayi"]), 1/3); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateVehicle_top_speed_calculator(input: Vehicle_top_speed_calculatorInput): Vehicle_top_speed_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = ["High fuel/energy consumption indicates efficiency losses."];
  const suggestedActions: string[] = ["Regular maintenance improves overall equipment efficiency.","Simulate real-world driving conditions for accurate range estimates."];
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
    unit: "m/s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Vehicle_top_speed_calculatorOutput {
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

export const Vehicle_top_speed_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m/s",
  breakdownKeys: [],
} as const;
