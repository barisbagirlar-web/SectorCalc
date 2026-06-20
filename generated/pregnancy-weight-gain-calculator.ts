// Auto-generated from pregnancy-weight-gain-calculator-schema.json
import * as z from 'zod';

export interface Pregnancy_weight_gain_calculatorInput {
  prePregnancyWeight: number;
  height: number;
  currentWeight: number;
  currentWeek: number;
  dataConfidence?: number;
}

export const Pregnancy_weight_gain_calculatorInputSchema = z.object({
  prePregnancyWeight: z.number().default(60),
  height: z.number().default(165),
  currentWeight: z.number().default(65),
  currentWeek: z.number().default(20),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pregnancy_weight_gain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.prePregnancyWeight / ((input.height / 100) ** 2); results["bmi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bmi"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmi"])) < 18.5 ? 12.5 : (toNumericFormulaValue(results["bmi"])) < 25 ? 11.5 : (toNumericFormulaValue(results["bmi"])) < 30 ? 7 : 5; results["totalMinGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMinGain"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["bmi"])) < 18.5 ? 18 : (toNumericFormulaValue(results["bmi"])) < 25 ? 16 : (toNumericFormulaValue(results["bmi"])) < 30 ? 11.5 : 9; results["totalMaxGain"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMaxGain"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMinGain"])) * (input.currentWeek / 40); results["minGainCurrent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["minGainCurrent"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalMaxGain"])) * (input.currentWeek / 40); results["maxGainCurrent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxGainCurrent"] = Number.NaN; }
  try { const v = input.prePregnancyWeight + (toNumericFormulaValue(results["minGainCurrent"])); results["recommendedMinWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recommendedMinWeight"] = Number.NaN; }
  try { const v = input.prePregnancyWeight + (toNumericFormulaValue(results["maxGainCurrent"])); results["recommendedMaxWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recommendedMaxWeight"] = Number.NaN; }
  try { const v = input.currentWeight - input.prePregnancyWeight; results["weightGained"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightGained"] = Number.NaN; }
  return results;
}


export function calculatePregnancy_weight_gain_calculator(input: Pregnancy_weight_gain_calculatorInput): Pregnancy_weight_gain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["weightGained"]);
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


export interface Pregnancy_weight_gain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
