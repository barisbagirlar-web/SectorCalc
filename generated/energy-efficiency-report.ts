// Auto-generated from energy-efficiency-report-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EnergyEfficiencyReportInput {
  totalEnergyConsumption: number;
  productionOutput: number;
  energyCostPerKwh: number;
  baselineEnergyIntensity: number;
  operatingHours: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const EnergyEfficiencyReportInputSchema = z.object({
  totalEnergyConsumption: z.number().min(0).default(0),
  productionOutput: z.number().min(0).default(0),
  energyCostPerKwh: z.number().min(0).default(0.12),
  baselineEnergyIntensity: z.number().min(0).default(0),
  operatingHours: z.number().min(0).max(8760).default(8760),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface EnergyEfficiencyReportOutput {
  potentialSavings: number;
  breakdown: {
    energyIntensity: number;
    energyIntensityRatio: number;
    totalEnergyCost: number;
    energyCostPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EnergyEfficiencyReportInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.energyIntensity = (() => { try { return input.totalEnergyConsumption / input.productionOutput; } catch { return 0; } })();
  results.energyIntensityRatio = (() => { try { return results.energyIntensity / input.baselineEnergyIntensity; } catch { return 0; } })();
  results.totalEnergyCost = (() => { try { return input.totalEnergyConsumption * input.energyCostPerKwh; } catch { return 0; } })();
  results.energyCostPerUnit = (() => { try { return results.totalEnergyCost / input.productionOutput; } catch { return 0; } })();
  results.potentialSavings = (() => { try { return (input.baselineEnergyIntensity - results.energyIntensity) * input.productionOutput * input.energyCostPerKwh; } catch { return 0; } })();
  results.energyCostRatio = (() => { try { return results.totalEnergyCost / (input.productionOutput * averageRevenuePerUnit); } catch { return 0; } })();
  results.dataConfidenceAdjustedSavings = (() => { try { return results.potentialSavings * (input.dataConfidence == 'high' ? 1.0 : input.dataConfidence == 'medium' ? 0.85 : 0.7); } catch { return 0; } })();
  return results;
}

export function calculateEnergyEfficiencyReport(input: EnergyEfficiencyReportInput): EnergyEfficiencyReportOutput {
  const results = evaluateFormulas(input);
  const potentialSavings = results.potentialSavings ?? 0;
  const breakdown = {
    energyIntensity: results.energyIntensity,
    energyIntensityRatio: results.energyIntensityRatio,
    totalEnergyCost: results.totalEnergyCost,
    energyCostPerUnit: results.energyCostPerUnit,
  };

  // rule: totalEnergyConsumption >= 0
  // rule: productionOutput >= 0
  // rule: energyCostPerKwh >= 0
  // rule: baselineEnergyIntensity >= 0
  // rule: operatingHours >= 0 and operatingHours <= 8760
  // rule: if productionOutput > 0 then totalEnergyConsumption > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if energyIntensityRatio > 1.2 then 'High energy intensity compared to baseline'
  // threshold skipped (non-JS): if energyCostRatio > 0.2 then 'Energy cost exceeds 20% of production value'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedSavings; } catch { return potentialSavings; } })();

  return {
    potentialSavings,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over multiple periods","Benchmarking against industry standards","Detailed breakdown report"],
  };
}
