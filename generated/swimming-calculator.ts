// Auto-generated from swimming-calculator-schema.json
import * as z from 'zod';

export interface Swimming_calculatorInput {
  distance: number;
  time: number;
  restTime: number;
  laps: number;
  poolLength: number;
  dataConfidence?: number;
}

export const Swimming_calculatorInputSchema = z.object({
  distance: z.number().default(100),
  time: z.number().default(60),
  restTime: z.number().default(30),
  laps: z.number().default(1),
  poolLength: z.number().default(25),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Swimming_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.time / (input.distance / 100); results["averagePacePer100m"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averagePacePer100m"] = Number.NaN; }
  try { const v = input.time * input.laps + input.restTime * (input.laps - 1); results["totalTimeWithRest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeWithRest"] = Number.NaN; }
  try { const v = input.distance * input.laps; results["totalDistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDistance"] = Number.NaN; }
  try { const v = input.distance / input.poolLength; results["lapsPerPool"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lapsPerPool"] = Number.NaN; }
  try { const v = input.distance / input.time; results["speedMetersPerSecond"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speedMetersPerSecond"] = Number.NaN; }
  return results;
}


export function calculateSwimming_calculator(input: Swimming_calculatorInput): Swimming_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["averagePacePer100m"]);
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


export interface Swimming_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
