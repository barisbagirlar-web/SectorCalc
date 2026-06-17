// @ts-nocheck
// Auto-generated from de-moivres-theorem-calculator-schema.json
import * as z from 'zod';

export interface De_moivres_theorem_calculatorInput {
  r: number;
  theta: number;
  angleUnit: number;
  n: number;
  decimals: number;
}

export const De_moivres_theorem_calculatorInputSchema = z.object({
  r: z.number().default(1),
  theta: z.number().default(0),
  angleUnit: z.number().default(0),
  n: z.number().default(2),
  decimals: z.number().default(4),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: De_moivres_theorem_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.angleUnit === 1) ? input.theta * Math.PI / 180 : input.theta; results["thetaRad"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["thetaRad"] = 0; }
  try { const v = input.n * (asFormulaNumber(results["thetaRad"])); results["nTheta"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["nTheta"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDe_moivres_theorem_calculator(input: De_moivres_theorem_calculatorInput): De_moivres_theorem_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["nTheta"]);
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


export interface De_moivres_theorem_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
