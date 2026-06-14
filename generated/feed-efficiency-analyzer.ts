// Auto-generated from feed-efficiency-analyzer-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FeedEfficiencyAnalyzerInput {
  feedIntake: number;
  weightGain: number;
  feedCost: number;
  animalType: 'cattle' | 'swine' | 'poultry' | 'sheep';
  dataConfidence: number;
}

export const FeedEfficiencyAnalyzerInputSchema = z.object({
  feedIntake: z.number().min(0).max(100).default(10),
  weightGain: z.number().min(0).max(5).default(0.5),
  feedCost: z.number().min(0).max(10).default(0.3),
  animalType: z.enum(['cattle', 'swine', 'poultry', 'sheep']).default('cattle'),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface FeedEfficiencyAnalyzerOutput {
  feedCostPerGain: number;
  breakdown: {
    feedConversionRatio: number;
    feedCostPerGain: number;
    efficiencyScore: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FeedEfficiencyAnalyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.feedConversionRatio = ((): number => { try { const __v = input.feedIntake / input.weightGain; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.feedCostPerGain = ((): number => { try { const __v = input.feedCost * input.feedIntake / input.weightGain; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.efficiencyScore = ((): number => { try { const __v = 100 / (results.feedConversionRatio * results.feedCostPerGain); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.efficiencyScore * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFeedEfficiencyAnalyzer(input: FeedEfficiencyAnalyzerInput): FeedEfficiencyAnalyzerOutput {
  const results = evaluateFormulas(input);
  const feedCostPerGain = results.feedCostPerGain ?? 0;
  const breakdown = {
    feedConversionRatio: results.feedConversionRatio,
    feedCostPerGain: results.feedCostPerGain,
    efficiencyScore: results.efficiencyScore,
  };

  // rule: feedIntake > 0
  // rule: weightGain > 0
  // rule: feedCost > 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High feed conversion ratio indicates inefficiency.
  // threshold skipped (non-JS): Feed cost per gain exceeds typical threshold.

  const dataConfidenceAdjusted = (() => { try { return results.efficiencyScore * (input.dataConfidence / 100); } catch { return feedCostPerGain; } })();

  return {
    feedCostPerGain,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report"],
  };
}
