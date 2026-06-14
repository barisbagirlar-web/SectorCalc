// Auto-generated from quality-cost-paf-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface QualityCostPafCalculatorInput {
  totalSales: number;
  preventionCost: number;
  appraisalCost: number;
  internalFailureCost: number;
  externalFailureCost: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const QualityCostPafCalculatorInputSchema = z.object({
  totalSales: z.number().min(0).default(1000000),
  preventionCost: z.number().min(0).default(50000),
  appraisalCost: z.number().min(0).default(30000),
  internalFailureCost: z.number().min(0).default(20000),
  externalFailureCost: z.number().min(0).default(10000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface QualityCostPafCalculatorOutput {
  totalQualityCostRatio: number;
  breakdown: {
    totalQualityCost: number;
    preventionRatio: number;
    appraisalRatio: number;
    internalFailureRatio: number;
    externalFailureRatio: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: QualityCostPafCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalQualityCost = ((): number => { try { const __v = input.preventionCost + input.appraisalCost + input.internalFailureCost + input.externalFailureCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalQualityCostRatio = ((): number => { try { const __v = results.totalQualityCost / input.totalSales; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.preventionRatio = ((): number => { try { const __v = input.preventionCost / results.totalQualityCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.appraisalRatio = ((): number => { try { const __v = input.appraisalCost / results.totalQualityCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.internalFailureRatio = ((): number => { try { const __v = input.internalFailureCost / results.totalQualityCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.externalFailureRatio = ((): number => { try { const __v = input.externalFailureCost / results.totalQualityCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalQualityCost * (input.dataConfidence === 'low' ? 1.2 : input.dataConfidence === 'medium' ? 1.0 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateQualityCostPafCalculator(input: QualityCostPafCalculatorInput): QualityCostPafCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalQualityCostRatio = results.totalQualityCostRatio ?? 0;
  const breakdown = {
    totalQualityCost: results.totalQualityCost,
    preventionRatio: results.preventionRatio,
    appraisalRatio: results.appraisalRatio,
    internalFailureRatio: results.internalFailureRatio,
    externalFailureRatio: results.externalFailureRatio,
  };

  // rule: totalSales > 0
  // rule: preventionCost >= 0
  // rule: appraisalCost >= 0
  // rule: internalFailureCost >= 0
  // rule: externalFailureCost >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 0.15
  // threshold skipped (non-JS): 0.05

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalQualityCostRatio; } })();

  return {
    totalQualityCostRatio,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report"],
  };
}
