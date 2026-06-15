// Auto-generated from water-intake-calculator-schema.json
import * as z from 'zod';

export interface Water_intake_calculatorInput {
  numEmployees: number;
  workDaysPerYear: number;
  avgWaterUsePerPersonPerDay: number;
  processWaterIntensity: number;
  annualProductionUnits: number;
  leakageFactor: number;
  recyclingRate: number;
  seasonalFactor: number;
  industryType: string;
}

export const Water_intake_calculatorInputSchema = z.object({
  numEmployees: z.number().min(1).max(100000).default(100),
  workDaysPerYear: z.number().min(1).max(365).default(250),
  avgWaterUsePerPersonPerDay: z.number().min(0).max(500).default(50),
  processWaterIntensity: z.number().min(0).max(1000).default(10),
  annualProductionUnits: z.number().min(0).max(100000000).default(50000),
  leakageFactor: z.number().min(0).max(50).default(5),
  recyclingRate: z.number().min(0).max(100).default(20),
  seasonalFactor: z.number().min(0.5).max(2).default(1),
  industryType: z.enum(['manufacturing', 'food_and_beverage', 'pharmaceutical', 'textile', 'electronics', 'other']).default('manufacturing'),
});

function evaluateAllFormulas(input: Water_intake_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["f1"] = input.numEmployees * input.workDaysPerYear * input.avgWaterUsePerPersonPerDay * input.seasonalFactor; } catch { results["f1"] = 0; }
  try { results["f2"] = input.annualProductionUnits * input.processWaterIntensity * input.seasonalFactor; } catch { results["f2"] = 0; }
  try { results["f3"] = processWaterGross * (input.recyclingRate / 100); } catch { results["f3"] = 0; }
  try { results["f4"] = processWaterGross - recycledWater; } catch { results["f4"] = 0; }
  try { results["f5"] = (domesticWater + netProcessWater) * (input.leakageFactor / 100); } catch { results["f5"] = 0; }
  try { results["f6"] = domesticWater + netProcessWater + leakageLosses; } catch { results["f6"] = 0; }
  try { results["f7"] = totalWaterIntake / input.annualProductionUnits; } catch { results["f7"] = 0; }
  return results;
}


export function calculateWater_intake_calculator(input: Water_intake_calculatorInput): Water_intake_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalWaterIntake"] ?? 0;
  const breakdown = {
    domesticWater: values["domesticWater"] ?? 0,
    processWaterGross: values["processWaterGross"] ?? 0,
    recycledWater: values["recycledWater"] ?? 0,
    netProcessWater: values["netProcessWater"] ?? 0,
    leakageLosses: values["leakageLosses"] ?? 0,
    waterIntensityIndex: values["waterIntensityIndex"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unaccounted Leakage","Low Recycling Efficiency","High Seasonal Variation"];
  const suggestedActions: string[] = ["Conduct Leak Detection Survey","Increase Water Recycling","Install Water-Efficient Fixtures","Optimize Process Water Use","Implement Seasonal Demand Planning"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Water_intake_calculatorOutput {
  totalWasteCost: number;
  breakdown: { domesticWater: number; processWaterGross: number; recycledWater: number; netProcessWater: number; leakageLosses: number; waterIntensityIndex: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
