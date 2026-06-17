// @ts-nocheck
// Auto-generated from net-worth-calculator-schema.json
import * as z from 'zod';

export interface Net_worth_calculatorInput {
  cash: number;
  investments: number;
  realEstate: number;
  personalProperty: number;
  otherAssets: number;
  currentDebt: number;
  longTermDebt: number;
  otherDebt: number;
}

export const Net_worth_calculatorInputSchema = z.object({
  cash: z.number().default(0),
  investments: z.number().default(0),
  realEstate: z.number().default(0),
  personalProperty: z.number().default(0),
  otherAssets: z.number().default(0),
  currentDebt: z.number().default(0),
  longTermDebt: z.number().default(0),
  otherDebt: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Net_worth_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.cash + input.investments + input.realEstate + input.personalProperty + input.otherAssets; results["totalAssets"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalAssets"] = 0; }
  try { const v = input.currentDebt + input.longTermDebt + input.otherDebt; results["totalDebt"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDebt"] = 0; }
  try { const v = (asFormulaNumber(results["totalAssets"])) - (asFormulaNumber(results["totalDebt"])); results["netWorth"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["netWorth"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNet_worth_calculator(input: Net_worth_calculatorInput): Net_worth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["netWorth"]);
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


export interface Net_worth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
