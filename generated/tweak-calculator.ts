// Auto-generated from tweak-calculator-schema.json
import * as z from 'zod';

export interface Tweak_calculatorInput {
  currentValue: number;
  targetValue: number;
  efficiency: number;
  safetyFactor: number;
  tolerance: number;
  dataConfidence?: number;
}

export const Tweak_calculatorInputSchema = z.object({
  currentValue: z.number().default(100),
  targetValue: z.number().default(120),
  efficiency: z.number().default(85),
  safetyFactor: z.number().default(110),
  tolerance: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tweak_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.targetValue - input.currentValue) / input.currentValue) * 100; results["rawTweakPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawTweakPercent"] = Number.NaN; }
  try { const v = ((input.targetValue - input.currentValue) / input.currentValue) * 100 / (input.efficiency / 100); results["efficiencyAdjustedTweakPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["efficiencyAdjustedTweakPercent"] = Number.NaN; }
  try { const v = ((input.targetValue - input.currentValue) / input.currentValue) * 100 * input.safetyFactor / input.efficiency; results["recommendedTweakPercent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recommendedTweakPercent"] = Number.NaN; }
  try { const v = input.currentValue * (1 + ((input.targetValue - input.currentValue) / input.currentValue) * input.safetyFactor / input.efficiency); results["finalParameterValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalParameterValue"] = Number.NaN; }
  return results;
}


export function calculateTweak_calculator(input: Tweak_calculatorInput): Tweak_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recommendedTweakPercent"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
