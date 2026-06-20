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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Standard_error_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sd1 ** 2; results["sd1Squared"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sd1Squared"] = Number.NaN; }
  try { const v = input.sd2 ** 2; results["sd2Squared"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sd2Squared"] = Number.NaN; }
  try { const v = (input.sd1 ** 2) / input.n1; results["varianceTerm1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["varianceTerm1"] = Number.NaN; }
  try { const v = (input.sd2 ** 2) / input.n2; results["varianceTerm2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["varianceTerm2"] = Number.NaN; }
  try { const v = (input.sd1 ** 2) / input.n1 + (input.sd2 ** 2) / input.n2; results["combinedVariance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["combinedVariance"] = Number.NaN; }
  return results;
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
