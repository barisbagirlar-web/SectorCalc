// Auto-generated from gst-calculator-schema.json
import * as z from 'zod';

export interface Gst_calculatorInput {
  amount: number;
  gstRate: number;
  country: number;
}

export const Gst_calculatorInputSchema = z.object({
  amount: z.number().default(100),
  gstRate: z.number().default(10),
  country: z.number().default(1),
});

function evaluateAllFormulas(input: Gst_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.amount * input.gstRate / 100; results["gstAmount"] = Number.isFinite(v) ? v : 0; } catch { results["gstAmount"] = 0; }
  try { const v = input.amount + (results["gstAmount"] ?? 0); results["totalInclGst"] = Number.isFinite(v) ? v : 0; } catch { results["totalInclGst"] = 0; }
  try { const v = input.gstRate / 100; results["gstRateDecimal"] = Number.isFinite(v) ? v : 0; } catch { results["gstRateDecimal"] = 0; }
  try { const v = input.amount; results["amountExclGst"] = Number.isFinite(v) ? v : 0; } catch { results["amountExclGst"] = 0; }
  try { const v = input.country === 1 ? 0.1 : input.country === 2 ? 0.05 : 0.18; results["effectiveRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRate"] = 0; }
  return results;
}


export function calculateGst_calculator(input: Gst_calculatorInput): Gst_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalInclGst"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
