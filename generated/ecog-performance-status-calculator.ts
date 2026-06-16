// Auto-generated from ecog-performance-status-calculator-schema.json
import * as z from 'zod';

export interface Ecog_performance_status_calculatorInput {
  vibrationLevel: number;
  temperature: number;
  runtimeHours: number;
  oilQuality: number;
  noiseLevel: number;
}

export const Ecog_performance_status_calculatorInputSchema = z.object({
  vibrationLevel: z.number().default(2.5),
  temperature: z.number().default(60),
  runtimeHours: z.number().default(2000),
  oilQuality: z.number().default(80),
  noiseLevel: z.number().default(85),
});

function evaluateAllFormulas(input: Ecog_performance_status_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.vibrationLevel/10*0.3 + input.temperature/100*0.2 + input.runtimeHours/5000*0.2 + input.oilQuality/100*0.15 + input.noiseLevel/120*0.15; results["conditionScore"] = Number.isFinite(v) ? v : 0; } catch { results["conditionScore"] = 0; }
  try { const v = 100 - (results["conditionScore"] ?? 0)*100; results["healthPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["healthPercentage"] = 0; }
  try { const v = (results["conditionScore"] ?? 0) < 0.2 ? 0 : (results["conditionScore"] ?? 0) < 0.4 ? 1 : (results["conditionScore"] ?? 0) < 0.6 ? 2 : (results["conditionScore"] ?? 0) < 0.8 ? 3 : (results["conditionScore"] ?? 0) < 1.0 ? 4 : 5; results["ecogGrade"] = Number.isFinite(v) ? v : 0; } catch { results["ecogGrade"] = 0; }
  return results;
}


export function calculateEcog_performance_status_calculator(input: Ecog_performance_status_calculatorInput): Ecog_performance_status_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["ecogGrade"] ?? 0;
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


export interface Ecog_performance_status_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
