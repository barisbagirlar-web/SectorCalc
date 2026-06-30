// Auto-generated from linoleum-length-calculator-schema.json
import * as z from 'zod';

export interface Linoleum_length_calculatorInput {
  dataConfidence?: number;
  alan: number;
  ruloEn: number;
  fire: number;
}

export const Linoleum_length_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alan: z.number().min(0).default(30),
  ruloEn: z.number().min(0).default(2),
  fire: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Linoleum_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["alan"] / Math.max(0.0001, input["ruloEn"])) * (1 + input["fire"] / 100); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateLinoleum_length_calculator(input: Linoleum_length_calculatorInput): Linoleum_length_calculatorOutput {
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
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Linoleum_length_calculatorOutput {
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

export const Linoleum_length_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: [],
} as const;
