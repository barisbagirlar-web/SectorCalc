// Auto-generated from water-optimization-verdict-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface WaterOptimizationVerdictInput {
  waterSource: 'municipal' | 'groundwater' | 'surface water' | 'recycled' | 'desalinated';
  annualWaterConsumption: number;
  waterCostPerUnit: number;
  treatmentCostPerUnit: number;
  recyclingRate: number;
  waterStressIndex: number;
  energyIntensity: number;
  energyCostPerKwh: number;
  laborCostPerHour: number;
  laborHoursPerYear: number;
  maintenanceCostPerYear: number;
  capitalInvestment: number;
  projectLifetime: number;
  discountRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const WaterOptimizationVerdictInputSchema = z.object({
  waterSource: z.enum(['municipal', 'groundwater', 'surface water', 'recycled', 'desalinated']).default('municipal'),
  annualWaterConsumption: z.number().min(0).max(100000000).default(10000),
  waterCostPerUnit: z.number().min(0).max(100).default(1.5),
  treatmentCostPerUnit: z.number().min(0).max(50).default(0.5),
  recyclingRate: z.number().min(0).max(100).default(20),
  waterStressIndex: z.number().min(0).max(1).default(0.5),
  energyIntensity: z.number().min(0).max(10).default(0.5),
  energyCostPerKwh: z.number().min(0).max(1).default(0.1),
  laborCostPerHour: z.number().min(0).max(200).default(25),
  laborHoursPerYear: z.number().min(0).max(8760).default(2000),
  maintenanceCostPerYear: z.number().min(0).max(1000000).default(5000),
  capitalInvestment: z.number().min(0).max(100000000).default(100000),
  projectLifetime: z.number().min(1).max(50).default(10),
  discountRate: z.number().min(0).max(30).default(8),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface WaterOptimizationVerdictOutput {
  verdict: number;
  breakdown: {
    totalWaterCost: number;
    totalTreatmentCost: number;
    totalEnergyCost: number;
    totalLaborCost: number;
    totalOperatingCost: number;
    annualSavingsFromRecycling: number;
    npv: number;
    paybackPeriod: number;
    waterEfficiencyRatio: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: WaterOptimizationVerdictInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalWaterCost = ((): number => { try { const __v = input.annualWaterConsumption * input.waterCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalTreatmentCost = ((): number => { try { const __v = input.annualWaterConsumption * (1 - input.recyclingRate/100) * input.treatmentCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalEnergyCost = ((): number => { try { const __v = input.annualWaterConsumption * input.energyIntensity * input.energyCostPerKwh; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = input.laborCostPerHour * input.laborHoursPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalOperatingCost = ((): number => { try { const __v = results.totalWaterCost + results.totalTreatmentCost + results.totalEnergyCost + results.totalLaborCost + input.maintenanceCostPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualSavingsFromRecycling = ((): number => { try { const __v = input.annualWaterConsumption * (input.recyclingRate/100) * (input.waterCostPerUnit + input.treatmentCostPerUnit); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netAnnualBenefit = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriod = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.waterEfficiencyRatio = ((): number => { try { const __v = (input.annualWaterConsumption - input.annualWaterConsumption * input.recyclingRate/100) / input.annualWaterConsumption; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.verdict = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateWaterOptimizationVerdict(input: WaterOptimizationVerdictInput): WaterOptimizationVerdictOutput {
  const results = evaluateFormulas(input);
  const verdict = results.verdict ?? 0;
  const breakdown = {
    totalWaterCost: results.totalWaterCost,
    totalTreatmentCost: results.totalTreatmentCost,
    totalEnergyCost: results.totalEnergyCost,
    totalLaborCost: results.totalLaborCost,
    totalOperatingCost: results.totalOperatingCost,
    annualSavingsFromRecycling: results.annualSavingsFromRecycling,
    npv: results.npv,
    paybackPeriod: results.paybackPeriod,
    waterEfficiencyRatio: results.waterEfficiencyRatio,
  };

  // rule: annualWaterConsumption > 0
  // rule: waterCostPerUnit >= 0
  // rule: treatmentCostPerUnit >= 0
  // rule: recyclingRate >= 0 and recyclingRate <= 100
  // rule: waterStressIndex >= 0 and waterStressIndex <= 1
  // rule: energyIntensity >= 0
  // rule: energyCostPerKwh >= 0
  // rule: laborCostPerHour >= 0
  // rule: laborHoursPerYear >= 0
  // rule: maintenanceCostPerYear >= 0
  // rule: capitalInvestment >= 0
  // rule: projectLifetime >= 1
  // rule: discountRate >= 0
  // rule: if waterSource == 'desalinated' then energyIntensity >= 3 (desalination typically high energy)
  // rule: if recyclingRate > 0 then treatmentCostPerUnit may be higher due to advanced treatment
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High water stress region - optimization critical
  // threshold skipped (non-JS): Low recycling rate - potential for improvement
  // threshold skipped (non-JS): High energy intensity - consider energy efficiency measures
  // threshold skipped (non-JS): Large consumer - detailed audit recommended

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return verdict; } })();

  return {
    verdict,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of detailed report","CSV export of input data and results","Trend analysis over multiple periods","Comparison with industry benchmarks","Sensitivity analysis on key inputs"],
  };
}
