// Auto-generated from ebit-calculator-schema.json
import * as z from 'zod';

export interface Ebit_calculatorInput {
  revenue: number;
  cogs: number;
  sga: number;
  rd: number;
  da: number;
  otherOpEx: number;
  dataConfidence?: number;
}

export const Ebit_calculatorInputSchema = z.object({
  revenue: z.number().default(0),
  cogs: z.number().default(0),
  sga: z.number().default(0),
  rd: z.number().default(0),
  da: z.number().default(0),
  otherOpEx: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ebit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.cogs; results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossProfit"] = Number.NaN; }
  try { const v = input.sga + input.rd + input.da + input.otherOpEx; results["totalOpEx"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalOpEx"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossProfit"])) - (toNumericFormulaValue(results["totalOpEx"])); results["ebit"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ebit"] = Number.NaN; }
  return results;
}


export function calculateEbit_calculator(input: Ebit_calculatorInput): Ebit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ebit"]);
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


export interface Ebit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
