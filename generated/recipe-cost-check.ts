// Auto-generated from recipe-cost-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RecipeCostCheckInput {
  ingredientCostPerUnit: number;
  ingredientQuantity: number;
  laborCostPerHour: number;
  laborHoursPerBatch: number;
  overheadRate: number;
  batchSize: number;
  wastePercentage: number;
  energyCostPerKwh: number;
  energyConsumptionKwh: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const RecipeCostCheckInputSchema = z.object({
  ingredientCostPerUnit: z.number().min(0).default(0),
  ingredientQuantity: z.number().min(0).default(0),
  laborCostPerHour: z.number().min(0).default(0),
  laborHoursPerBatch: z.number().min(0).default(0),
  overheadRate: z.number().min(0).max(100).default(20),
  batchSize: z.number().min(1).default(1),
  wastePercentage: z.number().min(0).max(100).default(5),
  energyCostPerKwh: z.number().min(0).default(0.12),
  energyConsumptionKwh: z.number().min(0).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface RecipeCostCheckOutput {
  costPerUnit: number;
  breakdown: {
    materialCost: number;
    laborCost: number;
    energyCost: number;
    overheadCost: number;
    totalCostPerBatch: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RecipeCostCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.materialCost = ((): number => { try { const __v = input.ingredientCostPerUnit * input.ingredientQuantity * (1 + input.wastePercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = input.laborCostPerHour * input.laborHoursPerBatch; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energyCost = ((): number => { try { const __v = input.energyCostPerKwh * input.energyConsumptionKwh; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directCost = ((): number => { try { const __v = results.materialCost + results.laborCost + results.energyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.directCost * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerBatch = ((): number => { try { const __v = results.directCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerUnit = ((): number => { try { const __v = results.totalCostPerBatch / input.batchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.costPerUnit * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRecipeCostCheck(input: RecipeCostCheckInput): RecipeCostCheckOutput {
  const results = evaluateFormulas(input);
  const costPerUnit = results.costPerUnit ?? 0;
  const breakdown = {
    materialCost: results.materialCost,
    laborCost: results.laborCost,
    energyCost: results.energyCost,
    overheadCost: results.overheadCost,
    totalCostPerBatch: results.totalCostPerBatch,
  };

  // rule: ingredientCostPerUnit >= 0
  // rule: ingredientQuantity >= 0
  // rule: laborCostPerHour >= 0
  // rule: laborHoursPerBatch >= 0
  // rule: overheadRate >= 0 and overheadRate <= 100
  // rule: batchSize >= 1
  // rule: wastePercentage >= 0 and wastePercentage <= 100
  // rule: energyCostPerKwh >= 0
  // rule: energyConsumptionKwh >= 0
  // rule: if batchSize > 0 then ingredientQuantity >= 0
  // rule: if laborHoursPerBatch > 0 then laborCostPerHour > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste percentage detected; consider process improvement.
  // threshold skipped (non-JS): Overhead rate exceeds typical range; review indirect costs.
  // threshold skipped (non-JS): Energy cost above benchmark; consider energy efficiency measures.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return costPerUnit; } })();

  return {
    costPerUnit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of cost report","CSV export of data","Trend analysis over time","Benchmark comparison against industry standards","Detailed breakdown with charts"],
  };
}
