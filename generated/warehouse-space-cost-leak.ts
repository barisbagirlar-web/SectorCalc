// Auto-generated from warehouse-space-cost-leak-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface WarehouseSpaceCostLeakInput {
  totalWarehouseArea: number;
  usableStorageArea: number;
  annualRentPerSqm: number;
  operatingCostPerSqm: number;
  inventoryTurnover: number;
  averageInventoryValue: number;
  carryingCostRate: number;
  wasteSpacePercent: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const WarehouseSpaceCostLeakInputSchema = z.object({
  totalWarehouseArea: z.number().min(0).default(10000),
  usableStorageArea: z.number().min(0).default(7000),
  annualRentPerSqm: z.number().min(0).default(120),
  operatingCostPerSqm: z.number().min(0).default(30),
  inventoryTurnover: z.number().min(0).default(6),
  averageInventoryValue: z.number().min(0).default(5000000),
  carryingCostRate: z.number().min(0).max(100).default(25),
  wasteSpacePercent: z.number().min(0).max(100).default(15),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface WarehouseSpaceCostLeakOutput {
  spaceCostLeak: number;
  breakdown: {
    totalSpaceCost: number;
    wastedSpaceCost: number;
    inventoryCarryingCost: number;
    spaceUtilization: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: WarehouseSpaceCostLeakInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalSpaceCost = ((): number => { try { const __v = input.totalWarehouseArea * (input.annualRentPerSqm + input.operatingCostPerSqm); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wastedSpaceCost = ((): number => { try { const __v = results.totalSpaceCost * (input.wasteSpacePercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.inventoryCarryingCost = ((): number => { try { const __v = input.averageInventoryValue * (input.carryingCostRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.spaceCostLeak = ((): number => { try { const __v = results.wastedSpaceCost + results.inventoryCarryingCost * (1 - (input.usableStorageArea / input.totalWarehouseArea)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.spaceCostLeak * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateWarehouseSpaceCostLeak(input: WarehouseSpaceCostLeakInput): WarehouseSpaceCostLeakOutput {
  const results = evaluateFormulas(input);
  const spaceCostLeak = results.spaceCostLeak ?? 0;
  const breakdown = {
    totalSpaceCost: results.totalSpaceCost,
    wastedSpaceCost: results.wastedSpaceCost,
    inventoryCarryingCost: results.inventoryCarryingCost,
    spaceUtilization: results.spaceUtilization,
  };

  // rule: usableStorageArea <= totalWarehouseArea
  // rule: wasteSpacePercent >= 0
  // rule: inventoryTurnover > 0
  // rule: carryingCostRate between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Critical: Waste space exceeds 20% - immediate layout review needed.
  // threshold skipped (non-JS): Warning: Low inventory turnover indicates overstocking or obsolescence.
  // threshold skipped (non-JS): Warning: Carrying cost rate above industry norm.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return spaceCostLeak; } })();

  return {
    spaceCostLeak,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Recommendations"],
  };
}
