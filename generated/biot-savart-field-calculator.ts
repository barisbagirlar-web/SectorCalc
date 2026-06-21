// Auto-generated from biot-savart-field-calculator-schema.json
import * as z from 'zod';

export interface Biot_savart_field_calculatorInput {
  akim: number;
  uzunluk: number;
  mesafe: number;
  aci: number;
  dataConfidence?: number;
}

export const Biot_savart_field_calculatorInputSchema = z.object({
  akim: z.number().min(0).default(10),
  uzunluk: z.number().min(0).default(0.01),
  mesafe: z.number().min(0).default(0.05),
  aci: z.number().min(0).default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Biot_savart_field_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (4 * Math.PI * 1e-7 * input.akim * input.uzunluk * Math.sin(input.aci * Math.PI / 180)) / Math.max(0.0001, (4 * Math.PI * Math.pow(input.mesafe, 2))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateBiot_savart_field_calculator(input: Biot_savart_field_calculatorInput): Biot_savart_field_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    sonuc: toNumericFormulaValue(values["sonuc"])
  };
  const hiddenLossDrivers: string[] = ["Low Q factor indicates broader frequency response."];
  const suggestedActions: string[] = ["Verify component tolerances affect circuit performance.","Use proper safety equipment for high voltage/current work."];
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
    unit: "T",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Biot_savart_field_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Biot_savart_field_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "T",
  breakdownKeys: ["sonuc"],
} as const;

