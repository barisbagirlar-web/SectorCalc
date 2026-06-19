// Auto-generated from roas-calculator-schema.json
import * as z from 'zod';

export interface Roas_calculatorInput {
  spendA: number;
  spendB: number;
  revenueA: number;
  revenueB: number;
  dataConfidence?: number;
}

export const Roas_calculatorInputSchema = z.object({
  spendA: z.number().default(0),
  spendB: z.number().default(0),
  revenueA: z.number().default(0),
  revenueB: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Roas_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.spendA + input.spendB; results["totalSpend"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSpend"] = 0; }
  try { const v = input.revenueA + input.revenueB; results["totalRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalRevenue"] = 0; }
  try { const v = (asFormulaNumber(results["totalRevenue"])) / (asFormulaNumber(results["totalSpend"])); results["roas"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roas"] = 0; }
  try { const v = (asFormulaNumber(results["roas"])) * 100; results["roasPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roasPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateRoas_calculator(input: Roas_calculatorInput): Roas_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["roas"]);
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


export interface Roas_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
