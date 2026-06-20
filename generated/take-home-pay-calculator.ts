// Auto-generated from take-home-pay-calculator-schema.json
import * as z from 'zod';

export interface Take_home_pay_calculatorInput {
  grossSalary: number;
  incomeTaxRate: number;
  socialSecurityRate: number;
  otherDeductions: number;
  dataConfidence?: number;
}

export const Take_home_pay_calculatorInputSchema = z.object({
  grossSalary: z.number().default(5000),
  incomeTaxRate: z.number().default(20),
  socialSecurityRate: z.number().default(15),
  otherDeductions: z.number().default(200),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Take_home_pay_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSalary * (input.incomeTaxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = input.grossSalary * (input.socialSecurityRate / 100); results["socialSecurityAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["socialSecurityAmount"] = Number.NaN; }
  try { const v = input.otherDeductions; results["otherDeductionsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["otherDeductionsAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxAmount"])) + (toNumericFormulaValue(results["socialSecurityAmount"])) + input.otherDeductions; results["totalDeductions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDeductions"] = Number.NaN; }
  try { const v = input.grossSalary - (toNumericFormulaValue(results["totalDeductions"])); results["netPay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netPay"] = Number.NaN; }
  return results;
}


export function calculateTake_home_pay_calculator(input: Take_home_pay_calculatorInput): Take_home_pay_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netPay"]);
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


export interface Take_home_pay_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
