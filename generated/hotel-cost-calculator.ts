// Auto-generated from hotel-cost-calculator-schema.json
import * as z from 'zod';

export interface Hotel_cost_calculatorInput {
  nights: number;
  roomRate: number;
  guests: number;
  mealsPerDay: number;
  mealCost: number;
  transportCost: number;
  otherCost: number;
  dataConfidence?: number;
}

export const Hotel_cost_calculatorInputSchema = z.object({
  nights: z.number().default(1),
  roomRate: z.number().default(100),
  guests: z.number().default(1),
  mealsPerDay: z.number().default(3),
  mealCost: z.number().default(15),
  transportCost: z.number().default(50),
  otherCost: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hotel_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nights * input.roomRate; results["roomTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roomTotal"] = 0; }
  try { const v = input.nights * input.guests * input.mealsPerDay * input.mealCost; results["mealTotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mealTotal"] = 0; }
  try { const v = (asFormulaNumber(results["roomTotal"])) + (asFormulaNumber(results["mealTotal"])) + input.transportCost + input.otherCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.nights; results["averagePerNight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averagePerNight"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) / input.nights / input.guests; results["averagePerGuestPerNight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["averagePerGuestPerNight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHotel_cost_calculator(input: Hotel_cost_calculatorInput): Hotel_cost_calculatorOutput {
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


export interface Hotel_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
