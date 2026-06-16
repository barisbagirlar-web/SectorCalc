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

function evaluateAllFormulas(input: Fertilizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(input.nitrogenRate / (input.fertilizerN / 100), input.phosphorusRate / (input.fertilizerP / 100), input.potassiumRate / (input.fertilizerK / 100)); results["perHaRequirement"] = Number.isFinite(v) ? v : 0; } catch { results["perHaRequirement"] = 0; }
  try { const v = input.area * (results["perHaRequirement"] ?? 0); results["totalFertilizerKg"] = Number.isFinite(v) ? v : 0; } catch { results["totalFertilizerKg"] = 0; }
  try { const v = (results["totalFertilizerKg"] ?? 0) / 1000; results["totalFertilizerTons"] = Number.isFinite(v) ? v : 0; } catch { results["totalFertilizerTons"] = 0; }
  return results;
}


export function calculateFertilizer_calculator(input: Fertilizer_calculatorInput): Fertilizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalFertilizerKg"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
