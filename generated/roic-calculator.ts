// Auto-generated from roic-calculator-schema.json
import * as z from 'zod';

export interface Roic_calculatorInput {
  ebit: number;
  taxRate: number;
  totalDebt: number;
  totalEquity: number;
  cash: number;
}

export const Roic_calculatorInputSchema = z.object({
  ebit: z.number().default(100000),
  taxRate: z.number().default(20),
  totalDebt: z.number().default(500000),
  totalEquity: z.number().default(500000),
  cash: z.number().default(50000),
});

function evaluateAllFormulas(input: Roic_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ebit * (1 - input.taxRate / 100); results["nopat"] = Number.isFinite(v) ? v : 0; } catch { results["nopat"] = 0; }
  try { const v = input.totalDebt + input.totalEquity - input.cash; results["investedCapital"] = Number.isFinite(v) ? v : 0; } catch { results["investedCapital"] = 0; }
  try { const v = ((results["nopat"] ?? 0) / (results["investedCapital"] ?? 0)) * 100; results["roic"] = Number.isFinite(v) ? v : 0; } catch { results["roic"] = 0; }
  return results;
}


export function calculateRoic_calculator(input: Roic_calculatorInput): Roic_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["roic"] ?? 0;
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


export interface Roic_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
