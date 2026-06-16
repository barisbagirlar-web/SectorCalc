// Auto-generated from km-to-m-calculator-schema.json
import * as z from 'zod';

export interface Km_to_m_calculatorInput {
  inputKm: number;
  conversionFactor: number;
  decimalPrecision: number;
  roundingMethod: number;
  minimumValue: number;
  maximumValue: number;
  scaleFactor: number;
}

export const Km_to_m_calculatorInputSchema = z.object({
  inputKm: z.number().default(1),
  conversionFactor: z.number().default(1000),
  decimalPrecision: z.number().default(2),
  roundingMethod: z.number().default(0),
  minimumValue: z.number().default(0),
  maximumValue: z.number().default(999999),
  scaleFactor: z.number().default(1),
});

function evaluateAllFormulas(input: Km_to_m_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.inputKm * input.conversionFactor * input.scaleFactor; results["rawMeters"] = Number.isFinite(v) ? v : 0; } catch { results["rawMeters"] = 0; }
  try { const v = input.roundingMethod === 0 ? Math.round((results["rawMeters"] ?? 0) * Math.pow(10, input.decimalPrecision)) / Math.pow(10, input.decimalPrecision) : input.roundingMethod === 1 ? Math.floor((results["rawMeters"] ?? 0) * Math.pow(10, input.decimalPrecision)) / Math.pow(10, input.decimalPrecision) : Math.ceil((results["rawMeters"] ?? 0) * Math.pow(10, input.decimalPrecision)) / Math.pow(10, input.decimalPrecision); results["rounded"] = Number.isFinite(v) ? v : 0; } catch { results["rounded"] = 0; }
  try { const v = Math.max(input.minimumValue, Math.min(input.maximumValue, (results["rounded"] ?? 0))); results["clamped"] = Number.isFinite(v) ? v : 0; } catch { results["clamped"] = 0; }
  return results;
}


export function calculateKm_to_m_calculator(input: Km_to_m_calculatorInput): Km_to_m_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["clamped"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Km_to_m_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
