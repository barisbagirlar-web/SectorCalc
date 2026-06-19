// Auto-generated from crypto-staking-calculator-schema.json
import * as z from 'zod';

export interface Crypto_staking_calculatorInput {
  principal: number;
  apy: number;
  duration: number;
  compoundFrequency: number;
  dataConfidence?: number;
}

export const Crypto_staking_calculatorInputSchema = z.object({
  principal: z.number().default(1000),
  apy: z.number().default(10),
  duration: z.number().default(365),
  compoundFrequency: z.number().default(365),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Crypto_staking_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.principal * (1 + (input.apy / 100) / input.compoundFrequency) ** (input.compoundFrequency * (input.duration / 365)); results["totalValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalValue"] = 0; }
  try { const v = (asFormulaNumber(results["totalValue"])) - input.principal; results["earnedRewards"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["earnedRewards"] = 0; }
  try { const v = input.principal; results["initialInvestment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["initialInvestment"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCrypto_staking_calculator(input: Crypto_staking_calculatorInput): Crypto_staking_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalValue"]);
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


export interface Crypto_staking_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
