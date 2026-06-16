// Auto-generated from pay-period-calculator-schema.json
import * as z from 'zod';

export interface Pay_period_calculatorInput {
  annualSalary: number;
  payPeriodsPerYear: number;
  overtimeHours: number;
  overtimeRateMultiplier: number;
  hoursPerPeriod: number;
  deductions: number;
  taxRate: number;
  otherWithholdings: number;
}

export const Pay_period_calculatorInputSchema = z.object({
  annualSalary: z.number().default(30000),
  payPeriodsPerYear: z.number().default(12),
  overtimeHours: z.number().default(0),
  overtimeRateMultiplier: z.number().default(1.5),
  hoursPerPeriod: z.number().default(160),
  deductions: z.number().default(0),
  taxRate: z.number().default(20),
  otherWithholdings: z.number().default(0),
});

function evaluateAllFormulas(input: Pay_period_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualSalary / input.payPeriodsPerYear; results["regularPay"] = Number.isFinite(v) ? v : 0; } catch { results["regularPay"] = 0; }
  try { const v = (results["regularPay"] ?? 0) / input.hoursPerPeriod; results["hourlyRate"] = Number.isFinite(v) ? v : 0; } catch { results["hourlyRate"] = 0; }
  try { const v = input.overtimeHours * (results["hourlyRate"] ?? 0) * input.overtimeRateMultiplier; results["overtimePay"] = Number.isFinite(v) ? v : 0; } catch { results["overtimePay"] = 0; }
  try { const v = (results["regularPay"] ?? 0) + (results["overtimePay"] ?? 0); results["grossPayPerPeriod"] = Number.isFinite(v) ? v : 0; } catch { results["grossPayPerPeriod"] = 0; }
  try { const v = (results["grossPayPerPeriod"] ?? 0) - input.deductions; results["taxableIncome"] = Number.isFinite(v) ? v : 0; } catch { results["taxableIncome"] = 0; }
  try { const v = (results["taxableIncome"] ?? 0) * (input.taxRate / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["taxableIncome"] ?? 0) - (results["taxAmount"] ?? 0) - input.otherWithholdings; results["netPayPerPeriod"] = Number.isFinite(v) ? v : 0; } catch { results["netPayPerPeriod"] = 0; }
  return results;
}


export function calculatePay_period_calculator(input: Pay_period_calculatorInput): Pay_period_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netPayPerPeriod"] ?? 0;
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


export interface Pay_period_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
