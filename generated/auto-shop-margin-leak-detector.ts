// Auto-generated from auto-shop-margin-leak-detector-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AutoShopMarginLeakDetectorInput {
  laborRate: number;
  laborHoursBilled: number;
  partsRevenue: number;
  partsCost: number;
  laborCostPerHour: number;
  overheadMonthly: number;
  warrantyReturnsPercent: number;
  inventoryShrinkagePercent: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AutoShopMarginLeakDetectorInputSchema = z.object({
  laborRate: z.number().min(50).max(200).default(100),
  laborHoursBilled: z.number().min(100).max(1000).default(400),
  partsRevenue: z.number().min(10000).max(200000).default(50000),
  partsCost: z.number().min(5000).max(150000).default(35000),
  laborCostPerHour: z.number().min(15).max(60).default(30),
  overheadMonthly: z.number().min(5000).max(50000).default(15000),
  warrantyReturnsPercent: z.number().min(0).max(10).default(2),
  inventoryShrinkagePercent: z.number().min(0).max(5).default(1),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AutoShopMarginLeakDetectorOutput {
  adjustedGrossMarginPercent: number;
  breakdown: {
    grossMarginPercent: number;
    laborMarginPercent: number;
    partsMarkupPercent: number;
    totalHiddenLoss: number;
    warrantyLoss: number;
    inventoryLoss: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AutoShopMarginLeakDetectorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.laborRevenue = input.laborRate * input.laborHoursBilled;
  results.partsRevenueInput = input.partsRevenue;
  results.totalRevenue = results.laborRevenue + input.partsRevenue;
  results.laborCostTotal = input.laborCostPerHour * input.laborHoursBilled;
  results.partsCostInput = input.partsCost;
  results.totalCost = results.laborCostTotal + results.partsCostInput + input.overheadMonthly;
  results.grossProfit = results.totalRevenue - results.totalCost;
  results.grossMarginPercent = (results.grossProfit / results.totalRevenue) * 100;
  results.laborMarginPercent = ((results.laborRevenue - results.laborCostTotal) / results.laborRevenue) * 100;
  results.partsMarkupPercent = ((input.partsRevenue - input.partsCost) / input.partsCost) * 100;
  results.warrantyLoss = results.totalRevenue * (input.warrantyReturnsPercent / 100);
  results.inventoryLoss = input.partsCost * (input.inventoryShrinkagePercent / 100);
  results.totalHiddenLoss = results.warrantyLoss + results.inventoryLoss;
  results.adjustedGrossProfit = results.grossProfit - results.totalHiddenLoss;
  results.adjustedGrossMarginPercent = (results.adjustedGrossProfit / results.totalRevenue) * 100;
  results.dataConfidenceFactor = input.dataConfidence == 'low' ? 0.9 : (input.dataConfidence == 'medium' ? 0.95 : 1.0);
  results.dataConfidenceAdjustedMargin = results.adjustedGrossMarginPercent * results.dataConfidenceFactor;
  return results;
}

export function calculateAutoShopMarginLeakDetector(input: AutoShopMarginLeakDetectorInput): AutoShopMarginLeakDetectorOutput {
  const results = evaluateFormulas(input);
  const adjustedGrossMarginPercent = results.adjustedGrossMarginPercent;
  const breakdown = {
    grossMarginPercent: results.grossMarginPercent,
    laborMarginPercent: results.laborMarginPercent,
    partsMarkupPercent: results.partsMarkupPercent,
    totalHiddenLoss: results.totalHiddenLoss,
    warrantyLoss: results.warrantyLoss,
    inventoryLoss: results.inventoryLoss,
  };

  // rule: laborRate > laborCostPerHour
  // rule: partsRevenue > partsCost
  // rule: laborHoursBilled > 0
  // rule: overheadMonthly > 0
  // rule: warrantyReturnsPercent >= 0
  // rule: inventoryShrinkagePercent >= 0
  // threshold grossMarginPercent < 40: Low gross margin warning: check pricing and cost structure.
  // threshold laborMarginPercent < 50: Labor margin below 50%: labor rate may be too low or efficiency poor.
  // threshold partsMarkupPercent < 30: Parts markup below 30%: consider increasing parts prices.
  // threshold warrantyReturnsPercent > 5: High warranty returns: investigate quality issues.
  // threshold inventoryShrinkagePercent > 2: High inventory shrinkage: improve inventory controls.
  const hiddenLossDrivers: string[] = ["warrantyReturnsPercent > 3 ? 'Warranty returns exceed 3%' : ''","inventoryShrinkagePercent > 1.5 ? 'Inventory shrinkage above 1.5%' : ''"];
  const suggestedActions: string[] = ["If labor margin < 50%: increase labor rate or improve technician efficiency.","If parts markup < 30%: renegotiate supplier pricing or increase retail markup.","If warranty returns > 3%: implement quality control process.","If inventory shrinkage > 1.5%: conduct physical inventory and improve security."];
  const dataConfidenceAdjusted = results.dataConfidenceAdjustedMargin;

  return {
    adjustedGrossMarginPercent,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF report export","CSV data export","Trend analysis over multiple months","Benchmarking against industry averages","Detailed breakdown with charts","Scenario simulation (what-if analysis)"],
  };
}
