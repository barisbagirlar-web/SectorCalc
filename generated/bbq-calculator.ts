// Auto-generated from bbq-calculator-schema.json
import * as z from 'zod';

export interface Bbq_calculatorInput {
  guests: number;
  meatPerPerson: number;
  sidesPerPerson: number;
  cookingLoss: number;
  butcherYield: number;
  dataConfidence?: number;
}

export const Bbq_calculatorInputSchema = z.object({
  guests: z.number().default(10),
  meatPerPerson: z.number().default(300),
  sidesPerPerson: z.number().default(200),
  cookingLoss: z.number().default(20),
  butcherYield: z.number().default(75),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bbq_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.guests * input.meatPerPerson / (input.butcherYield / 100) / (1 - input.cookingLoss / 100); results["totalRawMeatNeeded"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRawMeatNeeded"] = 0; }
  try { const v = input.guests * input.meatPerPerson; results["cookedMeatWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cookedMeatWeight"] = 0; }
  try { const v = input.guests * input.sidesPerPerson; results["totalSidesWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSidesWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBbq_calculator(input: Bbq_calculatorInput): Bbq_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRawMeatNeeded"]);
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


export interface Bbq_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
