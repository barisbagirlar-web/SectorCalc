// Auto-generated from standard-error-calculator-schema.json
import * as z from 'zod';

export interface Standard_error_calculatorInput {
  sd1: number;
  n1: number;
  sd2: number;
  n2: number;
  dataConfidence?: number;
}

export const Standard_error_calculatorInputSchema = z.object({
  sd1: z.number().default(0),
  n1: z.number().default(1),
  sd2: z.number().default(0),
  n2: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Standard_error_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sd1 ** 2; results["sd1Squared"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sd1Squared"] = 0; }
  try { const v = input.sd2 ** 2; results["sd2Squared"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sd2Squared"] = 0; }
  try { const v = (input.sd1 ** 2) / input.n1; results["varianceTerm1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["varianceTerm1"] = 0; }
  try { const v = (input.sd2 ** 2) / input.n2; results["varianceTerm2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["varianceTerm2"] = 0; }
  try { const v = (input.sd1 ** 2) / input.n1 + (input.sd2 ** 2) / input.n2; results["combinedVariance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["combinedVariance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStandard_error_calculator(input: Standard_error_calculatorInput): Standard_error_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["combinedVariance"]);
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


export interface Standard_error_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
