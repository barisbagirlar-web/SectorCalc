// @ts-nocheck
// Auto-generated from rir-calculator-schema.json
import * as z from 'zod';

export interface Rir_calculatorInput {
  recordableCases: number;
  employeeCount: number;
  hoursPerWeek: number;
  weeksPerYear: number;
}

export const Rir_calculatorInputSchema = z.object({
  recordableCases: z.number().default(5),
  employeeCount: z.number().default(100),
  hoursPerWeek: z.number().default(40),
  weeksPerYear: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rir_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.recordableCases * 200000) / (input.employeeCount * input.hoursPerWeek * input.weeksPerYear); results["recordableIncidentRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["recordableIncidentRate"] = 0; }
  try { const v = input.employeeCount * input.hoursPerWeek * input.weeksPerYear; results["totalHoursWorked"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalHoursWorked"] = 0; }
  try { const v = input.recordableCases; results["numberOfRecordableCases"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["numberOfRecordableCases"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRir_calculator(input: Rir_calculatorInput): Rir_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recordableIncidentRate"]);
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


export interface Rir_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
