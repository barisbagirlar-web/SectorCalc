// Auto-generated from net-positive-suction-head-available-calculator-schema.json
import * as z from 'zod';

export interface Net_positive_suction_head_available_calculatorInput {
  basinc: number;
  buharBasinci: number;
  yogunluk: number;
  yukseklik: number;
  kayip: number;
  dataConfidence?: number;
}

export const Net_positive_suction_head_available_calculatorInputSchema = z.object({
  basinc: z.number().min(0).default(101325),
  buharBasinci: z.number().min(0).default(5000),
  yogunluk: z.number().min(0).default(1000),
  yukseklik: z.number().min(0).default(3),
  kayip: z.number().min(0).default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Net_positive_suction_head_available_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.basinc - input.buharBasinci) / Math.max(0.0001, (input.yogunluk * 9.81)) + input.yukseklik - input.kayip; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateNet_positive_suction_head_available_calculator(input: Net_positive_suction_head_available_calculatorInput): Net_positive_suction_head_available_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Verify calculations with FEA or physical testing.","Use appropriate safety factors for design."];
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


export interface Net_positive_suction_head_available_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Net_positive_suction_head_available_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m",
  breakdownKeys: ["sonuc"],
} as const;

