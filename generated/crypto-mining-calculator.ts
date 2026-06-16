// Auto-generated from crypto-mining-calculator-schema.json
import * as z from 'zod';

export interface Crypto_mining_calculatorInput {
  hashRate: number;
  powerConsumption: number;
  electricityCost: number;
  poolFee: number;
  dailyRevenuePerTH: number;
}

export const Crypto_mining_calculatorInputSchema = z.object({
  hashRate: z.number().default(100),
  powerConsumption: z.number().default(3000),
  electricityCost: z.number().default(0.12),
  poolFee: z.number().default(2),
  dailyRevenuePerTH: z.number().default(0.06),
});

function evaluateAllFormulas(input: Crypto_mining_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hashRate * input.dailyRevenuePerTH; results["dailyGrossRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["dailyGrossRevenue"] = 0; }
  try { const v = (results["dailyGrossRevenue"] ?? 0) * (input.poolFee / 100); results["dailyPoolFee"] = Number.isFinite(v) ? v : 0; } catch { results["dailyPoolFee"] = 0; }
  try { const v = (results["dailyGrossRevenue"] ?? 0) - (results["dailyPoolFee"] ?? 0); results["dailyNetRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["dailyNetRevenue"] = 0; }
  try { const v = (input.powerConsumption / 1000) * 24 * input.electricityCost; results["dailyElectricityCost"] = Number.isFinite(v) ? v : 0; } catch { results["dailyElectricityCost"] = 0; }
  try { const v = (results["dailyNetRevenue"] ?? 0) - (results["dailyElectricityCost"] ?? 0); results["dailyProfit"] = Number.isFinite(v) ? v : 0; } catch { results["dailyProfit"] = 0; }
  return results;
}


export function calculateCrypto_mining_calculator(input: Crypto_mining_calculatorInput): Crypto_mining_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["dailyProfit"] ?? 0;
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


export interface Crypto_mining_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
