// Auto-generated from vat-moss-calculator-schema.json
import * as z from 'zod';

export interface Vat_moss_calculatorInput {
  netAmount: number;
  vatRate: number;
  quantity: number;
  discountPercent: number;
  additionalCosts: number;
  dataConfidence?: number;
}

export const Vat_moss_calculatorInputSchema = z.object({
  netAmount: z.number().default(100),
  vatRate: z.number().default(20),
  quantity: z.number().default(1),
  discountPercent: z.number().default(0),
  additionalCosts: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vat_moss_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.netAmount * input.quantity) * (1 - input.discountPercent/100) + input.additionalCosts; results["taxableAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxableAmount"])) * (input.vatRate/100); results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxableAmount"])) + (asFormulaNumber(results["vatAmount"])); results["grossAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVat_moss_calculator(input: Vat_moss_calculatorInput): Vat_moss_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["vatAmount"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Vat_moss_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
