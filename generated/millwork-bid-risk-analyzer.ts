// Auto-generated from millwork-bid-risk-analyzer-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MillworkBidRiskAnalyzerInput {
  projectSize: number;
  materialCostPerSqFt: number;
  laborRate: number;
  laborHoursPerSqFt: number;
  overheadPercent: number;
  profitMargin: number;
  riskFactor: 'low' | 'medium' | 'high';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const MillworkBidRiskAnalyzerInputSchema = z.object({
  projectSize: z.number().min(100).max(100000).default(1000),
  materialCostPerSqFt: z.number().min(10).max(500).default(50),
  laborRate: z.number().min(15).max(150).default(45),
  laborHoursPerSqFt: z.number().min(0.1).max(2).default(0.5),
  overheadPercent: z.number().min(0).max(50).default(15),
  profitMargin: z.number().min(0).max(30).default(10),
  riskFactor: z.enum(['low', 'medium', 'high']).default('medium'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface MillworkBidRiskAnalyzerOutput {
  finalBidPrice: number;
  breakdown: {
    directMaterialCost: number;
    directLaborCost: number;
    overheadCost: number;
    totalCost: number;
    baseBidPrice: number;
    adjustedBidPrice: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MillworkBidRiskAnalyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.directMaterialCost = ((): number => { try { const __v = input.projectSize * input.materialCostPerSqFt; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directLaborCost = ((): number => { try { const __v = input.projectSize * input.laborHoursPerSqFt * input.laborRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDirectCost = ((): number => { try { const __v = results.directMaterialCost + results.directLaborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.totalDirectCost * (input.overheadPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDirectCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.baseBidPrice = ((): number => { try { const __v = results.totalCost * (1 + input.profitMargin / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.riskMultiplier = ((): number => { try { const __v = input.riskFactor == 'low' ? 0.95 : (input.riskFactor == 'medium' ? 1.0 : 1.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedBidPrice = ((): number => { try { const __v = results.baseBidPrice * results.riskMultiplier; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.confidenceMultiplier = ((): number => { try { const __v = input.dataConfidence == 'low' ? 0.9 : (input.dataConfidence == 'medium' ? 1.0 : 1.05); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.finalBidPrice = ((): number => { try { const __v = results.adjustedBidPrice * results.confidenceMultiplier; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMillworkBidRiskAnalyzer(input: MillworkBidRiskAnalyzerInput): MillworkBidRiskAnalyzerOutput {
  const results = evaluateFormulas(input);
  const finalBidPrice = results.finalBidPrice ?? 0;
  const breakdown = {
    directMaterialCost: results.directMaterialCost,
    directLaborCost: results.directLaborCost,
    overheadCost: results.overheadCost,
    totalCost: results.totalCost,
    baseBidPrice: results.baseBidPrice,
    adjustedBidPrice: results.adjustedBidPrice,
  };

  // rule: projectSize >= 100 and projectSize <= 100000
  // rule: materialCostPerSqFt >= 10 and materialCostPerSqFt <= 500
  // rule: laborRate >= 15 and laborRate <= 150
  // rule: laborHoursPerSqFt >= 0.1 and laborHoursPerSqFt <= 2
  // rule: overheadPercent >= 0 and overheadPercent <= 50
  // rule: profitMargin >= 0 and profitMargin <= 30
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High material cost risk
  // threshold skipped (non-JS): Low productivity risk
  // threshold skipped (non-JS): High overhead risk
  // threshold skipped (non-JS): Low profit margin risk

  const dataConfidenceAdjusted = (() => { try { return results.finalBidPrice; } catch { return finalBidPrice; } })();

  return {
    finalBidPrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Bids","Detailed Report with Charts"],
  };
}
