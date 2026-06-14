// Auto-generated from food-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FoodCostCalculatorInput {
  totalRevenue: number;
  foodCost: number;
  laborCost: number;
  overheadCost: number;
  wastePercentage: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const FoodCostCalculatorInputSchema = z.object({
  totalRevenue: z.number().min(0).default(100000),
  foodCost: z.number().min(0).default(35000),
  laborCost: z.number().min(0).default(30000),
  overheadCost: z.number().min(0).default(15000),
  wastePercentage: z.number().min(0).max(100).default(5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface FoodCostCalculatorOutput {
  foodCostPercentage: number;
  breakdown: {
    foodCostPercentage: number;
    primeCostPercentage: number;
    grossProfitMargin: number;
    netProfitMargin: number;
    wasteCost: number;
    adjustedFoodCostPercentage: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FoodCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.foodCostPercentage = ((): number => { try { const __v = input.foodCost / input.totalRevenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.primeCost = ((): number => { try { const __v = input.foodCost + input.laborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.primeCostPercentage = ((): number => { try { const __v = results.primeCost / input.totalRevenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossProfit = ((): number => { try { const __v = input.totalRevenue - input.foodCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossProfitMargin = ((): number => { try { const __v = results.grossProfit / input.totalRevenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfit = ((): number => { try { const __v = input.totalRevenue - input.foodCost - input.laborCost - input.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netProfitMargin = ((): number => { try { const __v = results.netProfit / input.totalRevenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wasteCost = ((): number => { try { const __v = input.foodCost * (input.wastePercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedFoodCost = ((): number => { try { const __v = input.foodCost - results.wasteCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedFoodCostPercentage = ((): number => { try { const __v = results.adjustedFoodCost / input.totalRevenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFoodCostCalculator(input: FoodCostCalculatorInput): FoodCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const foodCostPercentage = results.foodCostPercentage ?? 0;
  const breakdown = {
    foodCostPercentage: results.foodCostPercentage,
    primeCostPercentage: results.primeCostPercentage,
    grossProfitMargin: results.grossProfitMargin,
    netProfitMargin: results.netProfitMargin,
    wasteCost: results.wasteCost,
    adjustedFoodCostPercentage: results.adjustedFoodCostPercentage,
  };

  // rule: totalRevenue > 0
  // rule: foodCost >= 0
  // rule: laborCost >= 0
  // rule: overheadCost >= 0
  // rule: wastePercentage >= 0 and wastePercentage <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if foodCostPercentage > 0.35 then 'High food cost ratio; target < 30%'
  // threshold skipped (non-JS): if (foodCost + laborCost) / totalRevenue > 0.65 then 'Prime cost too high; target < 60%'
  // threshold skipped (non-JS): if wastePercentage > 10 then 'Excessive waste; investigate processes'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return foodCostPercentage; } })();

  return {
    foodCostPercentage,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over time","Benchmark comparison against industry standards","Detailed breakdown report with charts"],
  };
}
