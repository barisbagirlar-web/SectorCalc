// Auto-generated from depreciation-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DepreciationCalculatorInput {
  assetCost: number;
  salvageValue: number;
  usefulLife: number;
  depreciationMethod: 'straight-line' | 'declining-balance' | 'sum-of-years-digits' | 'units-of-production';
  decliningBalanceFactor: number;
  productionUnits: number;
  unitsProducedThisYear: number;
  dataConfidence: number;
}

export const DepreciationCalculatorInputSchema = z.object({
  assetCost: z.number().min(0).default(100000),
  salvageValue: z.number().min(0).default(10000),
  usefulLife: z.number().min(1).max(50).default(10),
  depreciationMethod: z.enum(['straight-line', 'declining-balance', 'sum-of-years-digits', 'units-of-production']).default('straight-line'),
  decliningBalanceFactor: z.number().min(1).max(3).default(2),
  productionUnits: z.number().min(1).default(100000),
  unitsProducedThisYear: z.number().min(0).default(10000),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface DepreciationCalculatorOutput {
  annualDepreciation: number;
  breakdown: {
    depreciableBase: number;
    bookValue: number;
    accumulatedDepreciation: number;
    remainingLife: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DepreciationCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.depreciableBase = (() => { try { return input.assetCost - input.salvageValue; } catch { return 0; } })();
  results.remainingLife = (() => { try { return input.usefulLife - yearsElapsed; } catch { return 0; } })();
  results.sumOfYears = (() => { try { return input.usefulLife * (input.usefulLife + 1) / 2; } catch { return 0; } })();
  results.annualDepreciation = (() => { try { return input.depreciationMethod == 'straight-line' ? results.depreciableBase / input.usefulLife : (input.depreciationMethod == 'declining-balance' ? (results.bookValue * input.decliningBalanceFactor / input.usefulLife) : (input.depreciationMethod == 'sum-of-years-digits' ? (results.remainingLife / results.sumOfYears) * results.depreciableBase : (input.depreciationMethod == 'units-of-production' ? (results.depreciableBase / input.productionUnits) * input.unitsProducedThisYear : 0))); } catch { return 0; } })();
  results.bookValue = (() => { try { return input.assetCost - results.accumulatedDepreciation; } catch { return 0; } })();
  results.accumulatedDepreciation = (() => { try { return 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.annualDepreciation * (input.dataConfidence / 100); } catch { return 0; } })();
  return results;
}

export function calculateDepreciationCalculator(input: DepreciationCalculatorInput): DepreciationCalculatorOutput {
  const results = evaluateFormulas(input);
  const annualDepreciation = results.annualDepreciation ?? 0;
  const breakdown = {
    depreciableBase: results.depreciableBase,
    bookValue: results.bookValue,
    accumulatedDepreciation: results.accumulatedDepreciation,
    remainingLife: results.remainingLife,
  };

  // rule: salvageValue must be less than assetCost
  // rule: usefulLife must be positive integer
  // rule: if depreciationMethod == 'declining-balance' then decliningBalanceFactor must be >= 1 and <= 3
  // rule: if depreciationMethod == 'units-of-production' then productionUnits must be > 0 and unitsProducedThisYear must be >= 0
  // rule: unitsProducedThisYear must be <= productionUnits
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High salvage value relative to cost; consider impairment test.
  // threshold skipped (non-JS): Very long useful life; verify asset type and condition.
  // threshold skipped (non-JS): Aggressive depreciation; may not reflect actual usage.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return annualDepreciation; } })();

  return {
    annualDepreciation,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["Export to PDF/CSV","Trend analysis over multiple periods","Comparison of different depreciation methods","Detailed report with charts and amortization schedule"],
  };
}
