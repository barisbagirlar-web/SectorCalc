// Auto-generated from dat-score-calculator-schema.json
import * as z from 'zod';

export interface Dat_score_calculatorInput {
  onTimeDeliveries: number;
  totalDeliveries: number;
  correctOrders: number;
  totalOrders: number;
  damageFreeShipments: number;
  totalShipments: number;
  dataConfidence?: number;
}

export const Dat_score_calculatorInputSchema = z.object({
  onTimeDeliveries: z.number().default(100),
  totalDeliveries: z.number().default(120),
  correctOrders: z.number().default(110),
  totalOrders: z.number().default(120),
  damageFreeShipments: z.number().default(115),
  totalShipments: z.number().default(120),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Dat_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.onTimeDeliveries / input.totalDeliveries * 100; results["onTimeRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["onTimeRate"] = Number.NaN; }
  try { const v = input.correctOrders / input.totalOrders * 100; results["accuracyRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["accuracyRate"] = Number.NaN; }
  try { const v = input.damageFreeShipments / input.totalShipments * 100; results["damageFreeRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["damageFreeRate"] = Number.NaN; }
  try { const v = (input.onTimeDeliveries / input.totalDeliveries * 100 + input.correctOrders / input.totalOrders * 100 + input.damageFreeShipments / input.totalShipments * 100) / 3; results["datScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["datScore"] = Number.NaN; }
  return results;
}


export function calculateDat_score_calculator(input: Dat_score_calculatorInput): Dat_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["datScore"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Dat_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
