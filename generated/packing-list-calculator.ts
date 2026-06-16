// Auto-generated from packing-list-calculator-schema.json
import * as z from 'zod';

export interface Packing_list_calculatorInput {
  quantityOrdered: number;
  unitsPerCarton: number;
  cartonLength: number;
  cartonWidth: number;
  cartonHeight: number;
  cartonWeight: number;
  maxCartonsPerPallet: number;
  maxWeightPerPallet: number;
}

export const Packing_list_calculatorInputSchema = z.object({
  quantityOrdered: z.number().default(1000),
  unitsPerCarton: z.number().default(50),
  cartonLength: z.number().default(40),
  cartonWidth: z.number().default(30),
  cartonHeight: z.number().default(20),
  cartonWeight: z.number().default(12),
  maxCartonsPerPallet: z.number().default(24),
  maxWeightPerPallet: z.number().default(500),
});

function evaluateAllFormulas(input: Packing_list_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.quantityOrdered / input.unitsPerCarton) * (input.cartonLength * input.cartonWidth * input.cartonHeight) / 1000000; results["totalVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  try { const v = (input.quantityOrdered / input.unitsPerCarton) * input.cartonWeight; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = input.quantityOrdered / input.unitsPerCarton; results["totalCartons"] = Number.isFinite(v) ? v : 0; } catch { results["totalCartons"] = 0; }
  try { const v = (input.quantityOrdered / input.unitsPerCarton) / input.maxCartonsPerPallet; results["palletsByVolume"] = Number.isFinite(v) ? v : 0; } catch { results["palletsByVolume"] = 0; }
  try { const v = (input.quantityOrdered / input.unitsPerCarton) * input.cartonWeight / input.maxWeightPerPallet; results["palletsByWeight"] = Number.isFinite(v) ? v : 0; } catch { results["palletsByWeight"] = 0; }
  return results;
}


export function calculatePacking_list_calculator(input: Packing_list_calculatorInput): Packing_list_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalVolume"] ?? 0;
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


export interface Packing_list_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
