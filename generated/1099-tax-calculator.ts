// Auto-generated from 1099-tax-calculator-schema.json
import * as z from 'zod';

export interface _1099_tax_calculatorInput {
  grossIncome: number;
  businessExpenses: number;
  federalTaxRate: number;
  stateTaxRate: number;
  selfEmploymentTaxRate: number;
}

export const _1099_tax_calculatorInputSchema = z.object({
  grossIncome: z.number().default(50000),
  businessExpenses: z.number().default(5000),
  federalTaxRate: z.number().default(22),
  stateTaxRate: z.number().default(5),
  selfEmploymentTaxRate: z.number().default(15.3),
});

function evaluateAllFormulas(input: _1099_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossIncome - input.businessExpenses; results["netProfit"] = Number.isFinite(v) ? v : 0; } catch { results["netProfit"] = 0; }
  try { const v = (results["netProfit"] ?? 0) * 0.9235 * (input.selfEmploymentTaxRate / 100); results["seTax"] = Number.isFinite(v) ? v : 0; } catch { results["seTax"] = 0; }
  try { const v = (results["netProfit"] ?? 0) - ((results["seTax"] ?? 0) / 2); results["adjustedNet"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedNet"] = 0; }
  try { const v = (results["adjustedNet"] ?? 0) * (input.federalTaxRate / 100); results["federalTax"] = Number.isFinite(v) ? v : 0; } catch { results["federalTax"] = 0; }
  try { const v = (results["adjustedNet"] ?? 0) * (input.stateTaxRate / 100); results["stateTax"] = Number.isFinite(v) ? v : 0; } catch { results["stateTax"] = 0; }
  try { const v = (results["federalTax"] ?? 0) + (results["stateTax"] ?? 0) + (results["seTax"] ?? 0); results["totalTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalTax"] = 0; }
  return results;
}


export function calculate_1099_tax_calculator(input: _1099_tax_calculatorInput): _1099_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTax"] ?? 0;
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


export interface _1099_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
