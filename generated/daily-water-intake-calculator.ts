// Auto-generated from daily-water-intake-calculator-schema.json
import * as z from 'zod';

export interface Daily_water_intake_calculatorInput {
  agirlik: number;
  aktiviteSure: number;
  dataConfidence?: number;
}

export const Daily_water_intake_calculatorInputSchema = z.object({
  agirlik: z.number().min(0).default(75),
  aktiviteSure: z.number().min(0).default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Daily_water_intake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.agirlik * 0.033) + (input.aktiviteSure / 30 * 0.35); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDaily_water_intake_calculator(input: Daily_water_intake_calculatorInput): Daily_water_intake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Consult a healthcare professional before starting any diet or exercise program.","Individual results may vary."];
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
    unit: "liters",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Daily_water_intake_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Daily_water_intake_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "liters",
  breakdownKeys: ["sonuc"],
} as const;

