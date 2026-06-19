// Auto-generated from payroll-tax-calculator-schema.json
import * as z from 'zod';

export interface Payroll_tax_calculatorInput {
  grossSalary: number;
  taxRate1: number;
  taxRate2: number;
  taxRate3: number;
  bracket1Limit: number;
  bracket2Limit: number;
  dataConfidence?: number;
}

export const Payroll_tax_calculatorInputSchema = z.object({
  grossSalary: z.number().default(50000),
  taxRate1: z.number().default(10),
  taxRate2: z.number().default(20),
  taxRate3: z.number().default(30),
  bracket1Limit: z.number().default(20000),
  bracket2Limit: z.number().default(50000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Payroll_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSalary <= input.bracket1Limit ? input.grossSalary * input.taxRate1 / 100 : input.bracket1Limit * input.taxRate1 / 100; results["bracket1Tax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bracket1Tax"] = 0; }
  try { const v = input.grossSalary <= input.bracket1Limit ? 0 : input.grossSalary <= input.bracket2Limit ? (input.grossSalary - input.bracket1Limit) * input.taxRate2 / 100 : (input.bracket2Limit - input.bracket1Limit) * input.taxRate2 / 100; results["bracket2Tax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bracket2Tax"] = 0; }
  try { const v = input.grossSalary <= input.bracket2Limit ? 0 : (input.grossSalary - input.bracket2Limit) * input.taxRate3 / 100; results["bracket3Tax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bracket3Tax"] = 0; }
  try { const v = (asFormulaNumber(results["bracket1Tax"])) + (asFormulaNumber(results["bracket2Tax"])) + (asFormulaNumber(results["bracket3Tax"])); results["totalTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalTax"] = 0; }
  try { const v = input.grossSalary - (asFormulaNumber(results["totalTax"])); results["netSalary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netSalary"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePayroll_tax_calculator(input: Payroll_tax_calculatorInput): Payroll_tax_calculatorOutput {
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


export interface Payroll_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
