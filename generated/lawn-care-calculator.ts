// Auto-generated from lawn-care-calculator-schema.json
import * as z from 'zod';

export interface Lawn_care_calculatorInput {
  lawnArea: number;
  seedCost: number;
  fertilizerCost: number;
  irrigationCost: number;
  laborRate: number;
  laborHours: number;
  profitMargin: number;
}

export const Lawn_care_calculatorInputSchema = z.object({
  lawnArea: z.number().default(100),
  seedCost: z.number().default(0.5),
  fertilizerCost: z.number().default(0.3),
  irrigationCost: z.number().default(0.1),
  laborRate: z.number().default(25),
  laborHours: z.number().default(4),
  profitMargin: z.number().default(20),
});

function evaluateAllFormulas(input: Lawn_care_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.seedCost + input.fertilizerCost + input.irrigationCost) * input.lawnArea; results["materialCost"] = Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = input.laborRate * input.laborHours; results["laborCost"] = Number.isFinite(v) ? v : 0; } catch { results["laborCost"] = 0; }
  try { const v = (results["materialCost"] ?? 0) + (results["laborCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / (1 - input.profitMargin / 100); results["sellingPrice"] = Number.isFinite(v) ? v : 0; } catch { results["sellingPrice"] = 0; }
  return results;
}


export function calculateLawn_care_calculator(input: Lawn_care_calculatorInput): Lawn_care_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sellingPrice"] ?? 0;
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


export interface Lawn_care_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
