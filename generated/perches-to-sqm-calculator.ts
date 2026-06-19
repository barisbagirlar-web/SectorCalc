// Auto-generated from perches-to-sqm-calculator-schema.json
import * as z from 'zod';

export interface Perches_to_sqm_calculatorInput {
  perches: number;
  factor: number;
  knownSqm: number;
  offset: number;
  precision: number;
  dataConfidence?: number;
}

export const Perches_to_sqm_calculatorInputSchema = z.object({
  perches: z.number().default(0),
  factor: z.number().default(25.29285264),
  knownSqm: z.number().default(0),
  offset: z.number().default(0),
  precision: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Perches_to_sqm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.perches * input.factor + input.offset; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.perches; results["breakdown"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["breakdown"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePerches_to_sqm_calculator(input: Perches_to_sqm_calculatorInput): Perches_to_sqm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["primary"]);
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


export interface Perches_to_sqm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
