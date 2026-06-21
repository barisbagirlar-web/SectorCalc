// Auto-generated from adc-resolution-calculator-schema.json
import * as z from 'zod';

export interface Adc_resolution_calculatorInput {
  bitSayisi: number;
  refVoltaj: number;
  dataConfidence?: number;
}

export const Adc_resolution_calculatorInputSchema = z.object({
  bitSayisi: z.number().min(1).max(32).default(12),
  refVoltaj: z.number().min(0).default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Adc_resolution_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.refVoltaj / Math.max(0.0001, Math.pow(2, input.bitSayisi)); results["LSB"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["LSB"] = Number.NaN; }
  try { const v = 20 * Math.log10(Math.max(1, Math.pow(2, input.bitSayisi))); results["sonuc"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sonuc"] = Number.NaN; }
  return results;
}


export function calculateAdc_resolution_calculator(input: Adc_resolution_calculatorInput): Adc_resolution_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sonuc"]);
  const breakdown = {
    LSB: toNumericFormulaValue(values["LSB"]),
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
    unit: "dB",
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Adc_resolution_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { LSB: number; sonuc: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Adc_resolution_calculatorOutputMeta = {
  primaryKey: "sonuc",
  unit: "dB",
  breakdownKeys: ["LSB","sonuc"],
} as const;

