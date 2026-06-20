// Auto-generated from crypto-mining-calculator-schema.json
import * as z from 'zod';

export interface Crypto_mining_calculatorInput {
  hashRate: number;
  powerConsumption: number;
  electricityCost: number;
  poolFee: number;
  dailyRevenuePerTH: number;
  dataConfidence?: number;
}

export const Crypto_mining_calculatorInputSchema = z.object({
  hashRate: z.number().default(100),
  powerConsumption: z.number().default(3000),
  electricityCost: z.number().default(0.12),
  poolFee: z.number().default(2),
  dailyRevenuePerTH: z.number().default(0.06),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Crypto_mining_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.hashRate * input.dailyRevenuePerTH; results["dailyGrossRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyGrossRevenue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyGrossRevenue"])) * (input.poolFee / 100); results["dailyPoolFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyPoolFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyGrossRevenue"])) - (toNumericFormulaValue(results["dailyPoolFee"])); results["dailyNetRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyNetRevenue"] = Number.NaN; }
  try { const v = (input.powerConsumption / 1000) * 24 * input.electricityCost; results["dailyElectricityCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyElectricityCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyNetRevenue"])) - (toNumericFormulaValue(results["dailyElectricityCost"])); results["dailyProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyProfit"] = Number.NaN; }
  return results;
}


export function calculateCrypto_mining_calculator(input: Crypto_mining_calculatorInput): Crypto_mining_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyProfit"]);
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


export interface Crypto_mining_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
