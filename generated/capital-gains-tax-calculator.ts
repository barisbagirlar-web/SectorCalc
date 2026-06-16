// Auto-generated from capital-gains-tax-calculator-schema.json
import * as z from 'zod';

export interface Capital_gains_tax_calculatorInput {
  purchasePrice: number;
  salePrice: number;
  acquisitionCost: number;
  improvementCost: number;
  exemption: number;
  taxRate: number;
}

export const Capital_gains_tax_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(10000),
  salePrice: z.number().default(15000),
  acquisitionCost: z.number().default(500),
  improvementCost: z.number().default(0),
  exemption: z.number().default(0),
  taxRate: z.number().default(15),
});

function evaluateAllFormulas(input: Capital_gains_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.salePrice - (input.purchasePrice + input.acquisitionCost + input.improvementCost); results["capitalGain"] = Number.isFinite(v) ? v : 0; } catch { results["capitalGain"] = 0; }
  try { const v = Math.max(0, input.salePrice - (input.purchasePrice + input.acquisitionCost + input.improvementCost) - input.exemption); results["taxableGain"] = Number.isFinite(v) ? v : 0; } catch { results["taxableGain"] = 0; }
  try { const v = (Math.max(0, input.salePrice - (input.purchasePrice + input.acquisitionCost + input.improvementCost) - input.exemption) * input.taxRate) / 100; results["taxOwed"] = Number.isFinite(v) ? v : 0; } catch { results["taxOwed"] = 0; }
  return results;
}


export function calculateCapital_gains_tax_calculator(input: Capital_gains_tax_calculatorInput): Capital_gains_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["taxOwed"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
