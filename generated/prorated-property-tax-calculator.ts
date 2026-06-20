// Auto-generated from prorated-property-tax-calculator-schema.json
import * as z from 'zod';

export interface Prorated_property_tax_calculatorInput {
  annualPropertyTax: number;
  daysInTaxYear: number;
  daysOwned: number;
  otherFees: number;
  dataConfidence?: number;
}

export const Prorated_property_tax_calculatorInputSchema = z.object({
  annualPropertyTax: z.number().default(0),
  daysInTaxYear: z.number().default(365),
  daysOwned: z.number().default(0),
  otherFees: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Prorated_property_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.annualPropertyTax / input.daysInTaxYear; results["dailyTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyTax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyTax"])) * input.daysOwned; results["proratedTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["proratedTax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["proratedTax"])) + input.otherFees; results["totalTaxDue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTaxDue"] = Number.NaN; }
  return results;
}


export function calculateProrated_property_tax_calculator(input: Prorated_property_tax_calculatorInput): Prorated_property_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["proratedTax"]);
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


export interface Prorated_property_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
