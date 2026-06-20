// Auto-generated from wedding-catering-calculator-schema.json
import * as z from 'zod';

export interface Wedding_catering_calculatorInput {
  guestCount: number;
  costPerPlate: number;
  drinksPerGuest: number;
  serviceChargePercent: number;
  dataConfidence?: number;
}

export const Wedding_catering_calculatorInputSchema = z.object({
  guestCount: z.number().default(100),
  costPerPlate: z.number().default(200),
  drinksPerGuest: z.number().default(50),
  serviceChargePercent: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wedding_catering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.guestCount * input.costPerPlate; results["totalFoodCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFoodCost"] = Number.NaN; }
  try { const v = input.guestCount * input.drinksPerGuest; results["totalDrinksCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDrinksCost"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["totalFoodCost"])) + (toNumericFormulaValue(results["totalDrinksCost"]))) * input.serviceChargePercent / 100; results["serviceCharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["serviceCharge"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalFoodCost"])) + (toNumericFormulaValue(results["totalDrinksCost"])) + (toNumericFormulaValue(results["serviceCharge"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / input.guestCount; results["costPerGuest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerGuest"] = Number.NaN; }
  return results;
}


export function calculateWedding_catering_calculator(input: Wedding_catering_calculatorInput): Wedding_catering_calculatorOutput {
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


export interface Wedding_catering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
