// Auto-generated from interval-calculator-schema.json
import * as z from 'zod';

export interface Interval_calculatorInput {
  nominal: number;
  plusTol: number;
  minusTol: number;
  scaleFactor: number;
  dataConfidence?: number;
}

export const Interval_calculatorInputSchema = z.object({
  nominal: z.number().default(100),
  plusTol: z.number().default(0.1),
  minusTol: z.number().default(0.05),
  scaleFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Interval_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.scaleFactor * (input.nominal + input.plusTol); results["upper_limit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["upper_limit"] = 0; }
  try { const v = input.scaleFactor * (input.nominal - input.minusTol); results["lower_limit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lower_limit"] = 0; }
  try { const v = input.scaleFactor * (input.plusTol + input.minusTol); results["tolerance_range"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tolerance_range"] = 0; }
  try { const v = input.scaleFactor * (input.nominal + (input.plusTol - input.minusTol) / 2); results["midpoint"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["midpoint"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateInterval_calculator(input: Interval_calculatorInput): Interval_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["tolerance_range"]);
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


export interface Interval_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
