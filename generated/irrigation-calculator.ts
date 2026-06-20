// Auto-generated from irrigation-calculator-schema.json
import * as z from 'zod';

export interface Irrigation_calculatorInput {
  area: number;
  cropWater: number;
  efficiency: number;
  peakFactor: number;
  systemLosses: number;
  operatingHours: number;
  dataConfidence?: number;
}

export const Irrigation_calculatorInputSchema = z.object({
  area: z.number().default(1),
  cropWater: z.number().default(5),
  efficiency: z.number().default(75),
  peakFactor: z.number().default(1.2),
  systemLosses: z.number().default(5),
  operatingHours: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Irrigation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.area * input.cropWater * 100000 * input.peakFactor) / (input.efficiency * (100 - input.systemLosses)); results["totalDailyVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDailyVolume"] = Number.NaN; }
  try { const v = ((input.area * input.cropWater * 100000 * input.peakFactor) / (input.efficiency * (100 - input.systemLosses))) / input.operatingHours; results["requiredFlowRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredFlowRate"] = Number.NaN; }
  try { const v = input.area * input.cropWater * 10; results["rawWaterRequirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rawWaterRequirement"] = Number.NaN; }
  return results;
}


export function calculateIrrigation_calculator(input: Irrigation_calculatorInput): Irrigation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDailyVolume"]);
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


export interface Irrigation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
