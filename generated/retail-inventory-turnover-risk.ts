// Auto-generated from retail-inventory-turnover-risk-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RetailInventoryTurnoverRiskInput {
  costOfGoodsSold: number;
  averageInventory: number;
  daysInPeriod: number;
  industryBenchmarkTurnover: number;
  demandVariability: number;
  leadTimeDays: number;
  serviceLevelTarget: number;
  dataConfidence: number;
}

export const RetailInventoryTurnoverRiskInputSchema = z.object({
  costOfGoodsSold: z.number().min(0).default(1000000),
  averageInventory: z.number().min(0).default(200000),
  daysInPeriod: z.number().min(1).max(365).default(365),
  industryBenchmarkTurnover: z.number().min(0).default(6),
  demandVariability: z.number().min(0).max(2).default(0.3),
  leadTimeDays: z.number().min(0).max(365).default(30),
  serviceLevelTarget: z.number().min(50).max(99.9).default(95),
  dataConfidence: z.number().min(0).max(100).default(80),
});

export interface RetailInventoryTurnoverRiskOutput {
  riskScore: number;
  breakdown: {
    inventoryTurnoverRatio: number;
    daysInventoryOutstanding: number;
    safetyStockFactor: number;
    adjustedTurnoverRisk: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RetailInventoryTurnoverRiskInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.inventoryTurnoverRatio = ((): number => { try { const __v = input.costOfGoodsSold / input.averageInventory; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.daysInventoryOutstanding = ((): number => { try { const __v = input.daysInPeriod / results.inventoryTurnoverRatio; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.safetyStockFactor = ((): number => { try { const __v = normsinv(input.serviceLevelTarget/100) * input.demandVariability * Math.sqrt(input.leadTimeDays/input.daysInPeriod); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedTurnoverRisk = ((): number => { try { const __v = Math.max(0, (input.industryBenchmarkTurnover - results.inventoryTurnoverRatio) / input.industryBenchmarkTurnover) * (1 + input.demandVariability) * (1 + input.leadTimeDays/365); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.riskScore = ((): number => { try { const __v = results.adjustedTurnoverRisk * (100 / input.dataConfidence); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.riskScore * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRetailInventoryTurnoverRisk(input: RetailInventoryTurnoverRiskInput): RetailInventoryTurnoverRiskOutput {
  const results = evaluateFormulas(input);
  const riskScore = results.riskScore ?? 0;
  const breakdown = {
    inventoryTurnoverRatio: results.inventoryTurnoverRatio,
    daysInventoryOutstanding: results.daysInventoryOutstanding,
    safetyStockFactor: results.safetyStockFactor,
    adjustedTurnoverRisk: results.adjustedTurnoverRisk,
  };

  // rule: costOfGoodsSold > 0
  // rule: averageInventory > 0
  // rule: daysInPeriod between 1 and 365
  // rule: industryBenchmarkTurnover > 0
  // rule: demandVariability >= 0
  // rule: leadTimeDays >= 0
  // rule: serviceLevelTarget between 50 and 99.9
  // rule: dataConfidence between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): inventoryTurnoverRatio
  // threshold skipped (non-string): demandVariability
  // threshold skipped (non-string): leadTimeDays

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return riskScore; } })();

  return {
    riskScore,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (historical comparison)","Benchmark Comparison (industry peers)","Detailed Report with breakdowns and charts"],
  };
}
