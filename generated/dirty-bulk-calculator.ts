// Auto-generated from dirty-bulk-calculator-schema.json
import * as z from 'zod';

export interface Dirty_bulk_calculatorInput {
  weight: number;
  distance: number;
  ratePerTonKm: number;
  cleaningSurchargePercent: number;
  demurrageRiskFactor: number;
  demurrageRate: number;
}

export const Dirty_bulk_calculatorInputSchema = z.object({
  weight: z.number().default(1000),
  distance: z.number().default(500),
  ratePerTonKm: z.number().default(0.05),
  cleaningSurchargePercent: z.number().default(15),
  demurrageRiskFactor: z.number().default(2),
  demurrageRate: z.number().default(5000),
});

function evaluateAllFormulas(input: Dirty_bulk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * input.distance * input.ratePerTonKm; results["baseCost"] = Number.isFinite(v) ? v : 0; } catch { results["baseCost"] = 0; }
  try { const v = (results["baseCost"] ?? 0) * (input.cleaningSurchargePercent / 100); results["cleaningSurcharge"] = Number.isFinite(v) ? v : 0; } catch { results["cleaningSurcharge"] = 0; }
  try { const v = input.demurrageRiskFactor * input.demurrageRate; results["demurrageCost"] = Number.isFinite(v) ? v : 0; } catch { results["demurrageCost"] = 0; }
  try { const v = (results["baseCost"] ?? 0) + (results["cleaningSurcharge"] ?? 0) + (results["demurrageCost"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) / input.weight; results["costPerTon"] = Number.isFinite(v) ? v : 0; } catch { results["costPerTon"] = 0; }
  return results;
}


export function calculateDirty_bulk_calculator(input: Dirty_bulk_calculatorInput): Dirty_bulk_calculatorOutput {
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


export interface Dirty_bulk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
