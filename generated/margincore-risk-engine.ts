// Auto-generated from margincore-risk-engine-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MargincoreRiskEngineInput {
  revenue: number;
  costOfGoodsSold: number;
  operatingExpenses: number;
  defectRate: number;
  downtimeHours: number;
  totalProductionHours: number;
  inventoryTurnover: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const MargincoreRiskEngineInputSchema = z.object({
  revenue: z.number().min(0).default(1000000),
  costOfGoodsSold: z.number().min(0).default(600000),
  operatingExpenses: z.number().min(0).default(300000),
  defectRate: z.number().min(0).max(1).default(0.02),
  downtimeHours: z.number().min(0).max(8760).default(200),
  totalProductionHours: z.number().min(1).max(8760).default(2000),
  inventoryTurnover: z.number().min(0).default(6),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface MargincoreRiskEngineOutput {
  riskAdjustedMargin: number;
  breakdown: {
    grossMargin: number;
    operatingMargin: number;
    qualityLoss: number;
    downtimeLoss: number;
    inventoryHoldingCost: number;
    totalRiskExposure: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MargincoreRiskEngineInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.grossMargin = ((): number => { try { const __v = input.revenue - input.costOfGoodsSold; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossMarginRatio = ((): number => { try { const __v = (input.revenue - input.costOfGoodsSold) / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.operatingMargin = ((): number => { try { const __v = input.revenue - input.costOfGoodsSold - input.operatingExpenses; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.operatingMarginRatio = ((): number => { try { const __v = (input.revenue - input.costOfGoodsSold - input.operatingExpenses) / input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.downtimeRatio = ((): number => { try { const __v = input.downtimeHours / input.totalProductionHours; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.qualityLoss = ((): number => { try { const __v = input.defectRate * input.revenue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.downtimeLoss = ((): number => { try { const __v = results.downtimeRatio * (input.costOfGoodsSold + input.operatingExpenses); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.inventoryHoldingCost = ((): number => { try { const __v = (input.costOfGoodsSold / input.inventoryTurnover) * 0.2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalRiskExposure = ((): number => { try { const __v = results.qualityLoss + results.downtimeLoss + results.inventoryHoldingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.riskAdjustedMargin = ((): number => { try { const __v = results.operatingMargin - results.totalRiskExposure; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.riskAdjustedMargin * (input.dataConfidence == 'low' ? 0.8 : input.dataConfidence == 'medium' ? 0.9 : 1.0); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMargincoreRiskEngine(input: MargincoreRiskEngineInput): MargincoreRiskEngineOutput {
  const results = evaluateFormulas(input);
  const riskAdjustedMargin = results.riskAdjustedMargin ?? 0;
  const breakdown = {
    grossMargin: results.grossMargin,
    operatingMargin: results.operatingMargin,
    qualityLoss: results.qualityLoss,
    downtimeLoss: results.downtimeLoss,
    inventoryHoldingCost: results.inventoryHoldingCost,
    totalRiskExposure: results.totalRiskExposure,
  };

  // rule: revenue > 0
  // rule: costOfGoodsSold >= 0
  // rule: operatingExpenses >= 0
  // rule: defectRate >= 0 and defectRate <= 1
  // rule: downtimeHours >= 0 and downtimeHours <= totalProductionHours
  // rule: totalProductionHours > 0
  // rule: inventoryTurnover >= 0
  // rule: if defectRate > 0.05 then 'Critical defect rate'
  // rule: if downtimeHours/totalProductionHours > 0.1 then 'High downtime ratio'
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): defectRateCritical
  // threshold skipped (non-string): downtimeRatioCritical
  // threshold skipped (non-string): inventoryTurnoverLow

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return riskAdjustedMargin; } })();

  return {
    riskAdjustedMargin,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
