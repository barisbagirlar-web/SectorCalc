// Auto-generated from freight-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FreightCostCalculatorInput {
  shipmentWeight: number;
  distance: number;
  mode: 'truck' | 'rail' | 'air' | 'ocean';
  fuelPrice: number;
  laborRate: number;
  handlingCostPerKg: number;
  insuranceRate: number;
  cargoValue: number;
  dataConfidence: number;
}

export const FreightCostCalculatorInputSchema = z.object({
  shipmentWeight: z.number().min(0).default(1000),
  distance: z.number().min(0).default(500),
  mode: z.enum(['truck', 'rail', 'air', 'ocean']).default('truck'),
  fuelPrice: z.number().min(0).default(1.2),
  laborRate: z.number().min(0).default(25),
  handlingCostPerKg: z.number().min(0).default(0.1),
  insuranceRate: z.number().min(0).max(100).default(0.5),
  cargoValue: z.number().min(0).default(50000),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface FreightCostCalculatorOutput {
  totalFreightCost: number;
  breakdown: {
    baseFreightCost: number;
    fuelCost: number;
    laborCost: number;
    handlingCost: number;
    insuranceCost: number;
    costPerKg: number;
    costPerKm: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FreightCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.baseFreightCost = (() => { try { return input.shipmentWeight * input.distance * (input.mode === 'truck' ? 0.0001 : input.mode === 'rail' ? 0.00005 : input.mode === 'air' ? 0.0005 : 0.00002); } catch { return 0; } })();
  results.fuelCost = (() => { try { return input.distance * (input.mode === 'truck' ? 0.3 : input.mode === 'rail' ? 0.1 : input.mode === 'air' ? 2.5 : 0.05) * input.fuelPrice; } catch { return 0; } })();
  results.laborCost = (() => { try { return input.distance * (input.mode === 'truck' ? 0.02 : input.mode === 'rail' ? 0.005 : input.mode === 'air' ? 0.1 : 0.001) * input.laborRate; } catch { return 0; } })();
  results.handlingCost = (() => { try { return input.shipmentWeight * input.handlingCostPerKg; } catch { return 0; } })();
  results.insuranceCost = (() => { try { return input.cargoValue * (input.insuranceRate / 100); } catch { return 0; } })();
  results.totalFreightCost = (() => { try { return results.baseFreightCost + results.fuelCost + results.laborCost + results.handlingCost + results.insuranceCost; } catch { return 0; } })();
  results.costPerKg = (() => { try { return results.totalFreightCost / input.shipmentWeight; } catch { return 0; } })();
  results.costPerKm = (() => { try { return results.totalFreightCost / input.distance; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.totalFreightCost * (1 + (100 - input.dataConfidence) / 100); } catch { return 0; } })();
  return results;
}

export function calculateFreightCostCalculator(input: FreightCostCalculatorInput): FreightCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalFreightCost = results.totalFreightCost ?? 0;
  const breakdown = {
    baseFreightCost: results.baseFreightCost,
    fuelCost: results.fuelCost,
    laborCost: results.laborCost,
    handlingCost: results.handlingCost,
    insuranceCost: results.insuranceCost,
    costPerKg: results.costPerKg,
    costPerKm: results.costPerKm,
  };

  // rule: shipmentWeight > 0
  // rule: distance > 0
  // rule: fuelPrice >= 0
  // rule: laborRate >= 0
  // rule: handlingCostPerKg >= 0
  // rule: insuranceRate >= 0 and insuranceRate <= 100
  // rule: cargoValue >= 0
  // rule: dataConfidence >= 0 and dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Fuel price is high; consider fuel surcharge or alternative routes.
  // threshold skipped (non-JS): Long distance; consider intermodal or rail to reduce cost.
  // threshold skipped (non-JS): Heavy shipment; verify weight limits and potential oversize charges.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalFreightCost; } })();

  return {
    totalFreightCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
