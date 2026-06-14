// Auto-generated from asgari-siparis-miktari-moq-ve-stok-tasima-maliyet-denge-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCostPerUnitPerYear: number;
  unitCost: number;
  leadTimeDays: number;
  serviceLevel: number;
  demandStdDev: number;
  workingDaysPerYear: number;
}

export const AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInputSchema = z.object({
  annualDemand: z.number().min(1).max(10000000).default(10000),
  orderingCost: z.number().min(0).max(10000).default(50),
  holdingCostPerUnitPerYear: z.number().min(0).max(1000).default(2),
  unitCost: z.number().min(0).max(100000).default(10),
  leadTimeDays: z.number().min(0).max(365).default(7),
  serviceLevel: z.number().min(50).max(99.99).default(95),
  demandStdDev: z.number().min(0).max(10000).default(10),
  workingDaysPerYear: z.number().min(1).max(365).default(250),
});

export interface AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorOutput {
  totalAnnualInventoryCost: number;
  breakdown: {
    eoq: number;
    safetyStock: number;
    reorderPoint: number;
    totalAnnualOrderingCost: number;
    totalAnnualHoldingCost: number;
    moq: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.eoq = (() => { try { return Math.Math.sqrt((2 * input.annualDemand * input.orderingCost) / input.holdingCostPerUnitPerYear); } catch { return 0; } })();
  results.dailyDemand = (() => { try { return input.annualDemand / input.workingDaysPerYear; } catch { return 0; } })();
  results.totalAnnualOrderingCost = (() => { try { return (input.annualDemand / results.eoq) * input.orderingCost; } catch { return 0; } })();
  results.moq = (() => { try { return results.eoq; } catch { return 0; } })();
  results.serviceLevelZScore = (() => { try { return getZScore(input.serviceLevel / 100); } catch { return 0; } })();
  results.safetyStock = (() => { try { return results.serviceLevelZScore * input.demandStdDev * Math.Math.sqrt(input.leadTimeDays); } catch { return 0; } })();
  results.reorderPoint = (() => { try { return results.dailyDemand * input.leadTimeDays + results.safetyStock; } catch { return 0; } })();
  results.totalAnnualHoldingCost = (() => { try { return (results.eoq / 2) * input.holdingCostPerUnitPerYear + results.safetyStock * input.holdingCostPerUnitPerYear; } catch { return 0; } })();
  results.totalAnnualInventoryCost = (() => { try { return results.totalAnnualOrderingCost + results.totalAnnualHoldingCost; } catch { return 0; } })();
  return results;
}

export function calculateAsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculator(input: AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorInput): AsgariSiparisMiktariMoqVeStokTasimaMaliyetDengeCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalAnnualInventoryCost = results.totalAnnualInventoryCost ?? 0;
  const breakdown = {
    eoq: results.eoq,
    safetyStock: results.safetyStock,
    reorderPoint: results.reorderPoint,
    totalAnnualOrderingCost: results.totalAnnualOrderingCost,
    totalAnnualHoldingCost: results.totalAnnualHoldingCost,
    moq: results.moq,
  };

  // rule: annualDemand > 0
  // rule: orderingCost >= 0
  // rule: holdingCostPerUnitPerYear >= 0
  // rule: unitCost >= 0
  // rule: leadTimeDays >= 0
  // rule: serviceLevel >= 50 && serviceLevel <= 99.99
  // rule: demandStdDev >= 0
  // rule: workingDaysPerYear >= 1 && workingDaysPerYear <= 365
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If orderingCost > 1000, consider process improvement to reduce setup costs.
  // threshold skipped (non-JS): If holdingCostPerUnitPerYear > 0.3 * unitCost, inventory carrying cost is high; review storage efficiency.
  // threshold skipped (non-JS): If serviceLevel > 99.5, safety stock may be excessive; consider cost-service trade-off.

  const dataConfidenceAdjusted = (() => { try { return results.totalAnnualInventoryCost * (1 + (1 - dataConfidence) * 0.1); } catch { return totalAnnualInventoryCost; } })();

  return {
    totalAnnualInventoryCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Scenario comparison (multiple parameter sets)","Detailed report with charts and recommendations"],
  };
}
