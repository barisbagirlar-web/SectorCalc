// Auto-generated from retaining-wall-calculator-schema.json
import * as z from 'zod';

export interface Retaining_wall_calculatorInput {
  wallHeight: number;
  wallThickness: number;
  baseWidth: number;
  baseThickness: number;
  soilDensity: number;
  concreteDensity: number;
  frictionAngle: number;
  dataConfidence?: number;
}

export const Retaining_wall_calculatorInputSchema = z.object({
  wallHeight: z.number().default(3),
  wallThickness: z.number().default(0.3),
  baseWidth: z.number().default(2),
  baseThickness: z.number().default(0.4),
  soilDensity: z.number().default(18),
  concreteDensity: z.number().default(24),
  frictionAngle: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Retaining_wall_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.wallHeight * input.wallThickness * input.concreteDensity; results["W1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["W1"] = Number.NaN; }
  try { const v = input.baseWidth * input.baseThickness * input.concreteDensity; results["W2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["W2"] = Number.NaN; }
  try { const v = input.baseWidth - input.wallThickness; results["heel_length"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heel_length"] = Number.NaN; }
  try { const v = input.soilDensity * input.wallHeight * (toNumericFormulaValue(results["heel_length"])); results["W3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["W3"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["W1"])) + (toNumericFormulaValue(results["W2"])) + (toNumericFormulaValue(results["W3"])); results["R"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["R"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["W1"])) * (input.wallThickness / 2) + (toNumericFormulaValue(results["W2"])) * (input.baseWidth / 2) + (toNumericFormulaValue(results["W3"])) * ((input.baseWidth + input.wallThickness) / 2); results["Mr"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Mr"] = Number.NaN; }
  return results;
}


export function calculateRetaining_wall_calculator(input: Retaining_wall_calculatorInput): Retaining_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Mr"]);
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


export interface Retaining_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
