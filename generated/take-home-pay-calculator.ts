// Auto-generated from take-home-pay-calculator-schema.json
import * as z from 'zod';

export interface Take_home_pay_calculatorInput {
  grossSalary: number;
  incomeTaxRate: number;
  socialSecurityRate: number;
  otherDeductions: number;
}

export const Take_home_pay_calculatorInputSchema = z.object({
  grossSalary: z.number().default(5000),
  incomeTaxRate: z.number().default(20),
  socialSecurityRate: z.number().default(15),
  otherDeductions: z.number().default(200),
});

function evaluateAllFormulas(input: Take_home_pay_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossSalary * (input.incomeTaxRate / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = input.grossSalary * (input.socialSecurityRate / 100); results["socialSecurityAmount"] = Number.isFinite(v) ? v : 0; } catch { results["socialSecurityAmount"] = 0; }
  try { const v = input.otherDeductions; results["otherDeductionsAmount"] = Number.isFinite(v) ? v : 0; } catch { results["otherDeductionsAmount"] = 0; }
  try { const v = (results["taxAmount"] ?? 0) + (results["socialSecurityAmount"] ?? 0) + input.otherDeductions; results["totalDeductions"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeductions"] = 0; }
  try { const v = input.grossSalary - (results["totalDeductions"] ?? 0); results["netPay"] = Number.isFinite(v) ? v : 0; } catch { results["netPay"] = 0; }
  return results;
}


export function calculateTake_home_pay_calculator(input: Take_home_pay_calculatorInput): Take_home_pay_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netPay"] ?? 0;
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


export interface Take_home_pay_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
