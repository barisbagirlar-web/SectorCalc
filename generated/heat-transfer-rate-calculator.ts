// Auto-generated from heat-transfer-rate-calculator-schema.json
import * as z from 'zod';

export interface Heat_transfer_rate_calculatorInput {
  dataConfidence?: number;
  alan: number;
  K: number;
  kalinlik: number;
  sicaklikFarki: number;
}

export const Heat_transfer_rate_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  alan: z.number().min(0).default(10),
  K: z.number().min(0).default(0.5),
  kalinlik: z.number().min(0).default(0.2),
  sicaklikFarki: z.number().min(0).default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Heat_transfer_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["K"] * input["alan"] * input["sicaklikFarki"]) / Math.max(0.0001, input["kalinlik"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateHeat_transfer_rate_calculator(input: Heat_transfer_rate_calculatorInput): Heat_transfer_rate_calculatorOutput {
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
    unit: "W",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Heat_transfer_rate_calculatorOutput {
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

export const Heat_transfer_rate_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "W",
  breakdownKeys: [],
} as const;
