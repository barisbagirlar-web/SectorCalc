// Auto-generated from product-margin-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ProductMarginCalculatorInput {
  sellingPrice: number;
  unitCost: number;
  volume: number;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  fixedCosts: number;
  variableCosts: number;
  discountRate: number;
  returnRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ProductMarginCalculatorInputSchema = z.object({
  sellingPrice: z.number().min(0).default(0),
  unitCost: z.number().min(0).default(0),
  volume: z.number().min(1).default(1),
  period: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).default('monthly'),
  fixedCosts: z.number().min(0).default(0),
  variableCosts: z.number().min(0).default(0),
  discountRate: z.number().min(0).max(100).default(0),
  returnRate: z.number().min(0).max(100).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ProductMarginCalculatorOutput {
  netMargin: number;
  breakdown: {
    effectivePrice: number;
    grossMarginPerUnit: number;
    grossMarginPercent: number;
    totalGrossMargin: number;
    netMarginPercent: number;
    breakEvenUnits: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ProductMarginCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.effectivePrice = ((): number => { try { const __v = input.sellingPrice * (1 - input.discountRate / 100) * (1 - input.returnRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalVariableCostPerUnit = ((): number => { try { const __v = input.unitCost + input.variableCosts; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossMarginPerUnit = ((): number => { try { const __v = results.effectivePrice - results.totalVariableCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossMarginPercent = ((): number => { try { const __v = results.grossMarginPerUnit / results.effectivePrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalGrossMargin = ((): number => { try { const __v = results.grossMarginPerUnit * input.volume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netMargin = ((): number => { try { const __v = results.totalGrossMargin - input.fixedCosts; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netMarginPercent = ((): number => { try { const __v = results.netMargin / (results.effectivePrice * input.volume); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.breakEvenUnits = ((): number => { try { const __v = input.fixedCosts / results.grossMarginPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateProductMarginCalculator(input: ProductMarginCalculatorInput): ProductMarginCalculatorOutput {
  const results = evaluateFormulas(input);
  const netMargin = results.netMargin ?? 0;
  const breakdown = {
    effectivePrice: results.effectivePrice,
    grossMarginPerUnit: results.grossMarginPerUnit,
    grossMarginPercent: results.grossMarginPercent,
    totalGrossMargin: results.totalGrossMargin,
    netMarginPercent: results.netMarginPercent,
    breakEvenUnits: results.breakEvenUnits,
  };

  // rule: sellingPrice > 0
  // rule: unitCost >= 0
  // rule: volume >= 1
  // rule: fixedCosts >= 0
  // rule: variableCosts >= 0
  // rule: discountRate >= 0 && discountRate <= 100
  // rule: returnRate >= 0 && returnRate <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): grossMarginPercent
  // threshold skipped (non-string): netMarginPercent
  // threshold skipped (non-string): returnRate

  const dataConfidenceAdjusted = (() => { try { return input.dataConfidence === 'low' ? results.netMargin * 0.9 : input.dataConfidence === 'medium' ? results.netMargin * 0.95 : results.netMargin; } catch { return netMargin; } })();

  return {
    netMargin,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over time","Scenario comparison","Detailed report with charts"],
  };
}
