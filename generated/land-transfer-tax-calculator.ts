// Auto-generated from land-transfer-tax-calculator-schema.json
import * as z from 'zod';

export interface Land_transfer_tax_calculatorInput {
  propertyValue: number;
  taxRate: number;
  exemptionAmount: number;
  isFirstTimeBuyer: number;
  fixedFee: number;
  dataConfidence?: number;
}

export const Land_transfer_tax_calculatorInputSchema = z.object({
  propertyValue: z.number().default(500000),
  taxRate: z.number().default(2.5),
  exemptionAmount: z.number().default(4000),
  isFirstTimeBuyer: z.number().default(0),
  fixedFee: z.number().default(250),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Land_transfer_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyValue * (input.taxRate / 100); results["baseTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseTax"] = Number.NaN; }
  try { const v = input.isFirstTimeBuyer * input.exemptionAmount; results["exemptionApplied"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["exemptionApplied"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseTax"])) - (toNumericFormulaValue(results["exemptionApplied"])) > 0 ? (toNumericFormulaValue(results["baseTax"])) - (toNumericFormulaValue(results["exemptionApplied"])) : 0; results["netTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netTax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netTax"])) + input.fixedFee; results["totalTax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTax"] = Number.NaN; }
  return results;
}


export function calculateLand_transfer_tax_calculator(input: Land_transfer_tax_calculatorInput): Land_transfer_tax_calculatorOutput {
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


export interface Land_transfer_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
