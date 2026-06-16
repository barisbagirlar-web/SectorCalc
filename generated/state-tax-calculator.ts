// Auto-generated from state-tax-calculator-schema.json
import * as z from 'zod';

export interface State_tax_calculatorInput {
  grossIncome: number;
  stateTaxRate: number;
  standardDeduction: number;
  additionalDeductions: number;
  taxCredits: number;
}

export const State_tax_calculatorInputSchema = z.object({
  grossIncome: z.number().default(50000),
  stateTaxRate: z.number().default(5),
  standardDeduction: z.number().default(12000),
  additionalDeductions: z.number().default(0),
  taxCredits: z.number().default(0),
});

function evaluateAllFormulas(input: State_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossIncome - input.standardDeduction - input.additionalDeductions; results["taxableIncome"] = Number.isFinite(v) ? v : 0; } catch { results["taxableIncome"] = 0; }
  try { const v = (results["taxableIncome"] ?? 0) > 0 ? (results["taxableIncome"] ?? 0) * input.stateTaxRate / 100 : 0; results["taxBeforeCredits"] = Number.isFinite(v) ? v : 0; } catch { results["taxBeforeCredits"] = 0; }
  try { const v = Math.max(0, (results["taxBeforeCredits"] ?? 0) - input.taxCredits); results["totalTaxOwed"] = Number.isFinite(v) ? v : 0; } catch { results["totalTaxOwed"] = 0; }
  return results;
}


export function calculateState_tax_calculator(input: State_tax_calculatorInput): State_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTaxOwed"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface State_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
