// Auto-generated from property-tax-calculator-schema.json
import * as z from 'zod';

export interface Property_tax_calculatorInput {
  marketValue: number;
  assessmentRatio: number;
  millRate: number;
  exemptionAmount: number;
  additionalFees: number;
  dataConfidence?: number;
}

export const Property_tax_calculatorInputSchema = z.object({
  marketValue: z.number().default(300000),
  assessmentRatio: z.number().default(80),
  millRate: z.number().default(20),
  exemptionAmount: z.number().default(0),
  additionalFees: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Property_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.marketValue * (input.assessmentRatio / 100); results["assessedValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["assessedValue"] = Number.NaN; }
  try { const v = ((toNumericFormulaValue(results["assessedValue"])) * input.millRate) / 1000; results["taxBeforeExemptions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxBeforeExemptions"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxBeforeExemptions"])) - input.exemptionAmount + input.additionalFees; results["totalTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTax"] = Number.NaN; }
  return results;
}


export function calculateProperty_tax_calculator(input: Property_tax_calculatorInput): Property_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTax"]);
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


export interface Property_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
