// Auto-generated from rir-calculator-schema.json
import * as z from 'zod';

export interface Rir_calculatorInput {
  recordableCases: number;
  employeeCount: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  dataConfidence?: number;
}

export const Rir_calculatorInputSchema = z.object({
  recordableCases: z.number().default(5),
  employeeCount: z.number().default(100),
  hoursPerWeek: z.number().default(40),
  weeksPerYear: z.number().default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Rir_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.recordableCases * 200000) / (input.employeeCount * input.hoursPerWeek * input.weeksPerYear); results["recordableIncidentRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["recordableIncidentRate"] = Number.NaN; }
  try { const v = input.employeeCount * input.hoursPerWeek * input.weeksPerYear; results["totalHoursWorked"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalHoursWorked"] = Number.NaN; }
  try { const v = input.recordableCases; results["numberOfRecordableCases"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["numberOfRecordableCases"] = Number.NaN; }
  return results;
}


export function calculateRir_calculator(input: Rir_calculatorInput): Rir_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["recordableIncidentRate"]);
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


export interface Rir_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
