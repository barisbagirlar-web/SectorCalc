// Auto-generated from reverse-charge-vat-calculator-schema.json
import * as z from 'zod';

export interface Reverse_charge_vat_calculatorInput {
  invoiceNet: number;
  exchangeRate: number;
  vatRate: number;
  isCrossBorder: number;
  dataConfidence?: number;
}

export const Reverse_charge_vat_calculatorInputSchema = z.object({
  invoiceNet: z.number().default(1000),
  exchangeRate: z.number().default(1),
  vatRate: z.number().default(20),
  isCrossBorder: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Reverse_charge_vat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.invoiceNet * input.exchangeRate; results["netAmountLocal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netAmountLocal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netAmountLocal"])) * input.vatRate / 100; results["vatToReport"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatToReport"] = Number.NaN; }
  try { const v = input.invoiceNet; results["totalPayableToSupplier"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPayableToSupplier"] = Number.NaN; }
  return results;
}


export function calculateReverse_charge_vat_calculator(input: Reverse_charge_vat_calculatorInput): Reverse_charge_vat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vatToReport"]);
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


export interface Reverse_charge_vat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
