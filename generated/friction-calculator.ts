// Auto-generated from friction-calculator-schema.json
import * as z from 'zod';

export interface Friction_calculatorInput {
  mass: number;
  angle: number;
  coeffStatic: number;
  coeffKinetic: number;
  gravity: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Friction_calculatorInputSchema = z.object({
  mass: z.number().default(10),
  angle: z.number().default(0),
  coeffStatic: z.number().default(0.5),
  coeffKinetic: z.number().default(0.3),
  gravity: z.number().default(9.81),
  safetyFactor: z.number().default(1.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Friction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.mass * input.angle * input.coeffStatic * input.coeffKinetic; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.mass * input.angle * input.coeffStatic * input.coeffKinetic * (input.gravity * input.safetyFactor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.gravity * input.safetyFactor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFriction_calculator(input: Friction_calculatorInput): Friction_calculatorOutput {
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


export interface Friction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
