// Auto-generated from water-usage-optimizer-calculator-schema.json
import * as z from 'zod';

export interface Water_usage_optimizer_calculatorInput {
  totalWaterIn: number;
  productionOutput: number;
  processWater: number;
  coolingWater: number;
  wastewaterDischarge: number;
  recycledWater: number;
  leakageLosses: number;
  industryType: string;
  waterCostPerM3: number;
  enableAdvancedAnalysis: boolean;
}

export const Water_usage_optimizer_calculatorInputSchema = z.object({
  totalWaterIn: z.number().min(0).max(1000000).default(10000),
  productionOutput: z.number().min(1).max(10000000).default(50000),
  processWater: z.number().min(0).max(1000000).default(7000),
  coolingWater: z.number().min(0).max(1000000).default(2000),
  wastewaterDischarge: z.number().min(0).max(1000000).default(6000),
  recycledWater: z.number().min(0).max(1000000).default(1500),
  leakageLosses: z.number().min(0).max(1000000).default(500),
  industryType: z.enum(['food_and_beverage', 'chemical', 'pharmaceutical', 'textile', 'metal_fabrication', 'general_manufacturing']).default('general_manufacturing'),
  waterCostPerM3: z.number().min(0).max(100).default(2.5),
  enableAdvancedAnalysis: z.boolean().default(false),
});

function evaluateAllFormulas(input: Water_usage_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalWaterIn - input.recycledWater; results["netWaterConsumption"] = Number.isFinite(v) ? v : 0; } catch { results["netWaterConsumption"] = 0; }
  try { const v = (results["netWaterConsumption"] ?? 0) / input.productionOutput; results["waterIntensity"] = Number.isFinite(v) ? v : 0; } catch { results["waterIntensity"] = 0; }
  try { const v = input.recycledWater / input.totalWaterIn; results["recycleRate"] = Number.isFinite(v) ? v : 0; } catch { results["recycleRate"] = 0; }
  try { const v = input.processWater / (results["netWaterConsumption"] ?? 0); results["processEfficiency"] = Number.isFinite(v) ? v : 0; } catch { results["processEfficiency"] = 0; }
  try { const v = input.wastewaterDischarge / (results["netWaterConsumption"] ?? 0); results["wastewaterRatio"] = Number.isFinite(v) ? v : 0; } catch { results["wastewaterRatio"] = 0; }
  try { const v = (input.totalWaterIn + input.wastewaterDischarge) * input.waterCostPerM3; results["totalWaterCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalWaterCost"] = 0; }
  try { const v = 100 * (1 - ((results["waterIntensity"] ?? 0) / 0.5)) * 0.4 + 100 * (results["recycleRate"] ?? 0) * 0.4 + 100 * (1 - ((results["wastewaterRatio"] ?? 0) / 0.8)) * 0.2; results["waterUsageScore"] = Number.isFinite(v) ? v : 0; } catch { results["waterUsageScore"] = 0; }
  return results;
}


export function calculateWater_usage_optimizer_calculator(input: Water_usage_optimizer_calculatorInput): Water_usage_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["waterUsageScore"] ?? 0;
  const breakdown = {
    waterIntensity: values["waterIntensity"] ?? 0,
    recycleRate: values["recycleRate"] ?? 0,
    processEfficiency: values["processEfficiency"] ?? 0,
    wastewaterRatio: values["wastewaterRatio"] ?? 0,
    totalWaterCost: values["totalWaterCost"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Unaccounted Water","Evaporation Loss","Blowdown Loss"];
  const suggestedActions: string[] = ["Leak Repair Program","Increase Water Recycling","Process Water Reduction","Cooling Tower Optimization"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Custom alert thresholds"],
  };
}


export interface Water_usage_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: { waterIntensity: number; recycleRate: number; processEfficiency: number; wastewaterRatio: number; totalWaterCost: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
