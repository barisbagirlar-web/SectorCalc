// Auto-generated from startup-valuation-calculator-schema.json
import * as z from 'zod';

export interface Startup_valuation_calculatorInput {
  projectedRevenue: number;
  netProfitMargin: number;
  peRatio: number;
  requiredROI: number;
  investmentAmount: number;
}

export const Startup_valuation_calculatorInputSchema = z.object({
  projectedRevenue: z.number().default(10000000),
  netProfitMargin: z.number().default(15),
  peRatio: z.number().default(20),
  requiredROI: z.number().default(3),
  investmentAmount: z.number().default(1000000),
});

function evaluateAllFormulas(input: Startup_valuation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.projectedRevenue * (input.netProfitMargin / 100) * input.peRatio; results["exitValue"] = Number.isFinite(v) ? v : 0; } catch { results["exitValue"] = 0; }
  try { const v = (results["exitValue"] ?? 0) / input.requiredROI; results["postMoney"] = Number.isFinite(v) ? v : 0; } catch { results["postMoney"] = 0; }
  try { const v = (results["postMoney"] ?? 0) - input.investmentAmount; results["preMoney"] = Number.isFinite(v) ? v : 0; } catch { results["preMoney"] = 0; }
  try { const v = (input.investmentAmount / (results["postMoney"] ?? 0)) * 100; results["ownershipPercent"] = Number.isFinite(v) ? v : 0; } catch { results["ownershipPercent"] = 0; }
  results["Pre_Money_Valuation"] = 0;
  results["Exit_Value"] = 0;
  results["Investor_Ownership__"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateStartup_valuation_calculator(input: Startup_valuation_calculatorInput): Startup_valuation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Startup_valuation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
