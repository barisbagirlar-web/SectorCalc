// Auto-generated from route-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RouteCostCalculatorInput {
  distanceKm: number;
  fuelConsumptionPerKm: number;
  fuelPricePerLiter: number;
  driverHourlyRate: number;
  averageSpeedKmh: number;
  tollCost: number;
  maintenanceCostPerKm: number;
  loadWeightTons: number;
  costPerTonKm: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'TRY';
}

export const RouteCostCalculatorInputSchema = z.object({
  distanceKm: z.number().min(0).default(100),
  fuelConsumptionPerKm: z.number().min(0).default(0.1),
  fuelPricePerLiter: z.number().min(0).default(1.5),
  driverHourlyRate: z.number().min(0).default(25),
  averageSpeedKmh: z.number().min(0).default(60),
  tollCost: z.number().min(0).default(0),
  maintenanceCostPerKm: z.number().min(0).default(0.05),
  loadWeightTons: z.number().min(0).default(10),
  costPerTonKm: z.number().min(0).default(0.1),
  currency: z.enum(['USD', 'EUR', 'GBP', 'TRY']).default('USD'),
});

export interface RouteCostCalculatorOutput {
  totalCost: number;
  breakdown: {
    fuelCost: number;
    driverCost: number;
    maintenanceCost: number;
    tollCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RouteCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.fuelCost = ((): number => { try { const __v = input.distanceKm * input.fuelConsumptionPerKm * input.fuelPricePerLiter; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.driverCost = ((): number => { try { const __v = (input.distanceKm / input.averageSpeedKmh) * input.driverHourlyRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maintenanceCost = ((): number => { try { const __v = input.distanceKm * input.maintenanceCostPerKm; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.fuelCost + results.driverCost + results.maintenanceCost + input.tollCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerKm = ((): number => { try { const __v = results.totalCost / input.distanceKm; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerTonKm = ((): number => { try { const __v = results.totalCost / (input.loadWeightTons * input.distanceKm); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costEfficiencyRatio = ((): number => { try { const __v = results.input.costPerTonKm / costPerTonKmInput; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRouteCostCalculator(input: RouteCostCalculatorInput): RouteCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    fuelCost: results.fuelCost,
    driverCost: results.driverCost,
    maintenanceCost: results.maintenanceCost,
    tollCost: results.tollCost,
  };

  // rule: distanceKm >= 0
  // rule: fuelConsumptionPerKm >= 0
  // rule: fuelPricePerLiter >= 0
  // rule: driverHourlyRate >= 0
  // rule: averageSpeedKmh > 0
  // rule: tollCost >= 0
  // rule: maintenanceCostPerKm >= 0
  // rule: loadWeightTons >= 0
  // rule: costPerTonKm >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): fuelConsumptionPerKm * fuelPricePerLiter
  // threshold skipped (non-JS): fuelCostPerKm + maintenanceCostPerKm + (driverHourlyRate / averageSpeedKmh)
  // threshold skipped (non-JS): totalCostPerKm * distanceKm + tollCost
  // threshold skipped (non-JS): totalCost / (loadWeightTons * distanceKm)
  // threshold skipped (non-JS): costPerTonKmActual / costPerTonKm

  const dataConfidenceAdjusted = (() => { try { return results.totalCost * (1 - 0.1 * (1 - dataConfidence)); } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Graphs"],
  };
}
