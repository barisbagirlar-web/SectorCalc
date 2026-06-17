// @ts-nocheck
// Auto-generated from ctr-calculator-schema.json
import * as z from 'zod';

export interface Ctr_calculatorInput {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalCost: number;
  ctrTarget: number;
}

export const Ctr_calculatorInputSchema = z.object({
  totalImpressions: z.number().default(0),
  totalClicks: z.number().default(0),
  totalConversions: z.number().default(0),
  totalCost: z.number().default(0),
  ctrTarget: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ctr_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalImpressions !== 0 ? (input.totalClicks / input.totalImpressions) * 100 : 0; results["ctr"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["ctr"] = 0; }
  try { const v = input.totalClicks !== 0 ? (input.totalConversions / input.totalClicks) * 100 : 0; results["conversionRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["conversionRate"] = 0; }
  try { const v = ((input.totalClicks !== 0 ? input.totalCost / input.totalClicks : 0) ? 1 : 0); results["costPerClick"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costPerClick"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCtr_calculator(input: Ctr_calculatorInput): Ctr_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["ctr"]);
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


export interface Ctr_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
