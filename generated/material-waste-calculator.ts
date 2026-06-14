// Auto-generated from material-waste-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface MaterialWasteCalculatorInput {
  totalMaterialInput: number;
  goodOutput: number;
  scrapRate: number;
  reworkRate: number;
  materialCostPerKg: number;
  disposalCostPerKg: number;
  productionVolume: number;
  timePeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const MaterialWasteCalculatorInputSchema = z.object({
  totalMaterialInput: z.number().min(0).default(1000),
  goodOutput: z.number().min(0).default(800),
  scrapRate: z.number().min(0).max(100).default(5),
  reworkRate: z.number().min(0).max(100).default(3),
  materialCostPerKg: z.number().min(0).default(5),
  disposalCostPerKg: z.number().min(0).default(0.5),
  productionVolume: z.number().min(0).default(10000),
  timePeriod: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('monthly'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface MaterialWasteCalculatorOutput {
  totalWasteCost: number;
  breakdown: {
    totalWaste: number;
    scrapWaste: number;
    reworkWaste: number;
    wastePercentage: number;
    annualWasteCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: MaterialWasteCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalWaste = ((): number => { try { const __v = input.totalMaterialInput - input.goodOutput; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.scrapWaste = ((): number => { try { const __v = input.totalMaterialInput * (input.scrapRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkWaste = ((): number => { try { const __v = input.goodOutput * (input.reworkRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalWasteCost = ((): number => { try { const __v = (results.scrapWaste + results.reworkWaste) * input.materialCostPerKg + results.totalWaste * input.disposalCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wastePercentage = ((): number => { try { const __v = (results.totalWaste / input.totalMaterialInput) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualWasteCost = ((): number => { try { const __v = results.totalWasteCost * (input.timePeriod === 'daily' ? 365 : input.timePeriod === 'weekly' ? 52 : input.timePeriod === 'monthly' ? 12 : 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence === 'low' ? results.totalWasteCost * 1.2 : input.dataConfidence === 'medium' ? results.totalWasteCost * 1.0 : results.totalWasteCost * 0.9; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateMaterialWasteCalculator(input: MaterialWasteCalculatorInput): MaterialWasteCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalWasteCost = results.totalWasteCost ?? 0;
  const breakdown = {
    totalWaste: results.totalWaste,
    scrapWaste: results.scrapWaste,
    reworkWaste: results.reworkWaste,
    wastePercentage: results.wastePercentage,
    annualWasteCost: results.annualWasteCost,
  };

  // rule: goodOutput must be less than or equal to totalMaterialInput
  // rule: scrapRate + reworkRate must be less than 100
  // rule: materialCostPerKg > 0
  // rule: disposalCostPerKg >= 0
  // rule: productionVolume > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Critical: Scrap rate exceeds 10% - investigate process inefficiencies.
  // threshold skipped (non-JS): Warning: Rework rate above 5% - quality issue detected.
  // threshold skipped (non-JS): Alert: Total waste cost exceeds $10,000 - consider waste reduction projects.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalWasteCost; } })();

  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
