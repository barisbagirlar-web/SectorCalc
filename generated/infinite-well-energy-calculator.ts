// Auto-generated from infinite-well-energy-calculator-schema.json
import * as z from 'zod';

export interface Infinite_well_energy_calculatorInput {
  dataConfidence?: number;
  kuyuGenisligi: number;
  kutle: number;
  kuantumSayisi: number;
}

export const Infinite_well_energy_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  kuyuGenisligi: z.number().min(0).default(1e-10),
  kutle: z.number().min(0).default(9.11e-31),
  kuantumSayisi: z.number().min(1).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Infinite_well_energy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.pow(input["kuantumSayisi"], 2) * Math.pow(Math.PI, 2) * Math.pow(1.054e-34, 2)) / Math.max(0.0001, (2 * input["kutle"] * Math.pow(input["kuyuGenisligi"], 2))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateInfinite_well_energy_calculator(input: Infinite_well_energy_calculatorInput): Infinite_well_energy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Quantum effects are only observable at microscopic scales.","These are idealized models."];
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
    unit: "J",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Infinite_well_energy_calculatorOutput {
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

export const Infinite_well_energy_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "J",
  breakdownKeys: [],
} as const;
