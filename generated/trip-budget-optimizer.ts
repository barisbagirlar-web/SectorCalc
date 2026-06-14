// Auto-generated from trip-budget-optimizer-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TripBudgetOptimizerInput {
  tripDuration: number;
  dailyBudget: number;
  numTravelers: number;
  accommodationCost: number;
  transportCost: number;
  foodCostPerDay: number;
  activityCost: number;
  miscCostPerDay: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'TRY';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const TripBudgetOptimizerInputSchema = z.object({
  tripDuration: z.number().min(1).max(365).default(5),
  dailyBudget: z.number().min(0).max(10000).default(100),
  numTravelers: z.number().min(1).max(1000).default(1),
  accommodationCost: z.number().min(0).max(10000).default(150),
  transportCost: z.number().min(0).max(100000).default(500),
  foodCostPerDay: z.number().min(0).max(1000).default(50),
  activityCost: z.number().min(0).max(5000).default(30),
  miscCostPerDay: z.number().min(0).max(1000).default(20),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'TRY']).default('USD'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface TripBudgetOptimizerOutput {
  totalBudget: number;
  breakdown: {
    totalAccommodation: number;
    totalFood: number;
    totalActivities: number;
    totalMisc: number;
    transportCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TripBudgetOptimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalAccommodation = ((): number => { try { const __v = input.accommodationCost * input.tripDuration * input.numTravelers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFood = ((): number => { try { const __v = input.foodCostPerDay * input.tripDuration * input.numTravelers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalActivities = ((): number => { try { const __v = input.activityCost * input.tripDuration * input.numTravelers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMisc = ((): number => { try { const __v = input.miscCostPerDay * input.tripDuration * input.numTravelers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalBudget = ((): number => { try { const __v = results.totalAccommodation + input.transportCost + results.totalFood + results.totalActivities + results.totalMisc; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerPerson = ((): number => { try { const __v = results.totalBudget / input.numTravelers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerDay = ((): number => { try { const __v = results.totalBudget / input.tripDuration; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.budgetUtilization = ((): number => { try { const __v = results.totalBudget / (input.dailyBudget * input.tripDuration * input.numTravelers + input.transportCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalBudget * (input.dataConfidence === 'low' ? 1.15 : input.dataConfidence === 'medium' ? 1.05 : 1.0); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTripBudgetOptimizer(input: TripBudgetOptimizerInput): TripBudgetOptimizerOutput {
  const results = evaluateFormulas(input);
  const totalBudget = results.totalBudget ?? 0;
  const breakdown = {
    totalAccommodation: results.totalAccommodation,
    totalFood: results.totalFood,
    totalActivities: results.totalActivities,
    totalMisc: results.totalMisc,
    transportCost: results.transportCost,
  };

  // rule: tripDuration must be >= 1 and <= 365
  // rule: dailyBudget must be >= 0
  // rule: numTravelers must be >= 1
  // rule: accommodationCost must be >= 0
  // rule: transportCost must be >= 0
  // rule: foodCostPerDay must be >= 0
  // rule: activityCost must be >= 0
  // rule: miscCostPerDay must be >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If totalBudget > 1.2 * (dailyBudget * tripDuration * numTravelers + transportCost) then warning: 'Budget exceeds planned by more than 20%'
  // threshold skipped (non-JS): If accommodationCost > 0.5 * dailyBudget then warning: 'Accommodation cost exceeds 50% of daily budget'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalBudget; } })();

  return {
    totalBudget,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Trips","Detailed Report with Charts"],
  };
}
