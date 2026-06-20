// Auto-generated from quarts-to-liters-calculator-schema.json
import * as z from 'zod';

export interface Quarts_to_liters_calculatorInput {
  quartsPerContainer: number;
  numberOfContainers: number;
  quartType: number;
  wasteFactor: number;
  dataConfidence?: number;
}

export const Quarts_to_liters_calculatorInputSchema = z.object({
  quartsPerContainer: z.number().default(1),
  numberOfContainers: z.number().default(1),
  quartType: z.number().default(0),
  wasteFactor: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Quarts_to_liters_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quartsPerContainer * input.numberOfContainers; results["totalQuarts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalQuarts"] = Number.NaN; }
  try { const v = input.quartType === 0 ? 0.946352946 : 1.1365225; results["conversionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["conversionFactor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalQuarts"])) * (toNumericFormulaValue(results["conversionFactor"])); results["baseLiters"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseLiters"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseLiters"])) * input.wasteFactor / 100; results["wasteLiters"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteLiters"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseLiters"])) + (toNumericFormulaValue(results["wasteLiters"])); results["totalLiters"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLiters"] = Number.NaN; }
  return results;
}


export function calculateQuarts_to_liters_calculator(input: Quarts_to_liters_calculatorInput): Quarts_to_liters_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLiters"]);
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


export interface Quarts_to_liters_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
