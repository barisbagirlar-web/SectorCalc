// Auto-generated from fuel-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FuelCostCalculatorInput {
  fuelType: 'diesel' | 'gasoline' | 'natural_gas' | 'propane' | 'electricity';
  fuelConsumption: number;
  distance: number;
  fuelPrice: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'TRY' | 'other';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const FuelCostCalculatorInputSchema = z.object({
  fuelType: z.enum(['diesel', 'gasoline', 'natural_gas', 'propane', 'electricity']).default('diesel'),
  fuelConsumption: z.number().min(0).max(100).default(10),
  distance: z.number().min(0).max(1000000).default(1000),
  fuelPrice: z.number().min(0).max(10).default(1.5),
  currency: z.enum(['USD', 'EUR', 'GBP', 'TRY', 'other']).default('USD'),
  period: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('monthly'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface FuelCostCalculatorOutput {
  totalFuelCost: number;
  breakdown: {
    totalFuelUsed: number;
    costPerKm: number;
    fuelPrice: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FuelCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalFuelUsed = ((): number => { try { const __v = input.fuelConsumption * input.distance / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFuelCost = ((): number => { try { const __v = results.totalFuelUsed * input.fuelPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerKm = ((): number => { try { const __v = results.totalFuelCost / input.distance; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedCost = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.totalFuelCost * 1.2 : (input.dataConfidence == 'medium' ? results.totalFuelCost * 1.05 : results.totalFuelCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFuelCostCalculator(input: FuelCostCalculatorInput): FuelCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalFuelCost = results.totalFuelCost ?? 0;
  const breakdown = {
    totalFuelUsed: results.totalFuelUsed,
    costPerKm: results.costPerKm,
    fuelPrice: results.fuelPrice,
  };

  // rule: fuelConsumption > 0
  // rule: distance >= 0
  // rule: fuelPrice > 0
  // rule: if fuelType == 'electricity' then fuelConsumption unit is kWh/100km
  // rule: if period == 'daily' then distance <= 10000
  // rule: if period == 'yearly' then distance <= 1000000
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High fuel consumption warning
  // threshold skipped (non-JS): Fuel price above average
  // threshold skipped (non-JS): High mileage period

  const dataConfidenceAdjusted = (() => { try { return results.adjustedCost; } catch { return totalFuelCost; } })();

  return {
    totalFuelCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with benchmarks","Detailed report with breakdowns"],
  };
}
