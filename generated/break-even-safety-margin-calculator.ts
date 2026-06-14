// Auto-generated from break-even-safety-margin-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BreakEvenSafetyMarginCalculatorInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  actualSalesVolume: number;
  timePeriod: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export const BreakEvenSafetyMarginCalculatorInputSchema = z.object({
  fixedCosts: z.number().min(0).default(0),
  variableCostPerUnit: z.number().min(0).default(0),
  sellingPricePerUnit: z.number().min(0).default(0),
  actualSalesVolume: z.number().min(0).default(0),
  timePeriod: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).default('monthly'),
});

export interface BreakEvenSafetyMarginCalculatorOutput {
  safetyMarginPercentage: number;
  breakdown: {
    breakEvenUnits: number;
    breakEvenRevenue: number;
    contributionMarginPerUnit: number;
    contributionMarginRatio: number;
    safetyMarginUnits: number;
    safetyMarginRevenue: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BreakEvenSafetyMarginCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.contributionMarginPerUnit = (() => { try { return input.sellingPricePerUnit - input.variableCostPerUnit; } catch { return 0; } })();
  results.contributionMarginRatio = (() => { try { return results.contributionMarginPerUnit / input.sellingPricePerUnit; } catch { return 0; } })();
  results.breakEvenUnits = (() => { try { return input.fixedCosts / results.contributionMarginPerUnit; } catch { return 0; } })();
  results.breakEvenRevenue = (() => { try { return input.fixedCosts / results.contributionMarginRatio; } catch { return 0; } })();
  results.safetyMarginUnits = (() => { try { return input.actualSalesVolume - results.breakEvenUnits; } catch { return 0; } })();
  results.safetyMarginRevenue = (() => { try { return (input.actualSalesVolume * input.sellingPricePerUnit) - results.breakEvenRevenue; } catch { return 0; } })();
  results.safetyMarginPercentage = (() => { try { return results.safetyMarginUnits / input.actualSalesVolume; } catch { return 0; } })();
  return results;
}

export function calculateBreakEvenSafetyMarginCalculator(input: BreakEvenSafetyMarginCalculatorInput): BreakEvenSafetyMarginCalculatorOutput {
  const results = evaluateFormulas(input);
  const safetyMarginPercentage = results.safetyMarginPercentage ?? 0;
  const breakdown = {
    breakEvenUnits: results.breakEvenUnits,
    breakEvenRevenue: results.breakEvenRevenue,
    contributionMarginPerUnit: results.contributionMarginPerUnit,
    contributionMarginRatio: results.contributionMarginRatio,
    safetyMarginUnits: results.safetyMarginUnits,
    safetyMarginRevenue: results.safetyMarginRevenue,
  };

  // rule: sellingPricePerUnit > variableCostPerUnit
  // rule: fixedCosts >= 0
  // rule: variableCostPerUnit >= 0
  // rule: sellingPricePerUnit > 0
  // rule: actualSalesVolume >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): safetyMargin < 0.1 -> 'Low safety margin, high risk'
  // threshold skipped (non-JS): actualSalesVolume < breakEvenUnits -> 'Below break-even point'

  const dataConfidenceAdjusted = (() => { try { return safetyMarginPercentage; } catch { return safetyMarginPercentage; } })();

  return {
    safetyMarginPercentage,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over periods","Scenario comparison","Detailed report with charts"],
  };
}
