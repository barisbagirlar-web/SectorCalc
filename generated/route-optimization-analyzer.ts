// Auto-generated from route-optimization-analyzer-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RouteOptimizationAnalyzerInput {
  distance: number;
  stops: number;
  vehicleCapacity: number;
  loadFactor: number;
  fuelConsumptionRate: number;
  fuelCostPerLiter: number;
  driverHourlyRate: number;
  averageSpeed: number;
  timePerStop: number;
  maintenanceCostPerKm: number;
  tollCost: number;
  dataConfidence: number;
}

export const RouteOptimizationAnalyzerInputSchema = z.object({
  distance: z.number().min(0).default(100),
  stops: z.number().min(1).default(10),
  vehicleCapacity: z.number().min(0).default(1000),
  loadFactor: z.number().min(0).max(100).default(80),
  fuelConsumptionRate: z.number().min(0).default(30),
  fuelCostPerLiter: z.number().min(0).default(1.5),
  driverHourlyRate: z.number().min(0).default(25),
  averageSpeed: z.number().min(0).default(50),
  timePerStop: z.number().min(0).default(15),
  maintenanceCostPerKm: z.number().min(0).default(0.1),
  tollCost: z.number().min(0).default(0),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface RouteOptimizationAnalyzerOutput {
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

function evaluateFormulas(input: RouteOptimizationAnalyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalDrivingTime = ((): number => { try { const __v = input.distance / input.averageSpeed * 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalStopTime = ((): number => { try { const __v = input.stops * input.timePerStop; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalTimeMinutes = ((): number => { try { const __v = results.totalDrivingTime + results.totalStopTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalTimeHours = ((): number => { try { const __v = results.totalTimeMinutes / 60; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelUsed = ((): number => { try { const __v = input.distance * input.fuelConsumptionRate / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelCost = ((): number => { try { const __v = results.fuelUsed * input.fuelCostPerLiter; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.driverCost = ((): number => { try { const __v = results.totalTimeHours * input.driverHourlyRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maintenanceCost = ((): number => { try { const __v = input.distance * input.maintenanceCostPerKm; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.fuelCost + results.driverCost + results.maintenanceCost + input.tollCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerKm = ((): number => { try { const __v = results.totalCost / input.distance; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerStop = ((): number => { try { const __v = results.totalCost / input.stops; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerKg = ((): number => { try { const __v = results.totalCost / (input.vehicleCapacity * input.loadFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCost * (100 / input.dataConfidence); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRouteOptimizationAnalyzer(input: RouteOptimizationAnalyzerInput): RouteOptimizationAnalyzerOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    fuelCost: results.fuelCost,
    driverCost: results.driverCost,
    maintenanceCost: results.maintenanceCost,
    tollCost: results.tollCost,
  };

  // rule: distance must be > 0
  // rule: stops must be >= 1
  // rule: vehicleCapacity must be > 0
  // rule: loadFactor must be between 0 and 100
  // rule: fuelConsumptionRate must be > 0
  // rule: fuelCostPerLiter must be > 0
  // rule: driverHourlyRate must be > 0
  // rule: averageSpeed must be > 0
  // rule: timePerStop must be >= 0
  // rule: maintenanceCostPerKm must be >= 0
  // rule: tollCost must be >= 0
  // rule: dataConfidence must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low vehicle utilization; consider consolidating routes.
  // threshold skipped (non-JS): High fuel consumption; check vehicle maintenance.
  // threshold skipped (non-JS): Low average speed; possible traffic congestion.
  // threshold skipped (non-JS): Excessive stop time; review loading processes.
  // threshold skipped (non-JS): Low data confidence; results may be unreliable.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Routes","Detailed Report with Charts"],
  };
}
