// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Overtime_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.regularHours * input.hourlyRate; results["regularPay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["regularPay"] = 0; }
  try { const v = input.overtimeHours * input.hourlyRate * input.overtimeMultiplier; results["overtimePay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["overtimePay"] = 0; }
  try { const v = (asFormulaNumber(results["regularPay"])) + (asFormulaNumber(results["overtimePay"])); results["totalPay"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalPay"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateOvertime_calculator(input: Overtime_calculatorInput): Overtime_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["regularPay"]);
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


export interface Overtime_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
