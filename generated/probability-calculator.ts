// Auto-generated from probability-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ProbabilityCalculatorInput {
  eventAProbability: number;
  eventBProbability: number;
  conditionalProbability: number;
  calculationMode: 'joint' | 'conditional' | 'bayes' | 'complement' | 'union';
  dataConfidence: number;
}

export const ProbabilityCalculatorInputSchema = z.object({
  eventAProbability: z.number().min(0).max(1).default(0.5),
  eventBProbability: z.number().min(0).max(1).default(0.5),
  conditionalProbability: z.number().min(0).max(1).default(0.5),
  calculationMode: z.enum(['joint', 'conditional', 'bayes', 'complement', 'union']).default('joint'),
  dataConfidence: z.number().min(0).max(1).default(0.95),
});

export interface ProbabilityCalculatorOutput {
  result: number;
  breakdown: {
    jointProbability: number;
    conditionalProbabilityFromJoint: number;
    bayesTheorem: number;
    complementProbability: number;
    unionProbability: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ProbabilityCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.jointProbability = ((): number => { try { const __v = input.eventAProbability * input.conditionalProbability; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.conditionalProbabilityFromJoint = ((): number => { try { const __v = results.jointProbability / input.eventBProbability; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.bayesTheorem = ((): number => { try { const __v = (input.conditionalProbability * input.eventAProbability) / input.eventBProbability; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.complementProbability = ((): number => { try { const __v = 1 - input.eventAProbability; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.unionProbability = ((): number => { try { const __v = input.eventAProbability + input.eventBProbability - results.jointProbability; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = primary * input.dataConfidence; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateProbabilityCalculator(input: ProbabilityCalculatorInput): ProbabilityCalculatorOutput {
  const results = evaluateFormulas(input);
  const result = results.result ?? 0;
  const breakdown = {
    jointProbability: results.jointProbability,
    conditionalProbabilityFromJoint: results.conditionalProbabilityFromJoint,
    bayesTheorem: results.bayesTheorem,
    complementProbability: results.complementProbability,
    unionProbability: results.unionProbability,
  };

  // rule: eventAProbability must be between 0 and 1
  // rule: eventBProbability must be between 0 and 1
  // rule: conditionalProbability must be between 0 and 1
  // rule: dataConfidence must be between 0 and 1
  // rule: If calculationMode is 'conditional' or 'bayes', eventAProbability must be > 0
  // rule: If calculationMode is 'bayes', conditionalProbability must be provided
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if eventAProbability < 0.01 then 'Very low probability event A'
  // threshold skipped (non-JS): if eventBProbability < 0.01 then 'Very low probability event B'
  // threshold skipped (non-JS): if conditionalProbability < 0.01 then 'Very low conditional probability'
  // threshold skipped (non-JS): if dataConfidence < 0.8 then 'Low data confidence'

  const dataConfidenceAdjusted = (() => { try { return primary * input.dataConfidence; } catch { return result; } })();

  return {
    result,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with historical data","Detailed report with confidence intervals"],
  };
}
