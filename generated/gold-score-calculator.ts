// Auto-generated from gold-score-calculator-schema.json
import * as z from 'zod';

export interface Gold_score_calculatorInput {
  weight: number;
  purity: number;
  marketPrice: number;
  makingChargePercent: number;
  taxRatePercent: number;
}

export const Gold_score_calculatorInputSchema = z.object({
  weight: z.number().default(10),
  purity: z.number().default(24),
  marketPrice: z.number().default(50),
  makingChargePercent: z.number().default(5),
  taxRatePercent: z.number().default(20),
});

function evaluateAllFormulas(input: Gold_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * (input.purity / 24) * input.marketPrice; results["goldContentValue"] = Number.isFinite(v) ? v : 0; } catch { results["goldContentValue"] = 0; }
  try { const v = (results["goldContentValue"] ?? 0) * (input.makingChargePercent / 100); results["makingCharges"] = Number.isFinite(v) ? v : 0; } catch { results["makingCharges"] = 0; }
  try { const v = ((results["goldContentValue"] ?? 0) + (results["makingCharges"] ?? 0)) * (input.taxRatePercent / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["goldContentValue"] ?? 0) + (results["makingCharges"] ?? 0) + (results["taxAmount"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = ((results["goldContentValue"] ?? 0) / (results["totalCost"] ?? 0)) * 100; results["goldScore"] = Number.isFinite(v) ? v : 0; } catch { results["goldScore"] = 0; }
  return results;
}


export function calculateGold_score_calculator(input: Gold_score_calculatorInput): Gold_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["goldScore"] ?? 0;
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


export interface Gold_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
