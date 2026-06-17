// @ts-nocheck
// Auto-generated from quick-ratio-calculator-schema.json
import * as z from 'zod';

export interface Quick_ratio_calculatorInput {
  cashEquivalents: number;
  marketableSecurities: number;
  accountsReceivable: number;
  currentLiabilities: number;
}

export const Quick_ratio_calculatorInputSchema = z.object({
  cashEquivalents: z.number().default(0),
  marketableSecurities: z.number().default(0),
  accountsReceivable: z.number().default(0),
  currentLiabilities: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Quick_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.cashEquivalents + input.marketableSecurities + input.accountsReceivable; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.cashEquivalents + input.marketableSecurities + input.accountsReceivable; results["result_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateQuick_ratio_calculator(input: Quick_ratio_calculatorInput): Quick_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Quick_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
