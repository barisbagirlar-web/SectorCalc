// Auto-generated from capital-gains-tax-calculator-schema.json
import * as z from 'zod';

export interface Capital_gains_tax_calculatorInput {
  purchasePrice: number;
  salePrice: number;
  acquisitionCost: number;
  improvementCost: number;
  exemption: number;
  taxRate: number;
  dataConfidence?: number;
}

export const Capital_gains_tax_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(10000),
  salePrice: z.number().default(15000),
  acquisitionCost: z.number().default(500),
  improvementCost: z.number().default(0),
  exemption: z.number().default(0),
  taxRate: z.number().default(15),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Capital_gains_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salePrice - (input.purchasePrice + input.acquisitionCost + input.improvementCost); results["capitalGain"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["capitalGain"] = 0; }
  try { const v = input.salePrice - (input.purchasePrice + input.acquisitionCost + input.improvementCost); results["capitalGain_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["capitalGain_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCapital_gains_tax_calculator(input: Capital_gains_tax_calculatorInput): Capital_gains_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["capitalGain_aux"]);
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


export interface Capital_gains_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
