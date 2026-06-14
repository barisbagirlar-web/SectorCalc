// Auto-generated from portion-cost-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PortionCostCalculatorInput {
  totalCost: number;
  batchSize: number;
  wastePercentage: number;
  laborCostPerHour: number;
  laborHoursPerBatch: number;
  overheadRate: number;
  desiredProfitMargin: number;
}

export const PortionCostCalculatorInputSchema = z.object({
  totalCost: z.number().min(0).default(0),
  batchSize: z.number().min(1).default(1),
  wastePercentage: z.number().min(0).max(100).default(0),
  laborCostPerHour: z.number().min(0).default(0),
  laborHoursPerBatch: z.number().min(0).default(0),
  overheadRate: z.number().min(0).max(100).default(0),
  desiredProfitMargin: z.number().min(0).max(100).default(20),
});

export interface PortionCostCalculatorOutput {
  totalCostPerPortion: number;
  breakdown: {
    directMaterialCostPerPortion: number;
    laborCostPerPortion: number;
    overheadCostPerPortion: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PortionCostCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.effectiveBatchSize = ((): number => { try { const __v = input.batchSize * (1 - input.wastePercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directMaterialCostPerPortion = ((): number => { try { const __v = input.totalCost / results.effectiveBatchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCostPerPortion = ((): number => { try { const __v = (input.laborCostPerHour * input.laborHoursPerBatch) / results.effectiveBatchSize; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directCostPerPortion = ((): number => { try { const __v = results.directMaterialCostPerPortion + results.laborCostPerPortion; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCostPerPortion = ((): number => { try { const __v = results.directCostPerPortion * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerPortion = ((): number => { try { const __v = results.directCostPerPortion + results.overheadCostPerPortion; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sellingPricePerPortion = ((): number => { try { const __v = results.totalCostPerPortion * (1 + input.desiredProfitMargin / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePortionCostCalculator(input: PortionCostCalculatorInput): PortionCostCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCostPerPortion = results.totalCostPerPortion ?? 0;
  const breakdown = {
    directMaterialCostPerPortion: results.directMaterialCostPerPortion,
    laborCostPerPortion: results.laborCostPerPortion,
    overheadCostPerPortion: results.overheadCostPerPortion,
  };

  // rule: totalCost >= 0
  // rule: batchSize >= 1
  // rule: wastePercentage >= 0 and wastePercentage <= 100
  // rule: laborCostPerHour >= 0
  // rule: laborHoursPerBatch >= 0
  // rule: overheadRate >= 0 and overheadRate <= 100
  // rule: desiredProfitMargin >= 0 and desiredProfitMargin <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste percentage detected; consider process improvement.
  // threshold skipped (non-JS): Overhead rate exceeds 50%; review overhead allocation.

  const dataConfidenceAdjusted = (() => { try { return results.totalCostPerPortion * (1 + (1 - dataConfidence) * 0.1); } catch { return totalCostPerPortion; } })();

  return {
    totalCostPerPortion,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report"],
  };
}
