// Auto-generated from barn-ventilation-calculator-schema.json
import * as z from 'zod';

export interface Barn_ventilation_calculatorInput {
  alan: number;
  yukseklik: number;
  havaDegisimSayisi: number;
  dataConfidence?: number;
}

export const Barn_ventilation_calculatorInputSchema = z.object({
  alan: z.number().min(0).default(200),
  yukseklik: z.number().min(0).default(4),
  havaDegisimSayisi: z.number().min(0).default(6),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Barn_ventilation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.alan * input.yukseklik * input.havaDegisimSayisi) / 3600; results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBarn_ventilation_calculator(input: Barn_ventilation_calculatorInput): Barn_ventilation_calculatorOutput {
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
    unit: "m3/s",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Barn_ventilation_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Barn_ventilation_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "m3/s",
  breakdownKeys: ["sonuc"],
} as const;

