// Auto-generated from fuel-travel-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FuelTravelCalculatorInput {
  distance: number;
  fuelEfficiency: number;
  fuelPrice: number;
  vehicleType: 'car' | 'truck' | 'bus' | 'motorcycle';
  loadFactor: number;
  dataConfidence: number;
}

export const FuelTravelCalculatorInputSchema = z.object({
  distance: z.number().min(0).default(100),
  fuelEfficiency: z.number().min(0).default(15),
  fuelPrice: z.number().min(0).default(1.5),
  vehicleType: z.enum(['car', 'truck', 'bus', 'motorcycle']).default('car'),
  loadFactor: z.number().min(0).max(100).default(100),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface FuelTravelCalculatorOutput {
  adjustedFuelCost: number;
  breakdown: {
    fuelConsumed: number;
    fuelCost: number;
    loadFactorPenalty: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FuelTravelCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.fuelConsumed = ((): number => { try { const __v = input.distance / input.fuelEfficiency; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelCost = ((): number => { try { const __v = results.fuelConsumed * input.fuelPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedFuelCost = ((): number => { try { const __v = results.fuelCost * (1 + (1 - input.loadFactor/100) * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.confidenceAdjustedCost = ((): number => { try { const __v = results.adjustedFuelCost * (1 + (1 - input.dataConfidence/100) * 0.05); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFuelTravelCalculator(input: FuelTravelCalculatorInput): FuelTravelCalculatorOutput {
  const results = evaluateFormulas(input);
  const adjustedFuelCost = results.adjustedFuelCost ?? 0;
  const breakdown = {
    fuelConsumed: results.fuelConsumed,
    fuelCost: results.fuelCost,
    loadFactorPenalty: results.loadFactorPenalty,
  };

  // rule: distance > 0
  // rule: fuelEfficiency > 0
  // rule: fuelPrice > 0
  // rule: loadFactor >= 0 && loadFactor <= 100
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Critical: Very low fuel efficiency, consider vehicle replacement.
  // threshold skipped (non-JS): Warning: Low load factor, optimize routing or consolidate shipments.
  // threshold skipped (non-JS): Warning: Low data confidence, results may be unreliable.

  const dataConfidenceAdjusted = (() => { try { return results.confidenceAdjustedCost; } catch { return adjustedFuelCost; } })();

  return {
    adjustedFuelCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Graphs"],
  };
}
