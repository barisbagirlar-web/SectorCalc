// Auto-generated from spring-rate-calculator-schema.json
import * as z from 'zod';

export interface Spring_rate_calculatorInput {
  wireDiameter: number;
  meanCoilDiameter: number;
  activeCoils: number;
  shearModulus: number;
  dataConfidence?: number;
}

export const Spring_rate_calculatorInputSchema = z.object({
  wireDiameter: z.number().default(1),
  meanCoilDiameter: z.number().default(10),
  activeCoils: z.number().default(10),
  shearModulus: z.number().default(79.3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Spring_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.shearModulus * 1000 * input.wireDiameter**4) / (8 * input.meanCoilDiameter**3 * input.activeCoils); results["springRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["springRate"] = 0; }
  try { const v = input.shearModulus * 1000; results["shearModulus___1000"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shearModulus___1000"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSpring_rate_calculator(input: Spring_rate_calculatorInput): Spring_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["springRate"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Spring_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
