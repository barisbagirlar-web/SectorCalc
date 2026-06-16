// Auto-generated from healthspan-calculator-schema.json
import * as z from 'zod';

export interface Healthspan_calculatorInput {
  currentAge: number;
  smokingYears: number;
  bmi: number;
  exerciseHoursPerWeek: number;
  dietQualityScore: number;
  alcoholUnitsPerWeek: number;
}

export const Healthspan_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  smokingYears: z.number().default(0),
  bmi: z.number().default(25),
  exerciseHoursPerWeek: z.number().default(3),
  dietQualityScore: z.number().default(70),
  alcoholUnitsPerWeek: z.number().default(2),
});

function evaluateAllFormulas(input: Healthspan_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 80 - input.currentAge; results["baseRemainingYears"] = Number.isFinite(v) ? v : 0; } catch { results["baseRemainingYears"] = 0; }
  try { const v = Math.log(1 + input.smokingYears) * 2; results["smokingImpact"] = Number.isFinite(v) ? v : 0; } catch { results["smokingImpact"] = 0; }
  try { const v = input.bmi > 25 ? Math.log(1 + (input.bmi - 25)) * 1.5 : 0; results["bmiImpact"] = Number.isFinite(v) ? v : 0; } catch { results["bmiImpact"] = 0; }
  try { const v = Math.sqrt(input.exerciseHoursPerWeek) * 1.2; results["exerciseGain"] = Number.isFinite(v) ? v : 0; } catch { results["exerciseGain"] = 0; }
  try { const v = (input.dietQualityScore - 50) / 10; results["dietGain"] = Number.isFinite(v) ? v : 0; } catch { results["dietGain"] = 0; }
  try { const v = input.alcoholUnitsPerWeek * 0.5; results["alcoholLoss"] = Number.isFinite(v) ? v : 0; } catch { results["alcoholLoss"] = 0; }
  try { const v = Math.max(0, (results["baseRemainingYears"] ?? 0) - (results["smokingImpact"] ?? 0) - (results["bmiImpact"] ?? 0) + (results["exerciseGain"] ?? 0) + (results["dietGain"] ?? 0) - (results["alcoholLoss"] ?? 0)); results["adjustedHealthspan"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedHealthspan"] = 0; }
  return results;
}


export function calculateHealthspan_calculator(input: Healthspan_calculatorInput): Healthspan_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedHealthspan"] ?? 0;
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


export interface Healthspan_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
