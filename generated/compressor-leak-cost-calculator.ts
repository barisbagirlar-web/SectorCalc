// Auto-generated from compressor-leak-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CompressorLeakCostCalculatorInput {
  numberOfLeaks: number;
  leakSize: '1' | '3' | '5' | '10';
  operatingHoursPerDay: number;
  operatingDaysPerYear: number;
  electricityCostPerKwh: number;
  compressorPowerPerCfm: number;
  leakFlowRatePerSize: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const CompressorLeakCostCalculatorInputSchema = z.object({
  numberOfLeaks: z.number().min(0).default(10),
  leakSize: z.enum(['1', '3', '5', '10']).default('3'),
  operatingHoursPerDay: z.number().min(0).max(24).default(16),
  operatingDaysPerYear: z.number().min(1).max(365).default(250),
  electricityCostPerKwh: z.number().min(0).default(0.12),
  compressorPowerPerCfm: z.number().min(0.18).max(0.35).default(0.25),
  leakFlowRatePerSize: z.number().min(0).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface CompressorLeakCostCalculatorOutput {
  annualCost: number;
  breakdown: {
    totalLeakFlowRate: number;
    annualEnergyConsumptionKwh: number;
    annualCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CompressorLeakCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.leakFlowRatePerSize = (() => { try { return input.leakSize == 1 ? 1.5 : input.leakSize == 3 ? 11 : input.leakSize == 5 ? 30 : input.leakSize == 10 ? 120 : 0; } catch { return 0; } })();
  results.totalLeakFlowRate = (() => { try { return input.numberOfLeaks * results.input.leakFlowRatePerSize; } catch { return 0; } })();
  results.annualOperatingHours = (() => { try { return input.operatingHoursPerDay * input.operatingDaysPerYear; } catch { return 0; } })();
  results.annualEnergyConsumptionKwh = (() => { try { return results.totalLeakFlowRate * input.compressorPowerPerCfm * results.annualOperatingHours; } catch { return 0; } })();
  results.annualCost = (() => { try { return results.annualEnergyConsumptionKwh * input.electricityCostPerKwh; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.annualCost * (input.dataConfidence == 'low' ? 0.8 : input.dataConfidence == 'medium' ? 1.0 : 1.2); } catch { return 0; } })();
  return results;
}

export function calculateCompressorLeakCostCalculator(input: CompressorLeakCostCalculatorInput): CompressorLeakCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const annualCost = results.annualCost ?? 0;
  const breakdown = {
    totalLeakFlowRate: results.totalLeakFlowRate,
    annualEnergyConsumptionKwh: results.annualEnergyConsumptionKwh,
    annualCost: results.annualCost,
  };

  // rule: numberOfLeaks >= 0
  // rule: operatingHoursPerDay >= 0 && operatingHoursPerDay <= 24
  // rule: operatingDaysPerYear >= 1 && operatingDaysPerYear <= 365
  // rule: electricityCostPerKwh >= 0
  // rule: compressorPowerPerCfm >= 0.18 && compressorPowerPerCfm <= 0.35
  // rule: leakFlowRatePerSize >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (annualCost > 10000) hiddenLossDrivers.push("High leak cost: immediate action recommended");
  if (input.leakFlowRatePerSize > 30) hiddenLossDrivers.push("Large leaks detected: prioritize repair");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return annualCost; } })();

  return {
    annualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of detailed report","CSV export of data","Trend analysis over multiple audits","Benchmarking against industry averages","Detailed breakdown by leak size category"],
  };
}
