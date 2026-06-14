// Auto-generated from laboratuvar-analiz-maliyeti-ve-numune-alma-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInput {
  numSamples: number;
  batchSize: number;
  costPerSample: number;
  defectRate: number;
  costOfDefect: number;
  samplingMode: 'fixed' | 'variable' | 'sequential';
  dataConfidence: number;
}

export const LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInputSchema = z.object({
  numSamples: z.number().min(1).max(1000).default(10),
  batchSize: z.number().min(1).max(100000).default(100),
  costPerSample: z.number().min(0).max(10000).default(50),
  defectRate: z.number().min(0).max(1).default(0.05),
  costOfDefect: z.number().min(0).max(100000).default(500),
  samplingMode: z.enum(['fixed', 'variable', 'sequential']).default('fixed'),
  dataConfidence: z.number().min(0).max(1).default(0.95),
});

export interface LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorOutput {
  totalExpectedCost: number;
  breakdown: {
    totalSamplingCost: number;
    expectedUndetectedCost: number;
    expectedDefectCost: number;
    riskReductionFactor: number;
    optimalSampleSize: number;
    costSavings: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalSamplingCost = ((): number => { try { const __v = input.numSamples * input.costPerSample; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedDefectsInBatch = ((): number => { try { const __v = input.batchSize * input.defectRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedDefectCost = ((): number => { try { const __v = results.expectedDefectsInBatch * input.costOfDefect; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.riskReductionFactor = ((): number => { try { const __v = 1 - (1 - input.defectRate) ^ input.numSamples; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedDetectedDefects = ((): number => { try { const __v = results.expectedDefectsInBatch * results.riskReductionFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedUndetectedDefects = ((): number => { try { const __v = results.expectedDefectsInBatch * (1 - results.riskReductionFactor); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedUndetectedCost = ((): number => { try { const __v = results.expectedUndetectedDefects * input.costOfDefect; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalExpectedCost = ((): number => { try { const __v = results.totalSamplingCost + results.expectedUndetectedCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.optimalSampleSize = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costSavings = ((): number => { try { const __v = results.expectedDefectCost - results.totalExpectedCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalExpectedCost * (1 + (1 - input.dataConfidence)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculator(input: LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorInput): LaboratuvarAnalizMaliyetiVeNumuneAlmaOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalExpectedCost = results.totalExpectedCost ?? 0;
  const breakdown = {
    totalSamplingCost: results.totalSamplingCost,
    expectedUndetectedCost: results.expectedUndetectedCost,
    expectedDefectCost: results.expectedDefectCost,
    riskReductionFactor: results.riskReductionFactor,
    optimalSampleSize: results.optimalSampleSize,
    costSavings: results.costSavings,
  };

  // rule: numSamples <= batchSize
  // rule: if samplingMode == 'fixed' then numSamples > 0
  // rule: if samplingMode == 'variable' then numSamples >= 0.1 * batchSize
  // rule: costPerSample > 0
  // rule: defectRate >= 0 and defectRate <= 1
  // rule: costOfDefect > 0
  // rule: dataConfidence > 0 and dataConfidence < 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High defect rate detected; consider process improvement.
  // threshold skipped (non-JS): Sample cost is high; evaluate alternative methods.
  // threshold skipped (non-JS): Sampling ratio exceeds 50%; consider 100% inspection.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalExpectedCost; } })();

  return {
    totalExpectedCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis (historical data)","Comparison of sampling modes","Detailed report with charts"],
  };
}
