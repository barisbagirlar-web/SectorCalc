// @ts-nocheck
// Auto-generated from property-tax-calculator-schema.json
import * as z from 'zod';

export interface Property_tax_calculatorInput {
  marketValue: number;
  assessmentRatio: number;
  millRate: number;
  exemptionAmount: number;
  additionalFees: number;
}

export const Property_tax_calculatorInputSchema = z.object({
  marketValue: z.number().default(300000),
  assessmentRatio: z.number().default(80),
  millRate: z.number().default(20),
  exemptionAmount: z.number().default(0),
  additionalFees: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Property_tax_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.marketValue * (input.assessmentRatio / 100); results["assessedValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["assessedValue"] = 0; }
  try { const v = ((asFormulaNumber(results["assessedValue"])) * input.millRate) / 1000; results["taxBeforeExemptions"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxBeforeExemptions"] = 0; }
  try { const v = (asFormulaNumber(results["taxBeforeExemptions"])) - input.exemptionAmount + input.additionalFees; results["totalTax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTax"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateProperty_tax_calculator(input: Property_tax_calculatorInput): Property_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTax"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
