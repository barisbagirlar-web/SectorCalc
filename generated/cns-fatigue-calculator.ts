// Auto-generated from cns-fatigue-calculator-schema.json
import * as z from 'zod';

export interface Cns_fatigue_calculatorInput {
  bodyWeight: number;
  weightLifted: number;
  reps: number;
  sets: number;
  restBetweenSets: number;
  daysSinceLastSession: number;
  trainingExperience: number;
}

export const Cns_fatigue_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(70),
  weightLifted: z.number().default(100),
  reps: z.number().default(10),
  sets: z.number().default(5),
  restBetweenSets: z.number().default(2),
  daysSinceLastSession: z.number().default(1),
  trainingExperience: z.number().default(2),
});

function evaluateAllFormulas(input: Cns_fatigue_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weightLifted * input.reps * input.sets; results["totalLoad"] = Number.isFinite(v) ? v : 0; } catch { results["totalLoad"] = 0; }
  try { const v = input.weightLifted / input.bodyWeight; results["intensity"] = Number.isFinite(v) ? v : 0; } catch { results["intensity"] = 0; }
  try { const v = 1 - Math.exp(-input.trainingExperience / 5); results["fatigueResistance"] = Number.isFinite(v) ? v : 0; } catch { results["fatigueResistance"] = 0; }
  try { const v = ((results["totalLoad"] ?? 0) / 1000) * (results["intensity"] ?? 0) * (1 / input.restBetweenSets) * (1 / input.daysSinceLastSession) * (1 - (results["fatigueResistance"] ?? 0)); results["fatigueIndex"] = Number.isFinite(v) ? v : 0; } catch { results["fatigueIndex"] = 0; }
  return results;
}


export function calculateCns_fatigue_calculator(input: Cns_fatigue_calculatorInput): Cns_fatigue_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["fatigueIndex"] ?? 0;
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


export interface Cns_fatigue_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
