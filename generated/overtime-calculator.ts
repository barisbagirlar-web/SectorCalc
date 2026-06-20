// Auto-generated from overtime-calculator-schema.json
import * as z from 'zod';

export interface Overtime_calculatorInput {
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  overtimeMultiplier: number;
  dataConfidence?: number;
}

export const Overtime_calculatorInputSchema = z.object({
  regularHours: z.number().default(40),
  overtimeHours: z.number().default(5),
  hourlyRate: z.number().default(20),
  overtimeMultiplier: z.number().default(1.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Overtime_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.regularHours * input.hourlyRate; results["regularPay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["regularPay"] = Number.NaN; }
  try { const v = input.overtimeHours * input.hourlyRate * input.overtimeMultiplier; results["overtimePay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overtimePay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["regularPay"])) + (toNumericFormulaValue(results["overtimePay"])); results["totalPay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPay"] = Number.NaN; }
  return results;
}


export function calculateOvertime_calculator(input: Overtime_calculatorInput): Overtime_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["regularPay"]);
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


export interface Overtime_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
