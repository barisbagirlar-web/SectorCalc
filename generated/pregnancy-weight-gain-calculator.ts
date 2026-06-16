// Auto-generated from pregnancy-weight-gain-calculator-schema.json
import * as z from 'zod';

export interface Pregnancy_weight_gain_calculatorInput {
  prePregnancyWeight: number;
  height: number;
  currentWeight: number;
  currentWeek: number;
}

export const Pregnancy_weight_gain_calculatorInputSchema = z.object({
  prePregnancyWeight: z.number().default(60),
  height: z.number().default(165),
  currentWeight: z.number().default(65),
  currentWeek: z.number().default(20),
});

function evaluateAllFormulas(input: Pregnancy_weight_gain_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.prePregnancyWeight / ((input.height / 100) ** 2); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = (results["bmi"] ?? 0) < 18.5 ? 'Underweight' : (results["bmi"] ?? 0) < 25 ? 'Normal weight' : (results["bmi"] ?? 0) < 30 ? 'Overweight' : 'Obese'; results["bmiCategory"] = Number.isFinite(v) ? v : 0; } catch { results["bmiCategory"] = 0; }
  try { const v = (results["bmi"] ?? 0) < 18.5 ? 12.5 : (results["bmi"] ?? 0) < 25 ? 11.5 : (results["bmi"] ?? 0) < 30 ? 7 : 5; results["totalMinGain"] = Number.isFinite(v) ? v : 0; } catch { results["totalMinGain"] = 0; }
  try { const v = (results["bmi"] ?? 0) < 18.5 ? 18 : (results["bmi"] ?? 0) < 25 ? 16 : (results["bmi"] ?? 0) < 30 ? 11.5 : 9; results["totalMaxGain"] = Number.isFinite(v) ? v : 0; } catch { results["totalMaxGain"] = 0; }
  try { const v = (results["totalMinGain"] ?? 0) * (input.currentWeek / 40); results["minGainCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["minGainCurrent"] = 0; }
  try { const v = (results["totalMaxGain"] ?? 0) * (input.currentWeek / 40); results["maxGainCurrent"] = Number.isFinite(v) ? v : 0; } catch { results["maxGainCurrent"] = 0; }
  try { const v = input.prePregnancyWeight + (results["minGainCurrent"] ?? 0); results["recommendedMinWeight"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedMinWeight"] = 0; }
  try { const v = input.prePregnancyWeight + (results["maxGainCurrent"] ?? 0); results["recommendedMaxWeight"] = Number.isFinite(v) ? v : 0; } catch { results["recommendedMaxWeight"] = 0; }
  try { const v = input.currentWeight - input.prePregnancyWeight; results["weightGained"] = Number.isFinite(v) ? v : 0; } catch { results["weightGained"] = 0; }
  try { const v = input.currentWeight >= (results["recommendedMinWeight"] ?? 0) && input.currentWeight <= (results["recommendedMaxWeight"] ?? 0) ? 'Within recommended range' : (input.currentWeight < (results["recommendedMinWeight"] ?? 0) ? 'Below recommended range' : 'Above recommended range'); results["status"] = Number.isFinite(v) ? v : 0; } catch { results["status"] = 0; }
  return results;
}


export function calculatePregnancy_weight_gain_calculator(input: Pregnancy_weight_gain_calculatorInput): Pregnancy_weight_gain_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["status"] ?? 0;
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


export interface Pregnancy_weight_gain_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
