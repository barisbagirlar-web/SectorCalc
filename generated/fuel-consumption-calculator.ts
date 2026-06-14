// Auto-generated from fuel-consumption-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FuelConsumptionCalculatorInput {
  distance: number;
  fuelUsed: number;
  fuelType: 'gasoline' | 'diesel' | 'LPG' | 'CNG' | 'electricity';
  vehicleType: 'car' | 'truck' | 'bus' | 'motorcycle' | 'van';
  drivingCondition: 'city' | 'highway' | 'mixed';
  loadFactor: number;
  maintenanceScore: number;
  dataConfidence: number;
}

export const FuelConsumptionCalculatorInputSchema = z.object({
  distance: z.number().min(0).default(100),
  fuelUsed: z.number().min(0).default(10),
  fuelType: z.enum(['gasoline', 'diesel', 'LPG', 'CNG', 'electricity']).default('gasoline'),
  vehicleType: z.enum(['car', 'truck', 'bus', 'motorcycle', 'van']).default('car'),
  drivingCondition: z.enum(['city', 'highway', 'mixed']).default('mixed'),
  loadFactor: z.number().min(0).max(100).default(50),
  maintenanceScore: z.number().min(0).max(100).default(80),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface FuelConsumptionCalculatorOutput {
  fuelConsumptionPer100km: number;
  breakdown: {
    adjustedConsumption: number;
    co2Emission: number;
    cost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FuelConsumptionCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.fuelConsumptionPer100km = (() => { try { return input.fuelUsed / input.distance * 100; } catch { return 0; } })();
  results.adjustedConsumption = (() => { try { return results.fuelConsumptionPer100km * (1 + (100 - input.maintenanceScore) / 200) * (1 + input.loadFactor / 200); } catch { return 0; } })();
  results.co2Emission = (() => { try { return input.fuelUsed * (input.fuelType === 'gasoline' ? 2.31 : input.fuelType === 'diesel' ? 2.68 : input.fuelType === 'LPG' ? 1.51 : input.fuelType === 'CNG' ? 1.64 : 0) * 1000; } catch { return 0; } })();
  results.cost = (() => { try { return input.fuelUsed * (input.fuelType === 'gasoline' ? 1.5 : input.fuelType === 'diesel' ? 1.4 : input.fuelType === 'LPG' ? 0.9 : input.fuelType === 'CNG' ? 0.8 : 0.12); } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.adjustedConsumption * (input.dataConfidence / 100); } catch { return 0; } })();
  return results;
}

export function calculateFuelConsumptionCalculator(input: FuelConsumptionCalculatorInput): FuelConsumptionCalculatorOutput {
  const results = evaluateFormulas(input);
  const fuelConsumptionPer100km = results.fuelConsumptionPer100km ?? 0;
  const breakdown = {
    adjustedConsumption: results.adjustedConsumption,
    co2Emission: results.co2Emission,
    cost: results.cost,
  };

  // rule: distance > 0
  // rule: fuelUsed > 0
  // rule: loadFactor >= 0 and loadFactor <= 100
  // rule: maintenanceScore >= 0 and maintenanceScore <= 100
  // rule: dataConfidence >= 0 and dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High fuel consumption warning
  // threshold skipped (non-JS): Maintenance required
  // threshold skipped (non-JS): Overload risk

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return fuelConsumptionPer100km; } })();

  return {
    fuelConsumptionPer100km,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report"],
  };
}
