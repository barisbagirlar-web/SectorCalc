// Auto-generated from consulting-hourly-rate-calculator-schema.json
import * as z from 'zod';

export interface Consulting_hourly_rate_calculatorInput {
  dataConfidence?: number;
  hedefGelir: number;
  yillikGider: number;
  faturaliSaat: number;
}

export const Consulting_hourly_rate_calculatorInputSchema = z.object({
  dataConfidence: z.number().optional(),
  hedefGelir: z.number().min(0).default(500000),
  yillikGider: z.number().min(0).default(100000),
  faturaliSaat: z.number().min(1).default(1500),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Consulting_hourly_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input["hedefGelir"] + input["yillikGider"]) / Math.max(1, input["faturaliSaat"]); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}

export function calculateConsulting_hourly_rate_calculator(input: Consulting_hourly_rate_calculatorInput): Consulting_hourly_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown: Record<string, number> = {};
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify financial projections with actual data.","Review assumptions quarterly."];
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
    unit: "TRY/hour",
    premiumRequired: false,
    premiumFeatures: [],
  };
}

export interface Consulting_hourly_rate_calculatorOutput {
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

export const Consulting_hourly_rate_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "TRY/hour",
  breakdownKeys: [],
} as const;
