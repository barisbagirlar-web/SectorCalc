// Auto-generated from container-calculator-schema.json
import * as z from 'zod';

export interface Container_calculatorInput {
  totalQuantity: number;
  itemsPerPallet: number;
  palletsPerContainer: number;
  reservePercent: number;
  dataConfidence?: number;
}

export const Container_calculatorInputSchema = z.object({
  totalQuantity: z.number().default(1000),
  itemsPerPallet: z.number().default(50),
  palletsPerContainer: z.number().default(20),
  reservePercent: z.number().default(5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Container_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalQuantity * input.itemsPerPallet * input.palletsPerContainer * (input.reservePercent / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.totalQuantity * input.itemsPerPallet * input.palletsPerContainer * (input.reservePercent / 100); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateContainer_calculator(input: Container_calculatorInput): Container_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Container_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
