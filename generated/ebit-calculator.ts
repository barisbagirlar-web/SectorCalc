// @ts-nocheck
// Auto-generated from ebit-calculator-schema.json
import * as z from 'zod';

export interface Ebit_calculatorInput {
  revenue: number;
  cogs: number;
  sga: number;
  rd: number;
  da: number;
  otherOpEx: number;
}

export const Ebit_calculatorInputSchema = z.object({
  revenue: z.number().default(0),
  cogs: z.number().default(0),
  sga: z.number().default(0),
  rd: z.number().default(0),
  da: z.number().default(0),
  otherOpEx: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ebit_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.revenue - input.cogs; results["grossProfit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["grossProfit"] = 0; }
  try { const v = input.sga + input.rd + input.da + input.otherOpEx; results["totalOpEx"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalOpEx"] = 0; }
  try { const v = (asFormulaNumber(results["grossProfit"])) - (asFormulaNumber(results["totalOpEx"])); results["ebit"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ebit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateEbit_calculator(input: Ebit_calculatorInput): Ebit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ebit"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
