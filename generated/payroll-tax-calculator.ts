// Auto-generated from payroll-tax-calculator-schema.json
import * as z from 'zod';

export interface Payroll_tax_calculatorInput {
  grossSalary: number;
  taxRate1: number;
  taxRate2: number;
  taxRate3: number;
  bracket1Limit: number;
  bracket2Limit: number;
}

export const Payroll_tax_calculatorInputSchema = z.object({
  grossSalary: z.number().default(50000),
  taxRate1: z.number().default(10),
  taxRate2: z.number().default(20),
  taxRate3: z.number().default(30),
  bracket1Limit: z.number().default(20000),
  bracket2Limit: z.number().default(50000),
});

function evaluateAllFormulas(input: Payroll_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSalary <= input.bracket1Limit ? input.grossSalary * input.taxRate1 / 100 : input.bracket1Limit * input.taxRate1 / 100; results["bracket1Tax"] = Number.isFinite(v) ? v : 0; } catch { results["bracket1Tax"] = 0; }
  try { const v = input.grossSalary <= input.bracket1Limit ? 0 : input.grossSalary <= input.bracket2Limit ? (input.grossSalary - input.bracket1Limit) * input.taxRate2 / 100 : (input.bracket2Limit - input.bracket1Limit) * input.taxRate2 / 100; results["bracket2Tax"] = Number.isFinite(v) ? v : 0; } catch { results["bracket2Tax"] = 0; }
  try { const v = input.grossSalary <= input.bracket2Limit ? 0 : (input.grossSalary - input.bracket2Limit) * input.taxRate3 / 100; results["bracket3Tax"] = Number.isFinite(v) ? v : 0; } catch { results["bracket3Tax"] = 0; }
  try { const v = (results["bracket1Tax"] ?? 0) + (results["bracket2Tax"] ?? 0) + (results["bracket3Tax"] ?? 0); results["totalTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalTax"] = 0; }
  try { const v = input.grossSalary - (results["totalTax"] ?? 0); results["netSalary"] = Number.isFinite(v) ? v : 0; } catch { results["netSalary"] = 0; }
  return results;
}


export function calculatePayroll_tax_calculator(input: Payroll_tax_calculatorInput): Payroll_tax_calculatorOutput {
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


export interface Payroll_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
