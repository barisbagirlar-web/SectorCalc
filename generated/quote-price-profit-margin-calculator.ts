// Auto-generated from quote-price-profit-margin-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface QuotePriceProfitMarginCalculatorInput {
  unitCost: number;
  desiredProfitMargin: number;
  overheadRate: number;
  quantity: number;
  discountRate: number;
  taxRate: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'TRY';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const QuotePriceProfitMarginCalculatorInputSchema = z.object({
  unitCost: z.number().min(0).default(0),
  desiredProfitMargin: z.number().min(0).max(100).default(20),
  overheadRate: z.number().min(0).max(100).default(15),
  quantity: z.number().min(1).default(1),
  discountRate: z.number().min(0).max(100).default(0),
  taxRate: z.number().min(0).max(100).default(0),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'TRY']).default('USD'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface QuotePriceProfitMarginCalculatorOutput {
  finalPrice: number;
  breakdown: {
    totalCost: number;
    basePrice: number;
    discountedPrice: number;
    profitPerUnit: number;
    profitMargin: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: QuotePriceProfitMarginCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalCost = ((): number => { try { const __v = input.unitCost * input.quantity * (1 + input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.basePrice = ((): number => { try { const __v = results.totalCost / (1 - input.desiredProfitMargin / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.discountedPrice = ((): number => { try { const __v = results.basePrice * (1 - input.discountRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.finalPrice = ((): number => { try { const __v = results.discountedPrice * (1 + input.taxRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitPerUnit = ((): number => { try { const __v = results.finalPrice / input.quantity - input.unitCost * (1 + input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMargin = ((): number => { try { const __v = (results.finalPrice - results.totalCost) / results.finalPrice * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateQuotePriceProfitMarginCalculator(input: QuotePriceProfitMarginCalculatorInput): QuotePriceProfitMarginCalculatorOutput {
  const results = evaluateFormulas(input);
  const finalPrice = results.finalPrice ?? 0;
  const breakdown = {
    totalCost: results.totalCost,
    basePrice: results.basePrice,
    discountedPrice: results.discountedPrice,
    profitPerUnit: results.profitPerUnit,
    profitMargin: results.profitMargin,
  };

  // rule: unitCost must be >= 0
  // rule: desiredProfitMargin must be between 0 and 100
  // rule: overheadRate must be between 0 and 100
  // rule: quantity must be >= 1
  // rule: discountRate must be between 0 and 100
  // rule: taxRate must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Warning: Desired profit margin is very high; may reduce competitiveness.
  // threshold skipped (non-JS): Warning: High discount rate may erode profit margin.
  // threshold skipped (non-JS): Warning: Overhead rate is high; consider cost reduction.

  const dataConfidenceAdjusted = (() => { try { return results.finalPrice * (1 + (input.dataConfidence === 'low' ? 0.1 : input.dataConfidence === 'medium' ? 0.05 : 0)); } catch { return finalPrice; } })();

  return {
    finalPrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
