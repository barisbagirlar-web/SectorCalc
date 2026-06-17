// Auto-generated from container-calculator-schema.json
import * as z from 'zod';

export interface Container_calculatorInput {
  totalQuantity: number;
  itemsPerPallet: number;
  palletsPerContainer: number;
  reservePercent: number;
}

export const Container_calculatorInputSchema = z.object({
  totalQuantity: z.number().default(1000),
  itemsPerPallet: z.number().default(50),
  palletsPerContainer: z.number().default(20),
  reservePercent: z.number().default(5),
});

function evaluateAllFormulas(input: Container_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.ceil(input.totalQuantity / input.itemsPerPallet); results["palletsNeeded"] = Number.isFinite(v) ? v : 0; } catch { results["palletsNeeded"] = 0; }
  try { const v = Math.ceil((results["palletsNeeded"] ?? 0) / input.palletsPerContainer); results["containersWithoutReserve"] = Number.isFinite(v) ? v : 0; } catch { results["containersWithoutReserve"] = 0; }
  try { const v = Math.ceil((results["containersWithoutReserve"] ?? 0) * (1 + input.reservePercent / 100)); results["containersWithReserve"] = Number.isFinite(v) ? v : 0; } catch { results["containersWithReserve"] = 0; }
  try { const v = $(results["palletsNeeded"] ?? 0); results["__palletsNeeded_"] = Number.isFinite(v) ? v : 0; } catch { results["__palletsNeeded_"] = 0; }
  try { const v = $(results["containersWithoutReserve"] ?? 0); results["__containersWithoutReserve_"] = Number.isFinite(v) ? v : 0; } catch { results["__containersWithoutReserve_"] = 0; }
  try { const v = $(results["containersWithReserve"] ?? 0); results["__containersWithReserve_"] = Number.isFinite(v) ? v : 0; } catch { results["__containersWithReserve_"] = 0; }
  return results;
}


export function calculateContainer_calculator(input: Container_calculatorInput): Container_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["palletsNeeded"] ?? 0;
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


export interface Container_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
