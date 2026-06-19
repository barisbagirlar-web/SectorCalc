// Auto-generated from rsu-calculator-schema.json
import * as z from 'zod';

export interface Rsu_calculatorInput {
  totalRSUs: number;
  vestedPercentage: number;
  sharePrice: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Rsu_calculatorInputSchema = z.object({
  totalRSUs: z.number().default(1000),
  vestedPercentage: z.number().default(100),
  sharePrice: z.number().default(50),
  taxRate: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rsu_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalRSUs * (input.vestedPercentage / 100); results["vestedShares"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vestedShares"] = 0; }
  try { const v = (asFormulaNumber(results["vestedShares"])) * input.sharePrice; results["preTaxValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["preTaxValue"] = 0; }
  try { const v = (asFormulaNumber(results["preTaxValue"])) * (input.taxRate / 100); results["estimatedTax"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["estimatedTax"] = 0; }
  try { const v = (asFormulaNumber(results["preTaxValue"])) - (asFormulaNumber(results["estimatedTax"])); results["netValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRsu_calculator(input: Rsu_calculatorInput): Rsu_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netValue"]));
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


export interface Rsu_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
