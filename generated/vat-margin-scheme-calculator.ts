// Auto-generated from vat-margin-scheme-calculator-schema.json
import * as z from 'zod';

export interface Vat_margin_scheme_calculatorInput {
  purchasePrice: number;
  sellingPrice: number;
  vatRate: number;
  allowableCosts: number;
  dataConfidence?: number;
}

export const Vat_margin_scheme_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(0),
  sellingPrice: z.number().default(0),
  vatRate: z.number().default(20),
  allowableCosts: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vat_margin_scheme_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sellingPrice - input.purchasePrice - input.allowableCosts; results["grossMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossMargin"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossMargin"])) * input.vatRate / (100 + input.vatRate); results["vatDue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatDue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossMargin"])) - (toNumericFormulaValue(results["vatDue"])); results["netMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netMargin"] = Number.NaN; }
  return results;
}


export function calculateVat_margin_scheme_calculator(input: Vat_margin_scheme_calculatorInput): Vat_margin_scheme_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vatDue"]);
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


export interface Vat_margin_scheme_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
