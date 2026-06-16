// Auto-generated from life-expectancy-calculator-schema.json
import * as z from 'zod';

export interface Life_expectancy_calculatorInput {
  currentAge: number;
  gender: number;
  smokingStatus: number;
  alcoholConsumption: number;
  bmi: number;
  exerciseHours: number;
}

export const Life_expectancy_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  gender: z.number().default(0),
  smokingStatus: z.number().default(0),
  alcoholConsumption: z.number().default(3),
  bmi: z.number().default(25),
  exerciseHours: z.number().default(2),
});

function evaluateAllFormulas(input: Life_expectancy_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 75; results["baseExpectancy"] = Number.isFinite(v) ? v : 0; } catch { results["baseExpectancy"] = 0; }
  try { const v = input.gender * 5; results["genderBonus"] = Number.isFinite(v) ? v : 0; } catch { results["genderBonus"] = 0; }
  try { const v = - input.smokingStatus * 0.5; results["smokingEffect"] = Number.isFinite(v) ? v : 0; } catch { results["smokingEffect"] = 0; }
  try { const v = (input.alcoholConsumption - 7) * 0.2; results["alcoholEffect"] = Number.isFinite(v) ? v : 0; } catch { results["alcoholEffect"] = 0; }
  try { const v = input.exerciseHours * 0.5; results["exerciseBonus"] = Number.isFinite(v) ? v : 0; } catch { results["exerciseBonus"] = 0; }
  results["bmiPenalty"] = 0;
  try { const v = 75 + input.gender * 5 - input.smokingStatus * 0.5 + (input.alcoholConsumption - 7) * 0.2 + input.exerciseHours * 0.5 - (input.bmi - 23) ** 2 * 0.02; results["lifeExpectancy"] = Number.isFinite(v) ? v : 0; } catch { results["lifeExpectancy"] = 0; }
  return results;
}


export function calculateLife_expectancy_calculator(input: Life_expectancy_calculatorInput): Life_expectancy_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["lifeExpectancy"] ?? 0;
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


export interface Life_expectancy_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
