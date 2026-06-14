// Auto-generated from logistics-fuel-route-drift-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LogisticsFuelRouteDriftInput {
  plannedRouteDistance: number;
  actualRouteDistance: number;
  fuelConsumptionRate: number;
  fuelCostPerLiter: number;
  numTrips: number;
  timePeriod: 'day' | 'week' | 'month' | 'quarter' | 'year';
  dataConfidence: number;
}

export const LogisticsFuelRouteDriftInputSchema = z.object({
  plannedRouteDistance: z.number().min(0).default(100),
  actualRouteDistance: z.number().min(0).default(110),
  fuelConsumptionRate: z.number().min(0).default(0.3),
  fuelCostPerLiter: z.number().min(0).default(1.5),
  numTrips: z.number().min(1).default(1),
  timePeriod: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface LogisticsFuelRouteDriftOutput {
  totalFuelCostDrift: number;
  breakdown: {
    routeDriftPercent: number;
    fuelCostPlanned: number;
    fuelCostActual: number;
    fuelCostDrift: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LogisticsFuelRouteDriftInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.routeDriftPercent = ((): number => { try { const __v = ((input.actualRouteDistance - input.plannedRouteDistance) / input.plannedRouteDistance) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelConsumedPlanned = ((): number => { try { const __v = input.plannedRouteDistance * input.fuelConsumptionRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelConsumedActual = ((): number => { try { const __v = input.actualRouteDistance * input.fuelConsumptionRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelCostPlanned = ((): number => { try { const __v = results.fuelConsumedPlanned * input.fuelCostPerLiter; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelCostActual = ((): number => { try { const __v = results.fuelConsumedActual * input.fuelCostPerLiter; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelCostDrift = ((): number => { try { const __v = results.fuelCostActual - results.fuelCostPlanned; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalFuelCostDrift = ((): number => { try { const __v = results.fuelCostDrift * input.numTrips; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalFuelCostDrift * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLogisticsFuelRouteDrift(input: LogisticsFuelRouteDriftInput): LogisticsFuelRouteDriftOutput {
  const results = evaluateFormulas(input);
  const totalFuelCostDrift = results.totalFuelCostDrift ?? 0;
  const breakdown = {
    routeDriftPercent: results.routeDriftPercent,
    fuelCostPlanned: results.fuelCostPlanned,
    fuelCostActual: results.fuelCostActual,
    fuelCostDrift: results.fuelCostDrift,
  };

  // rule: actualRouteDistance >= plannedRouteDistance
  // rule: fuelConsumptionRate > 0
  // rule: fuelCostPerLiter > 0
  // rule: numTrips >= 1
  // rule: dataConfidence between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): routeDriftPercent
  // threshold skipped (non-string): fuelCostDrift

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalFuelCostDrift; } })();

  return {
    totalFuelCostDrift,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report"],
  };
}
