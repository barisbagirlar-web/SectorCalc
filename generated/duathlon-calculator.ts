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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Duathlon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.run1Time + input.transition1 + input.bikeTime + input.transition2 + input.run2Time; results["totalTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTimeMinutes"] = Number.NaN; }
  try { const v = input.run1Distance + input.bikeDistance + input.run2Distance; results["totalDistanceKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDistanceKm"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDistanceKm"])) / ((toNumericFormulaValue(results["totalTimeMinutes"])) / 60); results["averageSpeedKmh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averageSpeedKmh"] = Number.NaN; }
  try { const v = input.run1Time / input.run1Distance; results["run1PaceMinPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["run1PaceMinPerKm"] = Number.NaN; }
  try { const v = input.bikeDistance / (input.bikeTime / 60); results["bikeSpeedKmh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bikeSpeedKmh"] = Number.NaN; }
  try { const v = input.run2Time / input.run2Distance; results["run2PaceMinPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["run2PaceMinPerKm"] = Number.NaN; }
  return results;
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
