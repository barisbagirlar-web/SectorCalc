// Auto-generated from dividend-tax-calculator-schema.json
import * as z from 'zod';

export interface Dividend_tax_calculatorInput {
  grossDividend: number;
  taxFreeAllowance: number;
  taxRate: number;
  surchargeRate: number;
  cessRate: number;
}

export const Dividend_tax_calculatorInputSchema = z.object({
  grossDividend: z.number().default(10000),
  taxFreeAllowance: z.number().default(2000),
  taxRate: z.number().default(10),
  surchargeRate: z.number().default(0),
  cessRate: z.number().default(4),
});

function evaluateAllFormulas(input: Dividend_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossDividend - input.taxFreeAllowance; results["taxableDividend"] = Number.isFinite(v) ? v : 0; } catch { results["taxableDividend"] = 0; }
  try { const v = (results["taxableDividend"] ?? 0) * input.taxRate / 100; results["basicTax"] = Number.isFinite(v) ? v : 0; } catch { results["basicTax"] = 0; }
  try { const v = (results["basicTax"] ?? 0) * input.surchargeRate / 100; results["surcharge"] = Number.isFinite(v) ? v : 0; } catch { results["surcharge"] = 0; }
  try { const v = ((results["basicTax"] ?? 0) + (results["surcharge"] ?? 0)) * input.cessRate / 100; results["cess"] = Number.isFinite(v) ? v : 0; } catch { results["cess"] = 0; }
  try { const v = (results["basicTax"] ?? 0) + (results["surcharge"] ?? 0) + (results["cess"] ?? 0); results["totalTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalTax"] = 0; }
  try { const v = input.grossDividend - (results["totalTax"] ?? 0); results["netDividend"] = Number.isFinite(v) ? v : 0; } catch { results["netDividend"] = 0; }
  return results;
}


export function calculateDividend_tax_calculator(input: Dividend_tax_calculatorInput): Dividend_tax_calculatorOutput {
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


export interface Dividend_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
