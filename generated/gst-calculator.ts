// Auto-generated from gst-calculator-schema.json
import * as z from 'zod';

export interface Gst_calculatorInput {
  amount: number;
  gstRate: number;
  country: number;
  dataConfidence?: number;
}

export const Gst_calculatorInputSchema = z.object({
  amount: z.number().default(100),
  gstRate: z.number().default(10),
  country: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gst_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.amount * input.gstRate / 100; results["gstAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gstAmount"] = Number.NaN; }
  try { const v = input.amount + (toNumericFormulaValue(results["gstAmount"])); results["totalInclGst"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalInclGst"] = Number.NaN; }
  try { const v = input.gstRate / 100; results["gstRateDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["gstRateDecimal"] = Number.NaN; }
  try { const v = input.amount; results["amountExclGst"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["amountExclGst"] = Number.NaN; }
  try { const v = input.country === 1 ? 0.1 : input.country === 2 ? 0.05 : 0.18; results["effectiveRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveRate"] = Number.NaN; }
  return results;
}


export function calculateGst_calculator(input: Gst_calculatorInput): Gst_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalInclGst"]);
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


export interface Gst_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
