// Auto-generated from scs-method-calculator-schema.json
import * as z from 'zod';

export interface Scs_method_calculatorInput {
  rainfall: number;
  curveNumber: number;
  amc: number;
  iaRatio: number;
  dataConfidence?: number;
}

export const Scs_method_calculatorInputSchema = z.object({
  rainfall: z.number().default(50),
  curveNumber: z.number().default(75),
  amc: z.number().default(2),
  iaRatio: z.number().default(0.2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Scs_method_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rainfall * input.curveNumber * input.amc * input.iaRatio; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.rainfall * input.curveNumber * input.amc * input.iaRatio; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateScs_method_calculator(input: Scs_method_calculatorInput): Scs_method_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Scs_method_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
