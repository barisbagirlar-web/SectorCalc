// Auto-generated from 16-8-fasting-calculator-schema.json
import * as z from 'zod';

export interface _16_8_fasting_calculatorInput {
  currentHour: number;
  fastingStartHour: number;
  fastingDuration: number;
  eatingDuration: number;
}

export const _16_8_fasting_calculatorInputSchema = z.object({
  currentHour: z.number().default(12),
  fastingStartHour: z.number().default(20),
  fastingDuration: z.number().default(16),
  eatingDuration: z.number().default(8),
});

function evaluateAllFormulas(input: _16_8_fasting_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.fastingStartHour + input.fastingDuration) % 24; results["fastingEndHour"] = Number.isFinite(v) ? v : 0; } catch { results["fastingEndHour"] = 0; }
  try { const v = ((input.fastingStartHour + input.fastingDuration) % 24 + input.eatingDuration) % 24; results["eatingWindowEndHour"] = Number.isFinite(v) ? v : 0; } catch { results["eatingWindowEndHour"] = 0; }
  try { const v = Math.max(0, input.fastingDuration - (input.currentHour >= input.fastingStartHour ? input.currentHour - input.fastingStartHour : input.currentHour + 24 - input.fastingStartHour)); results["remainingFastingTime"] = Number.isFinite(v) ? v : 0; } catch { results["remainingFastingTime"] = 0; }
  try { const v = Math.min(100, ((input.currentHour >= input.fastingStartHour ? input.currentHour - input.fastingStartHour : input.currentHour + 24 - input.fastingStartHour) / input.fastingDuration) * 100); results["progressPercent"] = Number.isFinite(v) ? v : 0; } catch { results["progressPercent"] = 0; }
  return results;
}


export function calculate_16_8_fasting_calculator(input: _16_8_fasting_calculatorInput): _16_8_fasting_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["remainingFastingTime"] ?? 0;
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


export interface _16_8_fasting_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
