// Auto-generated from baseboard-length-calculator-schema.json
import * as z from 'zod';

export interface Baseboard_length_calculatorInput {
  odaCevresi: number;
  kapiGenisligi: number;
  kapiSayisi: number;
  dataConfidence?: number;
}

export const Baseboard_length_calculatorInputSchema = z.object({
  odaCevresi: z.number().min(0).default(40),
  kapiGenisligi: z.number().min(0).default(0.9),
  kapiSayisi: z.number().min(0).default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Baseboard_length_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.odaCevresi - (input.kapiGenisligi * input.kapiSayisi); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBaseboard_length_calculator(input: Baseboard_length_calculatorInput): Baseboard_length_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Order 5-10% extra material for waste.","Verify local building codes before purchasing."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    unit: "m",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Baseboard_length_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Baseboard_length_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

