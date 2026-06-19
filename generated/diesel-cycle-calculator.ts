// Auto-generated from diesel-cycle-calculator-schema.json
import * as z from 'zod';

export interface Diesel_cycle_calculatorInput {
  r: number;
  rc: number;
  T1: number;
  p1: number;
  k: number;
  cv: number;
  dataConfidence?: number;
}

export const Diesel_cycle_calculatorInputSchema = z.object({
  r: z.number().default(18),
  rc: z.number().default(2.5),
  T1: z.number().default(300),
  p1: z.number().default(100000),
  k: z.number().default(1.4),
  cv: z.number().default(718),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Diesel_cycle_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cv * (input.k - 1); results["R"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["R"] = 0; }
  try { const v = (asFormulaNumber(results["R"])) * input.T1 / input.p1; results["v1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["v1"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDiesel_cycle_calculator(input: Diesel_cycle_calculatorInput): Diesel_cycle_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["v1"]));
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


export interface Diesel_cycle_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
