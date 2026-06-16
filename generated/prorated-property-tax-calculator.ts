// Auto-generated from prorated-property-tax-calculator-schema.json
import * as z from 'zod';

export interface Prorated_property_tax_calculatorInput {
  annualPropertyTax: number;
  daysInTaxYear: number;
  daysOwned: number;
  otherFees: number;
}

export const Prorated_property_tax_calculatorInputSchema = z.object({
  annualPropertyTax: z.number().default(0),
  daysInTaxYear: z.number().default(365),
  daysOwned: z.number().default(0),
  otherFees: z.number().default(0),
});

function evaluateAllFormulas(input: Prorated_property_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualPropertyTax / input.daysInTaxYear; results["dailyTax"] = Number.isFinite(v) ? v : 0; } catch { results["dailyTax"] = 0; }
  try { const v = (results["dailyTax"] ?? 0) * input.daysOwned; results["proratedTax"] = Number.isFinite(v) ? v : 0; } catch { results["proratedTax"] = 0; }
  try { const v = (results["proratedTax"] ?? 0) + input.otherFees; results["totalTaxDue"] = Number.isFinite(v) ? v : 0; } catch { results["totalTaxDue"] = 0; }
  return results;
}


export function calculateProrated_property_tax_calculator(input: Prorated_property_tax_calculatorInput): Prorated_property_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["proratedTax"] ?? 0;
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


export interface Prorated_property_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
