// Auto-generated from harmonic-series-calculator-schema.json
import * as z from 'zod';

export interface Harmonic_series_calculatorInput {
  startIndex: number;
  endIndex: number;
  exponent: number;
  increment: number;
  shift: number;
  multiplier: number;
}

export const Harmonic_series_calculatorInputSchema = z.object({
  startIndex: z.number().default(1),
  endIndex: z.number().default(10),
  exponent: z.number().default(1),
  increment: z.number().default(1),
  shift: z.number().default(0),
  multiplier: z.number().default(1),
});

function evaluateAllFormulas(input: Harmonic_series_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Array.from({length: Math.max(0, Math.floor((input.endIndex - input.startIndex) / input.increment) + 1)}, (_, i) => input.startIndex + i * input.increment).reduce((acc, k) => acc + input.multiplier / Math.pow(k + input.shift, input.exponent), 0); results["totalSum"] = Number.isFinite(v) ? v : 0; } catch { results["totalSum"] = 0; }
  try { const v = Math.floor((input.endIndex - input.startIndex) / input.increment) + 1; results["termsIncluded"] = Number.isFinite(v) ? v : 0; } catch { results["termsIncluded"] = 0; }
  try { const v = input.exponent === 1 ? (input.multiplier / input.increment) * Math.log((input.endIndex + input.shift) / (input.startIndex + input.shift)) : (input.multiplier / input.increment) * (Math.pow(input.endIndex + input.shift, 1 - input.exponent) - Math.pow(input.startIndex + input.shift, 1 - input.exponent)) / (1 - input.exponent); results["approximateIntegral"] = Number.isFinite(v) ? v : 0; } catch { results["approximateIntegral"] = 0; }
  return results;
}


export function calculateHarmonic_series_calculator(input: Harmonic_series_calculatorInput): Harmonic_series_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSum"] ?? 0;
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


export interface Harmonic_series_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
