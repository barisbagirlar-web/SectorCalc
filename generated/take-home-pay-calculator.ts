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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Take_home_pay_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSalary * (input.incomeTaxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.grossSalary * (input.socialSecurityRate / 100); results["socialSecurityAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["socialSecurityAmount"] = 0; }
  try { const v = input.otherDeductions; results["otherDeductionsAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["otherDeductionsAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxAmount"])) + (asFormulaNumber(results["socialSecurityAmount"])) + input.otherDeductions; results["totalDeductions"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDeductions"] = 0; }
  try { const v = input.grossSalary - (asFormulaNumber(results["totalDeductions"])); results["netPay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netPay"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
