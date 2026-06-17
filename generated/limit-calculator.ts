// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Limit_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.approachPoint - input.epsilon; results["xLeft"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["xLeft"] = 0; }
  try { const v = input.approachPoint + input.epsilon; results["xRight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["xRight"] = 0; }
  try { const v = input.numCoeff0 + input.numCoeff1 * (asFormulaNumber(results["xLeft"])) + input.numCoeff2 * (asFormulaNumber(results["xLeft"])) ** 2; results["leftNumerator"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leftNumerator"] = 0; }
  try { const v = input.denCoeff0 + input.denCoeff1 * (asFormulaNumber(results["xLeft"])) + input.denCoeff2 * (asFormulaNumber(results["xLeft"])) ** 2; results["leftDenominator"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leftDenominator"] = 0; }
  try { const v = (asFormulaNumber(results["leftNumerator"])) / (asFormulaNumber(results["leftDenominator"])); results["leftLimit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["leftLimit"] = 0; }
  try { const v = input.numCoeff0 + input.numCoeff1 * (asFormulaNumber(results["xRight"])) + input.numCoeff2 * (asFormulaNumber(results["xRight"])) ** 2; results["rightNumerator"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rightNumerator"] = 0; }
  try { const v = input.denCoeff0 + input.denCoeff1 * (asFormulaNumber(results["xRight"])) + input.denCoeff2 * (asFormulaNumber(results["xRight"])) ** 2; results["rightDenominator"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rightDenominator"] = 0; }
  try { const v = (asFormulaNumber(results["rightNumerator"])) / (asFormulaNumber(results["rightDenominator"])); results["rightLimit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rightLimit"] = 0; }
  try { const v = ((asFormulaNumber(results["leftLimit"])) + (asFormulaNumber(results["rightLimit"]))) / 2; results["primary"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["primary"] = 0; }
  try { const v = (asFormulaNumber(results["leftLimit"])); results["breakdown_0"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown_0"] = 0; }
  try { const v = (asFormulaNumber(results["rightLimit"])); results["breakdown_1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["breakdown_1"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateLimit_calculator(input: Limit_calculatorInput): Limit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["breakdown_1"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
