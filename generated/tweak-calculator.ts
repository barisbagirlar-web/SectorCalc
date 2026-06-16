// Auto-generated from tweak-calculator-schema.json
import * as z from 'zod';

export interface Tweak_calculatorInput {
  currentValue: number;
  targetValue: number;
  efficiency: number;
  safetyFactor: number;
  tolerance: number;
}

export const Tweak_calculatorInputSchema = z.object({
  currentValue: z.number().default(100),
  targetValue: z.number().default(120),
  efficiency: z.number().default(85),
  safetyFactor: z.number().default(110),
  tolerance: z.number().default(5),
});

function evaluateAllFormulas(input: Tweak_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.targetValue - input.currentValue) / input.currentValue) * 100; results["rawTweakPercent"] = Number.isFinite(v) ? v : 0; } catch { results["rawTweakPercent"] = 0; }
  try { const v = ((input.targetValue - input.currentValue) / input.currentValue) * 100 / (input.efficiency / 100); results["efficiencyAdjustedTweakPercent"] = Number.isFinite(v) ? v : 0; } catch { results["efficiencyAdjustedTweakPercent"] = 0; }
  try { const v = ((input.targetValue - input.currentValue) / input.currentValue) * 100 * input.safetyFactor / input.efficiency; results["recommendedTweakPercent"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedTweakPercent"] = 0; }
  try { const v = input.currentValue * (1 + ((input.targetValue - input.currentValue) / input.currentValue) * input.safetyFactor / input.efficiency); results["finalParameterValue"] = Number.isFinite(v) ? v : 0; } catch { results["finalParameterValue"] = 0; }
  try { const v = Math.abs(((input.targetValue - input.currentValue) / input.currentValue) * 100 * input.safetyFactor / input.efficiency) <= input.tolerance; results["withinTolerance"] = Number.isFinite(v) ? v : 0; } catch { results["withinTolerance"] = 0; }
  return results;
}


export function calculateTweak_calculator(input: Tweak_calculatorInput): Tweak_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recommendedTweakPercent"] ?? 0;
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


export interface Tweak_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
