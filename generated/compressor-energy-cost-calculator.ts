// Auto-generated from compressor-energy-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CompressorEnergyCostCalculatorInput {
  compressorPower: number;
  loadFactor: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  electricityCost: number;
  motorEfficiency: number;
  compressorType: 'reciprocating' | 'screw' | 'centrifugal';
  maintenanceFactor: number;
  dataConfidence: number;
}

export const CompressorEnergyCostCalculatorInputSchema = z.object({
  compressorPower: z.number().min(1).max(10000).default(100),
  loadFactor: z.number().min(0).max(100).default(70),
  operatingHoursPerDay: z.number().min(0).max(24).default(16),
  operatingDaysPerYear: z.number().min(1).max(365).default(300),
  electricityCost: z.number().min(0.01).max(1).default(0.12),
  motorEfficiency: z.number().min(50).max(100).default(90),
  compressorType: z.enum(['reciprocating', 'screw', 'centrifugal']).default('screw'),
  maintenanceFactor: z.number().min(0).max(20).default(5),
  dataConfidence: z.number().min(0).max(100).default(80),
});

export interface CompressorEnergyCostCalculatorOutput {
  totalAnnualCost: number;
  breakdown: {
    annualEnergyConsumption: number;
    annualEnergyCost: number;
    annualMaintenanceLoss: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CompressorEnergyCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualEnergyConsumption = (() => { try { return input.compressorPower * (input.loadFactor / 100) * input.operatingHoursPerDay * input.operatingDaysPerYear / (input.motorEfficiency / 100); } catch { return 0; } })();
  results.annualEnergyCost = (() => { try { return results.annualEnergyConsumption * input.electricityCost; } catch { return 0; } })();
  results.annualMaintenanceLoss = (() => { try { return results.annualEnergyCost * (input.maintenanceFactor / 100); } catch { return 0; } })();
  results.totalAnnualCost = (() => { try { return results.annualEnergyCost + results.annualMaintenanceLoss; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = (() => { try { return results.totalAnnualCost * (input.dataConfidence / 100) + results.totalAnnualCost * (1 - input.dataConfidence / 100) * 1.1; } catch { return 0; } })();
  return results;
}

export function calculateCompressorEnergyCostCalculator(input: CompressorEnergyCostCalculatorInput): CompressorEnergyCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalAnnualCost = results.totalAnnualCost ?? 0;
  const breakdown = {
    annualEnergyConsumption: results.annualEnergyConsumption,
    annualEnergyCost: results.annualEnergyCost,
    annualMaintenanceLoss: results.annualMaintenanceLoss,
  };

  // rule: compressorPower > 0
  // rule: loadFactor >= 0 and loadFactor <= 100
  // rule: operatingHoursPerDay >= 0 and operatingHoursPerDay <= 24
  // rule: operatingDaysPerYear >= 1 and operatingDaysPerYear <= 365
  // rule: electricityCost > 0
  // rule: motorEfficiency >= 50 and motorEfficiency <= 100
  // rule: maintenanceFactor >= 0 and maintenanceFactor <= 20
  // rule: dataConfidence >= 0 and dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low load factor indicates oversized compressor or inefficient operation. Consider variable speed drive or system optimization.
  // threshold skipped (non-JS): Motor efficiency below standard. Consider replacing with high-efficiency motor (NEMA Premium or IE3).
  // threshold skipped (non-JS): High maintenance factor suggests significant leaks or poor maintenance. Conduct leak detection and repair program.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalAnnualCost; } })();

  return {
    totalAnnualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Breakdown"],
  };
}
