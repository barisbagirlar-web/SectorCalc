// Auto-generated from renovation-budget-optimizer-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RenovationBudgetOptimizerInput {
  totalArea: number;
  unitCost: number;
  laborCostPercentage: number;
  materialCostPercentage: number;
  overheadPercentage: number;
  contingencyPercentage: number;
  projectDurationMonths: number;
  inflationRate: number;
  financingRate: number;
  energySavingsPerYear: number;
  maintenanceSavingsPerYear: number;
  propertyValueIncrease: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const RenovationBudgetOptimizerInputSchema = z.object({
  totalArea: z.number().min(1).max(100000).default(100),
  unitCost: z.number().min(10).max(10000).default(500),
  laborCostPercentage: z.number().min(10).max(70).default(40),
  materialCostPercentage: z.number().min(20).max(80).default(50),
  overheadPercentage: z.number().min(0).max(30).default(10),
  contingencyPercentage: z.number().min(0).max(50).default(15),
  projectDurationMonths: z.number().min(1).max(60).default(6),
  inflationRate: z.number().min(0).max(20).default(3),
  financingRate: z.number().min(0).max(20).default(5),
  energySavingsPerYear: z.number().min(0).max(100000).default(2000),
  maintenanceSavingsPerYear: z.number().min(0).max(50000).default(1000),
  propertyValueIncrease: z.number().min(0).max(1000000).default(50000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface RenovationBudgetOptimizerOutput {
  totalBudget: number;
  breakdown: {
    baseCost: number;
    laborCost: number;
    materialCost: number;
    overheadCost: number;
    contingencyCost: number;
    financingCost: number;
    annualSavings: number;
    paybackPeriod: number;
    roi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RenovationBudgetOptimizerInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.baseCost = ((): number => { try { const __v = input.totalArea * input.unitCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = results.baseCost * (input.laborCostPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCost = ((): number => { try { const __v = results.baseCost * (input.materialCostPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.baseCost * (input.overheadPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.contingencyCost = ((): number => { try { const __v = results.baseCost * (input.contingencyPercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDirectCost = ((): number => { try { const __v = results.laborCost + results.materialCost + results.overheadCost + results.contingencyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.inflationFactor = ((): number => { try { const __v = (1 + input.inflationRate / 100) ** (input.projectDurationMonths / 12); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.financingCost = ((): number => { try { const __v = results.totalDirectCost * (input.financingRate / 100) * (input.projectDurationMonths / 12); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalBudget = ((): number => { try { const __v = results.totalDirectCost * results.inflationFactor + results.financingCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualSavings = ((): number => { try { const __v = input.energySavingsPerYear + input.maintenanceSavingsPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriod = ((): number => { try { const __v = results.totalBudget / results.annualSavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roi = ((): number => { try { const __v = ((input.propertyValueIncrease + results.annualSavings * 10) - results.totalBudget) / results.totalBudget * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalBudget * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.1 : 1.0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRenovationBudgetOptimizer(input: RenovationBudgetOptimizerInput): RenovationBudgetOptimizerOutput {
  const results = evaluateFormulas(input);
  const totalBudget = results.totalBudget ?? 0;
  const breakdown = {
    baseCost: results.baseCost,
    laborCost: results.laborCost,
    materialCost: results.materialCost,
    overheadCost: results.overheadCost,
    contingencyCost: results.contingencyCost,
    financingCost: results.financingCost,
    annualSavings: results.annualSavings,
    paybackPeriod: results.paybackPeriod,
    roi: results.roi,
  };

  // rule: laborCostPercentage + materialCostPercentage + overheadPercentage must equal 100
  // rule: if dataConfidence == 'low' then contingencyPercentage >= 20
  // rule: projectDurationMonths must be positive integer
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High contingency indicates high risk; consider detailed risk assessment.
  // threshold skipped (non-JS): Financing cost is high; explore alternative funding.
  // threshold skipped (non-JS): Energy savings too low; verify energy audit.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalBudget; } })();

  return {
    totalBudget,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
