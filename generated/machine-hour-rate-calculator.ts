// Auto-generated from machine-hour-rate-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MachineHourRateCalculatorInput {
  machinePurchaseCost: number;
  usefulLifeYears: number;
  salvageValue: number;
  annualOperatingHours: number;
  maintenanceCostPerYear: number;
  energyConsumptionKw: number;
  energyCostPerKwh: number;
  operatorLaborCostPerHour: number;
  floorSpaceSqFt: number;
  annualFacilityCostPerSqFt: number;
  otherAnnualCosts: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const MachineHourRateCalculatorInputSchema = z.object({
  machinePurchaseCost: z.number().min(0).default(100000),
  usefulLifeYears: z.number().min(1).max(50).default(10),
  salvageValue: z.number().min(0).default(10000),
  annualOperatingHours: z.number().min(0).max(8760).default(2000),
  maintenanceCostPerYear: z.number().min(0).default(5000),
  energyConsumptionKw: z.number().min(0).default(50),
  energyCostPerKwh: z.number().min(0).default(0.12),
  operatorLaborCostPerHour: z.number().min(0).default(25),
  floorSpaceSqFt: z.number().min(0).default(200),
  annualFacilityCostPerSqFt: z.number().min(0).default(10),
  otherAnnualCosts: z.number().min(0).default(2000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface MachineHourRateCalculatorOutput {
  machineHourRate: number;
  breakdown: {
    depreciationPerHour: number;
    maintenancePerHour: number;
    energyPerHour: number;
    laborPerHour: number;
    facilityPerHour: number;
    otherPerHour: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MachineHourRateCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualDepreciation = ((): number => { try { const __v = (input.machinePurchaseCost - input.salvageValue) / input.usefulLifeYears; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyCost = ((): number => { try { const __v = input.energyConsumptionKw * input.energyCostPerKwh * input.annualOperatingHours; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualFacilityCost = ((): number => { try { const __v = input.floorSpaceSqFt * input.annualFacilityCostPerSqFt; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualCost = ((): number => { try { const __v = results.annualDepreciation + input.maintenanceCostPerYear + results.annualEnergyCost + (input.operatorLaborCostPerHour * input.annualOperatingHours) + results.annualFacilityCost + input.otherAnnualCosts; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.machineHourRate = ((): number => { try { const __v = results.totalAnnualCost / input.annualOperatingHours; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedRate = ((): number => { try { const __v = results.machineHourRate * (input.dataConfidence == 'low' ? 1.1 : (input.dataConfidence == 'medium' ? 1.05 : 1.0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMachineHourRateCalculator(input: MachineHourRateCalculatorInput): MachineHourRateCalculatorOutput {
  const results = evaluateFormulas(input);
  const machineHourRate = results.machineHourRate ?? 0;
  const breakdown = {
    depreciationPerHour: results.depreciationPerHour,
    maintenancePerHour: results.maintenancePerHour,
    energyPerHour: results.energyPerHour,
    laborPerHour: results.laborPerHour,
    facilityPerHour: results.facilityPerHour,
    otherPerHour: results.otherPerHour,
  };

  // rule: machinePurchaseCost > 0
  // rule: usefulLifeYears >= 1
  // rule: salvageValue >= 0 and salvageValue <= machinePurchaseCost
  // rule: annualOperatingHours > 0 and annualOperatingHours <= 8760
  // rule: maintenanceCostPerYear >= 0
  // rule: energyConsumptionKw >= 0
  // rule: energyCostPerKwh >= 0
  // rule: operatorLaborCostPerHour >= 0
  // rule: floorSpaceSqFt >= 0
  // rule: annualFacilityCostPerSqFt >= 0
  // rule: otherAnnualCosts >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Maintenance cost exceeds 5% of purchase cost; consider preventive maintenance review.
  // threshold skipped (non-JS): Low utilization; consider alternative use or sell machine.
  // threshold skipped (non-JS): High energy consumption; consider energy efficiency audit.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedRate; } catch { return machineHourRate; } })();

  return {
    machineHourRate,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Breakdown Report"],
  };
}
