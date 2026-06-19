// Auto-generated from position-size-calculator-schema.json
import * as z from 'zod';

export interface Position_size_calculatorInput {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLossPrice: number;
  dataConfidence?: number;
}

export const Position_size_calculatorInputSchema = z.object({
  accountBalance: z.number().default(10000),
  riskPercent: z.number().default(2),
  entryPrice: z.number().default(100),
  stopLossPrice: z.number().default(95),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Position_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.accountBalance * (input.riskPercent / 100); results["riskAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["riskAmount"] = 0; }
  try { const v = input.accountBalance * (input.riskPercent / 100); results["riskAmount_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["riskAmount_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePosition_size_calculator(input: Position_size_calculatorInput): Position_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["riskAmount_aux"]));
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


export interface Position_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
