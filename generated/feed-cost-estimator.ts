// Auto-generated from feed-cost-estimator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FeedCostEstimatorInput {
  feedType: 'corn' | 'soybean meal' | 'wheat' | 'barley' | 'mixed';
  quantityPerDay: number;
  pricePerKg: number;
  numberOfAnimals: number;
  feedingDays: number;
  wastePercentage: number;
  laborCostPerHour: number;
  laborHoursPerDay: number;
  transportCostPerKg: number;
  storageCostPerKg: number;
  dataConfidence: number;
}

export const FeedCostEstimatorInputSchema = z.object({
  feedType: z.enum(['corn', 'soybean meal', 'wheat', 'barley', 'mixed']).default('corn'),
  quantityPerDay: z.number().min(0).max(100000).default(100),
  pricePerKg: z.number().min(0).max(100).default(0.3),
  numberOfAnimals: z.number().min(1).max(1000000).default(1000),
  feedingDays: z.number().min(1).max(3650).default(365),
  wastePercentage: z.number().min(0).max(50).default(5),
  laborCostPerHour: z.number().min(0).max(100).default(15),
  laborHoursPerDay: z.number().min(0).max(24).default(2),
  transportCostPerKg: z.number().min(0).max(10).default(0.05),
  storageCostPerKg: z.number().min(0).max(10).default(0.02),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface FeedCostEstimatorOutput {
  totalCost: number;
  breakdown: {
    feedCost: number;
    wasteCost: number;
    laborCost: number;
    transportCost: number;
    storageCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FeedCostEstimatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalFeedQuantity = ((): number => { try { const __v = input.quantityPerDay * input.numberOfAnimals * input.feedingDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFeedCost = ((): number => { try { const __v = results.totalFeedQuantity * input.pricePerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wasteCost = ((): number => { try { const __v = results.totalFeedCost * (input.wastePercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = input.laborCostPerHour * input.laborHoursPerDay * input.feedingDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.transportCost = ((): number => { try { const __v = results.totalFeedQuantity * input.transportCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.storageCost = ((): number => { try { const __v = results.totalFeedQuantity * input.storageCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalFeedCost + results.wasteCost + results.laborCost + results.transportCost + results.storageCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerAnimalPerDay = ((): number => { try { const __v = results.totalCost / (input.numberOfAnimals * input.feedingDays); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerKgFeed = ((): number => { try { const __v = results.totalCost / results.totalFeedQuantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCost * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFeedCostEstimator(input: FeedCostEstimatorInput): FeedCostEstimatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    feedCost: results.totalFeedCost,
    wasteCost: results.wasteCost,
    laborCost: results.laborCost,
    transportCost: results.transportCost,
    storageCost: results.storageCost,
  };

  // rule: quantityPerDay > 0
  // rule: pricePerKg > 0
  // rule: numberOfAnimals > 0
  // rule: feedingDays > 0
  // rule: wastePercentage >= 0
  // rule: laborCostPerHour >= 0
  // rule: laborHoursPerDay >= 0
  // rule: transportCostPerKg >= 0
  // rule: storageCostPerKg >= 0
  // rule: dataConfidence between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste percentage; consider improving feed management.
  // threshold skipped (non-JS): Labor cost exceeds $100/day; review efficiency.
  // threshold skipped (non-JS): Transport cost high; consider local suppliers.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Comparison with benchmarks","Detailed breakdown report"],
  };
}
