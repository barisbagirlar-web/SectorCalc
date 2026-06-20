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
  dataConfidence?: number;
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
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Water_usage_optimizer_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productionOutput / input.totalWaterIn; results["waterEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterEfficiency"] = Number.NaN; }
  try { const v = input.recycledWater / input.totalWaterIn; results["reuseRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reuseRate"] = Number.NaN; }
  try { const v = (input.leakageLosses + (input.totalWaterIn - input.processWater - input.coolingWater - input.wastewaterDischarge - input.recycledWater)) / input.totalWaterIn; results["lossRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lossRatio"] = Number.NaN; }
  try { const v = ((input.processWater + input.coolingWater) * (1 - (toNumericFormulaValue(results["reuseRate"]))) * (1 + (toNumericFormulaValue(results["lossRatio"]))) * 0.001 * 1.5) + (input.wastewaterDischarge * 0.002) + (input.leakageLosses * 0.003); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateWater_usage_optimizer_calculator(input: Water_usage_optimizer_calculatorInput): Water_usage_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Evaporation and drift from cooling towers","Unmetered process water usage"];
  const suggestedActions: string[] = ["Implement closed-loop cooling system to reduce makeup water","Install submeters on high-use processes to identify leaks"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Custom alert thresholds"],
  };
}


export interface Water_usage_optimizer_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
