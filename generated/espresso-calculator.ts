// Auto-generated from espresso-calculator-schema.json
import * as z from 'zod';

export interface Espresso_calculatorInput {
  dosePerShot: number;
  coffeeBagPrice: number;
  bagWeight: number;
  wastePercentage: number;
  dataConfidence?: number;
}

export const Espresso_calculatorInputSchema = z.object({
  dosePerShot: z.number().default(18),
  coffeeBagPrice: z.number().default(10),
  bagWeight: z.number().default(1000),
  wastePercentage: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Espresso_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.bagWeight * (1 - input.wastePercentage / 100); results["totalUsableCoffee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalUsableCoffee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalUsableCoffee"])) / input.dosePerShot; results["shotsPerBag"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shotsPerBag"] = Number.NaN; }
  try { const v = input.coffeeBagPrice / input.bagWeight; results["costPerGram"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerGram"] = Number.NaN; }
  try { const v = input.coffeeBagPrice / (toNumericFormulaValue(results["shotsPerBag"])); results["costPerShot"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerShot"] = Number.NaN; }
  return results;
}


export function calculateEspresso_calculator(input: Espresso_calculatorInput): Espresso_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerShot"]);
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


export interface Espresso_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
