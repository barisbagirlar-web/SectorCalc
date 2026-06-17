// Auto-generated from tabata-calculator-schema.json
import * as z from 'zod';

export interface Tabata_calculatorInput {
  workDuration: number;
  restDuration: number;
  rounds: number;
  preparationTime: number;
  coolDownTime: number;
}

export const Tabata_calculatorInputSchema = z.object({
  workDuration: z.number().default(20),
  restDuration: z.number().default(10),
  rounds: z.number().default(8),
  preparationTime: z.number().default(0),
  coolDownTime: z.number().default(0),
});

function evaluateAllFormulas(input: Tabata_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workDuration * input.rounds; results["totalWorkTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalWorkTime"] = 0; }
  try { const v = input.restDuration * input.rounds; results["totalRestTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalRestTime"] = 0; }
  try { const v = input.preparationTime + input.coolDownTime + input.rounds * (input.workDuration + input.restDuration); results["totalWorkoutTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalWorkoutTime"] = 0; }
  return results;
}


export function calculateTabata_calculator(input: Tabata_calculatorInput): Tabata_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWorkoutTime"] ?? 0;
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


export interface Tabata_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
