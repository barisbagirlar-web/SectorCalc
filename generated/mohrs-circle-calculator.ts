// Auto-generated from mohrs-circle-calculator-schema.json
import * as z from 'zod';

export interface Mohrs_circle_calculatorInput {
  sigma_x: number;
  sigma_y: number;
  tau_xy: number;
  dataConfidence?: number;
}

export const Mohrs_circle_calculatorInputSchema = z.object({
  sigma_x: z.number().default(0),
  sigma_y: z.number().default(0),
  tau_xy: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mohrs_circle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sigma_x + input.sigma_y) / 2; results["sigma_avg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sigma_avg"] = 0; }
  try { const v = (input.sigma_x + input.sigma_y) / 2; results["sigma_avg_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sigma_avg_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMohrs_circle_calculator(input: Mohrs_circle_calculatorInput): Mohrs_circle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["sigma_avg"]));
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


export interface Mohrs_circle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
