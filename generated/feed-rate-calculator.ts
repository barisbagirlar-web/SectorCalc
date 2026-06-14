// Auto-generated from feed-rate-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FeedRateCalculatorInput {
  cuttingSpeed: number;
  spindleSpeed: number;
  numberOfTeeth: number;
  feedPerTooth: number;
  materialType: 'steel' | 'aluminum' | 'stainless' | 'titanium' | 'castIron';
  operationType: 'milling' | 'turning' | 'drilling' | 'grinding';
}

export const FeedRateCalculatorInputSchema = z.object({
  cuttingSpeed: z.number().min(10).max(1000).default(100),
  spindleSpeed: z.number().min(100).max(10000).default(1000),
  numberOfTeeth: z.number().min(1).max(100).default(4),
  feedPerTooth: z.number().min(0.01).max(1).default(0.1),
  materialType: z.enum(['steel', 'aluminum', 'stainless', 'titanium', 'castIron']).default('steel'),
  operationType: z.enum(['milling', 'turning', 'drilling', 'grinding']).default('milling'),
});

export interface FeedRateCalculatorOutput {
  feedRateAdjusted: number;
  breakdown: {
    feedRate: number;
    materialFactor: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FeedRateCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.feedRate = ((): number => { try { const __v = input.spindleSpeed * input.numberOfTeeth * input.feedPerTooth; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.feedRateAdjusted = ((): number => { try { const __v = results.feedRate * (materialFactor[input.operationType][input.materialType] || 1.0); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFeedRateCalculator(input: FeedRateCalculatorInput): FeedRateCalculatorOutput {
  const results = evaluateFormulas(input);
  const feedRateAdjusted = results.feedRateAdjusted ?? 0;
  const breakdown = {
    feedRate: results.feedRate,
    materialFactor: results.materialFactor,
  };

  // rule: If operationType == 'milling', then numberOfTeeth must be >= 1.
  // rule: If operationType == 'turning', then numberOfTeeth must be 1.
  // rule: feedPerTooth must be > 0.
  // rule: cuttingSpeed must be > 0.
  // rule: spindleSpeed must be > 0.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If feedRate > 5000 mm/min, warning: 'Feed rate too high; risk of tool breakage.'
  // threshold skipped (non-JS): If feedRate < 10 mm/min, warning: 'Feed rate too low; inefficient machining.'

  const dataConfidenceAdjusted = (() => { try { return results.feedRateAdjusted * (1 - 0.1 * (1 - dataConfidence)); } catch { return feedRateAdjusted; } })();

  return {
    feedRateAdjusted,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Comparison with industry benchmarks","Detailed report with tool life estimation"],
  };
}
