// Auto-generated from estate-tax-calculator-schema.json
import * as z from 'zod';

export interface Estate_tax_calculatorInput {
  grossEstateValue: number;
  standardExemption: number;
  otherDeductions: number;
  taxRate: number;
  surchargeThreshold: number;
  surchargeRate: number;
}

export const Estate_tax_calculatorInputSchema = z.object({
  grossEstateValue: z.number().default(1000000),
  standardExemption: z.number().default(500000),
  otherDeductions: z.number().default(0),
  taxRate: z.number().default(40),
  surchargeThreshold: z.number().default(10000000),
  surchargeRate: z.number().default(4),
});

function evaluateAllFormulas(input: Estate_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.grossEstateValue - input.standardExemption - input.otherDeductions); results["taxableEstate"] = Number.isFinite(v) ? v : 0; } catch { results["taxableEstate"] = 0; }
  try { const v = (results["taxableEstate"] ?? 0) * (input.taxRate / 100); results["baseTax"] = Number.isFinite(v) ? v : 0; } catch { results["baseTax"] = 0; }
  try { const v = (results["taxableEstate"] ?? 0) > input.surchargeThreshold ? ((results["taxableEstate"] ?? 0) - input.surchargeThreshold) * (input.surchargeRate / 100) : 0; results["surcharge"] = Number.isFinite(v) ? v : 0; } catch { results["surcharge"] = 0; }
  try { const v = (results["baseTax"] ?? 0) + (results["surcharge"] ?? 0); results["totalTax"] = Number.isFinite(v) ? v : 0; } catch { results["totalTax"] = 0; }
  return results;
}


export function calculateEstate_tax_calculator(input: Estate_tax_calculatorInput): Estate_tax_calculatorOutput {
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


export interface Estate_tax_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
