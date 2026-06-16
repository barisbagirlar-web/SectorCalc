// Auto-generated from cash-flow-calculator-schema.json
import * as z from 'zod';

export interface Cash_flow_calculatorInput {
  initialInvestment: number;
  periodicCashFlow: number;
  periods: number;
  discountRate: number;
  salvageValue: number;
}

export const Cash_flow_calculatorInputSchema = z.object({
  initialInvestment: z.number().default(10000),
  periodicCashFlow: z.number().default(2000),
  periods: z.number().default(5),
  discountRate: z.number().default(10),
  salvageValue: z.number().default(0),
});

function evaluateAllFormulas(input: Cash_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { const r = input.discountRate / 100; let npv = -input.initialInvestment; for (let t = 1; t <= input.periods; t++) { npv += input.periodicCashFlow / Math.pow(1 + r, t); } npv += input.salvageValue / Math.pow(1 + r, input.periods); return npv; })(); results["npv"] = Number.isFinite(v) ? v : 0; } catch { results["npv"] = 0; }
  try { const v = (input) => input.periodicCashFlow !== 0 ? input.initialInvestment / input.periodicCashFlow : Infinity; results["payback"] = Number.isFinite(v) ? v : 0; } catch { results["payback"] = 0; }
  try { const v = (() => { const r = input.discountRate / 100; let npv = -input.initialInvestment; for (let t = 1; t <= input.periods; t++) { npv += input.periodicCashFlow / Math.pow(1 + r, t); } npv += input.salvageValue / Math.pow(1 + r, input.periods); return (npv + input.initialInvestment) / input.initialInvestment; })(); results["profitabilityIndex"] = Number.isFinite(v) ? v : 0; } catch { results["profitabilityIndex"] = 0; }
  return results;
}


export function calculateCash_flow_calculator(input: Cash_flow_calculatorInput): Cash_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["npv"] ?? 0;
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


export interface Cash_flow_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
