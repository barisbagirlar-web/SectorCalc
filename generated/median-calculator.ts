// Auto-generated from median-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MedianCalculatorInput {
  dataPoints: number;
  dataValues: number;
  sortOrder: 'ascending' | 'descending';
  dataConfidence: number;
}

export const MedianCalculatorInputSchema = z.object({
  dataPoints: z.number().min(1).default(0),
  dataValues: z.number().default(0),
  sortOrder: z.enum(['ascending', 'descending']).default('ascending'),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface MedianCalculatorOutput {
  median: number;
  breakdown: {
    sortedData: number;
    n: number;
    median: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MedianCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.sortedData = ((): number => { try { const __v = sort(input.dataValues, input.sortOrder); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.n = ((): number => { try { const __v = input.dataPoints; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.median = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.median * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMedianCalculator(input: MedianCalculatorInput): MedianCalculatorOutput {
  const results = evaluateFormulas(input);
  const median = results.median ?? 0;
  const breakdown = {
    sortedData: results.sortedData,
    n: results.n,
    median: results.median,
  };

  // rule: dataPoints must be >= 1
  // rule: dataValues count must equal dataPoints
  // rule: dataConfidence must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low data confidence may affect reliability
  // threshold skipped (non-JS): Small sample size may not represent population

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return median; } })();

  return {
    median,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with historical medians","Detailed report with confidence intervals"],
  };
}
