// Auto-generated from food-waste-margin-loss-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FoodWasteMarginLossInput {
  totalFoodPurchased: number;
  wastePercentage: number;
  averageCostPerKg: number;
  averageSellingPricePerKg: number;
  periodDays: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const FoodWasteMarginLossInputSchema = z.object({
  totalFoodPurchased: z.number().min(0).default(10000),
  wastePercentage: z.number().min(0).max(100).default(5),
  averageCostPerKg: z.number().min(0).default(3.5),
  averageSellingPricePerKg: z.number().min(0).default(8),
  periodDays: z.number().min(1).max(365).default(30),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface FoodWasteMarginLossOutput {
  marginLoss: number;
  breakdown: {
    wasteQuantity: number;
    costOfWaste: number;
    lostRevenue: number;
    marginLossPerDay: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FoodWasteMarginLossInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.wasteQuantity = (() => { try { return input.totalFoodPurchased * (input.wastePercentage / 100); } catch { return 0; } })();
  results.costOfWaste = (() => { try { return results.wasteQuantity * input.averageCostPerKg; } catch { return 0; } })();
  results.lostRevenue = (() => { try { return results.wasteQuantity * input.averageSellingPricePerKg; } catch { return 0; } })();
  results.marginLoss = (() => { try { return results.lostRevenue - results.costOfWaste; } catch { return 0; } })();
  results.marginLossPerDay = (() => { try { return results.marginLoss / input.periodDays; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.marginLoss * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); } catch { return 0; } })();
  return results;
}

export function calculateFoodWasteMarginLoss(input: FoodWasteMarginLossInput): FoodWasteMarginLossOutput {
  const results = evaluateFormulas(input);
  const marginLoss = results.marginLoss ?? 0;
  const breakdown = {
    wasteQuantity: results.wasteQuantity,
    costOfWaste: results.costOfWaste,
    lostRevenue: results.lostRevenue,
    marginLossPerDay: results.marginLossPerDay,
  };

  // rule: totalFoodPurchased >= 0
  // rule: wastePercentage >= 0 and wastePercentage <= 100
  // rule: averageCostPerKg >= 0
  // rule: averageSellingPricePerKg >= 0
  // rule: periodDays >= 1 and periodDays <= 365
  // rule: if wastePercentage > 0 then totalFoodPurchased > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Critical: Waste percentage exceeds 10% - immediate action required
  // threshold skipped (non-JS): Warning: Waste percentage above 5% - review processes
  // threshold skipped (non-JS): Critical: Daily margin loss exceeds $100

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return marginLoss; } })();

  return {
    marginLoss,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over multiple periods","Benchmarking against industry standards","Detailed breakdown report"],
  };
}
