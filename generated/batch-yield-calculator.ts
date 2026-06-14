// Auto-generated from batch-yield-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BatchYieldCalculatorInput {
  batchSize: number;
  goodUnits: number;
  reworkUnits: number;
  scrapUnits: number;
  costPerUnit: number;
  reworkCostPerUnit: number;
  sellingPricePerUnit: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const BatchYieldCalculatorInputSchema = z.object({
  batchSize: z.number().min(1).default(1000),
  goodUnits: z.number().min(0).default(900),
  reworkUnits: z.number().min(0).default(50),
  scrapUnits: z.number().min(0).default(50),
  costPerUnit: z.number().min(0).default(10),
  reworkCostPerUnit: z.number().min(0).default(5),
  sellingPricePerUnit: z.number().min(0).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface BatchYieldCalculatorOutput {
  yieldRate: number;
  breakdown: {
    yieldRate: number;
    scrapRate: number;
    reworkRate: number;
    firstPassYield: number;
    totalCost: number;
    revenue: number;
    profit: number;
    profitMargin: number;
    costPerGoodUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BatchYieldCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.yieldRate = ((): number => { try { const __v = input.goodUnits / input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.scrapRate = ((): number => { try { const __v = input.scrapUnits / input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkRate = ((): number => { try { const __v = input.reworkUnits / input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.firstPassYield = ((): number => { try { const __v = input.goodUnits / (input.goodUnits + input.reworkUnits + input.scrapUnits); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = input.batchSize * input.costPerUnit + input.reworkUnits * input.reworkCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.revenue = ((): number => { try { const __v = input.goodUnits * input.sellingPricePerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profit = ((): number => { try { const __v = results.revenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMargin = ((): number => { try { const __v = results.profit / results.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerGoodUnit = ((): number => { try { const __v = results.totalCost / input.goodUnits; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedYield = ((): number => { try { const __v = input.dataConfidence === 'low' ? results.yieldRate * 0.9 : input.dataConfidence === 'medium' ? results.yieldRate * 0.95 : results.yieldRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateBatchYieldCalculator(input: BatchYieldCalculatorInput): BatchYieldCalculatorOutput {
  const results = evaluateFormulas(input);
  const yieldRate = results.yieldRate ?? 0;
  const breakdown = {
    yieldRate: results.yieldRate,
    scrapRate: results.scrapRate,
    reworkRate: results.reworkRate,
    firstPassYield: results.firstPassYield,
    totalCost: results.totalCost,
    revenue: results.revenue,
    profit: results.profit,
    profitMargin: results.profitMargin,
    costPerGoodUnit: results.costPerGoodUnit,
  };

  // rule: batchSize > 0
  // rule: goodUnits >= 0
  // rule: reworkUnits >= 0
  // rule: scrapUnits >= 0
  // rule: goodUnits + reworkUnits + scrapUnits <= batchSize
  // rule: costPerUnit >= 0
  // rule: reworkCostPerUnit >= 0
  // rule: sellingPricePerUnit >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low yield warning: yield rate below 90%
  // threshold skipped (non-JS): High scrap rate: scrap exceeds 5% of batch
  // threshold skipped (non-JS): High rework rate: rework exceeds 10% of batch

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedYield; } catch { return yieldRate; } })();

  return {
    yieldRate,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Loss Drivers"],
  };
}
