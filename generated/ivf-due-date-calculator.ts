// Auto-generated from ivf-due-date-calculator-schema.json
import * as z from 'zod';

export interface Ivf_due_date_calculatorInput {
  transferYear: number;
  transferMonth: number;
  transferDay: number;
  embryoAge: number;
  dataConfidence?: number;
}

export const Ivf_due_date_calculatorInputSchema = z.object({
  transferYear: z.number().default(2024),
  transferMonth: z.number().default(1),
  transferDay: z.number().default(1),
  embryoAge: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ivf_due_date_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 266 - input.embryoAge; results["daysToAdd"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["daysToAdd"] = 0; }
  try { const v = 266 - input.embryoAge; results["daysToAdd_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["daysToAdd_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateIvf_due_date_calculator(input: Ivf_due_date_calculatorInput): Ivf_due_date_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["daysToAdd_aux"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Ivf_due_date_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
