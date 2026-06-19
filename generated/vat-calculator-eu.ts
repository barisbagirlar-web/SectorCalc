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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vat_calculator_euInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.netAmount * (1 - input.discountPercent / 100); results["discountedNet"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["discountedNet"] = 0; }
  try { const v = (asFormulaNumber(results["discountedNet"])) * (input.vatRate / 100); results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (asFormulaNumber(results["discountedNet"])) + (asFormulaNumber(results["vatAmount"])); results["grossAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossAmount"] = 0; }
  try { const v = (asFormulaNumber(results["discountedNet"])) * input.quantity; results["totalNet"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalNet"] = 0; }
  try { const v = (asFormulaNumber(results["vatAmount"])) * input.quantity; results["totalVat"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVat"] = 0; }
  try { const v = (asFormulaNumber(results["grossAmount"])) * input.quantity; results["totalGross"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalGross"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVat_calculator_eu(input: Vat_calculator_euInput): Vat_calculator_euOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalGross"]));
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


export interface Vat_calculator_euOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
