// Auto-generated from shift-work-calculator-schema.json
import * as z from 'zod';

export interface Shift_work_calculatorInput {
  hoursWorked: number;
  hourlyRate: number;
  shiftMultiplier: number;
  overtimeHours: number;
  overtimeMultiplier: number;
}

export const Shift_work_calculatorInputSchema = z.object({
  hoursWorked: z.number().default(40),
  hourlyRate: z.number().default(20),
  shiftMultiplier: z.number().default(1.2),
  overtimeHours: z.number().default(0),
  overtimeMultiplier: z.number().default(1.5),
});

function evaluateAllFormulas(input: Shift_work_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hoursWorked * input.hourlyRate * input.shiftMultiplier; results["basePay"] = Number.isFinite(v) ? v : 0; } catch { results["basePay"] = 0; }
  try { const v = input.overtimeHours * input.hourlyRate * input.overtimeMultiplier; results["overtimePay"] = Number.isFinite(v) ? v : 0; } catch { results["overtimePay"] = 0; }
  try { const v = (results["basePay"] ?? 0) + (results["overtimePay"] ?? 0); results["totalPay"] = Number.isFinite(v) ? v : 0; } catch { results["totalPay"] = 0; }
  return results;
}


export function calculateShift_work_calculator(input: Shift_work_calculatorInput): Shift_work_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPay"] ?? 0;
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


export interface Shift_work_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
