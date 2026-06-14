// Auto-generated from energy-compressor-leak-cost-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EnergyCompressorLeakCostInput {
  compressorPower: number;
  leakRate: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  electricityCost: number;
  motorEfficiency: number;
  loadFactor: number;
  maintenanceCostPerLeak: number;
  numberOfLeaks: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const EnergyCompressorLeakCostInputSchema = z.object({
  compressorPower: z.number().min(1).max(10000).default(100),
  leakRate: z.number().min(0).max(100).default(20),
  operatingHoursPerDay: z.number().min(0).max(24).default(16),
  operatingDaysPerYear: z.number().min(1).max(365).default(250),
  electricityCost: z.number().min(0.01).max(1).default(0.12),
  motorEfficiency: z.number().min(50).max(100).default(90),
  loadFactor: z.number().min(0).max(100).default(80),
  maintenanceCostPerLeak: z.number().min(0).max(1000).default(50),
  numberOfLeaks: z.number().min(0).max(1000).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface EnergyCompressorLeakCostOutput {
  totalAnnualLeakCost: number;
  breakdown: {
    annualEnergyCost: number;
    annualMaintenanceCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EnergyCompressorLeakCostInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualEnergyConsumption = ((): number => { try { const __v = input.compressorPower * (input.leakRate / 100) * input.operatingHoursPerDay * input.operatingDaysPerYear / (input.motorEfficiency / 100) * (input.loadFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyCost = ((): number => { try { const __v = results.annualEnergyConsumption * input.electricityCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualMaintenanceCost = ((): number => { try { const __v = input.maintenanceCostPerLeak * input.numberOfLeaks; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualLeakCost = ((): number => { try { const __v = results.annualEnergyCost + results.annualMaintenanceCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalAnnualLeakCost * (input.dataConfidence == 'low' ? 1.3 : (input.dataConfidence == 'medium' ? 1.15 : 1.05)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateEnergyCompressorLeakCost(input: EnergyCompressorLeakCostInput): EnergyCompressorLeakCostOutput {
  const results = evaluateFormulas(input);
  const totalAnnualLeakCost = results.totalAnnualLeakCost ?? 0;
  const breakdown = {
    annualEnergyCost: results.annualEnergyCost,
    annualMaintenanceCost: results.annualMaintenanceCost,
  };

  // rule: compressorPower > 0
  // rule: leakRate >= 0 and leakRate <= 100
  // rule: operatingHoursPerDay >= 0 and operatingHoursPerDay <= 24
  // rule: operatingDaysPerYear >= 1 and operatingDaysPerYear <= 365
  // rule: electricityCost > 0
  // rule: motorEfficiency >= 50 and motorEfficiency <= 100
  // rule: loadFactor >= 0 and loadFactor <= 100
  // rule: maintenanceCostPerLeak >= 0
  // rule: numberOfLeaks >= 0
  // rule: if leakRate > 0 then numberOfLeaks > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High leak rate indicates urgent maintenance needed.
  // threshold skipped (non-JS): Motor efficiency below standard; consider replacement.
  // threshold skipped (non-JS): Compressor oversized; consider downsizing or variable speed drive.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalAnnualLeakCost; } })();

  return {
    totalAnnualLeakCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Breakdown"],
  };
}
