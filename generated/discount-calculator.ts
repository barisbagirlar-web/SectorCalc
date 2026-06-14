// Auto-generated from discount-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DiscountCalculatorInput {
  originalPrice: number;
  discountPercent: number;
  quantity: number;
  taxRate: number;
  additionalDiscount: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'TRY';
}

export const DiscountCalculatorInputSchema = z.object({
  originalPrice: z.number().min(0).default(100),
  discountPercent: z.number().min(0).max(100).default(10),
  quantity: z.number().min(1).default(1),
  taxRate: z.number().min(0).max(100).default(0),
  additionalDiscount: z.number().min(0).default(0),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'TRY']).default('USD'),
});

export interface DiscountCalculatorOutput {
  total: number;
  breakdown: {
    originalTotal: number;
    discountAmount: number;
    additionalDiscount: number;
    subtotalAfterDiscount: number;
    taxAmount: number;
    total: number;
    savings: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DiscountCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.discountAmount = (() => { try { return input.originalPrice * (input.discountPercent / 100); } catch { return 0; } })();
  results.discountedPrice = (() => { try { return input.originalPrice - results.discountAmount; } catch { return 0; } })();
  results.subtotal = (() => { try { return results.discountedPrice * input.quantity; } catch { return 0; } })();
  results.subtotalAfterAdditional = (() => { try { return results.subtotal - input.additionalDiscount; } catch { return 0; } })();
  results.taxAmount = (() => { try { return results.subtotalAfterAdditional * (input.taxRate / 100); } catch { return 0; } })();
  results.total = (() => { try { return results.subtotalAfterAdditional + results.taxAmount; } catch { return 0; } })();
  results.savings = (() => { try { return input.originalPrice * input.quantity - results.total; } catch { return 0; } })();
  return results;
}

export function calculateDiscountCalculator(input: DiscountCalculatorInput): DiscountCalculatorOutput {
  const results = evaluateFormulas(input);
  const total = results.total ?? 0;
  const breakdown = {
    originalTotal: results.originalTotal,
    discountAmount: results.discountAmount,
    additionalDiscount: results.additionalDiscount,
    subtotalAfterDiscount: results.subtotalAfterDiscount,
    taxAmount: results.taxAmount,
    total: results.total,
    savings: results.savings,
  };

  // rule: originalPrice must be >= 0
  // rule: discountPercent must be between 0 and 100
  // rule: quantity must be >= 1
  // rule: taxRate must be between 0 and 100
  // rule: additionalDiscount must be >= 0
  // rule: additionalDiscount must be <= originalPrice * quantity * (1 - discountPercent/100) (cannot exceed discounted subtotal)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High discount may indicate clearance or loss leader; check profitability.
  // threshold skipped (non-JS): High tax jurisdiction; consider tax optimization strategies.
  // threshold skipped (non-JS): Bulk order; verify logistics capacity per Lean principles.

  const dataConfidenceAdjusted = (() => { try { return total; } catch { return total; } })();

  return {
    total,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of calculation breakdown","CSV export of multiple scenarios","Trend analysis of discount usage over time","Comparison of different discount strategies","Detailed report with charts and recommendations"],
  };
}
