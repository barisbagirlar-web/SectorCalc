// @ts-nocheck
// Auto-generated from eoq-calculator-schema.json
import * as z from 'zod';

export interface Eoq_calculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  unitCost: number;
  leadTimeDays: number;
  workingDaysPerYear: number;
}

export const Eoq_calculatorInputSchema = z.object({
  annualDemand: z.number().default(10000),
  orderingCost: z.number().default(100),
  holdingCost: z.number().default(5),
  unitCost: z.number().default(0),
  leadTimeDays: z.number().default(5),
  workingDaysPerYear: z.number().default(250),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Eoq_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.annualDemand / input.workingDaysPerYear) * input.leadTimeDays; results["reorderPoint"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["reorderPoint"] = 0; }
  try { const v = (input.annualDemand / input.workingDaysPerYear) * input.leadTimeDays; results["reorderPoint_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["reorderPoint_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEoq_calculator(input: Eoq_calculatorInput): Eoq_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["reorderPoint_aux"]);
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


export interface Eoq_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
