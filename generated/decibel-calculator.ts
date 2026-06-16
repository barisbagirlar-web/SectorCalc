// Auto-generated from decibel-calculator-schema.json
import * as z from 'zod';

export interface Decibel_calculatorInput {
  powerRef: number;
  powerMeas: number;
  ampRef: number;
  ampMeas: number;
}

export const Decibel_calculatorInputSchema = z.object({
  powerRef: z.number().default(1),
  powerMeas: z.number().default(2),
  ampRef: z.number().default(1),
  ampMeas: z.number().default(2),
});

function evaluateAllFormulas(input: Decibel_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 * Math.log10(input.powerMeas / input.powerRef); results["powerDecibel"] = Number.isFinite(v) ? v : 0; } catch { results["powerDecibel"] = 0; }
  try { const v = 20 * Math.log10(input.ampMeas / input.ampRef); results["amplitudeDecibel"] = Number.isFinite(v) ? v : 0; } catch { results["amplitudeDecibel"] = 0; }
  try { const v = input.powerMeas / input.powerRef; results["powerRatio"] = Number.isFinite(v) ? v : 0; } catch { results["powerRatio"] = 0; }
  return results;
}


export function calculateDecibel_calculator(input: Decibel_calculatorInput): Decibel_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["powerDecibel"] ?? 0;
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


export interface Decibel_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
