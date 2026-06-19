// Auto-generated from duathlon-calculator-schema.json
import * as z from 'zod';

export interface Duathlon_calculatorInput {
  run1Distance: number;
  run1Time: number;
  transition1: number;
  bikeDistance: number;
  bikeTime: number;
  transition2: number;
  run2Distance: number;
  run2Time: number;
  dataConfidence?: number;
}

export const Duathlon_calculatorInputSchema = z.object({
  run1Distance: z.number().default(5),
  run1Time: z.number().default(25),
  transition1: z.number().default(1),
  bikeDistance: z.number().default(20),
  bikeTime: z.number().default(40),
  transition2: z.number().default(1),
  run2Distance: z.number().default(2.5),
  run2Time: z.number().default(12),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Duathlon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.run1Time + input.transition1 + input.bikeTime + input.transition2 + input.run2Time; results["totalTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTimeMinutes"] = 0; }
  try { const v = input.run1Distance + input.bikeDistance + input.run2Distance; results["totalDistanceKm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDistanceKm"] = 0; }
  try { const v = (asFormulaNumber(results["totalDistanceKm"])) / ((asFormulaNumber(results["totalTimeMinutes"])) / 60); results["averageSpeedKmh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averageSpeedKmh"] = 0; }
  try { const v = input.run1Time / input.run1Distance; results["run1PaceMinPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["run1PaceMinPerKm"] = 0; }
  try { const v = input.bikeDistance / (input.bikeTime / 60); results["bikeSpeedKmh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bikeSpeedKmh"] = 0; }
  try { const v = input.run2Time / input.run2Distance; results["run2PaceMinPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["run2PaceMinPerKm"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDuathlon_calculator(input: Duathlon_calculatorInput): Duathlon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTimeMinutes"]);
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


export interface Duathlon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
