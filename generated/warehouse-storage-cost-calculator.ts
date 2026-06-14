// Auto-generated from warehouse-storage-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface WarehouseStorageCostCalculatorInput {
  totalStorageArea: number;
  usableStorageArea: number;
  averageInventoryValue: number;
  annualStorageCostPerSqm: number;
  laborCostPerHour: number;
  laborHoursPerSqmPerYear: number;
  equipmentCostPerYear: number;
  costOfCapitalRate: number;
  storageUtilizationRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const WarehouseStorageCostCalculatorInputSchema = z.object({
  totalStorageArea: z.number().min(0).default(1000),
  usableStorageArea: z.number().min(0).default(800),
  averageInventoryValue: z.number().min(0).default(500000),
  annualStorageCostPerSqm: z.number().min(0).default(120),
  laborCostPerHour: z.number().min(0).default(25),
  laborHoursPerSqmPerYear: z.number().min(0).default(2),
  equipmentCostPerYear: z.number().min(0).default(50000),
  costOfCapitalRate: z.number().min(0).max(100).default(8),
  storageUtilizationRate: z.number().min(0).max(100).default(85),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface WarehouseStorageCostCalculatorOutput {
  totalAnnualStorageCost: number;
  breakdown: {
    annualStorageSpaceCost: number;
    annualLaborCost: number;
    annualEquipmentCost: number;
    annualInventoryCarryingCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: WarehouseStorageCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualStorageSpaceCost = ((): number => { try { const __v = input.totalStorageArea * input.annualStorageCostPerSqm; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualLaborCost = ((): number => { try { const __v = input.usableStorageArea * input.laborHoursPerSqmPerYear * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEquipmentCost = ((): number => { try { const __v = input.equipmentCostPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualInventoryCarryingCost = ((): number => { try { const __v = input.averageInventoryValue * (input.costOfCapitalRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualStorageCost = ((): number => { try { const __v = results.annualStorageSpaceCost + results.annualLaborCost + results.annualEquipmentCost + results.annualInventoryCarryingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerSqmPerYear = ((): number => { try { const __v = results.totalAnnualStorageCost / input.usableStorageArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerDollarOfInventory = ((): number => { try { const __v = results.totalAnnualStorageCost / input.averageInventoryValue; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedTotalCost = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.totalAnnualStorageCost * 1.2 : (input.dataConfidence == 'medium' ? results.totalAnnualStorageCost * 1.1 : results.totalAnnualStorageCost); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateWarehouseStorageCostCalculator(input: WarehouseStorageCostCalculatorInput): WarehouseStorageCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalAnnualStorageCost = results.totalAnnualStorageCost ?? 0;
  const breakdown = {
    annualStorageSpaceCost: results.annualStorageSpaceCost,
    annualLaborCost: results.annualLaborCost,
    annualEquipmentCost: results.annualEquipmentCost,
    annualInventoryCarryingCost: results.annualInventoryCarryingCost,
  };

  // rule: usableStorageArea <= totalStorageArea
  // rule: storageUtilizationRate >= 0 and storageUtilizationRate <= 100
  // rule: costOfCapitalRate >= 0 and costOfCapitalRate <= 100
  // rule: if storageUtilizationRate > 100 then 'Utilization cannot exceed 100%'
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): storageUtilizationRate

  const dataConfidenceAdjusted = (() => { try { return results.adjustedTotalCost; } catch { return totalAnnualStorageCost; } })();

  return {
    totalAnnualStorageCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (historical comparison)","Benchmarking against industry averages","Detailed breakdown report with charts"],
  };
}
