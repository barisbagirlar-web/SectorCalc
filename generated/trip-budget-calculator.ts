// Auto-generated from trip-budget-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TripBudgetCalculatorInput {
  destination: 'domestic' | 'international';
  tripDuration: number;
  travelers: number;
  accommodationCostPerNight: number;
  dailyMealCost: number;
  transportationCost: number;
  incidentalsPerDay: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'TRY';
  exchangeRate: number;
  dataConfidence: number;
}

export const TripBudgetCalculatorInputSchema = z.object({
  destination: z.enum(['domestic', 'international']).default('domestic'),
  tripDuration: z.number().min(1).max(365).default(3),
  travelers: z.number().min(1).max(100).default(1),
  accommodationCostPerNight: z.number().min(0).max(10000).default(150),
  dailyMealCost: z.number().min(0).max(500).default(50),
  transportationCost: z.number().min(0).max(100000).default(500),
  incidentalsPerDay: z.number().min(0).max(200).default(20),
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY', 'TRY']).default('USD'),
  exchangeRate: z.number().min(0.001).max(1000).default(1),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface TripBudgetCalculatorOutput {
  totalCostInUSD: number;
  breakdown: {
    totalAccommodationCost: number;
    totalMealCost: number;
    transportationCost: number;
    totalIncidentals: number;
    totalCostPerPerson: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TripBudgetCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalAccommodationCost = ((): number => { try { const __v = input.accommodationCostPerNight * (input.tripDuration - 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMealCost = ((): number => { try { const __v = input.dailyMealCost * input.tripDuration * input.travelers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalIncidentals = ((): number => { try { const __v = input.incidentalsPerDay * input.tripDuration * input.travelers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalAccommodationCost + results.totalMealCost + input.transportationCost + results.totalIncidentals; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerPerson = ((): number => { try { const __v = results.totalCost / input.travelers; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostInUSD = ((): number => { try { const __v = results.totalCost * input.exchangeRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCostInUSD * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTripBudgetCalculator(input: TripBudgetCalculatorInput): TripBudgetCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCostInUSD = results.totalCostInUSD ?? 0;
  const breakdown = {
    totalAccommodationCost: results.totalAccommodationCost,
    totalMealCost: results.totalMealCost,
    transportationCost: results.transportationCost,
    totalIncidentals: results.totalIncidentals,
    totalCostPerPerson: results.totalCostPerPerson,
  };

  // rule: tripDuration must be >= 1
  // rule: travelers must be >= 1
  // rule: accommodationCostPerNight must be >= 0
  // rule: dailyMealCost must be >= 0
  // rule: transportationCost must be >= 0
  // rule: incidentalsPerDay must be >= 0
  // rule: exchangeRate must be > 0
  // rule: dataConfidence must be between 0 and 100
  // rule: If destination is 'international', exchangeRate must be provided and not equal to 1 unless currency is USD
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If totalCostPerPerson > 5000, warning: 'High cost per person, consider budget review'
  // threshold skipped (non-JS): If accommodationCostPerNight > 500, warning: 'Accommodation cost exceeds typical corporate limit'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCostInUSD; } })();

  return {
    totalCostInUSD,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Trips","Detailed Report with Charts"],
  };
}
