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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Buffet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfGuests * input.pricePerGuest; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRevenue"] = Number.NaN; }
  try { const v = input.numberOfGuests * input.foodCostPerGuest * (1 + input.wastePercentage / 100); results["totalFoodCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFoodCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalFoodCost"])) + input.laborCost + input.overheadCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalRevenue"])) - (toNumericFormulaValue(results["totalCost"])); results["profit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profit"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["profit"])) / (toNumericFormulaValue(results["totalRevenue"]))) * 100; results["profitMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["profitMargin"] = Number.NaN; }
  return results;
}


export function calculateBuffet_calculator(input: Buffet_calculatorInput): Buffet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalRevenue"]);
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


export interface Buffet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
