// Auto-generated from proportion-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ProportionCalculatorInput {
  numerator: number;
  denominator: number;
  scaleFactor: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ProportionCalculatorInputSchema = z.object({
  numerator: z.number().min(0).default(0),
  denominator: z.number().min(0.0001).default(1),
  scaleFactor: z.number().min(0.0001).default(1),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('high'),
});

export interface ProportionCalculatorOutput {
  scaledProportion: number;
  breakdown: {
    rawProportion: number;
    scaledValue: number;
    confidenceFactor: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ProportionCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.proportion = ((): number => { try { const __v = input.numerator / input.denominator; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.scaledProportion = ((): number => { try { const __v = results.proportion * input.scaleFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.scaledProportion * (input.dataConfidence == 'high' ? 1 : input.dataConfidence == 'medium' ? 0.9 : 0.8); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateProportionCalculator(input: ProportionCalculatorInput): ProportionCalculatorOutput {
  const results = evaluateFormulas(input);
  const scaledProportion = results.scaledProportion ?? 0;
  const breakdown = {
    rawProportion: results.rawProportion,
    scaledValue: results.scaledValue,
    confidenceFactor: results.confidenceFactor,
  };

  // rule: denominator > 0
  // rule: scaleFactor > 0
  // rule: numerator >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Numerator exceeds denominator; check data.
  // threshold skipped (non-JS): Negative proportion; invalid.
  // threshold skipped (non-JS): Low data confidence; results may be unreliable.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return scaledProportion; } })();

  return {
    scaledProportion,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["Export to PDF/CSV","Trend analysis over time","Comparison with benchmarks","Detailed breakdown report"],
  };
}
