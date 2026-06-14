// Auto-generated from boya-ve-apre-recetesi-maliyet-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInput {
  annualPaintVolume: number;
  rawMaterialCostPerLiter: number;
  laborCostPerHour: number;
  laborHoursPerBatch: number;
  batchSize: number;
  energyCostPerBatch: number;
  wastePercentage: number;
  defectRate: number;
  reworkCostPerBatch: number;
  overheadRate: number;
  targetMargin: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInputSchema = z.object({
  annualPaintVolume: z.number().min(100).max(1000000).default(10000),
  rawMaterialCostPerLiter: z.number().min(0.5).max(50).default(5),
  laborCostPerHour: z.number().min(10).max(100).default(25),
  laborHoursPerBatch: z.number().min(1).max(40).default(8),
  batchSize: z.number().min(50).max(50000).default(1000),
  energyCostPerBatch: z.number().min(10).max(5000).default(200),
  wastePercentage: z.number().min(0).max(20).default(5),
  defectRate: z.number().min(0).max(10).default(2),
  reworkCostPerBatch: z.number().min(0).max(10000).default(500),
  overheadRate: z.number().min(0).max(100).default(20),
  targetMargin: z.number().min(0).max(50).default(15),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorOutput {
  totalExposure: number;
  breakdown: {
    directMaterialCost: number;
    directLaborCost: number;
    energyCost: number;
    wasteCost: number;
    defectCost: number;
    overheadCost: number;
    totalCost: number;
    costPerLiter: number;
    targetPricePerLiter: number;
    totalRevenue: number;
    totalProfit: number;
    profitMargin: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalBatchesPerYear = input.annualPaintVolume / input.batchSize;
  results.directMaterialCost = input.annualPaintVolume * input.rawMaterialCostPerLiter;
  results.directLaborCost = results.totalBatchesPerYear * input.laborHoursPerBatch * input.laborCostPerHour;
  results.energyCost = results.totalBatchesPerYear * input.energyCostPerBatch;
  results.wasteCost = results.directMaterialCost * (input.wastePercentage / 100);
  results.defectCost = results.totalBatchesPerYear * (input.defectRate / 100) * input.reworkCostPerBatch;
  results.totalDirectCost = results.directMaterialCost + results.directLaborCost + results.energyCost + results.wasteCost + results.defectCost;
  results.overheadCost = results.totalDirectCost * (input.overheadRate / 100);
  results.totalCost = results.totalDirectCost + results.overheadCost;
  results.costPerLiter = results.totalCost / input.annualPaintVolume;
  results.targetPricePerLiter = results.costPerLiter * (1 + input.targetMargin / 100);
  results.totalRevenue = input.annualPaintVolume * results.targetPricePerLiter;
  results.totalProfit = results.totalRevenue - results.totalCost;
  results.profitMargin = (results.totalProfit / results.totalRevenue) * 100;
  results.totalExposure = results.totalCost;
  results.variancePercent = 0;
  results.summaryLevel = results.totalExposure > 1000000 ? 'critical' : results.totalExposure > 500000 ? 'warning' : 'normal';
  results.primaryDriver = results.directMaterialCost > results.directLaborCost ? 'material' : 'labor';
  results.decisionVerdict = results.summaryLevel === 'critical' ? 'reject' : results.summaryLevel === 'warning' ? 'review' : 'accept';
  results.dataConfidenceAdjusted = input.dataConfidence === 'low' ? results.totalExposure * 1.2 : input.dataConfidence === 'medium' ? results.totalExposure * 1.1 : results.totalExposure;
  return results;
}

export function calculateBoyaVeApreRecetesiMaliyetOptimizasyonCalculator(input: BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorInput): BoyaVeApreRecetesiMaliyetOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalExposure = results.totalExposure;
  const breakdown = {
    directMaterialCost: results.directMaterialCost,
    directLaborCost: results.directLaborCost,
    energyCost: results.energyCost,
    wasteCost: results.wasteCost,
    defectCost: results.defectCost,
    overheadCost: results.overheadCost,
    totalCost: results.totalCost,
    costPerLiter: results.costPerLiter,
    targetPricePerLiter: results.targetPricePerLiter,
    totalRevenue: results.totalRevenue,
    totalProfit: results.totalProfit,
    profitMargin: results.profitMargin,
  };

  // rule: annualPaintVolume must be >= 100 and <= 1000000
  // rule: rawMaterialCostPerLiter must be >= 0.5 and <= 50
  // rule: laborCostPerHour must be >= 10 and <= 100
  // rule: laborHoursPerBatch must be >= 1 and <= 40
  // rule: batchSize must be >= 50 and <= 50000
  // rule: energyCostPerBatch must be >= 10 and <= 5000
  // rule: wastePercentage must be >= 0 and <= 20
  // rule: defectRate must be >= 0 and <= 10
  // rule: reworkCostPerBatch must be >= 0 and <= 10000
  // rule: overheadRate must be >= 0 and <= 100
  // rule: targetMargin must be >= 0 and <= 50
  // rule: If wastePercentage > 10 then warning: 'High waste percentage'
  // rule: If defectRate > 5 then warning: 'High defect rate'
  // rule: If reworkCostPerBatch > 2000 then warning: 'High rework cost'
  // threshold wastePercentage: warning: >10
  // threshold defectRate: warning: >5
  // threshold reworkCostPerBatch: warning: >2000
  const hiddenLossDrivers: string[] = ["wastePercentage > 10 ? 'High waste percentage' : ''","defectRate > 5 ? 'High defect rate' : ''","reworkCostPerBatch > 2000 ? 'High rework cost' : ''"];
  const suggestedActions: string[] = ["wastePercentage > 10 ? 'Implement lean manufacturing to reduce waste' : ''","defectRate > 5 ? 'Improve quality control processes' : ''","reworkCostPerBatch > 2000 ? 'Analyze root causes of defects to reduce rework' : ''","profitMargin < 10 ? 'Review pricing strategy or reduce costs' : ''"];
  const dataConfidenceAdjusted = results.dataConfidenceAdjusted;

  return {
    totalExposure,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of full report","CSV export of breakdown data","Trend analysis over multiple periods","Scenario comparison (what-if)","Detailed variance analysis","Benchmarking against industry standards"],
  };
}
