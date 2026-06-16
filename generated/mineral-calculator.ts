// Auto-generated from mineral-calculator-schema.json
import * as z from 'zod';

export interface Mineral_calculatorInput {
  ore_tonnage: number;
  ore_grade: number;
  recovery_rate: number;
  metal_price: number;
  processing_cost: number;
}

export const Mineral_calculatorInputSchema = z.object({
  ore_tonnage: z.number().default(1000),
  ore_grade: z.number().default(5),
  recovery_rate: z.number().default(90),
  metal_price: z.number().default(2000),
  processing_cost: z.number().default(10),
});

function evaluateAllFormulas(input: Mineral_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ore_tonnage * (input.ore_grade / 100) * (input.recovery_rate / 100); results["metal_tonnage"] = Number.isFinite(v) ? v : 0; } catch { results["metal_tonnage"] = 0; }
  try { const v = (results["metal_tonnage"] ?? 0) * input.metal_price; results["revenue"] = Number.isFinite(v) ? v : 0; } catch { results["revenue"] = 0; }
  try { const v = input.ore_tonnage * input.processing_cost; results["total_processing_cost"] = Number.isFinite(v) ? v : 0; } catch { results["total_processing_cost"] = 0; }
  try { const v = (results["revenue"] ?? 0) - (results["total_processing_cost"] ?? 0); results["net_profit"] = Number.isFinite(v) ? v : 0; } catch { results["net_profit"] = 0; }
  return results;
}


export function calculateMineral_calculator(input: Mineral_calculatorInput): Mineral_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["net_profit"] ?? 0;
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


export interface Mineral_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
