// Auto-generated from eoq-calculator-schema.json
import * as z from 'zod';

export interface Eoq_calculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  unitCost: number;
  leadTimeDays: number;
  workingDaysPerYear: number;
  dataConfidence?: number;
}

export const Eoq_calculatorInputSchema = z.object({
  annualDemand: z.number().default(10000),
  orderingCost: z.number().default(100),
  holdingCost: z.number().default(5),
  unitCost: z.number().default(0),
  leadTimeDays: z.number().default(5),
  workingDaysPerYear: z.number().default(250),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Eoq_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.annualDemand / input.workingDaysPerYear) * input.leadTimeDays; results["reorderPoint"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reorderPoint"] = 0; }
  try { const v = (input.annualDemand / input.workingDaysPerYear) * input.leadTimeDays; results["reorderPoint_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reorderPoint_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEoq_calculator(input: Eoq_calculatorInput): Eoq_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["reorderPoint_aux"]);
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


export interface Eoq_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
