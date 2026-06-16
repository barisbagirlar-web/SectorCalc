// Auto-generated from position-size-calculator-schema.json
import * as z from 'zod';

export interface Position_size_calculatorInput {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLossPrice: number;
}

export const Position_size_calculatorInputSchema = z.object({
  accountBalance: z.number().default(10000),
  riskPercent: z.number().default(2),
  entryPrice: z.number().default(100),
  stopLossPrice: z.number().default(95),
});

function evaluateAllFormulas(input: Position_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.accountBalance * (input.riskPercent / 100); results["riskAmount"] = Number.isFinite(v) ? v : 0; } catch { results["riskAmount"] = 0; }
  try { const v = Math.abs(input.entryPrice - input.stopLossPrice); results["priceRiskPerShare"] = Number.isFinite(v) ? v : 0; } catch { results["priceRiskPerShare"] = 0; }
  try { const v = Math.floor((results["riskAmount"] ?? 0) / (results["priceRiskPerShare"] ?? 0)); results["positionSize"] = Number.isFinite(v) ? v : 0; } catch { results["positionSize"] = 0; }
  return results;
}


export function calculatePosition_size_calculator(input: Position_size_calculatorInput): Position_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["positionSize"] ?? 0;
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


export interface Position_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
