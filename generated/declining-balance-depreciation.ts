// Auto-generated from declining-balance-depreciation-schema.json
import * as z from 'zod';

export interface Declining_balance_depreciationInput {
  cost: number;
  salvage: number;
  usefulLife: number;
  rateMultiplier: number;
  year: number;
}

export const Declining_balance_depreciationInputSchema = z.object({
  cost: z.number().default(10000),
  salvage: z.number().default(1000),
  usefulLife: z.number().default(5),
  rateMultiplier: z.number().default(2),
  year: z.number().default(1),
});

function evaluateAllFormulas(input: Declining_balance_depreciationInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { year > usefulLife ? 0 : (() => { const rate = (1 / usefulLife) * rateMultiplier; const bvStart = Math.max(cost * Math.pow(1 - rate, year - 1), salvage); return bvStart === salvage ? 0 : Math.min(rate * bvStart, bvStart - salvage); })() })(); results["depreciationAmount"] = Number.isFinite(v) ? v : 0; } catch { results["depreciationAmount"] = 0; }
  try { const v = input.year > input.usefulLife ? input.salvage : Math.max(input.cost * Math.pow(1 - (1 / input.usefulLife) * input.rateMultiplier, input.year - 1), input.salvage); results["bookValueStart"] = Number.isFinite(v) ? v : 0; } catch { results["bookValueStart"] = 0; }
  try { const v = (1 / input.usefulLife) * input.rateMultiplier; results["depreciationRateApplied"] = Number.isFinite(v) ? v : 0; } catch { results["depreciationRateApplied"] = 0; }
  try { const v = input.year > input.usefulLife ? input.cost - input.salvage : input.cost - Math.max(input.cost * Math.pow(1 - (1 / input.usefulLife) * input.rateMultiplier, input.year), input.salvage); results["accumulatedDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["accumulatedDepreciation"] = 0; }
  try { const v = input.year > input.usefulLife ? input.salvage : Math.max(input.cost * Math.pow(1 - (1 / input.usefulLife) * input.rateMultiplier, input.year), input.salvage); results["bookValueEnd"] = Number.isFinite(v) ? v : 0; } catch { results["bookValueEnd"] = 0; }
  return results;
}


export function calculateDeclining_balance_depreciation(input: Declining_balance_depreciationInput): Declining_balance_depreciationOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["depreciationAmount"] ?? 0;
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


export interface Declining_balance_depreciationOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
