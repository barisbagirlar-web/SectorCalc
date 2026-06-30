// Auto-generated from rainwater-harvest-calculator-schema.json
import * as z from 'zod';

export interface Rainwater_harvest_calculatorInput {
  dataConfidence?: number;
  catiAlani: number;
  yillikYagis: number;
  verim: number;
}

export const Rainwater_harvest_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  catiAlani: z.number().min(0).default(150),
  yillikYagis: z.number().min(0).default(600),
  verim: z.number().min(0).default(85),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rainwater_harvest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["catiAlani"] * (input["yillikYagis"] / 1000)) * (input["verim"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateRainwater_harvest_calculator(input: Rainwater_harvest_calculatorInput): Rainwater_harvest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
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
    unit: "m3",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Rainwater_harvest_calculatorOutput {
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

export const Rainwater_harvest_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m3",
  breakdownKeys: [],
} as const;
