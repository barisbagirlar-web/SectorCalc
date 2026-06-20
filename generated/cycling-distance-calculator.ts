// Auto-generated from cycling-distance-calculator-schema.json
import * as z from 'zod';

export interface Cycling_distance_calculatorInput {
  wheelDiameter: number;
  cadence: number;
  frontTeeth: number;
  rearTeeth: number;
  timeMinutes: number;
  dataConfidence?: number;
}

export const Cycling_distance_calculatorInputSchema = z.object({
  wheelDiameter: z.number().default(700),
  cadence: z.number().default(80),
  frontTeeth: z.number().default(50),
  rearTeeth: z.number().default(15),
  timeMinutes: z.number().default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cycling_distance_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.cadence * (input.frontTeeth / input.rearTeeth) * input.timeMinutes) * (Math.PI * input.wheelDiameter)) / 1000000; results["distance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["distance"] = Number.NaN; }
  try { const v = Math.PI * input.wheelDiameter; results["wheelCircumference"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wheelCircumference"] = Number.NaN; }
  try { const v = input.cadence * (input.frontTeeth / input.rearTeeth) * input.timeMinutes; results["totalRotations"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRotations"] = Number.NaN; }
  return results;
}


export function calculateCycling_distance_calculator(input: Cycling_distance_calculatorInput): Cycling_distance_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["distance"]);
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


export interface Cycling_distance_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
