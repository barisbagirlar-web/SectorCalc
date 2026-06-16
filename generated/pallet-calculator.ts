// Auto-generated from pallet-calculator-schema.json
import * as z from 'zod';

export interface Pallet_calculatorInput {
  totalItems: number;
  itemsPerLayer: number;
  layersPerPallet: number;
  itemWeight: number;
  maxPalletWeight: number;
}

export const Pallet_calculatorInputSchema = z.object({
  totalItems: z.number().default(1000),
  itemsPerLayer: z.number().default(20),
  layersPerPallet: z.number().default(5),
  itemWeight: z.number().default(10),
  maxPalletWeight: z.number().default(500),
});

function evaluateAllFormulas(input: Pallet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(Math.ceil(input.totalItems / (input.itemsPerLayer * input.layersPerPallet)), Math.ceil((input.totalItems * input.itemWeight) / input.maxPalletWeight)); results["totalPallets"] = Number.isFinite(v) ? v : 0; } catch { results["totalPallets"] = 0; }
  try { const v = Math.ceil(input.totalItems / (input.itemsPerLayer * input.layersPerPallet)); results["palletsByCount"] = Number.isFinite(v) ? v : 0; } catch { results["palletsByCount"] = 0; }
  try { const v = Math.ceil((input.totalItems * input.itemWeight) / input.maxPalletWeight); results["palletsByWeight"] = Number.isFinite(v) ? v : 0; } catch { results["palletsByWeight"] = 0; }
  try { const v = input.totalItems / Math.max(Math.ceil(input.totalItems / (input.itemsPerLayer * input.layersPerPallet)), Math.ceil((input.totalItems * input.itemWeight) / input.maxPalletWeight)); results["itemsPerPalletActual"] = Number.isFinite(v) ? v : 0; } catch { results["itemsPerPalletActual"] = 0; }
  try { const v = input.totalItems * input.itemWeight; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  try { const v = (input.totalItems * input.itemWeight) / (Math.max(Math.ceil(input.totalItems / (input.itemsPerLayer * input.layersPerPallet)), Math.ceil((input.totalItems * input.itemWeight) / input.maxPalletWeight)) * input.maxPalletWeight) * 100; results["weightUtilization"] = Number.isFinite(v) ? v : 0; } catch { results["weightUtilization"] = 0; }
  return results;
}


export function calculatePallet_calculator(input: Pallet_calculatorInput): Pallet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPallets"] ?? 0;
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


export interface Pallet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
