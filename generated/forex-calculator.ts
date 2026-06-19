// Auto-generated from forex-calculator-schema.json
import * as z from 'zod';

export interface Forex_calculatorInput {
  lotSize: number;
  entryPrice: number;
  exitPrice: number;
  pipSize: number;
  pipValue: number;
  leverage: number;
  dataConfidence?: number;
}

export const Forex_calculatorInputSchema = z.object({
  lotSize: z.number().default(0.1),
  entryPrice: z.number().default(1.12),
  exitPrice: z.number().default(1.13),
  pipSize: z.number().default(0.0001),
  pipValue: z.number().default(10),
  leverage: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Forex_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.exitPrice - input.entryPrice) / input.pipSize; results["profitPips"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profitPips"] = 0; }
  try { const v = (asFormulaNumber(results["profitPips"])) * input.pipValue * input.lotSize; results["profitLoss"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["profitLoss"] = 0; }
  try { const v = (input.lotSize * 100000 * input.entryPrice) / input.leverage; results["requiredMargin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateForex_calculator(input: Forex_calculatorInput): Forex_calculatorOutput {
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


export interface Forex_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
