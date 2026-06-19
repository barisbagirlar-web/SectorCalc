// Auto-generated from local-tax-calculator-schema.json
import * as z from 'zod';

export interface Local_tax_calculatorInput {
  propertyValue: number;
  propertyTaxRate: number;
  salesAmount: number;
  salesTaxRate: number;
  incomeAmount: number;
  incomeTaxRate: number;
  dataConfidence?: number;
}

export const Local_tax_calculatorInputSchema = z.object({
  propertyValue: z.number().default(0),
  propertyTaxRate: z.number().default(0),
  salesAmount: z.number().default(0),
  salesTaxRate: z.number().default(0),
  incomeAmount: z.number().default(0),
  incomeTaxRate: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Local_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyValue * input.propertyTaxRate / 100; results["propertyTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["propertyTax"] = 0; }
  try { const v = input.salesAmount * input.salesTaxRate / 100; results["salesTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["salesTax"] = 0; }
  try { const v = input.incomeAmount * input.incomeTaxRate / 100; results["incomeTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["incomeTax"] = 0; }
  try { const v = (asFormulaNumber(results["propertyTax"])) + (asFormulaNumber(results["salesTax"])) + (asFormulaNumber(results["incomeTax"])); results["totalLocalTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalLocalTax"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLocal_tax_calculator(input: Local_tax_calculatorInput): Local_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLocalTax"]);
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


export interface Local_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
