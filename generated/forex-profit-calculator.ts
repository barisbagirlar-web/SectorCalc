// Auto-generated from forex-profit-calculator-schema.json
import * as z from 'zod';

export interface Forex_profit_calculatorInput {
  direction: number;
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  pipValue: number;
  pipSize: number;
  dataConfidence?: number;
}

export const Forex_profit_calculatorInputSchema = z.object({
  direction: z.number().default(1),
  entryPrice: z.number().default(1.1),
  exitPrice: z.number().default(1.105),
  lotSize: z.number().default(1),
  pipValue: z.number().default(10),
  pipSize: z.number().default(0.0001),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Forex_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.exitPrice - input.entryPrice) / input.pipSize; results["pips"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pips"] = 0; }
  try { const v = input.direction * (asFormulaNumber(results["pips"])) * input.lotSize * input.pipValue; results["profitLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profitLoss"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateForex_profit_calculator(input: Forex_profit_calculatorInput): Forex_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["profitLoss"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Forex_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
