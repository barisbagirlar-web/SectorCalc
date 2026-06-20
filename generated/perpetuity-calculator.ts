// Auto-generated from perpetuity-calculator-schema.json
import * as z from 'zod';

export interface Perpetuity_calculatorInput {
  type: number;
  payment: number;
  discountRate: number;
  growthRate: number;
  dataConfidence?: number;
}

export const Perpetuity_calculatorInputSchema = z.object({
  type: z.number().default(0),
  payment: z.number().default(1000),
  discountRate: z.number().default(5),
  growthRate: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Perpetuity_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.type === 0 ? (input.payment * 100) / input.discountRate : (input.payment * 100) / (input.discountRate - input.growthRate); results["presentValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["presentValue"] = Number.NaN; }
  try { const v = input.payment; results["paymentDisplay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paymentDisplay"] = Number.NaN; }
  try { const v = input.discountRate; results["discountRateDisplay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountRateDisplay"] = Number.NaN; }
  try { const v = input.growthRate; results["growthRateDisplay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["growthRateDisplay"] = Number.NaN; }
  try { const v = input.type; results["typeDisplay"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["typeDisplay"] = Number.NaN; }
  return results;
}


export function calculatePerpetuity_calculator(input: Perpetuity_calculatorInput): Perpetuity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["presentValue"]);
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


export interface Perpetuity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
