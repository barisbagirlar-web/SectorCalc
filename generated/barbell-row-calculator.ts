// Auto-generated from barbell-row-calculator-schema.json
import * as z from 'zod';

export interface Barbell_row_calculatorInput {
  barbellDiameter: number;
  barbellLength: number;
  loadWeight: number;
  yieldStrength: number;
  safetyFactor: number;
}

export const Barbell_row_calculatorInputSchema = z.object({
  barbellDiameter: z.number().default(28),
  barbellLength: z.number().default(2200),
  loadWeight: z.number().default(100),
  yieldStrength: z.number().default(250),
  safetyFactor: z.number().default(3),
});

function evaluateAllFormulas(input: Barbell_row_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.loadWeight * 9.81 * input.barbellLength) / 4; results["bendingMoment"] = Number.isFinite(v) ? v : 0; } catch { results["bendingMoment"] = 0; }
  try { const v = Math.PI * Math.pow(input.barbellDiameter, 3) / 32; results["sectionModulus"] = Number.isFinite(v) ? v : 0; } catch { results["sectionModulus"] = 0; }
  try { const v = (results["bendingMoment"] ?? 0) / (results["sectionModulus"] ?? 0); results["maxBendingStress"] = Number.isFinite(v) ? v : 0; } catch { results["maxBendingStress"] = 0; }
  try { const v = input.yieldStrength / input.safetyFactor; results["allowableStress"] = Number.isFinite(v) ? v : 0; } catch { results["allowableStress"] = 0; }
  try { const v = (results["allowableStress"] ?? 0) - (results["maxBendingStress"] ?? 0); results["safetyMargin"] = Number.isFinite(v) ? v : 0; } catch { results["safetyMargin"] = 0; }
  return results;
}


export function calculateBarbell_row_calculator(input: Barbell_row_calculatorInput): Barbell_row_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxBendingStress"] ?? 0;
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


export interface Barbell_row_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
