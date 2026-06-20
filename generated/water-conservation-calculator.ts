// Auto-generated from water-conservation-calculator-schema.json
import * as z from 'zod';

export interface Water_conservation_calculatorInput {
  currentConsumption: number;
  baselineConsumption: number;
  waterCostPerCubicMeter: number;
  leakagePercentage: number;
  efficiencyImprovementPercentage: number;
  dataConfidence?: number;
}

export const Water_conservation_calculatorInputSchema = z.object({
  currentConsumption: z.number().default(1000),
  baselineConsumption: z.number().default(1200),
  waterCostPerCubicMeter: z.number().default(2.5),
  leakagePercentage: z.number().default(5),
  efficiencyImprovementPercentage: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Water_conservation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentConsumption * (input.leakagePercentage / 100); results["waterWasteFromLeaks"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterWasteFromLeaks"] = Number.NaN; }
  try { const v = input.baselineConsumption * (input.efficiencyImprovementPercentage / 100); results["efficiencySavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["efficiencySavings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["efficiencySavings"])) + (toNumericFormulaValue(results["waterWasteFromLeaks"])); results["totalPotentialWaterSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPotentialWaterSavings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPotentialWaterSavings"])) * input.waterCostPerCubicMeter; results["costSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costSavings"] = Number.NaN; }
  return results;
}


export function calculateWater_conservation_calculator(input: Water_conservation_calculatorInput): Water_conservation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalPotentialWaterSavings"]);
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


export interface Water_conservation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
