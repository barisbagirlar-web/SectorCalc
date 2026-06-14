// Auto-generated from inventory-carrying-cost-eoq-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface InventoryCarryingCostEoqCalculatorInput {
  annualDemand: number;
  orderingCost: number;
  holdingCostPerUnitPerYear: number;
  unitCost: number;
  carryingCostRate: number;
  leadTimeDays: number;
  safetyStock: number;
  workingDaysPerYear: number;
}

export const InventoryCarryingCostEoqCalculatorInputSchema = z.object({
  annualDemand: z.number().min(1).default(10000),
  orderingCost: z.number().min(0).default(100),
  holdingCostPerUnitPerYear: z.number().min(0).default(5),
  unitCost: z.number().min(0).default(50),
  carryingCostRate: z.number().min(0).max(100).default(20),
  leadTimeDays: z.number().min(0).default(7),
  safetyStock: z.number().min(0).default(100),
  workingDaysPerYear: z.number().min(1).max(365).default(365),
});

export interface InventoryCarryingCostEoqCalculatorOutput {
  totalAnnualInventoryCost: number;
  breakdown: {
    eoq: number;
    totalAnnualHoldingCost: number;
    totalAnnualOrderingCost: number;
    reorderPoint: number;
    averageInventoryLevel: number;
    inventoryTurnover: number;
    carryingCostPercentage: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: InventoryCarryingCostEoqCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.eoq = ((): number => { try { const __v = Math.Math.sqrt((2 * input.annualDemand * input.orderingCost) / input.holdingCostPerUnitPerYear); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualHoldingCost = ((): number => { try { const __v = (results.eoq / 2 + input.safetyStock) * input.holdingCostPerUnitPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualOrderingCost = ((): number => { try { const __v = (input.annualDemand / results.eoq) * input.orderingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualInventoryCost = ((): number => { try { const __v = results.totalAnnualHoldingCost + results.totalAnnualOrderingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reorderPoint = ((): number => { try { const __v = (input.annualDemand / input.workingDaysPerYear) * input.leadTimeDays + input.safetyStock; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.averageInventoryLevel = ((): number => { try { const __v = results.eoq / 2 + input.safetyStock; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.inventoryTurnover = ((): number => { try { const __v = input.annualDemand / results.averageInventoryLevel; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.carryingCostPercentage = ((): number => { try { const __v = input.holdingCostPerUnitPerYear / input.unitCost * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateInventoryCarryingCostEoqCalculator(input: InventoryCarryingCostEoqCalculatorInput): InventoryCarryingCostEoqCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalAnnualInventoryCost = results.totalAnnualInventoryCost ?? 0;
  const breakdown = {
    eoq: results.eoq,
    totalAnnualHoldingCost: results.totalAnnualHoldingCost,
    totalAnnualOrderingCost: results.totalAnnualOrderingCost,
    reorderPoint: results.reorderPoint,
    averageInventoryLevel: results.averageInventoryLevel,
    inventoryTurnover: results.inventoryTurnover,
    carryingCostPercentage: results.carryingCostPercentage,
  };

  // rule: annualDemand > 0
  // rule: orderingCost >= 0
  // rule: holdingCostPerUnitPerYear >= 0
  // rule: unitCost > 0
  // rule: carryingCostRate >= 0 and carryingCostRate <= 100
  // rule: leadTimeDays >= 0
  // rule: safetyStock >= 0
  // rule: workingDaysPerYear >= 1 and workingDaysPerYear <= 365
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Carrying cost rate exceeds typical industry benchmark (30%). Consider reducing inventory levels.
  // threshold skipped (non-JS): Safety stock is more than 50% of annual demand. Review demand variability and lead time reliability.

  const dataConfidenceAdjusted = (() => { try { return results.totalAnnualInventoryCost * (1 + (1 - dataConfidence) * 0.1); } catch { return totalAnnualInventoryCost; } })();

  return {
    totalAnnualInventoryCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
