// @ts-nocheck
// Auto-generated from espresso-calculator-schema.json
import * as z from 'zod';

export interface Espresso_calculatorInput {
  dosePerShot: number;
  coffeeBagPrice: number;
  bagWeight: number;
  wastePercentage: number;
}

export const Espresso_calculatorInputSchema = z.object({
  dosePerShot: z.number().default(18),
  coffeeBagPrice: z.number().default(10),
  bagWeight: z.number().default(1000),
  wastePercentage: z.number().default(5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Espresso_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bagWeight * (1 - input.wastePercentage / 100); results["totalUsableCoffee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalUsableCoffee"] = 0; }
  try { const v = (asFormulaNumber(results["totalUsableCoffee"])) / input.dosePerShot; results["shotsPerBag"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shotsPerBag"] = 0; }
  try { const v = input.coffeeBagPrice / input.bagWeight; results["costPerGram"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerGram"] = 0; }
  try { const v = input.coffeeBagPrice / (asFormulaNumber(results["shotsPerBag"])); results["costPerShot"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerShot"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEspresso_calculator(input: Espresso_calculatorInput): Espresso_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["costPerShot"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
