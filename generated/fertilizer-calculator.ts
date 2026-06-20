// Auto-generated from fertilizer-calculator-schema.json
import * as z from 'zod';

export interface Fertilizer_calculatorInput {
  area: number;
  nitrogenRate: number;
  phosphorusRate: number;
  potassiumRate: number;
  fertilizerN: number;
  fertilizerP: number;
  fertilizerK: number;
  dataConfidence?: number;
}

export const Fertilizer_calculatorInputSchema = z.object({
  area: z.number().default(1),
  nitrogenRate: z.number().default(100),
  phosphorusRate: z.number().default(50),
  potassiumRate: z.number().default(50),
  fertilizerN: z.number().default(10),
  fertilizerP: z.number().default(5),
  fertilizerK: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fertilizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.area * input.nitrogenRate * input.phosphorusRate * input.potassiumRate; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.area * input.nitrogenRate * input.phosphorusRate * input.potassiumRate * ((input.fertilizerN / 100) * (input.fertilizerP / 100) * (input.fertilizerK / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = (input.fertilizerN / 100) * (input.fertilizerP / 100) * (input.fertilizerK / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateFertilizer_calculator(input: Fertilizer_calculatorInput): Fertilizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Fertilizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
