// Auto-generated from overtraining-calculator-schema.json
import * as z from 'zod';

export interface Overtraining_calculatorInput {
  dailyHours: number;
  trainingDays: number;
  recoveryFactor: number;
  experience: number;
  taskComplexity: number;
}

export const Overtraining_calculatorInputSchema = z.object({
  dailyHours: z.number().default(2),
  trainingDays: z.number().default(5),
  recoveryFactor: z.number().default(7),
  experience: z.number().default(2),
  taskComplexity: z.number().default(3),
});

function evaluateAllFormulas(input: Overtraining_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyHours * input.trainingDays; results["weeklyTrainingLoad"] = Number.isFinite(v) ? v : 0; } catch { results["weeklyTrainingLoad"] = 0; }
  try { const v = input.recoveryFactor * 0.1; results["recoveryIndex"] = Number.isFinite(v) ? v : 0; } catch { results["recoveryIndex"] = 0; }
  try { const v = ((results["weeklyTrainingLoad"] ?? 0) / (input.experience + input.taskComplexity)) / (results["recoveryIndex"] ?? 0); results["overtrainingScore"] = Number.isFinite(v) ? v : 0; } catch { results["overtrainingScore"] = 0; }
  try { const v = (results["overtrainingScore"] ?? 0) <= 1 ? 'Düşük Risk' : (results["overtrainingScore"] ?? 0) <= 2 ? 'Orta Risk' : 'Yüksek Risk'; results["scoreInterpretation"] = Number.isFinite(v) ? v : 0; } catch { results["scoreInterpretation"] = 0; }
  return results;
}


export function calculateOvertraining_calculator(input: Overtraining_calculatorInput): Overtraining_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overtrainingScore"] ?? 0;
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


export interface Overtraining_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
