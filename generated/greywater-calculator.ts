// Auto-generated from greywater-calculator-schema.json
import * as z from 'zod';

export interface Greywater_calculatorInput {
  numberOfPeople: number;
  dailyWaterUsagePerPerson: number;
  greywaterFraction: number;
  systemEfficiency: number;
  waterCostPerCubicMeter: number;
  dataConfidence?: number;
}

export const Greywater_calculatorInputSchema = z.object({
  numberOfPeople: z.number().default(4),
  dailyWaterUsagePerPerson: z.number().default(100),
  greywaterFraction: z.number().default(0.65),
  systemEfficiency: z.number().default(0.8),
  waterCostPerCubicMeter: z.number().default(3.5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Greywater_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfPeople * input.dailyWaterUsagePerPerson * input.greywaterFraction; results["dailyGreywaterProduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyGreywaterProduction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyGreywaterProduction"])) * input.systemEfficiency; results["dailyReusableWater"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dailyReusableWater"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["dailyReusableWater"])) * 365 / 1000; results["annualWaterSaved"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualWaterSaved"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["annualWaterSaved"])) * input.waterCostPerCubicMeter; results["annualCostSaved"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCostSaved"] = Number.NaN; }
  return results;
}


export function calculateGreywater_calculator(input: Greywater_calculatorInput): Greywater_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dailyReusableWater"]);
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


export interface Greywater_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
