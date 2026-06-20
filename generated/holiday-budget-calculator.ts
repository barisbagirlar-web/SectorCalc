// Auto-generated from holiday-budget-calculator-schema.json
import * as z from 'zod';

export interface Holiday_budget_calculatorInput {
  travelers: number;
  days: number;
  flightCostPerPerson: number;
  hotelCostPerNight: number;
  dailyFoodBudgetPerPerson: number;
  dailyActivityBudgetPerPerson: number;
  dataConfidence?: number;
}

export const Holiday_budget_calculatorInputSchema = z.object({
  travelers: z.number().default(2),
  days: z.number().default(7),
  flightCostPerPerson: z.number().default(500),
  hotelCostPerNight: z.number().default(150),
  dailyFoodBudgetPerPerson: z.number().default(50),
  dailyActivityBudgetPerPerson: z.number().default(30),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Holiday_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flightCostPerPerson * input.travelers; results["transportTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["transportTotal"] = Number.NaN; }
  try { const v = input.hotelCostPerNight * input.days; results["accommodationTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["accommodationTotal"] = Number.NaN; }
  try { const v = input.dailyFoodBudgetPerPerson * input.travelers * input.days; results["foodTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["foodTotal"] = Number.NaN; }
  try { const v = input.dailyActivityBudgetPerPerson * input.travelers * input.days; results["activitiesTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["activitiesTotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["transportTotal"])) + (toNumericFormulaValue(results["accommodationTotal"])) + (toNumericFormulaValue(results["foodTotal"])) + (toNumericFormulaValue(results["activitiesTotal"])); results["grandTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grandTotal"] = Number.NaN; }
  return results;
}


export function calculateHoliday_budget_calculator(input: Holiday_budget_calculatorInput): Holiday_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grandTotal"]);
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


export interface Holiday_budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
