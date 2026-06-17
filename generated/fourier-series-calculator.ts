// Auto-generated from fourier-series-calculator-schema.json
import * as z from 'zod';

export interface Fourier_series_calculatorInput {
  offset: number;
  amplitude: number;
  period: number;
  time: number;
  numHarmonics: number;
}

export const Fourier_series_calculatorInputSchema = z.object({
  offset: z.number().default(0),
  amplitude: z.number().default(1),
  period: z.number().default(1),
  time: z.number().default(0),
  numHarmonics: z.number().default(3),
});

function evaluateAllFormulas(input: Fourier_series_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.offset + (4*input.amplitude/Math.PI) * ((Math.sin(2*Math.PI*1*input.time/input.period) * (input.numHarmonics >= 1 ? 1 : 0) * (1/1)) + (Math.sin(2*Math.PI*3*input.time/input.period) * (input.numHarmonics >= 2 ? 1 : 0) * (1/3)) + (Math.sin(2*Math.PI*5*input.time/input.period) * (input.numHarmonics >= 3 ? 1 : 0) * (1/5))); results["primary"] = Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.offset; results["breakdown"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  results["DC_Offset_Katk_s___mm_s_"] = 0;
  results["1__Harmonik__f___Katk_s___mm_s_"] = 0;
  results["3__Harmonik__f___Katk_s___mm_s_"] = 0;
  results["5__Harmonik__f___Katk_s___mm_s_"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateFourier_series_calculator(input: Fourier_series_calculatorInput): Fourier_series_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Fourier_series_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
