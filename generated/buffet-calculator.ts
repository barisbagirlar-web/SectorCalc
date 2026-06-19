// Auto-generated from buffet-calculator-schema.json
import * as z from 'zod';

export interface Buffet_calculatorInput {
  numberOfGuests: number;
  pricePerGuest: number;
  foodCostPerGuest: number;
  laborCost: number;
  overheadCost: number;
  wastePercentage: number;
  dataConfidence?: number;
}

export const Buffet_calculatorInputSchema = z.object({
  numberOfGuests: z.number().default(50),
  pricePerGuest: z.number().default(30),
  foodCostPerGuest: z.number().default(10),
  laborCost: z.number().default(500),
  overheadCost: z.number().default(200),
  wastePercentage: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Buffet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfGuests * input.pricePerGuest; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = input.numberOfGuests * input.foodCostPerGuest * (1 + input.wastePercentage / 100); results["totalFoodCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFoodCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalFoodCost"])) + input.laborCost + input.overheadCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) - (asFormulaNumber(results["totalCost"])); results["profit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profit"] = 0; }
  try { const v = ((asFormulaNumber(results["profit"])) / (asFormulaNumber(results["totalRevenue"]))) * 100; results["profitMargin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profitMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBuffet_calculator(input: Buffet_calculatorInput): Buffet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalRevenue"]));
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


export interface Buffet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
