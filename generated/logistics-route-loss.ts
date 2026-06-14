// Auto-generated from logistics-route-loss-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LogisticsRouteLossInput {
  routeDistance: number;
  fuelConsumptionPerKm: number;
  fuelPricePerLiter: number;
  driverHourlyRate: number;
  averageSpeed: number;
  loadFactor: number;
  maintenanceCostPerKm: number;
  tollCost: number;
  cargoValue: number;
  insuranceRate: number;
  dataConfidence: number;
}

export const LogisticsRouteLossInputSchema = z.object({
  routeDistance: z.number().min(0).default(100),
  fuelConsumptionPerKm: z.number().min(0).default(0.3),
  fuelPricePerLiter: z.number().min(0).default(1.5),
  driverHourlyRate: z.number().min(0).default(25),
  averageSpeed: z.number().min(0).default(60),
  loadFactor: z.number().min(0).max(100).default(80),
  maintenanceCostPerKm: z.number().min(0).default(0.1),
  tollCost: z.number().min(0).default(0),
  cargoValue: z.number().min(0).default(50000),
  insuranceRate: z.number().min(0).max(100).default(0.5),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface LogisticsRouteLossOutput {
  totalDirectCost: number;
  breakdown: {
    fuelCost: number;
    driverCost: number;
    maintenanceCost: number;
    tollCost: number;
    insuranceCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LogisticsRouteLossInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.travelTimeHours = ((): number => { try { const __v = input.routeDistance / input.averageSpeed; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fuelCost = ((): number => { try { const __v = input.routeDistance * input.fuelConsumptionPerKm * input.fuelPricePerLiter; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.driverCost = ((): number => { try { const __v = results.travelTimeHours * input.driverHourlyRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maintenanceCost = ((): number => { try { const __v = input.routeDistance * input.maintenanceCostPerKm; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.insuranceCost = ((): number => { try { const __v = input.cargoValue * (input.insuranceRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDirectCost = ((): number => { try { const __v = results.fuelCost + results.driverCost + results.maintenanceCost + input.tollCost + results.insuranceCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lossPerKm = ((): number => { try { const __v = results.totalDirectCost / input.routeDistance; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.lossPerUnitCargo = ((): number => { try { const __v = results.totalDirectCost / (input.cargoValue > 0 ? input.cargoValue : 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedLoss = ((): number => { try { const __v = results.totalDirectCost * (100 / input.dataConfidence); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLogisticsRouteLoss(input: LogisticsRouteLossInput): LogisticsRouteLossOutput {
  const results = evaluateFormulas(input);
  const totalDirectCost = results.totalDirectCost ?? 0;
  const breakdown = {
    fuelCost: results.fuelCost,
    driverCost: results.driverCost,
    maintenanceCost: results.maintenanceCost,
    tollCost: results.tollCost,
    insuranceCost: results.insuranceCost,
  };

  // rule: routeDistance > 0
  // rule: fuelConsumptionPerKm > 0
  // rule: fuelPricePerLiter > 0
  // rule: driverHourlyRate > 0
  // rule: averageSpeed > 0
  // rule: loadFactor >= 0 && loadFactor <= 100
  // rule: maintenanceCostPerKm >= 0
  // rule: tollCost >= 0
  // rule: cargoValue >= 0
  // rule: insuranceRate >= 0 && insuranceRate <= 100
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low load factor warning: consider consolidating shipments.
  // threshold skipped (non-JS): High fuel consumption: check vehicle maintenance.
  // threshold skipped (non-JS): High insurance rate: review risk management.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedLoss; } catch { return totalDirectCost; } })();

  return {
    totalDirectCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Route Comparison","Detailed Report"],
  };
}
