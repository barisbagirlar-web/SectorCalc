// Auto-generated from batch-yield-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BatchYieldCalculatorInput {
  batchSize: number;
  defectRate: number;
  reworkCostPerUnit: number;
  scrapCostPerUnit: number;
  inspectionCostPerBatch: number;
  revenuePerUnit: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const BatchYieldCalculatorInputSchema = z.object({
  batchSize: z.number().min(1).max(1000000).default(1000),
  defectRate: z.number().min(0).max(1).default(0.02),
  reworkCostPerUnit: z.number().min(0).max(10000).default(5),
  scrapCostPerUnit: z.number().min(0).max(10000).default(2),
  inspectionCostPerBatch: z.number().min(0).max(100000).default(100),
  revenuePerUnit: z.number().min(0).max(100000).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface BatchYieldCalculatorOutput {
  totalExposure: number;
  breakdown: {
    defectiveUnits: number;
    goodUnits: number;
    reworkCost: number;
    scrapCost: number;
    totalCost: number;
    opportunityCost: number;
    variancePercent: number;
    summaryLevel: number;
    primaryDriver: number;
    decisionVerdict: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BatchYieldCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.defectiveUnits = input.batchSize * input.defectRate;
  results.goodUnits = input.batchSize - results.defectiveUnits;
  results.reworkCost = results.defectiveUnits * input.reworkCostPerUnit;
  results.scrapCost = results.defectiveUnits * input.scrapCostPerUnit;
  results.totalCost = results.reworkCost + results.scrapCost + input.inspectionCostPerBatch;
  results.opportunityCost = results.defectiveUnits * input.revenuePerUnit;
  results.totalExposure = results.totalCost + results.opportunityCost;
  results.variancePercent = (results.totalExposure / (input.batchSize * input.revenuePerUnit)) * 100;
  results.summaryLevel = results.totalExposure < 1000 ? 'low' : results.totalExposure < 5000 ? 'medium' : 'high';
  results.primaryDriver = input.defectRate > 0.05 ? 'input.defectRate' : 'input.reworkCostPerUnit';
  results.decisionVerdict = results.totalExposure > 5000 ? 'critical' : results.totalExposure > 1000 ? 'warning' : 'acceptable';
  results.dataConfidenceAdjusted = input.dataConfidence === 'low' ? results.totalExposure * 1.2 : input.dataConfidence === 'medium' ? results.totalExposure * 1.1 : results.totalExposure;
  return results;
}

export function calculateBatchYieldCalculator(input: BatchYieldCalculatorInput): BatchYieldCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalExposure = results.totalExposure;
  const breakdown = {
    defectiveUnits: results.defectiveUnits,
    goodUnits: results.goodUnits,
    reworkCost: results.reworkCost,
    scrapCost: results.scrapCost,
    totalCost: results.totalCost,
    opportunityCost: results.opportunityCost,
    variancePercent: results.variancePercent,
    summaryLevel: results.summaryLevel,
    primaryDriver: results.primaryDriver,
    decisionVerdict: results.decisionVerdict,
  };

  // rule: batchSize must be >= 1
  // rule: defectRate must be between 0 and 1
  // rule: reworkCostPerUnit must be >= 0
  // rule: scrapCostPerUnit must be >= 0
  // rule: inspectionCostPerBatch must be >= 0
  // rule: revenuePerUnit must be >= 0
  // rule: If defectRate > 0.05, warning: 'High defect rate'
  // rule: If reworkCostPerUnit > revenuePerUnit * 0.5, warning: 'Rework cost exceeds 50% of revenue'
  // threshold defectRate: 0.05
  // threshold reworkCostRatio: 0.5
  const hiddenLossDrivers: string[] = ["defectRate > 0.05 ? 'High defect rate' : ''","reworkCostPerUnit > revenuePerUnit * 0.5 ? 'Rework cost exceeds 50% of revenue' : ''"];
  const suggestedActions: string[] = ["defectRate > 0.05 ? 'Implement process improvement to reduce defect rate' : ''","reworkCostPerUnit > revenuePerUnit * 0.5 ? 'Review rework process for cost reduction' : ''","totalExposure > 5000 ? 'Consider batch size optimization or quality investment' : ''"];
  const dataConfidenceAdjusted = results.dataConfidenceAdjusted;

  return {
    totalExposure,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmark comparison","Detailed report with breakdowns"],
  };
}
