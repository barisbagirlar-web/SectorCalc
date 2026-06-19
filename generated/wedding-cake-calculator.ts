// Auto-generated from wedding-cake-calculator-schema.json
import * as z from 'zod';

export interface Wedding_cake_calculatorInput {
  guestCount: number;
  portionGrams: number;
  ingredientCostPerKg: number;
  laborHours: number;
  laborRate: number;
  overheadPercent: number;
  profitMarginPercent: number;
  dataConfidence?: number;
}

export const Wedding_cake_calculatorInputSchema = z.object({
  guestCount: z.number().default(100),
  portionGrams: z.number().default(150),
  ingredientCostPerKg: z.number().default(5),
  laborHours: z.number().default(4),
  laborRate: z.number().default(20),
  overheadPercent: z.number().default(15),
  profitMarginPercent: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wedding_cake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.guestCount * input.portionGrams) / 1000; results["totalCakeWeightKg"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCakeWeightKg"] = 0; }
  try { const v = (asFormulaNumber(results["totalCakeWeightKg"])) * input.ingredientCostPerKg; results["ingredientCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ingredientCost"] = 0; }
  try { const v = input.laborHours * input.laborRate; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = ((asFormulaNumber(results["ingredientCost"])) + (asFormulaNumber(results["laborCost"]))) * (input.overheadPercent / 100); results["overheadCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["overheadCost"] = 0; }
  try { const v = (asFormulaNumber(results["ingredientCost"])) + (asFormulaNumber(results["laborCost"])) + (asFormulaNumber(results["overheadCost"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) * (1 + input.profitMarginPercent / 100); results["totalPrice"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPrice"] = 0; }
  try { const v = (asFormulaNumber(results["totalPrice"])) / input.guestCount; results["pricePerServing"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pricePerServing"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWedding_cake_calculator(input: Wedding_cake_calculatorInput): Wedding_cake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPrice"]);
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


export interface Wedding_cake_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
