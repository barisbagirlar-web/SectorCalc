// Auto-generated from milk-yield-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MilkYieldCheckInput {
  totalMilkProduced: number;
  totalFeedConsumed: number;
  numberOfCows: number;
  measurementPeriodDays: number;
  milkFatPercent: number;
  milkProteinPercent: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const MilkYieldCheckInputSchema = z.object({
  totalMilkProduced: z.number().min(0).default(0),
  totalFeedConsumed: z.number().min(0).default(0),
  numberOfCows: z.number().min(1).default(1),
  measurementPeriodDays: z.number().min(1).max(365).default(30),
  milkFatPercent: z.number().min(0).max(10).default(3.5),
  milkProteinPercent: z.number().min(0).max(8).default(3.2),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface MilkYieldCheckOutput {
  milkYieldPerCowPerDay: number;
  breakdown: {
    milkYieldPerCowPerDay: number;
    feedConversionEfficiency: number;
    energyCorrectedMilk: number;
    ecmPerCowPerDay: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MilkYieldCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.milkYieldPerCowPerDay = ((): number => { try { const __v = input.totalMilkProduced / (input.numberOfCows * input.measurementPeriodDays); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.feedConversionEfficiency = ((): number => { try { const __v = input.totalMilkProduced / input.totalFeedConsumed; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energyCorrectedMilk = ((): number => { try { const __v = input.totalMilkProduced * (0.327 + 0.122 * input.milkFatPercent + 0.077 * input.milkProteinPercent); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ecmPerCowPerDay = ((): number => { try { const __v = results.energyCorrectedMilk / (input.numberOfCows * input.measurementPeriodDays); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedYield = ((): number => { try { const __v = results.milkYieldPerCowPerDay * (input.dataConfidence == 'high' ? 1.0 : (input.dataConfidence == 'medium' ? 0.95 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMilkYieldCheck(input: MilkYieldCheckInput): MilkYieldCheckOutput {
  const results = evaluateFormulas(input);
  const milkYieldPerCowPerDay = results.milkYieldPerCowPerDay ?? 0;
  const breakdown = {
    milkYieldPerCowPerDay: results.milkYieldPerCowPerDay,
    feedConversionEfficiency: results.feedConversionEfficiency,
    energyCorrectedMilk: results.energyCorrectedMilk,
    ecmPerCowPerDay: results.ecmPerCowPerDay,
  };

  // rule: totalMilkProduced >= 0
  // rule: totalFeedConsumed >= 0
  // rule: numberOfCows >= 1
  // rule: measurementPeriodDays >= 1
  // rule: milkFatPercent >= 0
  // rule: milkProteinPercent >= 0
  // rule: if totalMilkProduced > 0 then numberOfCows > 0
  // rule: if totalFeedConsumed > 0 then numberOfCows > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): milkYieldPerCowPerDay
  // threshold skipped (non-string): feedConversionEfficiency

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedYield; } catch { return milkYieldPerCowPerDay; } })();

  return {
    milkYieldPerCowPerDay,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Graphs"],
  };
}
