// Auto-generated from seed-rate-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SeedRateCalculatorInput {
  targetPlantPopulation: number;
  germinationRate: number;
  seedlingSurvivalRate: number;
  thousandSeedWeight: number;
  rowSpacing: number;
  seedCostPerKg: number;
  fieldArea: number;
  dataConfidence: number;
}

export const SeedRateCalculatorInputSchema = z.object({
  targetPlantPopulation: z.number().min(10000).max(200000).default(50000),
  germinationRate: z.number().min(50).max(100).default(95),
  seedlingSurvivalRate: z.number().min(50).max(100).default(90),
  thousandSeedWeight: z.number().min(1).max(500).default(40),
  rowSpacing: z.number().min(10).max(200).default(75),
  seedCostPerKg: z.number().min(0).max(1000).default(5),
  fieldArea: z.number().min(0.1).max(1000).default(1),
  dataConfidence: z.number().min(50).max(100).default(100),
});

export interface SeedRateCalculatorOutput {
  seedRateKgPerHa: number;
  breakdown: {
    seedsPerHectare: number;
    totalSeedRequiredKg: number;
    totalSeedCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SeedRateCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.seedsPerHectare = ((): number => { try { const __v = input.targetPlantPopulation / (input.germinationRate/100) / (input.seedlingSurvivalRate/100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.seedRateKgPerHa = ((): number => { try { const __v = results.seedsPerHectare * input.thousandSeedWeight / 1000 / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalSeedRequiredKg = ((): number => { try { const __v = results.seedRateKgPerHa * input.fieldArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalSeedCost = ((): number => { try { const __v = results.totalSeedRequiredKg * input.seedCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedSeedRateKgPerHa = ((): number => { try { const __v = results.seedRateKgPerHa * (100 / input.dataConfidence); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSeedRateCalculator(input: SeedRateCalculatorInput): SeedRateCalculatorOutput {
  const results = evaluateFormulas(input);
  const seedRateKgPerHa = results.seedRateKgPerHa ?? 0;
  const breakdown = {
    seedsPerHectare: results.seedsPerHectare,
    totalSeedRequiredKg: results.totalSeedRequiredKg,
    totalSeedCost: results.totalSeedCost,
  };

  // rule: germinationRate must be between 50 and 100
  // rule: seedlingSurvivalRate must be between 50 and 100
  // rule: thousandSeedWeight must be > 0
  // rule: rowSpacing must be > 0
  // rule: seedCostPerKg must be >= 0
  // rule: fieldArea must be > 0
  // rule: dataConfidence must be between 50 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low germination rate may require higher seed rate or seed treatment.
  // threshold skipped (non-JS): Low survival rate indicates poor field conditions; consider increasing seed rate.
  // threshold skipped (non-JS): High seed cost; consider precision planting to reduce waste.

  const dataConfidenceAdjusted = (() => { try { return results.adjustedSeedRateKgPerHa; } catch { return seedRateKgPerHa; } })();

  return {
    seedRateKgPerHa,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over multiple fields","Comparison with historical data","Detailed report with recommendations"],
  };
}
