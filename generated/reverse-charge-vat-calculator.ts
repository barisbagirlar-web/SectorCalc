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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reverse_charge_vat_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.invoiceNet * input.exchangeRate; results["netAmountLocal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netAmountLocal"] = 0; }
  try { const v = (asFormulaNumber(results["netAmountLocal"])) * input.vatRate / 100; results["vatToReport"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vatToReport"] = 0; }
  try { const v = input.invoiceNet; results["totalPayableToSupplier"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPayableToSupplier"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReverse_charge_vat_calculator(input: Reverse_charge_vat_calculatorInput): Reverse_charge_vat_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["vatToReport"]));
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


export interface Reverse_charge_vat_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
