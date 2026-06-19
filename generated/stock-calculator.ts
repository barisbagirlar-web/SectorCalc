// Auto-generated from stock-calculator-schema.json
import * as z from 'zod';

export interface Stock_calculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCost: number;
  unitCost: number;
  leadTimeDays: number;
  workingDaysPerYear: number;
  dataConfidence?: number;
}

export const Stock_calculatorInputSchema = z.object({
  annualDemand: z.number().default(1000),
  orderingCost: z.number().default(50),
  holdingCost: z.number().default(2),
  unitCost: z.number().default(0),
  leadTimeDays: z.number().default(7),
  workingDaysPerYear: z.number().default(250),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Stock_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualDemand / input.workingDaysPerYear; results["dailyDemand"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyDemand"] = 0; }
  try { const v = (asFormulaNumber(results["dailyDemand"])) * input.leadTimeDays; results["reorderPoint"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["reorderPoint"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateStock_calculator(input: Stock_calculatorInput): Stock_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["reorderPoint"]));
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


export interface Stock_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
