// Auto-generated from shop-rate-hourly-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ShopRateHourlyCostCalculatorInput {
  directLaborCostPerHour: number;
  overheadRate: number;
  machineCostPerHour: number;
  materialCostPerUnit: number;
  productionRatePerHour: number;
  defectRate: number;
  utilizationRate: number;
  profitMargin: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ShopRateHourlyCostCalculatorInputSchema = z.object({
  directLaborCostPerHour: z.number().min(0).default(25),
  overheadRate: z.number().min(0).default(150),
  machineCostPerHour: z.number().min(0).default(10),
  materialCostPerUnit: z.number().min(0).default(5),
  productionRatePerHour: z.number().min(0.001).default(10),
  defectRate: z.number().min(0).max(100).default(2),
  utilizationRate: z.number().min(0).max(100).default(85),
  profitMargin: z.number().min(0).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ShopRateHourlyCostCalculatorOutput {
  shopRatePerHour: number;
  breakdown: {
    effectiveLaborCostPerHour: number;
    costPerUnitLabor: number;
    costPerUnitMachine: number;
    costPerUnitMaterial: number;
    totalCostPerUnit: number;
    yieldRate: number;
    adjustedCostPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ShopRateHourlyCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.effectiveLaborCostPerHour = ((): number => { try { const __v = input.directLaborCostPerHour * (1 + input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerUnitLabor = ((): number => { try { const __v = results.effectiveLaborCostPerHour / input.productionRatePerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerUnitMachine = ((): number => { try { const __v = input.machineCostPerHour / input.productionRatePerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerUnitMaterial = ((): number => { try { const __v = input.materialCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerUnit = ((): number => { try { const __v = results.costPerUnitLabor + results.costPerUnitMachine + results.costPerUnitMaterial; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yieldRate = ((): number => { try { const __v = 1 - input.defectRate / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedCostPerUnit = ((): number => { try { const __v = results.totalCostPerUnit / results.yieldRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.shopRatePerHour = ((): number => { try { const __v = results.adjustedCostPerUnit * input.productionRatePerHour * (1 + input.profitMargin / 100) / (input.utilizationRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.shopRatePerHour * (1 + (input.dataConfidence === 'low' ? 0.1 : input.dataConfidence === 'medium' ? 0.05 : 0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateShopRateHourlyCostCalculator(input: ShopRateHourlyCostCalculatorInput): ShopRateHourlyCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const shopRatePerHour = results.shopRatePerHour ?? 0;
  const breakdown = {
    effectiveLaborCostPerHour: results.effectiveLaborCostPerHour,
    costPerUnitLabor: results.costPerUnitLabor,
    costPerUnitMachine: results.costPerUnitMachine,
    costPerUnitMaterial: results.costPerUnitMaterial,
    totalCostPerUnit: results.totalCostPerUnit,
    yieldRate: results.yieldRate,
    adjustedCostPerUnit: results.adjustedCostPerUnit,
  };

  // rule: directLaborCostPerHour > 0
  // rule: overheadRate >= 0
  // rule: machineCostPerHour >= 0
  // rule: materialCostPerUnit >= 0
  // rule: productionRatePerHour > 0
  // rule: defectRate >= 0 and defectRate <= 100
  // rule: utilizationRate >= 0 and utilizationRate <= 100
  // rule: profitMargin >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High defect rate; consider process improvement (Six Sigma).
  // threshold skipped (non-JS): Low utilization; investigate downtime causes (OEE).
  // threshold skipped (non-JS): Overhead rate exceeds typical range; review indirect costs.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return shopRatePerHour; } })();

  return {
    shopRatePerHour,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
