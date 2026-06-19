// Auto-generated from commission-calculator-schema.json
import * as z from 'zod';

export interface Commission_calculatorInput {
  totalSales: number;
  baseCommissionRate: number;
  highTierThreshold: number;
  highTierRate: number;
  dataConfidence?: number;
}

export const Commission_calculatorInputSchema = z.object({
  totalSales: z.number().default(5000),
  baseCommissionRate: z.number().default(5),
  highTierThreshold: z.number().default(10000),
  highTierRate: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Commission_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalSales <= input.highTierThreshold ? input.totalSales * input.baseCommissionRate / 100 : input.highTierThreshold * input.baseCommissionRate / 100; results["tier1Commission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tier1Commission"] = 0; }
  try { const v = input.totalSales > input.highTierThreshold ? (input.totalSales - input.highTierThreshold) * input.highTierRate / 100 : 0; results["tier2Commission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["tier2Commission"] = 0; }
  try { const v = (asFormulaNumber(results["tier1Commission"])) + (asFormulaNumber(results["tier2Commission"])); results["totalCommission"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCommission"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCommission_calculator(input: Commission_calculatorInput): Commission_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalCommission"]));
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


export interface Commission_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
