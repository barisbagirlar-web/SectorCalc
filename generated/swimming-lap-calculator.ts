// Auto-generated from swimming-lap-calculator-schema.json
import * as z from 'zod';

export interface Swimming_lap_calculatorInput {
  poolLength: number;
  numLaps: number;
  pacePer100m: number;
  restBetweenLaps: number;
  dataConfidence?: number;
}

export const Swimming_lap_calculatorInputSchema = z.object({
  poolLength: z.number().default(25),
  numLaps: z.number().default(10),
  pacePer100m: z.number().default(120),
  restBetweenLaps: z.number().default(15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Swimming_lap_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.poolLength * input.numLaps; results["totalDistance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDistance"] = 0; }
  try { const v = (input.pacePer100m / 100) * input.poolLength * input.numLaps; results["totalSwimTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSwimTime"] = 0; }
  try { const v = (input.numLaps - 1) * input.restBetweenLaps; results["totalRestTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRestTime"] = 0; }
  try { const v = ((input.pacePer100m / 100) * input.poolLength * input.numLaps + (input.numLaps - 1) * input.restBetweenLaps) * 100 / (input.poolLength * input.numLaps); results["effectivePacePer100m"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectivePacePer100m"] = 0; }
  try { const v = (input.pacePer100m / 100) * input.poolLength * input.numLaps + (input.numLaps - 1) * input.restBetweenLaps; results["totalTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTime"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSwimming_lap_calculator(input: Swimming_lap_calculatorInput): Swimming_lap_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTime"]);
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


export interface Swimming_lap_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
