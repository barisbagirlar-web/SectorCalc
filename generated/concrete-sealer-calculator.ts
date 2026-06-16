// Auto-generated from concrete-sealer-calculator-schema.json
import * as z from 'zod';

export interface Concrete_sealer_calculatorInput {
  area: number;
  coverageRate: number;
  numCoats: number;
  wasteFactor: number;
  porosityFactor: number;
  pricePerUnit: number;
}

export const Concrete_sealer_calculatorInputSchema = z.object({
  area: z.number().default(1000),
  coverageRate: z.number().default(200),
  numCoats: z.number().default(2),
  wasteFactor: z.number().default(10),
  porosityFactor: z.number().default(1),
  pricePerUnit: z.number().default(30),
});

function evaluateAllFormulas(input: Concrete_sealer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.coverageRate / input.porosityFactor; results["adjustedCoverage"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedCoverage"] = 0; }
  try { const v = (input.area * input.numCoats * (1 + input.wasteFactor / 100) * input.porosityFactor) / input.coverageRate; results["totalSealer"] = Number.isFinite(v) ? v : 0; } catch { results["totalSealer"] = 0; }
  try { const v = (results["totalSealer"] ?? 0) * input.pricePerUnit; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateConcrete_sealer_calculator(input: Concrete_sealer_calculatorInput): Concrete_sealer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Concrete_sealer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
