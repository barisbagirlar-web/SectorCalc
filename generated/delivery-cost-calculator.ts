// Auto-generated from delivery-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface DeliveryCostCalculatorInput {
  distanceKm: number;
  weightKg: number;
  volumeM3: number;
  deliveryMode: 'standard' | 'express' | 'same-day';
  fuelCostPerLiter: number;
  vehicleEfficiency: number;
  laborRatePerHour: number;
  deliveryTimeHours: number;
  numStops: number;
  handlingCostPerKg: number;
  insuranceRate: number;
  cargoValue: number;
  dataConfidence: number;
}

export const DeliveryCostCalculatorInputSchema = z.object({
  distanceKm: z.number().min(0).max(10000).default(10),
  weightKg: z.number().min(0).max(100000).default(1),
  volumeM3: z.number().min(0).max(1000).default(0.1),
  deliveryMode: z.enum(['standard', 'express', 'same-day']).default('standard'),
  fuelCostPerLiter: z.number().min(0).max(10).default(1.5),
  vehicleEfficiency: z.number().min(1).max(50).default(10),
  laborRatePerHour: z.number().min(0).max(200).default(20),
  deliveryTimeHours: z.number().min(0).max(24).default(1),
  numStops: z.number().min(1).max(100).default(1),
  handlingCostPerKg: z.number().min(0).max(10).default(0.5),
  insuranceRate: z.number().min(0).max(10).default(0.5),
  cargoValue: z.number().min(0).max(1000000).default(1000),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface DeliveryCostCalculatorOutput {
  totalCost: number;
  breakdown: {
    fuelCost: number;
    laborCost: number;
    handlingCost: number;
    insuranceCost: number;
    modeMultiplier: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: DeliveryCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.fuelCost = (() => { try { return input.distanceKm / input.vehicleEfficiency * input.fuelCostPerLiter; } catch { return 0; } })();
  results.laborCost = (() => { try { return input.deliveryTimeHours * input.laborRatePerHour; } catch { return 0; } })();
  results.handlingCost = (() => { try { return input.weightKg * input.handlingCostPerKg; } catch { return 0; } })();
  results.insuranceCost = (() => { try { return input.cargoValue * (input.insuranceRate / 100); } catch { return 0; } })();
  results.baseCost = (() => { try { return results.fuelCost + results.laborCost + results.handlingCost + results.insuranceCost; } catch { return 0; } })();
  results.modeMultiplier = (() => { try { return input.deliveryMode == 'standard' ? 1 : (input.deliveryMode == 'express' ? 1.5 : 2); } catch { return 0; } })();
  results.totalCost = (() => { try { return results.baseCost * results.modeMultiplier; } catch { return 0; } })();
  results.costPerKg = (() => { try { return results.totalCost / input.weightKg; } catch { return 0; } })();
  results.costPerKm = (() => { try { return results.totalCost / input.distanceKm; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.totalCost / input.dataConfidence; } catch { return 0; } })();
  return results;
}

export function calculateDeliveryCostCalculator(input: DeliveryCostCalculatorInput): DeliveryCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    fuelCost: results.fuelCost,
    laborCost: results.laborCost,
    handlingCost: results.handlingCost,
    insuranceCost: results.insuranceCost,
    modeMultiplier: results.modeMultiplier,
  };

  // rule: distanceKm >= 0
  // rule: weightKg >= 0
  // rule: volumeM3 >= 0
  // rule: fuelCostPerLiter > 0
  // rule: vehicleEfficiency > 0
  // rule: laborRatePerHour >= 0
  // rule: deliveryTimeHours >= 0
  // rule: numStops >= 1
  // rule: handlingCostPerKg >= 0
  // rule: insuranceRate >= 0
  // rule: cargoValue >= 0
  // rule: dataConfidence between 0 and 1
  // rule: if deliveryMode == 'same-day' then deliveryTimeHours <= 8
  // rule: if deliveryMode == 'express' then deliveryTimeHours <= 24
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Fuel cost is high; consider route optimization.
  // threshold skipped (non-JS): Vehicle efficiency low; consider maintenance or replacement.
  // threshold skipped (non-JS): Labor cost high; review staffing.
  // threshold skipped (non-JS): Delivery time long; investigate delays.
  // threshold skipped (non-JS): Many stops; consider consolidation.
  // threshold skipped (non-JS): Handling cost high; review warehouse processes.
  // threshold skipped (non-JS): Insurance rate high; check risk factors.
  // threshold skipped (non-JS): Low data confidence; results may be unreliable.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

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
