// Auto-generated from z-score-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ZScoreCalculatorInput {
  ebit: number;
  totalAssets: number;
  netSales: number;
  retainedEarnings: number;
  workingCapital: number;
  totalLiabilities: number;
  marketValueEquity: number;
  bookValueTotalLiabilities: number;
  dataConfidence: number;
}

export const ZScoreCalculatorInputSchema = z.object({
  ebit: z.number().default(0),
  totalAssets: z.number().min(0).default(0),
  netSales: z.number().min(0).default(0),
  retainedEarnings: z.number().default(0),
  workingCapital: z.number().default(0),
  totalLiabilities: z.number().min(0).default(0),
  marketValueEquity: z.number().min(0).default(0),
  bookValueTotalLiabilities: z.number().min(0).default(0),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface ZScoreCalculatorOutput {
  zScore: number;
  breakdown: {
    x1: number;
    x2: number;
    x3: number;
    x4: number;
    x5: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ZScoreCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.x1 = ((): number => { try { const __v = input.workingCapital / input.totalAssets; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.x2 = ((): number => { try { const __v = input.retainedEarnings / input.totalAssets; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.x3 = ((): number => { try { const __v = input.ebit / input.totalAssets; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.x4 = ((): number => { try { const __v = input.marketValueEquity / input.bookValueTotalLiabilities; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.x5 = ((): number => { try { const __v = input.netSales / input.totalAssets; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.zScore = ((): number => { try { const __v = 1.2 * results.x1 + 1.4 * results.x2 + 3.3 * results.x3 + 0.6 * results.x4 + 1.0 * results.x5; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.zScore * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateZScoreCalculator(input: ZScoreCalculatorInput): ZScoreCalculatorOutput {
  const results = evaluateFormulas(input);
  const zScore = results.zScore ?? 0;
  const breakdown = {
    x1: results.x1,
    x2: results.x2,
    x3: results.x3,
    x4: results.x4,
    x5: results.x5,
  };

  // rule: totalAssets must be > 0
  // rule: netSales must be >= 0
  // rule: totalLiabilities must be >= 0
  // rule: marketValueEquity must be >= 0
  // rule: bookValueTotalLiabilities must be >= 0
  // rule: dataConfidence must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): zScore

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return zScore; } })();

  return {
    zScore,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis (historical Z-Score comparison)","Benchmarking against industry averages","Detailed report with ratio breakdowns"],
  };
}
