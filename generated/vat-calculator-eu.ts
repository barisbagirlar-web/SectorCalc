// Auto-generated from vat-calculator-eu-schema.json
import * as z from 'zod';

export interface Vat_calculator_euInput {
  netAmount: number;
  vatRate: number;
  quantity: number;
  discountPercent: number;
  dataConfidence?: number;
}

export const Vat_calculator_euInputSchema = z.object({
  netAmount: z.number().default(100),
  vatRate: z.number().default(20),
  quantity: z.number().default(1),
  discountPercent: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vat_calculator_euInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netAmount * (1 - input.discountPercent / 100); results["discountedNet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountedNet"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["discountedNet"])) * (input.vatRate / 100); results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["discountedNet"])) + (toNumericFormulaValue(results["vatAmount"])); results["grossAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["discountedNet"])) * input.quantity; results["totalNet"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalNet"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["vatAmount"])) * input.quantity; results["totalVat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalVat"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["grossAmount"])) * input.quantity; results["totalGross"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalGross"] = Number.NaN; }
  return results;
}


export function calculateVat_calculator_eu(input: Vat_calculator_euInput): Vat_calculator_euOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalGross"]);
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


export interface Vat_calculator_euOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
