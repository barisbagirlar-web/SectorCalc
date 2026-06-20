// Auto-generated from dividend-tax-calculator-schema.json
import * as z from 'zod';

export interface Dividend_tax_calculatorInput {
  grossDividend: number;
  taxFreeAllowance: number;
  taxRate: number;
  surchargeRate: number;
  cessRate: number;
  dataConfidence?: number;
}

export const Dividend_tax_calculatorInputSchema = z.object({
  grossDividend: z.number().default(10000),
  taxFreeAllowance: z.number().default(2000),
  taxRate: z.number().default(10),
  surchargeRate: z.number().default(0),
  cessRate: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dividend_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossDividend - input.taxFreeAllowance; results["taxableDividend"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxableDividend"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableDividend"])) * input.taxRate / 100; results["basicTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["basicTax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["basicTax"])) * input.surchargeRate / 100; results["surcharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["surcharge"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["basicTax"])) + (toNumericFormulaValue(results["surcharge"]))) * input.cessRate / 100; results["cess"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cess"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["basicTax"])) + (toNumericFormulaValue(results["surcharge"])) + (toNumericFormulaValue(results["cess"])); results["totalTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTax"] = Number.NaN; }
  try { const v = input.grossDividend - (toNumericFormulaValue(results["totalTax"])); results["netDividend"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netDividend"] = Number.NaN; }
  return results;
}


export function calculateDividend_tax_calculator(input: Dividend_tax_calculatorInput): Dividend_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTax"]);
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


export interface Dividend_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
