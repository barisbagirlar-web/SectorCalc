// Auto-generated from speaking-time-calculator-schema.json
import * as z from 'zod';

export interface Speaking_time_calculatorInput {
  totalWords: number;
  slowWPM: number;
  normalWPM: number;
  fastWPM: number;
}

export const Speaking_time_calculatorInputSchema = z.object({
  totalWords: z.number().default(1000),
  slowWPM: z.number().default(120),
  normalWPM: z.number().default(150),
  fastWPM: z.number().default(180),
});

function evaluateAllFormulas(input: Speaking_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWords / input.slowWPM; results["slowTime"] = Number.isFinite(v) ? v : 0; } catch { results["slowTime"] = 0; }
  try { const v = input.totalWords / input.normalWPM; results["normalTime"] = Number.isFinite(v) ? v : 0; } catch { results["normalTime"] = 0; }
  try { const v = input.totalWords / input.fastWPM; results["fastTime"] = Number.isFinite(v) ? v : 0; } catch { results["fastTime"] = 0; }
  return results;
}


export function calculateSpeaking_time_calculator(input: Speaking_time_calculatorInput): Speaking_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["normalTime"] ?? 0;
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


export interface Speaking_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
