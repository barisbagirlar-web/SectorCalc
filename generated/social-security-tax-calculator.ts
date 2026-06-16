// Auto-generated from social-security-tax-calculator-schema.json
import * as z from 'zod';

export interface Social_security_tax_calculatorInput {
  grossPay: number;
  employeeRate: number;
  employerRate: number;
  annualCeiling: number;
  payPeriods: number;
}

export const Social_security_tax_calculatorInputSchema = z.object({
  grossPay: z.number().default(0),
  employeeRate: z.number().default(6.2),
  employerRate: z.number().default(6.2),
  annualCeiling: z.number().default(160200),
  payPeriods: z.number().default(12),
});

function evaluateAllFormulas(input: Social_security_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualCeiling / input.payPeriods; results["perPeriodCeiling"] = Number.isFinite(v) ? v : 0; } catch { results["perPeriodCeiling"] = 0; }
  try { const v = Math.min(input.grossPay, (results["perPeriodCeiling"] ?? 0)); results["taxableAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (input.employeeRate / 100) * (results["taxableAmount"] ?? 0); results["employeeSS"] = Number.isFinite(v) ? v : 0; } catch { results["employeeSS"] = 0; }
  try { const v = (input.employerRate / 100) * (results["taxableAmount"] ?? 0); results["employerSS"] = Number.isFinite(v) ? v : 0; } catch { results["employerSS"] = 0; }
  try { const v = (results["employeeSS"] ?? 0) + (results["employerSS"] ?? 0); results["totalSS"] = Number.isFinite(v) ? v : 0; } catch { results["totalSS"] = 0; }
  return results;
}


export function calculateSocial_security_tax_calculator(input: Social_security_tax_calculatorInput): Social_security_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSS"] ?? 0;
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


export interface Social_security_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
