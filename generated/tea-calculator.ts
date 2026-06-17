// @ts-nocheck
// Auto-generated from tea-calculator-schema.json
import * as z from 'zod';

export interface Tea_calculatorInput {
  cups: number;
  waterPerCup: number;
  teaLeavesPerCup: number;
  strengthFactor: number;
  absorptionRate: number;
}

export const Tea_calculatorInputSchema = z.object({
  cups: z.number().default(10),
  waterPerCup: z.number().default(200),
  teaLeavesPerCup: z.number().default(2.5),
  strengthFactor: z.number().default(1),
  absorptionRate: z.number().default(1.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Tea_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.cups * input.waterPerCup + input.cups * input.teaLeavesPerCup * input.strengthFactor * input.absorptionRate) / 1000; results["totalWaterNeeded_liters"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWaterNeeded_liters"] = 0; }
  try { const v = input.cups * input.teaLeavesPerCup * input.strengthFactor; results["totalTeaLeaves_grams"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTeaLeaves_grams"] = 0; }
  try { const v = input.cups * input.teaLeavesPerCup * input.strengthFactor * input.absorptionRate; results["absorbedWater_ml"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["absorbedWater_ml"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTea_calculator(input: Tea_calculatorInput): Tea_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWaterNeeded_liters"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Tea_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
