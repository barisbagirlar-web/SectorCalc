// @ts-nocheck
// Auto-generated from small-business-grants-calculator-schema.json
import * as z from 'zod';

export interface Small_business_grants_calculatorInput {
  avgAnnualRevenue: number;
  numEmployees: number;
  projectCost: number;
  matchingFunds: number;
  isMinorityOwned: number;
  isWomanOwned: number;
}

export const Small_business_grants_calculatorInputSchema = z.object({
  avgAnnualRevenue: z.number().default(100000),
  numEmployees: z.number().default(10),
  projectCost: z.number().default(50000),
  matchingFunds: z.number().default(10000),
  isMinorityOwned: z.number().default(0),
  isWomanOwned: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Small_business_grants_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.avgAnnualRevenue + input.numEmployees + input.projectCost; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.avgAnnualRevenue + input.numEmployees + input.projectCost; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSmall_business_grants_calculator(input: Small_business_grants_calculatorInput): Small_business_grants_calculatorOutput {
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


export interface Small_business_grants_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
