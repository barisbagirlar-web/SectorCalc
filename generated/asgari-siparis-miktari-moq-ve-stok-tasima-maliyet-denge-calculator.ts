// Auto-generated from asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCostPerUnit: number;
  unitCost: number;
  moq: number;
  leadTimeDays: number;
  safetyStock: number;
  workingDaysPerYear: number;
}

export const AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputSchema = z.object({
  annualDemand: z.number().min(1).max(10000000).default(10000),
  orderingCost: z.number().min(0).max(10000).default(50),
  holdingCostPerUnit: z.number().min(0).max(1000).default(2),
  unitCost: z.number().min(0).max(100000).default(10),
  moq: z.number().min(1).max(100000).default(500),
  leadTimeDays: z.number().min(0).max(365).default(7),
  safetyStock: z.number().min(0).max(100000).default(100),
  workingDaysPerYear: z.number().min(1).max(365).default(250),
});

export interface AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorOutput {
  totalExposure: number;
  breakdown: {
    eoq: number;
    optimalOrderQuantity: number;
    averageInventory: number;
    annualHoldingCost: number;
    annualOrderingCost: number;
    totalInventoryCost: number;
    variancePercent: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.eoq = Math.sqrt((2 * input.annualDemand * input.orderingCost) / input.holdingCostPerUnit);
  results.optimalOrderQuantity = Math.max(results.eoq, input.moq);
  results.orderFrequency = input.annualDemand / results.optimalOrderQuantity;
  results.averageInventory = (results.optimalOrderQuantity / 2) + input.safetyStock;
  results.annualHoldingCost = results.averageInventory * input.holdingCostPerUnit;
  results.annualOrderingCost = results.orderFrequency * input.orderingCost;
  results.totalInventoryCost = results.annualHoldingCost + results.annualOrderingCost;
  results.totalExposure = results.totalInventoryCost + (results.averageInventory * input.unitCost);
  results.variancePercent = ((results.optimalOrderQuantity - results.eoq) / results.eoq) * 100;
  results.summaryLevel = results.totalExposure > 500000 ? 'critical' : results.totalExposure > 100000 ? 'warning' : 'normal';
  results.primaryDriver = results.variancePercent > 20 ? 'MOQ constraint' : 'EOQ optimal';
  results.decisionVerdict = results.variancePercent > 50 ? 'Negotiate MOQ reduction' : results.variancePercent > 20 ? 'Consider MOQ adjustment' : 'Accept current MOQ';
  return results;
}

export function calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator(input: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInput): AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalExposure = results.totalExposure;
  const breakdown = {
    eoq: results.eoq,
    optimalOrderQuantity: results.optimalOrderQuantity,
    averageInventory: results.averageInventory,
    annualHoldingCost: results.annualHoldingCost,
    annualOrderingCost: results.annualOrderingCost,
    totalInventoryCost: results.totalInventoryCost,
    variancePercent: results.variancePercent,
  };

  // rule: annualDemand must be > 0
  // rule: orderingCost must be >= 0
  // rule: holdingCostPerUnit must be >= 0
  // rule: unitCost must be >= 0
  // rule: moq must be > 0
  // rule: leadTimeDays must be >= 0
  // rule: safetyStock must be >= 0
  // rule: workingDaysPerYear must be between 1 and 365
  // rule: If moq > annualDemand, then warning: MOQ exceeds annual demand
  // rule: If holdingCostPerUnit > unitCost * 0.5, then warning: holding cost is high relative to unit cost
  // threshold totalExposure: warning: > 100000, critical: > 500000
  // threshold variancePercent: warning: > 20, critical: > 50
  const hiddenLossDrivers: string[] = ["If moq > eoq: excess inventory due to MOQ constraint","If safetyStock > 0.5 * averageInventory: high safety stock relative to cycle stock"];
  const suggestedActions: string[] = ["If variancePercent > 20: negotiate lower MOQ with supplier","If holdingCostPerUnit > unitCost * 0.3: review storage efficiency or reduce safety stock","If orderingCost is high: consider consolidating orders or using blanket orders"];
  const dataConfidenceAdjusted = results.totalExposure * (1 - (1 - dataConfidence) * 0.1) if dataConfidence provided;

  return {
    totalExposure,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Scenario comparison (multiple MOQ values)","Detailed breakdown report with charts","Data confidence adjustment"],
  };
}
