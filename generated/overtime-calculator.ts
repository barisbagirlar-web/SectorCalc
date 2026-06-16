// Auto-generated from overtime-calculator-schema.json
import * as z from 'zod';

export interface Overtime_calculatorInput {
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  overtimeMultiplier: number;
}

export const Overtime_calculatorInputSchema = z.object({
  regularHours: z.number().default(40),
  overtimeHours: z.number().default(5),
  hourlyRate: z.number().default(20),
  overtimeMultiplier: z.number().default(1.5),
});

function evaluateAllFormulas(input: Overtime_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.regularHours * input.hourlyRate; results["regularPay"] = Number.isFinite(v) ? v : 0; } catch { results["regularPay"] = 0; }
  try { const v = input.overtimeHours * input.hourlyRate * input.overtimeMultiplier; results["overtimePay"] = Number.isFinite(v) ? v : 0; } catch { results["overtimePay"] = 0; }
  try { const v = (results["regularPay"] ?? 0) + (results["overtimePay"] ?? 0); results["totalPay"] = Number.isFinite(v) ? v : 0; } catch { results["totalPay"] = 0; }
  return results;
}


export function calculateOvertime_calculator(input: Overtime_calculatorInput): Overtime_calculatorOutput {
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


export interface Overtime_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
