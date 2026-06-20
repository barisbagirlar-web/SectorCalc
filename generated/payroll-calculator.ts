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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Payroll_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hoursWorked * input.hourlyRate + input.overtimeHours * input.hourlyRate * input.overtimeMultiplier; results["grossPay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossPay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossPay"])) * input.taxRate / 100; results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossPay"])) * input.insuranceRate / 100; results["insuranceAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["insuranceAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxAmount"])) + (toNumericFormulaValue(results["insuranceAmount"])) + input.otherDeductions; results["totalDeductions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDeductions"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossPay"])) - (toNumericFormulaValue(results["totalDeductions"])); results["netPay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netPay"] = Number.NaN; }
  return results;
}


export function calculatePayroll_calculator(input: Payroll_calculatorInput): Payroll_calculatorOutput {
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


export interface Payroll_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
