// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Dividend_tax_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.grossDividend - input.taxFreeAllowance; results["taxableDividend"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxableDividend"] = 0; }
  try { const v = (asFormulaNumber(results["taxableDividend"])) * input.taxRate / 100; results["basicTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["basicTax"] = 0; }
  try { const v = (asFormulaNumber(results["basicTax"])) * input.surchargeRate / 100; results["surcharge"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["surcharge"] = 0; }
  try { const v = ((asFormulaNumber(results["basicTax"])) + (asFormulaNumber(results["surcharge"]))) * input.cessRate / 100; results["cess"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cess"] = 0; }
  try { const v = (asFormulaNumber(results["basicTax"])) + (asFormulaNumber(results["surcharge"])) + (asFormulaNumber(results["cess"])); results["totalTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTax"] = 0; }
  try { const v = input.grossDividend - (asFormulaNumber(results["totalTax"])); results["netDividend"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netDividend"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDividend_tax_calculator(input: Dividend_tax_calculatorInput): Dividend_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTax"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
