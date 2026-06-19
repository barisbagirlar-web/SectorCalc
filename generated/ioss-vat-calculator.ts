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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ioss_vat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netPrice + input.shippingCost; results["totalExcl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalExcl"] = 0; }
  try { const v = (asFormulaNumber(results["totalExcl"])) * input.vatRate / 100; results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalExcl"])) + (asFormulaNumber(results["vatAmount"])); results["totalIncl"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalIncl"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
