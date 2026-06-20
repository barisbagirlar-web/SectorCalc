// Auto-generated from energy-drink-calculator-schema.json
import * as z from 'zod';

export interface Energy_drink_calculatorInput {
  volume: number;
  caffeinePer100ml: number;
  sugarPer100ml: number;
  caloriesPer100ml: number;
  cansPerPack: number;
  pricePerPack: number;
  dataConfidence?: number;
}

export const Energy_drink_calculatorInputSchema = z.object({
  volume: z.number().default(250),
  caffeinePer100ml: z.number().default(32),
  sugarPer100ml: z.number().default(11),
  caloriesPer100ml: z.number().default(45),
  cansPerPack: z.number().default(4),
  pricePerPack: z.number().default(5.99),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Energy_drink_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.volume / 100) * input.caffeinePer100ml; results["totalCaffeine"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCaffeine"] = Number.NaN; }
  try { const v = (input.volume / 100) * input.sugarPer100ml; results["totalSugar"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSugar"] = Number.NaN; }
  try { const v = (input.volume / 100) * input.caloriesPer100ml; results["totalCalories"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCalories"] = Number.NaN; }
  try { const v = input.pricePerPack / input.cansPerPack; results["costPerCan"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerCan"] = Number.NaN; }
  try { const v = (input.pricePerPack / input.cansPerPack / input.volume) * 100; results["costPer100ml"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPer100ml"] = Number.NaN; }
  return results;
}


export function calculateEnergy_drink_calculator(input: Energy_drink_calculatorInput): Energy_drink_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCalories"]);
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


export interface Energy_drink_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
