// Auto-generated from rsu-calculator-schema.json
import * as z from 'zod';

export interface Rsu_calculatorInput {
  totalRSUs: number;
  vestedPercentage: number;
  sharePrice: number;
  taxRate: number;
}

export const Rsu_calculatorInputSchema = z.object({
  totalRSUs: z.number().default(1000),
  vestedPercentage: z.number().default(100),
  sharePrice: z.number().default(50),
  taxRate: z.number().default(30),
});

function evaluateAllFormulas(input: Rsu_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRSUs * (input.vestedPercentage / 100); results["vestedShares"] = Number.isFinite(v) ? v : 0; } catch { results["vestedShares"] = 0; }
  try { const v = (results["vestedShares"] ?? 0) * input.sharePrice; results["preTaxValue"] = Number.isFinite(v) ? v : 0; } catch { results["preTaxValue"] = 0; }
  try { const v = (results["preTaxValue"] ?? 0) * (input.taxRate / 100); results["estimatedTax"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedTax"] = 0; }
  try { const v = (results["preTaxValue"] ?? 0) - (results["estimatedTax"] ?? 0); results["netValue"] = Number.isFinite(v) ? v : 0; } catch { results["netValue"] = 0; }
  return results;
}


export function calculateRsu_calculator(input: Rsu_calculatorInput): Rsu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["netValue"] ?? 0;
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


export interface Rsu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
