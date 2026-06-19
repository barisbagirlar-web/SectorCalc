// Auto-generated from estate-tax-calculator-schema.json
import * as z from 'zod';

export interface Estate_tax_calculatorInput {
  grossEstateValue: number;
  standardExemption: number;
  otherDeductions: number;
  taxRate: number;
  surchargeThreshold: number;
  surchargeRate: number;
  dataConfidence?: number;
}

export const Estate_tax_calculatorInputSchema = z.object({
  grossEstateValue: z.number().default(1000000),
  standardExemption: z.number().default(500000),
  otherDeductions: z.number().default(0),
  taxRate: z.number().default(40),
  surchargeThreshold: z.number().default(10000000),
  surchargeRate: z.number().default(4),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Estate_tax_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.grossEstateValue * input.standardExemption * input.otherDeductions * (input.taxRate / 100); results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.grossEstateValue * input.standardExemption * input.otherDeductions * (input.taxRate / 100) * (input.surchargeThreshold * (input.surchargeRate / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.surchargeThreshold * (input.surchargeRate / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEstate_tax_calculator(input: Estate_tax_calculatorInput): Estate_tax_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
