// Auto-generated from jewelry-calculator-schema.json
import * as z from 'zod';

export interface Jewelry_calculatorInput {
  metalWeight: number;
  metalPurity: number;
  metalPricePerGram: number;
  gemstoneCost: number;
  laborCost: number;
  markupPercent: number;
}

export const Jewelry_calculatorInputSchema = z.object({
  metalWeight: z.number().default(5),
  metalPurity: z.number().default(18),
  metalPricePerGram: z.number().default(60),
  gemstoneCost: z.number().default(0),
  laborCost: z.number().default(50),
  markupPercent: z.number().default(100),
});

function evaluateAllFormulas(input: Jewelry_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.metalWeight * (input.metalPurity / 24) * input.metalPricePerGram; results["metalCost"] = Number.isFinite(v) ? v : 0; } catch { results["metalCost"] = 0; }
  try { const v = (results["metalCost"] ?? 0) + input.gemstoneCost; results["materialCost"] = Number.isFinite(v) ? v : 0; } catch { results["materialCost"] = 0; }
  try { const v = (results["materialCost"] ?? 0) + input.laborCost; results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) * (input.markupPercent / 100); results["markupAmount"] = Number.isFinite(v) ? v : 0; } catch { results["markupAmount"] = 0; }
  try { const v = (results["totalCost"] ?? 0) + (results["markupAmount"] ?? 0); results["finalPrice"] = Number.isFinite(v) ? v : 0; } catch { results["finalPrice"] = 0; }
  return results;
}


export function calculateJewelry_calculator(input: Jewelry_calculatorInput): Jewelry_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalPrice"] ?? 0;
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


export interface Jewelry_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
