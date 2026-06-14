// Auto-generated from roofing-square-cost-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RoofingSquareCostCheckInput {
  roofArea: number;
  materialCostPerSquare: number;
  laborCostPerHour: number;
  laborHoursPerSquare: number;
  wasteFactor: number;
  overheadRate: number;
  profitMargin: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const RoofingSquareCostCheckInputSchema = z.object({
  roofArea: z.number().min(0).default(1000),
  materialCostPerSquare: z.number().min(0).default(100),
  laborCostPerHour: z.number().min(0).default(50),
  laborHoursPerSquare: z.number().min(0).default(2),
  wasteFactor: z.number().min(0).max(50).default(10),
  overheadRate: z.number().min(0).max(100).default(15),
  profitMargin: z.number().min(0).max(100).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface RoofingSquareCostCheckOutput {
  costPerSquare: number;
  breakdown: {
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    profit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RoofingSquareCostCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.squares = ((): number => { try { const __v = input.roofArea / 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCost = ((): number => { try { const __v = results.squares * input.materialCostPerSquare * (1 + input.wasteFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = results.squares * input.laborHoursPerSquare * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directCost = ((): number => { try { const __v = results.materialCost + results.laborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.directCost * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.directCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalPrice = ((): number => { try { const __v = results.totalCost * (1 + input.profitMargin / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerSquare = ((): number => { try { const __v = results.totalPrice / results.squares; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence === 'low' ? results.totalPrice * 1.15 : input.dataConfidence === 'medium' ? results.totalPrice * 1.05 : results.totalPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRoofingSquareCostCheck(input: RoofingSquareCostCheckInput): RoofingSquareCostCheckOutput {
  const results = evaluateFormulas(input);
  const costPerSquare = results.costPerSquare ?? 0;
  const breakdown = {
    materialCost: results.materialCost,
    laborCost: results.laborCost,
    overheadCost: results.overheadCost,
    profit: results.profit,
  };

  // rule: roofArea > 0
  // rule: materialCostPerSquare > 0
  // rule: laborCostPerHour > 0
  // rule: laborHoursPerSquare > 0
  // rule: wasteFactor >= 0 && wasteFactor <= 50
  // rule: overheadRate >= 0 && overheadRate <= 100
  // rule: profitMargin >= 0 && profitMargin <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High waste factor may indicate inefficiency or poor material quality.
  // threshold skipped (non-JS): Labor hours per square exceed typical benchmark (RSMeans).
  // threshold skipped (non-JS): Material cost per square is above average; consider alternative materials.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return costPerSquare; } })();

  return {
    costPerSquare,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
