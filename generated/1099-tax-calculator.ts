// Auto-generated from 1099-tax-calculator-schema.json
import * as z from 'zod';

export interface _1099_tax_calculatorInput {
  grossIncome: number;
  businessExpenses: number;
  federalTaxRate: number;
  stateTaxRate: number;
  selfEmploymentTaxRate: number;
  dataConfidence?: number;
}

export const _1099_tax_calculatorInputSchema = z.object({
  grossIncome: z.number().default(50000),
  businessExpenses: z.number().default(5000),
  federalTaxRate: z.number().default(22),
  stateTaxRate: z.number().default(5),
  selfEmploymentTaxRate: z.number().default(15.3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: _1099_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossIncome - input.businessExpenses; results["netProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = (asFormulaNumber(results["netProfit"])) * 0.9235 * (input.selfEmploymentTaxRate / 100); results["seTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["seTax"] = 0; }
  try { const v = (asFormulaNumber(results["netProfit"])) - ((asFormulaNumber(results["seTax"])) / 2); results["adjustedNet"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedNet"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedNet"])) * (input.federalTaxRate / 100); results["federalTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["federalTax"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedNet"])) * (input.stateTaxRate / 100); results["stateTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stateTax"] = 0; }
  try { const v = (asFormulaNumber(results["federalTax"])) + (asFormulaNumber(results["stateTax"])) + (asFormulaNumber(results["seTax"])); results["totalTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTax"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculate_1099_tax_calculator(input: _1099_tax_calculatorInput): _1099_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalTax"]));
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


export interface _1099_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
