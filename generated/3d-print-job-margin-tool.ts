// Auto-generated from 3d-print-job-margin-tool-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface 3dPrintJobMarginToolInput {
  materialCostPerKg: number;
  materialUsageKg: number;
  printTimeHours: number;
  machineHourlyRate: number;
  laborHourlyRate: number;
  laborTimeHours: number;
  overheadPercent: number;
  targetMarginPercent: number;
  wastePercent: number;
  postProcessingCost: number;
  shippingCost: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const 3dPrintJobMarginToolInputSchema = z.object({
  materialCostPerKg: z.number().min(0).max(500).default(50),
  materialUsageKg: z.number().min(0).max(100).default(0.5),
  printTimeHours: z.number().min(0).max(1000).default(10),
  machineHourlyRate: z.number().min(0).max(100).default(5),
  laborHourlyRate: z.number().min(0).max(200).default(25),
  laborTimeHours: z.number().min(0).max(100).default(2),
  overheadPercent: z.number().min(0).max(100).default(20),
  targetMarginPercent: z.number().min(0).max(100).default(30),
  wastePercent: z.number().min(0).max(50).default(5),
  postProcessingCost: z.number().min(0).max(1000).default(0),
  shippingCost: z.number().min(0).max(500).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface 3dPrintJobMarginToolOutput {
  price: number;
  breakdown: {
    materialCost: number;
    machineCost: number;
    laborCost: number;
    directCost: number;
    overheadCost: number;
    totalCost: number;
    marginPercent: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: 3dPrintJobMarginToolInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.materialCost = input.materialCostPerKg * input.materialUsageKg * (1 + input.wastePercent / 100);
  results.machineCost = input.printTimeHours * input.machineHourlyRate;
  results.laborCost = input.laborTimeHours * input.laborHourlyRate;
  results.directCost = results.materialCost + results.machineCost + results.laborCost + input.postProcessingCost + input.shippingCost;
  results.totalCost = results.directCost * (1 + input.overheadPercent / 100);
  results.price = results.totalCost / (1 - input.targetMarginPercent / 100);
  results.margin = (results.price - results.totalCost) / results.price * 100;
  results.dataConfidenceAdjusted = case input.dataConfidence when 'low' then results.totalCost * 1.2 when 'medium' then results.totalCost * 1.1 else results.totalCost end;
  return results;
}

export function calculate3dPrintJobMarginTool(input: 3dPrintJobMarginToolInput): 3dPrintJobMarginToolOutput {
  const results = evaluateFormulas(input);
  const price = results.price;
  const breakdown = {
    materialCost: results.materialCost,
    machineCost: results.machineCost,
    laborCost: results.laborCost,
    directCost: results.directCost,
    overheadCost: results.overheadCost,
    totalCost: results.totalCost,
    marginPercent: results.marginPercent,
  };

  // rule: materialCostPerKg >= 0
  // rule: materialUsageKg >= 0
  // rule: printTimeHours >= 0
  // rule: machineHourlyRate >= 0
  // rule: laborHourlyRate >= 0
  // rule: laborTimeHours >= 0
  // rule: overheadPercent >= 0 and overheadPercent <= 100
  // rule: targetMarginPercent >= 0 and targetMarginPercent <= 100
  // rule: wastePercent >= 0 and wastePercent <= 50
  // rule: postProcessingCost >= 0
  // rule: shippingCost >= 0
  // rule: if materialUsageKg > 0 then materialCostPerKg > 0
  // rule: if printTimeHours > 0 then machineHourlyRate > 0
  // rule: if laborTimeHours > 0 then laborHourlyRate > 0
  // threshold wastePercent > 10: High waste percentage may indicate process inefficiency.
  // threshold overheadPercent > 30: Overhead above 30% may erode competitiveness.
  // threshold targetMarginPercent < 10: Margin below 10% may not cover risks.
  // threshold materialCostPerKg > 200: Material cost is high; consider alternative materials.
  const hiddenLossDrivers: string[] = ["wastePercent > 10 ? 'High waste' : ''","overheadPercent > 30 ? 'High overhead' : ''","targetMarginPercent < 10 ? 'Low margin' : ''"];
  const suggestedActions: string[] = ["wastePercent > 10 ? 'Optimize print settings to reduce waste.' : ''","overheadPercent > 30 ? 'Review overhead allocation.' : ''","targetMarginPercent < 10 ? 'Increase price or reduce costs.' : ''"];
  const dataConfidenceAdjusted = results.dataConfidenceAdjusted;

  return {
    price,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of detailed cost breakdown","CSV export for batch analysis","Trend analysis over multiple jobs","Comparison with historical jobs","Detailed report with graphs"],
  };
}
