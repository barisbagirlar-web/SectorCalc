// Auto-generated from break-even-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BreakEvenCalculatorInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  timePeriod: 'day' | 'week' | 'month' | 'quarter' | 'year';
  targetProfit: number;
  dataConfidence: number;
}

export const BreakEvenCalculatorInputSchema = z.object({
  fixedCosts: z.number().min(0).default(0),
  variableCostPerUnit: z.number().min(0).default(0),
  sellingPricePerUnit: z.number().min(0).default(0),
  timePeriod: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
  targetProfit: z.number().min(0).default(0),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface BreakEvenCalculatorOutput {
  breakEvenUnits: number;
  breakdown: {
    contributionMargin: number;
    breakEvenRevenue: number;
    targetProfitUnits: number;
    targetProfitRevenue: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BreakEvenCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.contributionMargin = (() => { try { return input.sellingPricePerUnit - input.variableCostPerUnit; } catch { return 0; } })();
  results.breakEvenUnits = (() => { try { return input.fixedCosts / results.contributionMargin; } catch { return 0; } })();
  results.breakEvenRevenue = (() => { try { return results.breakEvenUnits * input.sellingPricePerUnit; } catch { return 0; } })();
  results.targetProfitUnits = (() => { try { return (input.fixedCosts + input.targetProfit) / results.contributionMargin; } catch { return 0; } })();
  results.targetProfitRevenue = (() => { try { return results.targetProfitUnits * input.sellingPricePerUnit; } catch { return 0; } })();
  results.dataConfidenceAdjustedBreakEvenUnits = (() => { try { return results.breakEvenUnits * (100 / input.dataConfidence); } catch { return 0; } })();
  return results;
}

export function calculateBreakEvenCalculator(input: BreakEvenCalculatorInput): BreakEvenCalculatorOutput {
  const results = evaluateFormulas(input);
  const breakEvenUnits = results.breakEvenUnits ?? 0;
  const breakdown = {
    contributionMargin: results.contributionMargin,
    breakEvenRevenue: results.breakEvenRevenue,
    targetProfitUnits: results.targetProfitUnits,
    targetProfitRevenue: results.targetProfitRevenue,
  };

  // rule: sellingPricePerUnit > variableCostPerUnit
  // rule: fixedCosts >= 0
  // rule: variableCostPerUnit >= 0
  // rule: sellingPricePerUnit >= 0
  // rule: targetProfit >= 0
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if contributionMargin <= 0 then 'CRITICAL: Selling price does not cover variable cost. No break-even possible.'
  // threshold skipped (non-JS): if breakEvenUnits > 1000000 then 'WARNING: Break-even volume is very high. Consider reducing fixed costs or increasing price.'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedBreakEvenUnits; } catch { return breakEvenUnits; } })();

  return {
    breakEvenUnits,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis (multi-period comparison)","Scenario comparison (what-if analysis)","Detailed report with charts"],
  };
}
