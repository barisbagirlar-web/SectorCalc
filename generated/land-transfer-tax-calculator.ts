// Auto-generated from land-transfer-tax-calculator-schema.json
import * as z from 'zod';

export interface Land_transfer_tax_calculatorInput {
  propertyValue: number;
  taxRate: number;
  exemptionAmount: number;
  isFirstTimeBuyer: number;
  fixedFee: number;
}

export const Land_transfer_tax_calculatorInputSchema = z.object({
  propertyValue: z.number().default(500000),
  taxRate: z.number().default(2.5),
  exemptionAmount: z.number().default(4000),
  isFirstTimeBuyer: z.number().default(0),
  fixedFee: z.number().default(250),
});

function evaluateAllFormulas(input: Land_transfer_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.propertyValue * (input.taxRate / 100); results["baseTax"] = Number.isFinite(v) ? v : 0; } catch { results["baseTax"] = 0; }
  try { const v = input.isFirstTimeBuyer * input.exemptionAmount; results["exemptionApplied"] = Number.isFinite(v) ? v : 0; } catch { results["exemptionApplied"] = 0; }
  try { const v = (results["baseTax"] ?? 0) - (results["exemptionApplied"] ?? 0) > 0 ? (results["baseTax"] ?? 0) - (results["exemptionApplied"] ?? 0) : 0; results["netTax"] = Number.isFinite(v) ? v : 0; } catch { results["netTax"] = 0; }
  try { const v = (results["netTax"] ?? 0) + input.fixedFee; results["totalTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalTax"] = 0; }
  return results;
}


export function calculateLand_transfer_tax_calculator(input: Land_transfer_tax_calculatorInput): Land_transfer_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalTax"] ?? 0;
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


export interface Land_transfer_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
