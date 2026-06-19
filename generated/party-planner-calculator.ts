// Auto-generated from party-planner-calculator-schema.json
import * as z from 'zod';

export interface Party_planner_calculatorInput {
  guests: number;
  foodCostPerPerson: number;
  drinkCostPerPerson: number;
  venueCost: number;
  decorationsCost: number;
  entertainmentCost: number;
  miscCost: number;
  dataConfidence?: number;
}

export const Party_planner_calculatorInputSchema = z.object({
  guests: z.number().default(50),
  foodCostPerPerson: z.number().default(20),
  drinkCostPerPerson: z.number().default(10),
  venueCost: z.number().default(500),
  decorationsCost: z.number().default(200),
  entertainmentCost: z.number().default(300),
  miscCost: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Party_planner_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.foodCostPerPerson * input.guests; results["totalFoodCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFoodCost"] = 0; }
  try { const v = input.drinkCostPerPerson * input.guests; results["totalDrinkCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDrinkCost"] = 0; }
  try { const v = input.venueCost + input.decorationsCost + input.entertainmentCost + input.miscCost; results["fixedCosts"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fixedCosts"] = 0; }
  try { const v = input.foodCostPerPerson * input.guests + input.drinkCostPerPerson * input.guests + input.venueCost + input.decorationsCost + input.entertainmentCost + input.miscCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (input.foodCostPerPerson * input.guests + input.drinkCostPerPerson * input.guests + input.venueCost + input.decorationsCost + input.entertainmentCost + input.miscCost) / input.guests; results["costPerGuest"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["costPerGuest"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateParty_planner_calculator(input: Party_planner_calculatorInput): Party_planner_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCost"]));
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


export interface Party_planner_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
