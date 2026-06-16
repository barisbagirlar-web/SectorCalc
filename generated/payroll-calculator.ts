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

function evaluateAllFormulas(input: Payroll_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hoursWorked * input.hourlyRate + input.overtimeHours * input.hourlyRate * input.overtimeMultiplier; results["grossPay"] = Number.isFinite(v) ? v : 0; } catch { results["grossPay"] = 0; }
  try { const v = (results["grossPay"] ?? 0) * input.taxRate / 100; results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["grossPay"] ?? 0) * input.insuranceRate / 100; results["insuranceAmount"] = Number.isFinite(v) ? v : 0; } catch { results["insuranceAmount"] = 0; }
  try { const v = (results["taxAmount"] ?? 0) + (results["insuranceAmount"] ?? 0) + input.otherDeductions; results["totalDeductions"] = Number.isFinite(v) ? v : 0; } catch { results["totalDeductions"] = 0; }
  try { const v = (results["grossPay"] ?? 0) - (results["totalDeductions"] ?? 0); results["netPay"] = Number.isFinite(v) ? v : 0; } catch { results["netPay"] = 0; }
  return results;
}


export function calculatePayroll_calculator(input: Payroll_calculatorInput): Payroll_calculatorOutput {
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


export interface Payroll_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
