// Auto-generated from torsion-calculator-schema.json
import * as z from 'zod';

export interface Torsion_calculatorInput {
  torque: number;
  length: number;
  shearModulus: number;
  diameter: number;
  innerDiameter: number;
  dataConfidence?: number;
}

export const Torsion_calculatorInputSchema = z.object({
  torque: z.number().default(100),
  length: z.number().default(1),
  shearModulus: z.number().default(80000000000),
  diameter: z.number().default(0.05),
  innerDiameter: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Torsion_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.torque * input.length * input.shearModulus * input.diameter; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.torque * input.length * input.shearModulus * input.diameter * (input.innerDiameter); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.innerDiameter; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTorsion_calculator(input: Torsion_calculatorInput): Torsion_calculatorOutput {
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


export interface Torsion_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
