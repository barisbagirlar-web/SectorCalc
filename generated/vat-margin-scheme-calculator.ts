// Auto-generated from vat-margin-scheme-calculator-schema.json
import * as z from 'zod';

export interface Vat_margin_scheme_calculatorInput {
  purchasePrice: number;
  sellingPrice: number;
  vatRate: number;
  allowableCosts: number;
}

export const Vat_margin_scheme_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(0),
  sellingPrice: z.number().default(0),
  vatRate: z.number().default(20),
  allowableCosts: z.number().default(0),
});

function evaluateAllFormulas(input: Vat_margin_scheme_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice - input.purchasePrice - input.allowableCosts; results["grossMargin"] = Number.isFinite(v) ? v : 0; } catch { results["grossMargin"] = 0; }
  try { const v = (results["grossMargin"] ?? 0) * input.vatRate / (100 + input.vatRate); results["vatDue"] = Number.isFinite(v) ? v : 0; } catch { results["vatDue"] = 0; }
  try { const v = (results["grossMargin"] ?? 0) - (results["vatDue"] ?? 0); results["netMargin"] = Number.isFinite(v) ? v : 0; } catch { results["netMargin"] = 0; }
  return results;
}


export function calculateVat_margin_scheme_calculator(input: Vat_margin_scheme_calculatorInput): Vat_margin_scheme_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["vatDue"] ?? 0;
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


export interface Vat_margin_scheme_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
