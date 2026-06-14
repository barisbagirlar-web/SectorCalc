// Auto-generated from tip-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TipCalculatorInput {
  billAmount: number;
  tipPercentage: number;
  splitCount: number;
  roundUp: boolean;
  serviceQuality: 'poor' | 'average' | 'excellent';
}

export const TipCalculatorInputSchema = z.object({
  billAmount: z.number().min(0).default(0),
  tipPercentage: z.number().min(0).max(100).default(15),
  splitCount: z.number().min(1).default(1),
  roundUp: z.boolean().default(false),
  serviceQuality: z.enum(['poor', 'average', 'excellent']).default('average'),
});

export interface TipCalculatorOutput {
  roundedTotalPerPerson: number;
  breakdown: {
    tipAmount: number;
    totalAmount: number;
    totalPerPerson: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TipCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.tipAmount = ((): number => { try { const __v = input.billAmount * (input.tipPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAmount = ((): number => { try { const __v = input.billAmount + results.tipAmount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalPerPerson = ((): number => { try { const __v = results.totalAmount / input.splitCount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roundedTotalPerPerson = ((): number => { try { const __v = input.roundUp ? Math.Math.ceil(results.totalPerPerson) : results.totalPerPerson; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTipCalculator(input: TipCalculatorInput): TipCalculatorOutput {
  const results = evaluateFormulas(input);
  const roundedTotalPerPerson = results.roundedTotalPerPerson ?? 0;
  const breakdown = {
    tipAmount: results.tipAmount,
    totalAmount: results.totalAmount,
    totalPerPerson: results.totalPerPerson,
  };

  // rule: billAmount must be >= 0
  // rule: tipPercentage must be between 0 and 100
  // rule: splitCount must be >= 1
  // rule: if serviceQuality is 'poor', tipPercentage should be <= 10
  // rule: if serviceQuality is 'excellent', tipPercentage should be >= 18
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if tipPercentage > 25 then 'High tip percentage'
  // threshold skipped (non-JS): if splitCount > 10 then 'Large group'

  const dataConfidenceAdjusted = (() => { try { return results.roundedTotalPerPerson; } catch { return roundedTotalPerPerson; } })();

  return {
    roundedTotalPerPerson,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with historical tips","Detailed report with service quality breakdown"],
  };
}
