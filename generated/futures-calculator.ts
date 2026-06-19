// Auto-generated from futures-calculator-schema.json
import * as z from 'zod';

export interface Futures_calculatorInput {
  buyPrice: number;
  sellPrice: number;
  contractSize: number;
  contracts: number;
  marginRate: number;
  commission: number;
  dataConfidence?: number;
}

export const Futures_calculatorInputSchema = z.object({
  buyPrice: z.number().default(100),
  sellPrice: z.number().default(110),
  contractSize: z.number().default(1000),
  contracts: z.number().default(1),
  marginRate: z.number().default(10),
  commission: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Futures_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.sellPrice - input.buyPrice) * input.contractSize * input.contracts; results["grossPL"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossPL"] = 0; }
  try { const v = input.commission * input.contracts * 2; results["totalCommission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCommission"] = 0; }
  try { const v = (asFormulaNumber(results["grossPL"])) - (asFormulaNumber(results["totalCommission"])); results["netPL"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netPL"] = 0; }
  try { const v = input.buyPrice * input.contractSize * input.contracts * (input.marginRate / 100); results["requiredMargin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredMargin"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFutures_calculator(input: Futures_calculatorInput): Futures_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netPL"]));
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


export interface Futures_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
