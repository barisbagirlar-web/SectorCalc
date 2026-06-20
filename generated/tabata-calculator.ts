// Auto-generated from tabata-calculator-schema.json
import * as z from 'zod';

export interface Tabata_calculatorInput {
  workDuration: number;
  restDuration: number;
  rounds: number;
  preparationTime: number;
  coolDownTime: number;
  dataConfidence?: number;
}

export const Tabata_calculatorInputSchema = z.object({
  workDuration: z.number().default(20),
  restDuration: z.number().default(10),
  rounds: z.number().default(8),
  preparationTime: z.number().default(0),
  coolDownTime: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Tabata_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.workDuration * input.rounds; results["totalWorkTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWorkTime"] = Number.NaN; }
  try { const v = input.restDuration * input.rounds; results["totalRestTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRestTime"] = Number.NaN; }
  try { const v = input.preparationTime + input.coolDownTime + input.rounds * (input.workDuration + input.restDuration); results["totalWorkoutTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWorkoutTime"] = Number.NaN; }
  return results;
}


export function calculateTabata_calculator(input: Tabata_calculatorInput): Tabata_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWorkoutTime"]);
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


export interface Tabata_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
