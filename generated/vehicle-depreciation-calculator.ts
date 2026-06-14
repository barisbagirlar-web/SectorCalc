// Auto-generated from vehicle-depreciation-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface VehicleDepreciationCalculatorInput {
  purchasePrice: number;
  residualValue: number;
  usefulLife: number;
  depreciationMethod: 'straight-line' | 'declining-balance' | 'sum-of-years-digits';
  annualMileage: number;
  maintenanceCost: number;
  fuelEfficiency: number;
  fuelPrice: number;
  insuranceCost: number;
  taxRate: number;
  dataConfidence: number;
}

export const VehicleDepreciationCalculatorInputSchema = z.object({
  purchasePrice: z.number().min(1000).max(1000000).default(30000),
  residualValue: z.number().min(0).max(1000000).default(15000),
  usefulLife: z.number().min(1).max(30).default(5),
  depreciationMethod: z.enum(['straight-line', 'declining-balance', 'sum-of-years-digits']).default('straight-line'),
  annualMileage: z.number().min(0).max(100000).default(12000),
  maintenanceCost: z.number().min(0).max(50000).default(1000),
  fuelEfficiency: z.number().min(5).max(100).default(25),
  fuelPrice: z.number().min(0).max(10).default(3.5),
  insuranceCost: z.number().min(0).max(10000).default(1200),
  taxRate: z.number().min(0).max(50).default(7),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface VehicleDepreciationCalculatorOutput {
  annualDepreciation: number;
  breakdown: {
    annualDepreciation: number;
    bookValue: number;
    annualOperatingCost: number;
    totalCostOfOwnership: number;
    depreciationRate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: VehicleDepreciationCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualFuelCost = ((): number => { try { const __v = input.annualMileage / input.fuelEfficiency * input.fuelPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualOperatingCost = ((): number => { try { const __v = input.maintenanceCost + results.annualFuelCost + input.insuranceCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostOfOwnership = ((): number => { try { const __v = input.purchasePrice * (1 + input.taxRate/100) + results.annualOperatingCost * input.usefulLife - input.residualValue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualDepreciation = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.accumulatedDepreciation = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.bookValue = ((): number => { try { const __v = input.purchasePrice - results.accumulatedDepreciation; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.depreciationRate = ((): number => { try { const __v = results.annualDepreciation / input.purchasePrice * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedDepreciation = ((): number => { try { const __v = results.annualDepreciation * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateVehicleDepreciationCalculator(input: VehicleDepreciationCalculatorInput): VehicleDepreciationCalculatorOutput {
  const results = evaluateFormulas(input);
  const annualDepreciation = results.annualDepreciation ?? 0;
  const breakdown = {
    annualDepreciation: results.annualDepreciation,
    bookValue: results.bookValue,
    annualOperatingCost: results.annualOperatingCost,
    totalCostOfOwnership: results.totalCostOfOwnership,
    depreciationRate: results.depreciationRate,
  };

  // rule: purchasePrice > 0
  // rule: residualValue >= 0
  // rule: usefulLife >= 1
  // rule: annualMileage >= 0
  // rule: maintenanceCost >= 0
  // rule: fuelEfficiency > 0
  // rule: fuelPrice > 0
  // rule: insuranceCost >= 0
  // rule: taxRate >= 0
  // rule: dataConfidence between 0 and 100
  // rule: residualValue <= purchasePrice
  // rule: if depreciationMethod == 'declining-balance' then usefulLife <= 20
  // rule: if depreciationMethod == 'sum-of-years-digits' then usefulLife <= 30
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High mileage may accelerate depreciation.
  // threshold skipped (non-JS): High maintenance cost indicates potential reliability issues.
  // threshold skipped (non-JS): Low fuel efficiency increases operating cost.
  // threshold skipped (non-JS): Low data confidence may affect accuracy.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedDepreciation; } catch { return annualDepreciation; } })();

  return {
    annualDepreciation,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Similar Vehicles","Detailed Report with Charts"],
  };
}
