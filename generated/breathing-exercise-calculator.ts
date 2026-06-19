// Auto-generated from breathing-exercise-calculator-schema.json
import * as z from 'zod';

export interface Breathing_exercise_calculatorInput {
  breathingRate: number;
  tidalVolume: number;
  cylinderVolume: number;
  cylinderPressure: number;
  safetyFactor: number;
  ambientPressure: number;
  dataConfidence?: number;
}

export const Breathing_exercise_calculatorInputSchema = z.object({
  breathingRate: z.number().default(12),
  tidalVolume: z.number().default(0.5),
  cylinderVolume: z.number().default(6),
  cylinderPressure: z.number().default(200),
  safetyFactor: z.number().default(0.8),
  ambientPressure: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Breathing_exercise_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cylinderVolume * input.cylinderPressure; results["totalFreeAir_L"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFreeAir_L"] = 0; }
  try { const v = input.breathingRate * input.tidalVolume; results["minuteVentilation"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["minuteVentilation"] = 0; }
  try { const v = (input.cylinderVolume * input.cylinderPressure * input.safetyFactor) / (input.breathingRate * input.tidalVolume * input.ambientPressure); results["estimatedTimeMin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimatedTimeMin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBreathing_exercise_calculator(input: Breathing_exercise_calculatorInput): Breathing_exercise_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["estimatedTimeMin"]);
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


export interface Breathing_exercise_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
