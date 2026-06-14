// Auto-generated from 3d-print-cost-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface 3dPrintCostCheckInput {
  materialCostPerKg: number;
  materialWeightGrams: number;
  printTimeHours: number;
  machineCostPerHour: number;
  laborCostPerHour: number;
  postProcessingHours: number;
  batchSize: number;
  failureRatePercent: number;
  overheadPercent: number;
  desiredMarginPercent: number;
}

export const 3dPrintCostCheckInputSchema = z.object({
  materialCostPerKg: z.number().min(0).max(500).default(50),
  materialWeightGrams: z.number().min(0.1).max(10000).default(100),
  printTimeHours: z.number().min(0.1).max(168).default(5),
  machineCostPerHour: z.number().min(0).max(50).default(2),
  laborCostPerHour: z.number().min(0).max(100).default(25),
  postProcessingHours: z.number().min(0).max(10).default(0.5),
  batchSize: z.number().min(1).max(1000).default(1),
  failureRatePercent: z.number().min(0).max(100).default(5),
  overheadPercent: z.number().min(0).max(100).default(20),
  desiredMarginPercent: z.number().min(0).max(100).default(30),
});

export interface 3dPrintCostCheckOutput {
  recommendedPrice: number;
  breakdown: {
    materialCostPerPart: number;
    machineCostPerPart: number;
    laborCostPerPart: number;
    directCostPerPart: number;
    overheadCostPerPart: number;
    totalCostPerPart: number;
    marginAmount: number;
    marginPercent: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: 3dPrintCostCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.materialCostPerPart = input.materialCostPerKg * input.materialWeightGrams / 1000;
  results.machineCostPerPart = input.machineCostPerHour * input.printTimeHours / input.batchSize;
  results.laborCostPerPart = input.laborCostPerHour * (input.printTimeHours + input.postProcessingHours) / input.batchSize;
  results.directCostPerPart = results.materialCostPerPart + results.machineCostPerPart + results.laborCostPerPart;
  results.effectiveYield = 1 - input.failureRatePercent / 100;
  results.costPerGoodPart = results.directCostPerPart / results.effectiveYield;
  results.overheadCostPerPart = results.costPerGoodPart * input.overheadPercent / 100;
  results.totalCostPerPart = results.costPerGoodPart + results.overheadCostPerPart;
  results.recommendedPrice = results.totalCostPerPart * (1 + input.desiredMarginPercent / 100);
  results.marginAmount = results.recommendedPrice - results.totalCostPerPart;
  results.marginPercent = results.marginAmount / results.recommendedPrice * 100;
  return results;
}

export function calculate3dPrintCostCheck(input: 3dPrintCostCheckInput): 3dPrintCostCheckOutput {
  const results = evaluateFormulas(input);
  const recommendedPrice = results.recommendedPrice;
  const breakdown = {
    materialCostPerPart: results.materialCostPerPart,
    machineCostPerPart: results.machineCostPerPart,
    laborCostPerPart: results.laborCostPerPart,
    directCostPerPart: results.directCostPerPart,
    overheadCostPerPart: results.overheadCostPerPart,
    totalCostPerPart: results.totalCostPerPart,
    marginAmount: results.marginAmount,
    marginPercent: results.marginPercent,
  };

  // rule: materialCostPerKg > 0
  // rule: materialWeightGrams > 0
  // rule: printTimeHours > 0
  // rule: machineCostPerHour >= 0
  // rule: laborCostPerHour >= 0
  // rule: postProcessingHours >= 0
  // rule: batchSize >= 1
  // rule: failureRatePercent >= 0 and failureRatePercent <= 100
  // rule: overheadPercent >= 0 and overheadPercent <= 100
  // rule: desiredMarginPercent >= 0 and desiredMarginPercent <= 100
  // threshold failureRatePercent > 10: High failure rate significantly increases cost per good part. Consider optimizing print settings.
  // threshold overheadPercent > 50: Overhead seems high relative to direct costs. Review indirect expenses.
  // threshold desiredMarginPercent > 50: Target margin is very high; may not be competitive.
  const hiddenLossDrivers: string[] = ["failureRatePercent > 10 ? 'High failure rate' : ''","overheadPercent > 50 ? 'High overhead' : ''"];
  const suggestedActions: string[] = ["If failure rate > 10%: Review print settings, calibrate printer, or use higher quality material.","If overhead > 50%: Analyze indirect costs and consider reducing facility or admin expenses.","If margin too low: Increase batch size, reduce print time, or negotiate material costs."];
  const dataConfidenceAdjusted = results.totalCostPerPart * (1 + (1 - dataConfidence) * 0.1);

  return {
    recommendedPrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export of detailed cost breakdown","CSV export for batch analysis","Trend analysis over time","Comparison with historical jobs","Multi-material cost comparison","Sensitivity analysis on key inputs"],
  };
}
