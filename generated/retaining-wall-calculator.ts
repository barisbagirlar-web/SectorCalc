// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Retaining_wall_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.wallHeight * input.wallThickness * input.concreteDensity; results["W1"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["W1"] = 0; }
  try { const v = input.baseWidth * input.baseThickness * input.concreteDensity; results["W2"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["W2"] = 0; }
  try { const v = input.baseWidth - input.wallThickness; results["heel_length"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["heel_length"] = 0; }
  try { const v = input.soilDensity * input.wallHeight * (asFormulaNumber(results["heel_length"])); results["W3"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["W3"] = 0; }
  try { const v = (asFormulaNumber(results["W1"])) + (asFormulaNumber(results["W2"])) + (asFormulaNumber(results["W3"])); results["R"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["R"] = 0; }
  try { const v = (asFormulaNumber(results["W1"])) * (input.wallThickness / 2) + (asFormulaNumber(results["W2"])) * (input.baseWidth / 2) + (asFormulaNumber(results["W3"])) * ((input.baseWidth + input.wallThickness) / 2); results["Mr"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["Mr"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRetaining_wall_calculator(input: Retaining_wall_calculatorInput): Retaining_wall_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["Mr"]);
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


export interface Retaining_wall_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
