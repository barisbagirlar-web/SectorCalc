// Auto-generated from baby-weight-calculator-schema.json
import * as z from 'zod';

export interface Baby_weight_calculatorInput {
  bpd: number;
  hc: number;
  ac: number;
  fl: number;
  dataConfidence?: number;
}

export const Baby_weight_calculatorInputSchema = z.object({
  bpd: z.number().default(7.5),
  hc: z.number().default(27),
  ac: z.number().default(25.5),
  fl: z.number().default(5.6),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baby_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.335 - 0.0034 * input.ac * input.fl + 0.0316 * input.bpd + 0.0457 * input.ac + 0.1623 * input.fl; results["logEFW"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["logEFW"] = 0; }
  try { const v = 1.335 - 0.0034 * input.ac * input.fl + 0.0316 * input.bpd + 0.0457 * input.ac + 0.1623 * input.fl; results["logEFW_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["logEFW_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaby_weight_calculator(input: Baby_weight_calculatorInput): Baby_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["logEFW_aux"]));
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


export interface Baby_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
