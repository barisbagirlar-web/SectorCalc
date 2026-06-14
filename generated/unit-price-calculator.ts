// Auto-generated from unit-price-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface UnitPriceCalculatorInput {
  totalCost: number;
  quantity: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'TRY';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const UnitPriceCalculatorInputSchema = z.object({
  totalCost: z.number().min(0).default(0),
  quantity: z.number().min(1).default(1),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'TRY']).default('USD'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('high'),
});

export interface UnitPriceCalculatorOutput {
  unitPrice: number;
  breakdown: {
    totalCost: number;
    quantity: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: UnitPriceCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.unitPrice = ((): number => { try { const __v = input.totalCost / input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence === 'low' ? results.unitPrice * 1.1 : input.dataConfidence === 'medium' ? results.unitPrice * 1.05 : results.unitPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateUnitPriceCalculator(input: UnitPriceCalculatorInput): UnitPriceCalculatorOutput {
  const results = evaluateFormulas(input);
  const unitPrice = results.unitPrice ?? 0;
  const breakdown = {
    totalCost: results.totalCost,
    quantity: results.quantity,
  };

  // rule: totalCost >= 0
  // rule: quantity >= 1
  // rule: totalCost > 0 if quantity > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (unitPrice > 1000) hiddenLossDrivers.push("unitPriceHigh");
  if (unitPrice < 0.01) hiddenLossDrivers.push("unitPriceLow");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return unitPrice; } })();

  return {
    unitPrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report"],
  };
}
