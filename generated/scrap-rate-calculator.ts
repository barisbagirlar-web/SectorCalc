// Auto-generated from scrap-rate-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ScrapRateCalculatorInput {
  totalProductionQuantity: number;
  scrapQuantity: number;
  reworkQuantity: number;
  costPerUnit: number;
  reworkCostPerUnit: number;
  periodDays: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ScrapRateCalculatorInputSchema = z.object({
  totalProductionQuantity: z.number().min(0).default(1000),
  scrapQuantity: z.number().min(0).default(50),
  reworkQuantity: z.number().min(0).default(20),
  costPerUnit: z.number().min(0).default(10),
  reworkCostPerUnit: z.number().min(0).default(5),
  periodDays: z.number().min(1).max(365).default(30),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ScrapRateCalculatorOutput {
  totalWasteCost: number;
  breakdown: {
    scrapRate: number;
    reworkRate: number;
    totalWasteRate: number;
    scrapCost: number;
    reworkCost: number;
    dailyScrapRate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ScrapRateCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.scrapRate = ((): number => { try { const __v = input.scrapQuantity / input.totalProductionQuantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkRate = ((): number => { try { const __v = input.reworkQuantity / input.totalProductionQuantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWasteRate = ((): number => { try { const __v = (input.scrapQuantity + input.reworkQuantity) / input.totalProductionQuantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.scrapCost = ((): number => { try { const __v = input.scrapQuantity * input.costPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkCost = ((): number => { try { const __v = input.reworkQuantity * input.reworkCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWasteCost = ((): number => { try { const __v = results.scrapCost + results.reworkCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyScrapRate = ((): number => { try { const __v = results.scrapRate / input.periodDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustment = ((): number => { try { const __v = input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedTotalWasteCost = ((): number => { try { const __v = results.totalWasteCost * results.dataConfidenceAdjustment; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateScrapRateCalculator(input: ScrapRateCalculatorInput): ScrapRateCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalWasteCost = results.totalWasteCost ?? 0;
  const breakdown = {
    scrapRate: results.scrapRate,
    reworkRate: results.reworkRate,
    totalWasteRate: results.totalWasteRate,
    scrapCost: results.scrapCost,
    reworkCost: results.reworkCost,
    dailyScrapRate: results.dailyScrapRate,
  };

  // rule: scrapQuantity <= totalProductionQuantity
  // rule: reworkQuantity <= totalProductionQuantity
  // rule: costPerUnit > 0
  // rule: reworkCostPerUnit >= 0
  // rule: periodDays > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): scrapRate
  // threshold skipped (non-string): totalWasteCost

  const dataConfidenceAdjusted = (() => { try { return results.adjustedTotalWasteCost; } catch { return totalWasteCost; } })();

  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Pareto Chart"],
  };
}
