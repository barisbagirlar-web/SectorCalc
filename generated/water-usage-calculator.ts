// Auto-generated from water-usage-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface WaterUsageCalculatorInput {
  waterConsumption: number;
  waterCostPerM3: number;
  productionVolume: number;
  industryType: 'manufacturing' | 'food & beverage' | 'chemical' | 'pharmaceutical' | 'textile' | 'other';
  recyclingRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const WaterUsageCalculatorInputSchema = z.object({
  waterConsumption: z.number().min(0).default(100),
  waterCostPerM3: z.number().min(0).default(2.5),
  productionVolume: z.number().min(0).default(1000),
  industryType: z.enum(['manufacturing', 'food & beverage', 'chemical', 'pharmaceutical', 'textile', 'other']).default('manufacturing'),
  recyclingRate: z.number().min(0).max(100).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface WaterUsageCalculatorOutput {
  totalWaterCost: number;
  breakdown: {
    waterIntensity: number;
    netWaterConsumption: number;
    costSavings: number;
    waterEfficiencyScore: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: WaterUsageCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.waterIntensity = ((): number => { try { const __v = input.waterConsumption / input.productionVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWaterCost = ((): number => { try { const __v = input.waterConsumption * input.waterCostPerM3; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.recycledWater = ((): number => { try { const __v = input.waterConsumption * (input.recyclingRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netWaterConsumption = ((): number => { try { const __v = input.waterConsumption - results.recycledWater; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costSavings = ((): number => { try { const __v = results.recycledWater * input.waterCostPerM3; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.industryBenchmark = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.waterEfficiencyScore = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateWaterUsageCalculator(input: WaterUsageCalculatorInput): WaterUsageCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalWaterCost = results.totalWaterCost ?? 0;
  const breakdown = {
    waterIntensity: results.waterIntensity,
    netWaterConsumption: results.netWaterConsumption,
    costSavings: results.costSavings,
    waterEfficiencyScore: results.waterEfficiencyScore,
  };

  // rule: waterConsumption >= 0
  // rule: waterCostPerM3 >= 0
  // rule: productionVolume > 0
  // rule: recyclingRate >= 0 and recyclingRate <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if waterIntensity > industryBenchmark then 'High water intensity'
  // threshold skipped (non-JS): if recyclingRate < 20 then 'Low recycling rate'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalWaterCost; } })();

  return {
    totalWaterCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmark comparison","Detailed report with recommendations"],
  };
}
