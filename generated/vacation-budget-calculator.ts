// Auto-generated from vacation-budget-calculator-schema.json
import * as z from 'zod';

export interface Vacation_budget_calculatorInput {
  numberOfTravelers: number;
  numberOfNights: number;
  flightCostPerPerson: number;
  hotelCostPerNight: number;
  dailyFoodCostPerPerson: number;
  activitiesCostPerPerson: number;
  miscellaneousCost: number;
  dataConfidence?: number;
}

export const Vacation_budget_calculatorInputSchema = z.object({
  numberOfTravelers: z.number().default(1),
  numberOfNights: z.number().default(7),
  flightCostPerPerson: z.number().default(500),
  hotelCostPerNight: z.number().default(100),
  dailyFoodCostPerPerson: z.number().default(50),
  activitiesCostPerPerson: z.number().default(200),
  miscellaneousCost: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vacation_budget_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfTravelers * input.flightCostPerPerson; results["flightsTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["flightsTotal"] = 0; }
  try { const v = input.numberOfNights * input.hotelCostPerNight; results["hotelTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hotelTotal"] = 0; }
  try { const v = input.numberOfTravelers * input.dailyFoodCostPerPerson * input.numberOfNights; results["foodTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["foodTotal"] = 0; }
  try { const v = input.numberOfTravelers * input.activitiesCostPerPerson; results["activitiesTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["activitiesTotal"] = 0; }
  try { const v = input.miscellaneousCost; results["miscellaneousTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["miscellaneousTotal"] = 0; }
  try { const v = (asFormulaNumber(results["flightsTotal"])) + (asFormulaNumber(results["hotelTotal"])) + (asFormulaNumber(results["foodTotal"])) + (asFormulaNumber(results["activitiesTotal"])) + (asFormulaNumber(results["miscellaneousTotal"])); results["totalBudget"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBudget"] = 0; }
  try { const v = (asFormulaNumber(results["totalBudget"])) / (input.numberOfTravelers * input.numberOfNights); results["dailyPerPerson"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dailyPerPerson"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVacation_budget_calculator(input: Vacation_budget_calculatorInput): Vacation_budget_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalBudget"]);
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


export interface Vacation_budget_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
