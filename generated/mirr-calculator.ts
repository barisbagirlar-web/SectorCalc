// Auto-generated from mirr-calculator-schema.json
import * as z from 'zod';

export interface Mirr_calculatorInput {
  initialInvestment: number;
  cf1: number;
  cf2: number;
  cf3: number;
  cf4: number;
  cf5: number;
  financeRate: number;
  reinvestmentRate: number;
}

export const Mirr_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(-100000),
  cf1: z.number().default(20000),
  cf2: z.number().default(25000),
  cf3: z.number().default(30000),
  cf4: z.number().default(35000),
  cf5: z.number().default(40000),
  financeRate: z.number().default(10),
  reinvestmentRate: z.number().default(12),
});

function evaluateAllFormulas(input: Mirr_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(input.initialInvestment, 0) + Math.min(input.cf1, 0) / Math.pow(1 + input.financeRate/100, 1) + Math.min(input.cf2, 0) / Math.pow(1 + input.financeRate/100, 2) + Math.min(input.cf3, 0) / Math.pow(1 + input.financeRate/100, 3) + Math.min(input.cf4, 0) / Math.pow(1 + input.financeRate/100, 4) + Math.min(input.cf5, 0) / Math.pow(1 + input.financeRate/100, 5); results["pvNeg"] = Number.isFinite(v) ? v : 0; } catch { results["pvNeg"] = 0; }
  try { const v = Math.max(input.cf1, 0) * Math.pow(1 + input.reinvestmentRate/100, 4) + Math.max(input.cf2, 0) * Math.pow(1 + input.reinvestmentRate/100, 3) + Math.max(input.cf3, 0) * Math.pow(1 + input.reinvestmentRate/100, 2) + Math.max(input.cf4, 0) * Math.pow(1 + input.reinvestmentRate/100, 1) + Math.max(input.cf5, 0); results["fvPos"] = Number.isFinite(v) ? v : 0; } catch { results["fvPos"] = 0; }
  try { const v = Math.pow((results["fvPos"] ?? 0) / Math.abs((results["pvNeg"] ?? 0)), 1/5) - 1; results["mirrDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["mirrDecimal"] = 0; }
  try { const v = (results["mirrDecimal"] ?? 0) * 100; results["mirrPercent"] = Number.isFinite(v) ? v : 0; } catch { results["mirrPercent"] = 0; }
  return results;
}


export function calculateMirr_calculator(input: Mirr_calculatorInput): Mirr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pvNeg"] ?? 0;
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


export interface Mirr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
