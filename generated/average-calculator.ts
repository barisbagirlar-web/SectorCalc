// Auto-generated from average-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AverageCalculatorInput {
  values: number;
  weights: number;
  averageType: 'arithmetic' | 'weighted' | 'geometric' | 'harmonic' | 'median' | 'mode';
  dataConfidence: number;
}

export const AverageCalculatorInputSchema = z.object({
  values: z.number().default(0),
  weights: z.number().min(0).default(1),
  averageType: z.enum(['arithmetic', 'weighted', 'geometric', 'harmonic', 'median', 'mode']).default('arithmetic'),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface AverageCalculatorOutput {
  average: number;
  breakdown: {
    sum: number;
    count: number;
    min: number;
    max: number;
    range: number;
    variance: number;
    stdDev: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AverageCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.arithmetic = (() => { try { return sum(input.values) / count(input.values); } catch { return 0; } })();
  results.weighted = (() => { try { return sum(input.values[i] * input.weights[i]) / sum(input.weights); } catch { return 0; } })();
  results.geometric = (() => { try { return exp(sum(log(input.values)) / count(input.values)); } catch { return 0; } })();
  results.harmonic = (() => { try { return count(input.values) / sum(1/input.values); } catch { return 0; } })();
  results.median = (() => { try { return 0; } catch { return 0; } })();
  results.mode = (() => { try { return 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return primary * (input.dataConfidence / 100); } catch { return 0; } })();
  return results;
}

export function calculateAverageCalculator(input: AverageCalculatorInput): AverageCalculatorOutput {
  const results = evaluateFormulas(input);
  const average = results.average ?? 0;
  const breakdown = {
    sum: results.sum,
    count: results.count,
    min: results.min,
    max: results.max,
    range: results.range,
    variance: results.variance,
    stdDev: results.stdDev,
  };

  // rule: values must be an array of numbers
  // rule: if averageType is 'weighted', weights must be provided and have same length as values
  // rule: weights must be non-negative
  // rule: dataConfidence must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low data confidence; results may be unreliable
  // threshold skipped (non-JS): Small sample size; consider using median

  const dataConfidenceAdjusted = (() => { try { return primary * (input.dataConfidence / 100); } catch { return average; } })();

  return {
    average,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over time","Comparison with benchmarks","Detailed statistical report"],
  };
}
