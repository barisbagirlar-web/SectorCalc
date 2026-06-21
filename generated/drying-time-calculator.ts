// Auto-generated from drying-time-calculator-schema.json
import * as z from 'zod';

export interface Drying_time_calculatorInput {
  urunKutlesi: number;
  baslangicNem: number;
  hedefNem: number;
  havaDebi: number;
  nemFarki: number;
  dataConfidence?: number;
}

export const Drying_time_calculatorInputSchema = z.object({
  urunKutlesi: z.number().min(0).default(1000),
  baslangicNem: z.number().min(0).default(25),
  hedefNem: z.number().min(0).default(14),
  havaDebi: z.number().min(0).default(5),
  nemFarki: z.number().min(0).default(0.01),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Drying_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.urunKutlesi * ((input.baslangicNem - input.hedefNem) / 100); results["buharlasanSu"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["buharlasanSu"] = Number.NaN; }
  try { const v = (input.urunKutlesi * ((input.baslangicNem - input.hedefNem) / 100)) / Math.max(0.0001, (input.havaDebi * input.nemFarki)); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateDrying_time_calculator(input: Drying_time_calculatorInput): Drying_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low efficiency may indicate equipment or process issues."];
  const suggestedActions: string[] = ["Calibrate all measuring equipment regularly.","Use site-specific data when available."];
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
    unit: "s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Drying_time_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Drying_time_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "s",
  breakdownKeys: ["sonuc"],
} as const;

