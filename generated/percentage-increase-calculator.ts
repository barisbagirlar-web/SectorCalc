// Auto-generated from percentage-increase-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PercentageIncreaseCalculatorInput {
  originalValue: number;
  newValue: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PercentageIncreaseCalculatorInputSchema = z.object({
  originalValue: z.number().min(0).default(100),
  newValue: z.number().min(0).default(150),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PercentageIncreaseCalculatorOutput {
  percentageIncrease: number;
  breakdown: {
    absoluteIncrease: number;
    originalValue: number;
    newValue: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PercentageIncreaseCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.percentageIncrease = ((): number => { try { const __v = ((input.newValue - input.originalValue) / input.originalValue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.percentageIncrease * (input.dataConfidence === 'high' ? 1.0 : input.dataConfidence === 'medium' ? 0.9 : 0.8); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePercentageIncreaseCalculator(input: PercentageIncreaseCalculatorInput): PercentageIncreaseCalculatorOutput {
  const results = evaluateFormulas(input);
  const percentageIncrease = results.percentageIncrease ?? 0;
  const breakdown = {
    absoluteIncrease: results.absoluteIncrease,
    originalValue: results.originalValue,
    newValue: results.newValue,
  };

  // rule: newValue >= originalValue
  // rule: originalValue > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Extreme increase detected, verify data.
  // threshold skipped (non-JS): Negative increase, check inputs.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return percentageIncrease; } })();

  return {
    percentageIncrease,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with historical data","Detailed report with charts"],
  };
}
