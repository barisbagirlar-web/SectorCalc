// Auto-generated from oss-vat-calculator-schema.json
import * as z from 'zod';

export interface Oss_vat_calculatorInput {
  netAmount: number;
  vatRate: number;
  quantity: number;
  discount: number;
  additionalCost: number;
  dataConfidence?: number;
}

export const Oss_vat_calculatorInputSchema = z.object({
  netAmount: z.number().default(1000),
  vatRate: z.number().default(20),
  quantity: z.number().default(1),
  discount: z.number().default(0),
  additionalCost: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Oss_vat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netAmount * (1 - input.discount / 100); results["discountedNet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountedNet"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["discountedNet"])) * input.quantity + input.additionalCost; results["totalNet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalNet"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalNet"])) * input.vatRate / 100; results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalNet"])) + (toNumericFormulaValue(results["vatAmount"])); results["grossTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossTotal"] = Number.NaN; }
  return results;
}


export function calculateOss_vat_calculator(input: Oss_vat_calculatorInput): Oss_vat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["grossTotal"]);
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


export interface Oss_vat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
