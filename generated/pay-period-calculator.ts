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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pay_period_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualSalary / input.payPeriodsPerYear; results["regularPay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["regularPay"] = 0; }
  try { const v = (asFormulaNumber(results["regularPay"])) / input.hoursPerPeriod; results["hourlyRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hourlyRate"] = 0; }
  try { const v = input.overtimeHours * (asFormulaNumber(results["hourlyRate"])) * input.overtimeRateMultiplier; results["overtimePay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overtimePay"] = 0; }
  try { const v = (asFormulaNumber(results["regularPay"])) + (asFormulaNumber(results["overtimePay"])); results["grossPayPerPeriod"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossPayPerPeriod"] = 0; }
  try { const v = (asFormulaNumber(results["grossPayPerPeriod"])) - input.deductions; results["taxableIncome"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxableIncome"] = 0; }
  try { const v = (asFormulaNumber(results["taxableIncome"])) * (input.taxRate / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxableIncome"])) - (asFormulaNumber(results["taxAmount"])) - input.otherWithholdings; results["netPayPerPeriod"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netPayPerPeriod"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePay_period_calculator(input: Pay_period_calculatorInput): Pay_period_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netPayPerPeriod"]));
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


export interface Pay_period_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
