// Auto-generated from energy-savings-package-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EnergySavingsPackageCalculatorInput {
  annualEnergyConsumption: number;
  energyCostPerKwh: number;
  peakDemand: number;
  demandChargePerKw: number;
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  energySavingsPercentage: number;
  peakDemandReductionPercentage: number;
  implementationCost: number;
  maintenanceCostIncreasePerYear: number;
  discountRate: number;
  projectLifeYears: number;
  inflationRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const EnergySavingsPackageCalculatorInputSchema = z.object({
  annualEnergyConsumption: z.number().min(0).default(1000000),
  energyCostPerKwh: z.number().min(0).default(0.12),
  peakDemand: z.number().min(0).default(500),
  demandChargePerKw: z.number().min(0).default(10),
  operatingHoursPerDay: z.number().min(0).max(24).default(16),
  operatingDaysPerYear: z.number().min(0).max(365).default(250),
  energySavingsPercentage: z.number().min(0).max(100).default(15),
  peakDemandReductionPercentage: z.number().min(0).max(100).default(10),
  implementationCost: z.number().min(0).default(50000),
  maintenanceCostIncreasePerYear: z.number().min(0).default(2000),
  discountRate: z.number().min(0).max(100).default(8),
  projectLifeYears: z.number().min(1).max(50).default(10),
  inflationRate: z.number().min(0).max(100).default(2),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface EnergySavingsPackageCalculatorOutput {
  npv: number;
  breakdown: {
    annualEnergyCost: number;
    annualDemandCost: number;
    totalAnnualEnergyCost: number;
    annualEnergyCostSavings: number;
    annualDemandCostSavings: number;
    totalAnnualSavings: number;
    netAnnualSavings: number;
    paybackPeriodYears: number;
    irr: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EnergySavingsPackageCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualEnergyCost = ((): number => { try { const __v = input.annualEnergyConsumption * input.energyCostPerKwh; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualDemandCost = ((): number => { try { const __v = input.peakDemand * input.demandChargePerKw * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualEnergyCost = ((): number => { try { const __v = results.annualEnergyCost + results.annualDemandCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energySavings = ((): number => { try { const __v = input.annualEnergyConsumption * (input.energySavingsPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.demandReduction = ((): number => { try { const __v = input.peakDemand * (input.peakDemandReductionPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyCostSavings = ((): number => { try { const __v = results.energySavings * input.energyCostPerKwh; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualDemandCostSavings = ((): number => { try { const __v = results.demandReduction * input.demandChargePerKw * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualSavings = ((): number => { try { const __v = results.annualEnergyCostSavings + results.annualDemandCostSavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netAnnualSavings = ((): number => { try { const __v = results.totalAnnualSavings - input.maintenanceCostIncreasePerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriodYears = ((): number => { try { const __v = input.implementationCost / results.netAnnualSavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.irr = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateEnergySavingsPackageCalculator(input: EnergySavingsPackageCalculatorInput): EnergySavingsPackageCalculatorOutput {
  const results = evaluateFormulas(input);
  const npv = results.npv ?? 0;
  const breakdown = {
    annualEnergyCost: results.annualEnergyCost,
    annualDemandCost: results.annualDemandCost,
    totalAnnualEnergyCost: results.totalAnnualEnergyCost,
    annualEnergyCostSavings: results.annualEnergyCostSavings,
    annualDemandCostSavings: results.annualDemandCostSavings,
    totalAnnualSavings: results.totalAnnualSavings,
    netAnnualSavings: results.netAnnualSavings,
    paybackPeriodYears: results.paybackPeriodYears,
    irr: results.irr,
  };

  // rule: annualEnergyConsumption > 0
  // rule: energyCostPerKwh > 0
  // rule: peakDemand >= 0
  // rule: demandChargePerKw >= 0
  // rule: operatingHoursPerDay > 0 && operatingHoursPerDay <= 24
  // rule: operatingDaysPerYear > 0 && operatingDaysPerYear <= 365
  // rule: energySavingsPercentage >= 0 && energySavingsPercentage <= 100
  // rule: peakDemandReductionPercentage >= 0 && peakDemandReductionPercentage <= 100
  // rule: implementationCost >= 0
  // rule: maintenanceCostIncreasePerYear >= 0
  // rule: discountRate >= 0 && discountRate <= 100
  // rule: projectLifeYears >= 1
  // rule: inflationRate >= 0 && inflationRate <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 5 -> 'Payback period exceeds 5 years; consider alternative measures.'
  // threshold skipped (non-JS): < 0 -> 'Negative NPV; project may not be financially viable.'
  // threshold skipped (non-JS): < discountRate -> 'IRR below discount rate; project may not meet return expectations.'

  const dataConfidenceAdjusted = (() => { try { return results.npv * (input.dataConfidence == 'high' ? 1.0 : input.dataConfidence == 'medium' ? 0.9 : 0.8); } catch { return npv; } })();

  return {
    npv,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (multi-year projection)","Comparison with industry benchmarks","Detailed report with sensitivity analysis"],
  };
}
