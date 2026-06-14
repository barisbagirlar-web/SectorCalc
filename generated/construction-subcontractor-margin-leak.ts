// Auto-generated from construction-subcontractor-margin-leak-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ConstructionSubcontractorMarginLeakInput {
  contractValue: number;
  actualCost: number;
  reworkCost: number;
  delayPenalties: number;
  changeOrderImpact: number;
  warrantyClaims: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ConstructionSubcontractorMarginLeakInputSchema = z.object({
  contractValue: z.number().min(0).default(1000000),
  actualCost: z.number().min(0).default(900000),
  reworkCost: z.number().min(0).default(50000),
  delayPenalties: z.number().min(0).default(20000),
  changeOrderImpact: z.number().min(0).default(30000),
  warrantyClaims: z.number().min(0).default(10000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ConstructionSubcontractorMarginLeakOutput {
  marginLeakPercent: number;
  breakdown: {
    totalLeak: number;
    expectedMargin: number;
    actualMargin: number;
    reworkLeakPercent: number;
    delayLeakPercent: number;
    changeOrderLeakPercent: number;
    warrantyLeakPercent: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ConstructionSubcontractorMarginLeakInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalLeak = ((): number => { try { const __v = input.reworkCost + input.delayPenalties + Math.max(input.changeOrderImpact, 0) + input.warrantyClaims; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedMargin = ((): number => { try { const __v = input.contractValue - input.actualCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.actualMargin = ((): number => { try { const __v = input.contractValue - input.actualCost - results.totalLeak; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginLeakPercent = ((): number => { try { const __v = (results.totalLeak / input.contractValue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedLeak = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.totalLeak * 1.2 : (input.dataConfidence == 'medium' ? results.totalLeak * 1.1 : results.totalLeak); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateConstructionSubcontractorMarginLeak(input: ConstructionSubcontractorMarginLeakInput): ConstructionSubcontractorMarginLeakOutput {
  const results = evaluateFormulas(input);
  const marginLeakPercent = results.marginLeakPercent ?? 0;
  const breakdown = {
    totalLeak: results.totalLeak,
    expectedMargin: results.expectedMargin,
    actualMargin: results.actualMargin,
    reworkLeakPercent: results.reworkLeakPercent,
    delayLeakPercent: results.delayLeakPercent,
    changeOrderLeakPercent: results.changeOrderLeakPercent,
    warrantyLeakPercent: results.warrantyLeakPercent,
  };

  // rule: contractValue > 0
  // rule: actualCost >= 0
  // rule: reworkCost >= 0
  // rule: delayPenalties >= 0
  // rule: changeOrderImpact can be negative
  // rule: warrantyClaims >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Critical: Margin leak exceeds 10% of contract value.
  // threshold skipped (non-JS): Warning: Rework cost exceeds 5% of contract value.
  // threshold skipped (non-JS): Warning: Delay penalties exceed 2% of contract value.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedLeak; } catch { return marginLeakPercent; } })();

  return {
    marginLeakPercent,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report"],
  };
}
