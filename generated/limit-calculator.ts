// Auto-generated from limit-calculator-schema.json
import * as z from 'zod';

export interface Limit_calculatorInput {
  numCoeff0: number;
  numCoeff1: number;
  numCoeff2: number;
  denCoeff0: number;
  denCoeff1: number;
  denCoeff2: number;
  approachPoint: number;
  epsilon: number;
  dataConfidence?: number;
}

export const Limit_calculatorInputSchema = z.object({
  numCoeff0: z.number().default(0),
  numCoeff1: z.number().default(0),
  numCoeff2: z.number().default(0),
  denCoeff0: z.number().default(0),
  denCoeff1: z.number().default(0),
  denCoeff2: z.number().default(0),
  approachPoint: z.number().default(0),
  epsilon: z.number().default(0.0001),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Limit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.approachPoint - input.epsilon; results["xLeft"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["xLeft"] = Number.NaN; }
  try { const v = input.approachPoint + input.epsilon; results["xRight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["xRight"] = Number.NaN; }
  try { const v = input.numCoeff0 + input.numCoeff1 * (toNumericFormulaValue(results["xLeft"])) + input.numCoeff2 * (toNumericFormulaValue(results["xLeft"])) ** 2; results["leftNumerator"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leftNumerator"] = Number.NaN; }
  try { const v = input.denCoeff0 + input.denCoeff1 * (toNumericFormulaValue(results["xLeft"])) + input.denCoeff2 * (toNumericFormulaValue(results["xLeft"])) ** 2; results["leftDenominator"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leftDenominator"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["leftNumerator"])) / (toNumericFormulaValue(results["leftDenominator"])); results["leftLimit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leftLimit"] = Number.NaN; }
  try { const v = input.numCoeff0 + input.numCoeff1 * (toNumericFormulaValue(results["xRight"])) + input.numCoeff2 * (toNumericFormulaValue(results["xRight"])) ** 2; results["rightNumerator"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rightNumerator"] = Number.NaN; }
  try { const v = input.denCoeff0 + input.denCoeff1 * (toNumericFormulaValue(results["xRight"])) + input.denCoeff2 * (toNumericFormulaValue(results["xRight"])) ** 2; results["rightDenominator"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rightDenominator"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rightNumerator"])) / (toNumericFormulaValue(results["rightDenominator"])); results["rightLimit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rightLimit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["leftLimit"])) + (toNumericFormulaValue(results["rightLimit"]))) / 2; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["leftLimit"])); results["breakdown_0"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown_0"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["rightLimit"])); results["breakdown_1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["breakdown_1"] = Number.NaN; }
  return results;
}


export function calculateLimit_calculator(input: Limit_calculatorInput): Limit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakdown_1"]);
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


export interface Limit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
