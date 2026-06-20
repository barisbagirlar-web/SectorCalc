// Auto-generated from muscle-up-calculator-schema.json
import * as z from 'zod';

export interface Muscle_up_calculatorInput {
  loadKg: number;
  mechanicalAdvantage: number;
  frictionCoeff: number;
  pullAngle: number;
  dataConfidence?: number;
}

export const Muscle_up_calculatorInputSchema = z.object({
  loadKg: z.number().default(50),
  mechanicalAdvantage: z.number().default(2),
  frictionCoeff: z.number().default(0.05),
  pullAngle: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Muscle_up_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.loadKg * input.mechanicalAdvantage * input.frictionCoeff * input.pullAngle; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.loadKg * input.mechanicalAdvantage * input.frictionCoeff * input.pullAngle; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateMuscle_up_calculator(input: Muscle_up_calculatorInput): Muscle_up_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Muscle_up_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
