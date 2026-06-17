// @ts-nocheck
// Auto-generated from greywater-calculator-schema.json
import * as z from 'zod';

export interface Greywater_calculatorInput {
  numberOfPeople: number;
  dailyWaterUsagePerPerson: number;
  greywaterFraction: number;
  systemEfficiency: number;
  waterCostPerCubicMeter: number;
}

export const Greywater_calculatorInputSchema = z.object({
  numberOfPeople: z.number().default(4),
  dailyWaterUsagePerPerson: z.number().default(100),
  greywaterFraction: z.number().default(0.65),
  systemEfficiency: z.number().default(0.8),
  waterCostPerCubicMeter: z.number().default(3.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Greywater_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.numberOfPeople * input.dailyWaterUsagePerPerson * input.greywaterFraction; results["dailyGreywaterProduction"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyGreywaterProduction"] = 0; }
  try { const v = (asFormulaNumber(results["dailyGreywaterProduction"])) * input.systemEfficiency; results["dailyReusableWater"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dailyReusableWater"] = 0; }
  try { const v = (asFormulaNumber(results["dailyReusableWater"])) * 365 / 1000; results["annualWaterSaved"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualWaterSaved"] = 0; }
  try { const v = (asFormulaNumber(results["annualWaterSaved"])) * input.waterCostPerCubicMeter; results["annualCostSaved"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualCostSaved"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateGreywater_calculator(input: Greywater_calculatorInput): Greywater_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyReusableWater"]);
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


export interface Greywater_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
