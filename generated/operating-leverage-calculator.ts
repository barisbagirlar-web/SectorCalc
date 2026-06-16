// Auto-generated from operating-leverage-calculator-schema.json
import * as z from 'zod';

export interface Operating_leverage_calculatorInput {
  salesVolume: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  fixedCosts: number;
}

export const Operating_leverage_calculatorInputSchema = z.object({
  salesVolume: z.number().default(1000),
  pricePerUnit: z.number().default(50),
  variableCostPerUnit: z.number().default(30),
  fixedCosts: z.number().default(10000),
});

function evaluateAllFormulas(input: Operating_leverage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salesVolume * (input.pricePerUnit - input.variableCostPerUnit); results["contributionMargin"] = Number.isFinite(v) ? v : 0; } catch { results["contributionMargin"] = 0; }
  try { const v = input.salesVolume * (input.pricePerUnit - input.variableCostPerUnit) - input.fixedCosts; results["netOperatingIncome"] = Number.isFinite(v) ? v : 0; } catch { results["netOperatingIncome"] = 0; }
  try { const v = (input.salesVolume * (input.pricePerUnit - input.variableCostPerUnit)) / (input.salesVolume * (input.pricePerUnit - input.variableCostPerUnit) - input.fixedCosts); results["operatingLeverage"] = Number.isFinite(v) ? v : 0; } catch { results["operatingLeverage"] = 0; }
  return results;
}


export function calculateOperating_leverage_calculator(input: Operating_leverage_calculatorInput): Operating_leverage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["operatingLeverage"] ?? 0;
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


export interface Operating_leverage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
