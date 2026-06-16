// Auto-generated from declining-balance-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Declining_balance_depreciation_calculatorInput {
  cost: number;
  salvage: number;
  life: number;
  factor: number;
  year: number;
}

export const Declining_balance_depreciation_calculatorInputSchema = z.object({
  cost: z.number().default(10000),
  salvage: z.number().default(1000),
  life: z.number().default(5),
  factor: z.number().default(2),
  year: z.number().default(1),
});

function evaluateAllFormulas(input: Declining_balance_depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.factor / input.life; results["rate"] = Number.isFinite(v) ? v : 0; } catch { results["rate"] = 0; }
  try { const v = input.cost * (results["rate"] ?? 0) * (1 - (results["rate"] ?? 0)) ** (input.year - 1); results["depreciation"] = Number.isFinite(v) ? v : 0; } catch { results["depreciation"] = 0; }
  try { const v = input.cost * (1 - (results["rate"] ?? 0)) ** (input.year - 1); results["bookValueBeginning"] = Number.isFinite(v) ? v : 0; } catch { results["bookValueBeginning"] = 0; }
  try { const v = input.cost - input.cost * (1 - (results["rate"] ?? 0)) ** input.year; results["accumulatedDepreciation"] = Number.isFinite(v) ? v : 0; } catch { results["accumulatedDepreciation"] = 0; }
  try { const v = input.cost * (1 - (results["rate"] ?? 0)) ** input.year; results["endingBookValue"] = Number.isFinite(v) ? v : 0; } catch { results["endingBookValue"] = 0; }
  return results;
}


export function calculateDeclining_balance_depreciation_calculator(input: Declining_balance_depreciation_calculatorInput): Declining_balance_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["depreciation"] ?? 0;
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


export interface Declining_balance_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
