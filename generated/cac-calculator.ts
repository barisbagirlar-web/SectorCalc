// Auto-generated from cac-calculator-schema.json
import * as z from 'zod';

export interface Cac_calculatorInput {
  marketingCosts: number;
  salesCosts: number;
  technologyCosts: number;
  otherCosts: number;
  newCustomers: number;
  dataConfidence?: number;
}

export const Cac_calculatorInputSchema = z.object({
  marketingCosts: z.number().default(10000),
  salesCosts: z.number().default(8000),
  technologyCosts: z.number().default(2000),
  otherCosts: z.number().default(1500),
  newCustomers: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Cac_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.marketingCosts + input.salesCosts + input.technologyCosts + input.otherCosts; results["totalAcquisitionCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAcquisitionCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalAcquisitionCost"])) / input.newCustomers; results["cac"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cac"] = 0; }
  try { const v = input.marketingCosts / (asFormulaNumber(results["totalAcquisitionCost"])); results["marketingCostRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["marketingCostRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCac_calculator(input: Cac_calculatorInput): Cac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["cac"]));
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


export interface Cac_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
