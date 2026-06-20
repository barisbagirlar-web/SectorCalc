// Auto-generated from state-tax-calculator-schema.json
import * as z from 'zod';

export interface State_tax_calculatorInput {
  grossIncome: number;
  stateTaxRate: number;
  standardDeduction: number;
  additionalDeductions: number;
  taxCredits: number;
  dataConfidence?: number;
}

export const State_tax_calculatorInputSchema = z.object({
  grossIncome: z.number().default(50000),
  stateTaxRate: z.number().default(5),
  standardDeduction: z.number().default(12000),
  additionalDeductions: z.number().default(0),
  taxCredits: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: State_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossIncome - input.standardDeduction - input.additionalDeductions; results["taxableIncome"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxableIncome"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableIncome"])) > 0 ? (toNumericFormulaValue(results["taxableIncome"])) * input.stateTaxRate / 100 : 0; results["taxBeforeCredits"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxBeforeCredits"] = Number.NaN; }
  return results;
}


export function calculateState_tax_calculator(input: State_tax_calculatorInput): State_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["taxBeforeCredits"]);
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


export interface State_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
