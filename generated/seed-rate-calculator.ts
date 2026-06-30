// Auto-generated from seed-rate-calculator-schema.json
import * as z from 'zod';

export interface Seed_rate_calculatorInput {
  dataConfidence?: number;
  siraAraligi: number;
  uzeriMesafe: number;
  binTaneAgirlik: number;
  cimlenme: number;
}

export const Seed_rate_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  siraAraligi: z.number().min(0).default(0.7),
  uzeriMesafe: z.number().min(0).default(0.2),
  binTaneAgirlik: z.number().min(0).default(350),
  cimlenme: z.number().min(0).default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Seed_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (10000 / Math.max(0.0001, (input["siraAraligi"] * input["uzeriMesafe"]))) * (input["binTaneAgirlik"] / 1000) / Math.max(0.0001, (input["cimlenme"] / 100)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateSeed_rate_calculator(input: Seed_rate_calculatorInput): Seed_rate_calculatorOutput {
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
    unit: "kg/da",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Seed_rate_calculatorOutput {
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

export const Seed_rate_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "kg/da",
  breakdownKeys: [],
} as const;
