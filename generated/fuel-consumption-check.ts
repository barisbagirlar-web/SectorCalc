// Auto-generated from fuel-consumption-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FuelConsumptionCheckInput {
  fuelType: 'diesel' | 'gasoline' | 'natural_gas' | 'lpg' | 'electricity';
  fuelConsumption: number;
  distance: number;
  fuelPrice: number;
  operatingHours: number;
  idleConsumptionRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const FuelConsumptionCheckInputSchema = z.object({
  fuelType: z.enum(['diesel', 'gasoline', 'natural_gas', 'lpg', 'electricity']).default('diesel'),
  fuelConsumption: z.number().min(0).max(100).default(10),
  distance: z.number().min(0).max(1000000).default(10000),
  fuelPrice: z.number().min(0).max(10).default(1.5),
  operatingHours: z.number().min(0).max(8760).default(2000),
  idleConsumptionRate: z.number().min(0).max(50).default(1),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface FuelConsumptionCheckOutput {
  totalFuelCost: number;
  breakdown: {
    totalFuelUsed: number;
    totalIdleFuel: number;
    fuelCostPerKm: number;
    fuelEfficiency: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FuelConsumptionCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalFuelUsed = ((): number => { try { const __v = input.fuelConsumption * input.distance / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalIdleFuel = ((): number => { try { const __v = input.idleConsumptionRate * input.operatingHours; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFuelCost = ((): number => { try { const __v = (results.totalFuelUsed + results.totalIdleFuel) * input.fuelPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelCostPerKm = ((): number => { try { const __v = results.totalFuelCost / input.distance; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelEfficiency = ((): number => { try { const __v = input.distance / (results.totalFuelUsed + results.totalIdleFuel); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceFactor = ((): number => { try { const __v = input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedFuelCost = ((): number => { try { const __v = results.totalFuelCost * results.dataConfidenceFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFuelConsumptionCheck(input: FuelConsumptionCheckInput): FuelConsumptionCheckOutput {
  const results = evaluateFormulas(input);
  const totalFuelCost = results.totalFuelCost ?? 0;
  const breakdown = {
    totalFuelUsed: results.totalFuelUsed,
    totalIdleFuel: results.totalIdleFuel,
    fuelCostPerKm: results.fuelCostPerKm,
    fuelEfficiency: results.fuelEfficiency,
  };

  // rule: fuelConsumption > 0
  // rule: distance >= 0
  // rule: fuelPrice > 0
  // rule: operatingHours >= 0
  // rule: idleConsumptionRate >= 0
  // rule: if fuelType == 'electricity' then fuelConsumption unit is kWh/100km
  // rule: if fuelType != 'electricity' then fuelConsumption unit is L/100km
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if fuelConsumption > 20 then 'High fuel consumption'
  // threshold skipped (non-JS): if idleConsumptionRate > 5 then 'Excessive idle consumption'

  const dataConfidenceAdjusted = (() => { try { return results.adjustedFuelCost; } catch { return totalFuelCost; } })();

  return {
    totalFuelCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmark comparison","Detailed report with breakdown"],
  };
}
