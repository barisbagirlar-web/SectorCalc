// Auto-generated from wedding-guest-calculator-schema.json
import * as z from 'zod';

export interface Wedding_guest_calculatorInput {
  guestCount: number;
  costPerPlate: number;
  venueCost: number;
  decorationCost: number;
  entertainmentCost: number;
  miscPercent: number;
  dataConfidence?: number;
}

export const Wedding_guest_calculatorInputSchema = z.object({
  guestCount: z.number().default(100),
  costPerPlate: z.number().default(50),
  venueCost: z.number().default(2000),
  decorationCost: z.number().default(1500),
  entertainmentCost: z.number().default(3000),
  miscPercent: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Wedding_guest_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.venueCost + input.decorationCost + input.entertainmentCost + (input.costPerPlate * input.guestCount); results["baseCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseCost"])) * (input.miscPercent / 100); results["miscAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["miscAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseCost"])) + (toNumericFormulaValue(results["miscAmount"])); results["totalWeddingBudget"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWeddingBudget"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalWeddingBudget"])) / input.guestCount; results["costPerGuest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerGuest"] = Number.NaN; }
  return results;
}


export function calculateWedding_guest_calculator(input: Wedding_guest_calculatorInput): Wedding_guest_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWeddingBudget"]);
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


export interface Wedding_guest_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
