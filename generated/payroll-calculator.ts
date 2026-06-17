// @ts-nocheck
// Auto-generated from payroll-calculator-schema.json
import * as z from 'zod';

export interface Payroll_calculatorInput {
  hoursWorked: number;
  hourlyRate: number;
  overtimeHours: number;
  overtimeMultiplier: number;
  taxRate: number;
  insuranceRate: number;
  otherDeductions: number;
}

export const Payroll_calculatorInputSchema = z.object({
  hoursWorked: z.number().default(160),
  hourlyRate: z.number().default(20),
  overtimeHours: z.number().default(0),
  overtimeMultiplier: z.number().default(1.5),
  taxRate: z.number().default(20),
  insuranceRate: z.number().default(15),
  otherDeductions: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Payroll_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.hoursWorked * input.hourlyRate + input.overtimeHours * input.hourlyRate * input.overtimeMultiplier; results["grossPay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossPay"] = 0; }
  try { const v = (asFormulaNumber(results["grossPay"])) * input.taxRate / 100; results["taxAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["grossPay"])) * input.insuranceRate / 100; results["insuranceAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["insuranceAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxAmount"])) + (asFormulaNumber(results["insuranceAmount"])) + input.otherDeductions; results["totalDeductions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDeductions"] = 0; }
  try { const v = (asFormulaNumber(results["grossPay"])) - (asFormulaNumber(results["totalDeductions"])); results["netPay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netPay"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePayroll_calculator(input: Payroll_calculatorInput): Payroll_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netPay"]);
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


export interface Payroll_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
