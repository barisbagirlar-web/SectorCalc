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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Hotel_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nights * input.roomRate; results["roomTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roomTotal"] = Number.NaN; }
  try { const v = input.nights * input.guests * input.mealsPerDay * input.mealCost; results["mealTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mealTotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["roomTotal"])) + (toNumericFormulaValue(results["mealTotal"])) + input.transportCost + input.otherCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / input.nights; results["averagePerNight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averagePerNight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / input.nights / input.guests; results["averagePerGuestPerNight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["averagePerGuestPerNight"] = Number.NaN; }
  return results;
}


export function calculateHotel_cost_calculator(input: Hotel_cost_calculatorInput): Hotel_cost_calculatorOutput {
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


export interface Hotel_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
