// Auto-generated from dat-score-calculator-schema.json
import * as z from 'zod';

export interface Dat_score_calculatorInput {
  onTimeDeliveries: number;
  totalDeliveries: number;
  correctOrders: number;
  totalOrders: number;
  damageFreeShipments: number;
  totalShipments: number;
}

export const Dat_score_calculatorInputSchema = z.object({
  onTimeDeliveries: z.number().default(100),
  totalDeliveries: z.number().default(120),
  correctOrders: z.number().default(110),
  totalOrders: z.number().default(120),
  damageFreeShipments: z.number().default(115),
  totalShipments: z.number().default(120),
});

function evaluateAllFormulas(input: Dat_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.onTimeDeliveries / input.totalDeliveries * 100; results["onTimeRate"] = Number.isFinite(v) ? v : 0; } catch { results["onTimeRate"] = 0; }
  try { const v = input.correctOrders / input.totalOrders * 100; results["accuracyRate"] = Number.isFinite(v) ? v : 0; } catch { results["accuracyRate"] = 0; }
  try { const v = input.damageFreeShipments / input.totalShipments * 100; results["damageFreeRate"] = Number.isFinite(v) ? v : 0; } catch { results["damageFreeRate"] = 0; }
  try { const v = (input.onTimeDeliveries / input.totalDeliveries * 100 + input.correctOrders / input.totalOrders * 100 + input.damageFreeShipments / input.totalShipments * 100) / 3; results["datScore"] = Number.isFinite(v) ? v : 0; } catch { results["datScore"] = 0; }
  return results;
}


export function calculateDat_score_calculator(input: Dat_score_calculatorInput): Dat_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["datScore"] ?? 0;
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


export interface Dat_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
