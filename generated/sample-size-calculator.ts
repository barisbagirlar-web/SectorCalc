// Auto-generated from sample-size-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SampleSizeCalculatorInput {
  populationSize: number;
  confidenceLevel: '90%' | '95%' | '99%';
  marginOfError: number;
  expectedProportion: number;
  dataConfidence: number;
}

export const SampleSizeCalculatorInputSchema = z.object({
  populationSize: z.number().min(1).default(10000),
  confidenceLevel: z.enum(['90%', '95%', '99%']).default('95%'),
  marginOfError: z.number().min(0.1).max(100).default(5),
  expectedProportion: z.number().min(0).max(100).default(50),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface SampleSizeCalculatorOutput {
  adjustedSampleSize: number;
  breakdown: {
    zScore: number;
    initialSampleSize: number;
    finitePopulationCorrection: number;
    dataConfidenceFactor: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SampleSizeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.zScore = ((): number => { try { const __v = input.confidenceLevel === '99%' ? 2.576 : (input.confidenceLevel === '95%' ? 1.96 : 1.645); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.p = ((): number => { try { const __v = input.expectedProportion / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.q = ((): number => { try { const __v = 1 - results.p; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.e = ((): number => { try { const __v = input.marginOfError / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.n0 = ((): number => { try { const __v = (results.zScore * results.zScore * results.p * results.q) / (results.e * results.e); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.n = ((): number => { try { const __v = input.populationSize > 0 ? (results.n0 / (1 + (results.n0 - 1) / input.populationSize)) : results.n0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedSampleSize = ((): number => { try { const __v = Math.Math.ceil(results.n * (100 / input.dataConfidence)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSampleSizeCalculator(input: SampleSizeCalculatorInput): SampleSizeCalculatorOutput {
  const results = evaluateFormulas(input);
  const adjustedSampleSize = results.adjustedSampleSize ?? 0;
  const breakdown = {
    zScore: results.zScore,
    initialSampleSize: results.initialSampleSize,
    finitePopulationCorrection: results.finitePopulationCorrection,
    dataConfidenceFactor: results.dataConfidenceFactor,
  };

  // rule: populationSize must be >= 1
  // rule: confidenceLevel must be one of '90%', '95%', '99%'
  // rule: marginOfError must be > 0 and <= 100
  // rule: expectedProportion must be >= 0 and <= 100
  // rule: dataConfidence must be >= 0 and <= 100
  // rule: If populationSize < 30, warn: 'Small population size may require census.'
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): WARNING: Margin of error >10% may yield unreliable results.
  // threshold skipped (non-JS): WARNING: Extreme proportion may require larger sample size.
  // threshold skipped (non-JS): WARNING: Low data confidence; consider increasing sample size.

  const dataConfidenceAdjusted = (() => { try { return results.adjustedSampleSize; } catch { return adjustedSampleSize; } })();

  return {
    adjustedSampleSize,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over multiple surveys","Comparison of sample sizes for different scenarios","Detailed report with confidence intervals and power analysis"],
  };
}
