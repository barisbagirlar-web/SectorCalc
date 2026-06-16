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

function evaluateAllFormulas(input: Rir_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.recordableCases * 200000) / (input.employeeCount * input.hoursPerWeek * input.weeksPerYear); results["recordableIncidentRate"] = Number.isFinite(v) ? v : 0; } catch { results["recordableIncidentRate"] = 0; }
  try { const v = input.employeeCount * input.hoursPerWeek * input.weeksPerYear; results["totalHoursWorked"] = Number.isFinite(v) ? v : 0; } catch { results["totalHoursWorked"] = 0; }
  try { const v = input.recordableCases; results["numberOfRecordableCases"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfRecordableCases"] = 0; }
  return results;
}


export function calculateRir_calculator(input: Rir_calculatorInput): Rir_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["recordableIncidentRate"] ?? 0;
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


export interface Rir_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
