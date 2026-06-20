// Auto-generated from juice-calculator-schema.json
import * as z from 'zod';

export interface Juice_calculatorInput {
  fruitWeight: number;
  extractionRate: number;
  waterAdded: number;
  otherAdditives: number;
  dataConfidence?: number;
}

export const Juice_calculatorInputSchema = z.object({
  fruitWeight: z.number().default(100),
  extractionRate: z.number().default(70),
  waterAdded: z.number().default(0),
  otherAdditives: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Juice_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fruitWeight * input.extractionRate / 100; results["juiceFromFruitOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["juiceFromFruitOutput"] = Number.NaN; }
  try { const v = input.waterAdded; results["waterOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterOutput"] = Number.NaN; }
  try { const v = input.otherAdditives; results["additivesOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["additivesOutput"] = Number.NaN; }
  try { const v = input.fruitWeight - (input.fruitWeight * input.extractionRate / 100); results["wasteOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteOutput"] = Number.NaN; }
  try { const v = input.fruitWeight * input.extractionRate / 100 + input.waterAdded + input.otherAdditives; results["totalJuiceOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalJuiceOutput"] = Number.NaN; }
  return results;
}


export function calculateJuice_calculator(input: Juice_calculatorInput): Juice_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalJuiceOutput"]);
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


export interface Juice_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
