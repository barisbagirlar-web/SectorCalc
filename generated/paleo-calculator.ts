// Auto-generated from paleo-calculator-schema.json
import * as z from 'zod';

export interface Paleo_calculatorInput {
  meatCost: number;
  vegCost: number;
  fruitCost: number;
  nutCost: number;
  numberOfPeople: number;
  numberOfDays: number;
  dataConfidence?: number;
}

export const Paleo_calculatorInputSchema = z.object({
  meatCost: z.number().default(30),
  vegCost: z.number().default(10),
  fruitCost: z.number().default(5),
  nutCost: z.number().default(5),
  numberOfPeople: z.number().default(1),
  numberOfDays: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Paleo_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.meatCost + input.vegCost + input.fruitCost + input.nutCost; results["dailyPerPerson"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyPerPerson"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyPerPerson"])) * input.numberOfPeople; results["totalPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPerDay"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPerDay"])) * input.numberOfDays; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculatePaleo_calculator(input: Paleo_calculatorInput): Paleo_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Paleo_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
