// Auto-generated from fetal-weight-calculator-schema.json
import * as z from 'zod';

export interface Fetal_weight_calculatorInput {
  bpd: number;
  hc: number;
  ac: number;
  fl: number;
  dataConfidence?: number;
}

export const Fetal_weight_calculatorInputSchema = z.object({
  bpd: z.number().default(9.5),
  hc: z.number().default(33),
  ac: z.number().default(34),
  fl: z.number().default(7),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fetal_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.3596 - 0.00386 * input.ac * input.fl + 0.0064 * input.hc + 0.00061 * input.bpd * input.ac + 0.0424 * input.ac + 0.174 * input.fl; results["log10EFW"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["log10EFW"] = 0; }
  try { const v = 1.3596 - 0.00386 * input.ac * input.fl + 0.0064 * input.hc + 0.00061 * input.bpd * input.ac + 0.0424 * input.ac + 0.174 * input.fl; results["log10EFW_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["log10EFW_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFetal_weight_calculator(input: Fetal_weight_calculatorInput): Fetal_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["log10EFW_aux"]);
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


export interface Fetal_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
