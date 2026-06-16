// Auto-generated from local-tax-calculator-schema.json
import * as z from 'zod';

export interface Local_tax_calculatorInput {
  propertyValue: number;
  propertyTaxRate: number;
  salesAmount: number;
  salesTaxRate: number;
  incomeAmount: number;
  incomeTaxRate: number;
}

export const Local_tax_calculatorInputSchema = z.object({
  propertyValue: z.number().default(0),
  propertyTaxRate: z.number().default(0),
  salesAmount: z.number().default(0),
  salesTaxRate: z.number().default(0),
  incomeAmount: z.number().default(0),
  incomeTaxRate: z.number().default(0),
});

function evaluateAllFormulas(input: Local_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyValue * input.propertyTaxRate / 100; results["propertyTax"] = Number.isFinite(v) ? v : 0; } catch { results["propertyTax"] = 0; }
  try { const v = input.salesAmount * input.salesTaxRate / 100; results["salesTax"] = Number.isFinite(v) ? v : 0; } catch { results["salesTax"] = 0; }
  try { const v = input.incomeAmount * input.incomeTaxRate / 100; results["incomeTax"] = Number.isFinite(v) ? v : 0; } catch { results["incomeTax"] = 0; }
  try { const v = (results["propertyTax"] ?? 0) + (results["salesTax"] ?? 0) + (results["incomeTax"] ?? 0); results["totalLocalTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalLocalTax"] = 0; }
  return results;
}


export function calculateLocal_tax_calculator(input: Local_tax_calculatorInput): Local_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalLocalTax"] ?? 0;
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


export interface Local_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
