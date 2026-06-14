// Auto-generated from restaurant-menu-margin-leak-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RestaurantMenuMarginLeakInput {
  menuItemPrice: number;
  foodCostPerUnit: number;
  laborCostPerUnit: number;
  overheadCostPerUnit: number;
  wastePercentage: number;
  discountPercentage: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const RestaurantMenuMarginLeakInputSchema = z.object({
  menuItemPrice: z.number().min(0).max(1000).default(15.99),
  foodCostPerUnit: z.number().min(0).max(1000).default(4.5),
  laborCostPerUnit: z.number().min(0).max(1000).default(2),
  overheadCostPerUnit: z.number().min(0).max(1000).default(1.5),
  wastePercentage: z.number().min(0).max(100).default(5),
  discountPercentage: z.number().min(0).max(100).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface RestaurantMenuMarginLeakOutput {
  marginPercent: number;
  breakdown: {
    totalCostPerUnit: number;
    effectivePrice: number;
    wasteAdjustedCost: number;
    marginPerUnit: number;
    marginLeakPercent: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RestaurantMenuMarginLeakInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalCostPerUnit = ((): number => { try { const __v = input.foodCostPerUnit + input.laborCostPerUnit + input.overheadCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectivePrice = ((): number => { try { const __v = input.menuItemPrice * (1 - input.discountPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wasteAdjustedCost = ((): number => { try { const __v = results.totalCostPerUnit / (1 - input.wastePercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginPerUnit = ((): number => { try { const __v = results.effectivePrice - results.wasteAdjustedCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginPercent = ((): number => { try { const __v = (results.marginPerUnit / results.effectivePrice) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginLeakPercent = ((): number => { try { const __v = ((input.menuItemPrice - results.effectivePrice) / input.menuItemPrice) * 100 + (input.wastePercentage * (results.totalCostPerUnit / input.menuItemPrice)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedMargin = ((): number => { try { const __v = results.marginPercent * (input.dataConfidence == 'high' ? 1.0 : (input.dataConfidence == 'medium' ? 0.95 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRestaurantMenuMarginLeak(input: RestaurantMenuMarginLeakInput): RestaurantMenuMarginLeakOutput {
  const results = evaluateFormulas(input);
  const marginPercent = results.marginPercent ?? 0;
  const breakdown = {
    totalCostPerUnit: results.totalCostPerUnit,
    effectivePrice: results.effectivePrice,
    wasteAdjustedCost: results.wasteAdjustedCost,
    marginPerUnit: results.marginPerUnit,
    marginLeakPercent: results.marginLeakPercent,
  };

  // rule: menuItemPrice > 0
  // rule: foodCostPerUnit >= 0
  // rule: laborCostPerUnit >= 0
  // rule: overheadCostPerUnit >= 0
  // rule: wastePercentage >= 0 and wastePercentage <= 100
  // rule: discountPercentage >= 0 and discountPercentage <= 100
  // rule: foodCostPerUnit + laborCostPerUnit + overheadCostPerUnit < menuItemPrice (otherwise negative margin)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): marginLeakPercent
  // threshold skipped (non-string): wastePercentage

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedMargin; } catch { return marginPercent; } })();

  return {
    marginPercent,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over time","Benchmarking against industry standards","Detailed breakdown report with charts"],
  };
}
