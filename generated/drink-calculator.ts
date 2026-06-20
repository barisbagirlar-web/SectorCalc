// Auto-generated from drink-calculator-schema.json
import * as z from 'zod';

export interface Drink_calculatorInput {
  spiritVol: number;
  spiritCostPerL: number;
  mixerVol: number;
  mixerCostPerL: number;
  otherCost: number;
  marginPercent: number;
  dataConfidence?: number;
}

export const Drink_calculatorInputSchema = z.object({
  spiritVol: z.number().default(50),
  spiritCostPerL: z.number().default(20),
  mixerVol: z.number().default(150),
  mixerCostPerL: z.number().default(2),
  otherCost: z.number().default(0.1),
  marginPercent: z.number().default(70),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Drink_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.spiritVol + input.mixerVol; results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalVolume"] = Number.NaN; }
  try { const v = (input.spiritVol / 1000) * input.spiritCostPerL + (input.mixerVol / 1000) * input.mixerCostPerL + input.otherCost; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / (1 - input.marginPercent / 100); results["sellingPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sellingPrice"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalCost"])) / (toNumericFormulaValue(results["totalVolume"])); results["costPerMl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerMl"] = Number.NaN; }
  return results;
}


export function calculateDrink_calculator(input: Drink_calculatorInput): Drink_calculatorOutput {
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


export interface Drink_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
