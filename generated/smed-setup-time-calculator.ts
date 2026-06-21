// Auto-generated from smed-setup-time-calculator-schema.json
import * as z from 'zod';

export interface Smed_setup_time_calculatorInput {
  icAyar: number;
  disAyar: number;
  donusum: number;
  dataConfidence?: number;
}

export const Smed_setup_time_calculatorInputSchema = z.object({
  icAyar: z.number().min(0).default(60),
  disAyar: z.number().min(0).default(15),
  donusum: z.number().min(0).max(100).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Smed_setup_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.icAyar * (1 - input.donusum / 100); results["hedefIc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hedefIc"] = Number.NaN; }
  try { const v = (input.icAyar * (1 - input.donusum / 100)) + input.disAyar; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateSmed_setup_time_calculator(input: Smed_setup_time_calculatorInput): Smed_setup_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Conduct regular OEE audits for improvement.","Use SMED to reduce setup times."];
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
    unit: "min",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Smed_setup_time_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Smed_setup_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "min",
  breakdownKeys: ["sonuc"],
} as const;

