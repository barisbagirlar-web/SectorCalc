// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Water_usage_optimizer_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.totalWaterIn * input.productionOutput * input.processWater * input.coolingWater; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.totalWaterIn * input.productionOutput * input.processWater * input.coolingWater * (input.wastewaterDischarge * input.recycledWater * input.leakageLosses); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.wastewaterDischarge * input.recycledWater * input.leakageLosses; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWater_usage_optimizer_calculator(input: Water_usage_optimizer_calculatorInput): Water_usage_optimizer_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
