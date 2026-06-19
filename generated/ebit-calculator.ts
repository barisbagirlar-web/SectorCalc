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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ebit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.revenue - input.cogs; results["grossProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = input.sga + input.rd + input.da + input.otherOpEx; results["totalOpEx"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalOpEx"] = 0; }
  try { const v = (asFormulaNumber(results["grossProfit"])) - (asFormulaNumber(results["totalOpEx"])); results["ebit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ebit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEbit_calculator(input: Ebit_calculatorInput): Ebit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["ebit"]));
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


export interface Ebit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
