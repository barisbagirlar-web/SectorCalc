// Auto-generated from ioss-vat-calculator-schema.json
import * as z from 'zod';

export interface Ioss_vat_calculatorInput {
  netPrice: number;
  shippingCost: number;
  vatRate: number;
  dataConfidence?: number;
}

export const Ioss_vat_calculatorInputSchema = z.object({
  netPrice: z.number().default(0),
  shippingCost: z.number().default(0),
  vatRate: z.number().default(21),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ioss_vat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netPrice + input.shippingCost; results["totalExcl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalExcl"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalExcl"])) * input.vatRate / 100; results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalExcl"])) + (toNumericFormulaValue(results["vatAmount"])); results["totalIncl"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalIncl"] = Number.NaN; }
  return results;
}


export function calculateIoss_vat_calculator(input: Ioss_vat_calculatorInput): Ioss_vat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalIncl"]);
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


export interface Ioss_vat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
