// Auto-generated from construction-project-overrun-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ConstructionProjectOverrunInput {
  originalBudget: number;
  actualCost: number;
  plannedProgress: number;
  actualProgress: number;
  projectDuration: number;
  elapsedTime: number;
  contingencyReserve: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ConstructionProjectOverrunInputSchema = z.object({
  originalBudget: z.number().min(0).default(1000000),
  actualCost: z.number().min(0).default(1200000),
  plannedProgress: z.number().min(0).max(100).default(50),
  actualProgress: z.number().min(0).max(100).default(40),
  projectDuration: z.number().min(1).default(12),
  elapsedTime: z.number().min(0).default(6),
  contingencyReserve: z.number().min(0).default(100000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ConstructionProjectOverrunOutput {
  costOverrunPercent: number;
  breakdown: {
    costVariance: number;
    scheduleVariancePercent: number;
    costPerformanceIndex: number;
    schedulePerformanceIndex: number;
    estimateAtCompletion: number;
    overrunRiskScore: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ConstructionProjectOverrunInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.costVariance = ((): number => { try { const __v = input.actualCost - input.originalBudget; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costOverrunPercent = ((): number => { try { const __v = (input.actualCost - input.originalBudget) / input.originalBudget * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.scheduleVariancePercent = ((): number => { try { const __v = (input.actualProgress - input.plannedProgress) / input.plannedProgress * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerformanceIndex = ((): number => { try { const __v = input.actualProgress / 100 * input.originalBudget / input.actualCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.schedulePerformanceIndex = ((): number => { try { const __v = input.actualProgress / input.plannedProgress; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.estimateAtCompletion = ((): number => { try { const __v = input.originalBudget + input.contingencyReserve + results.costVariance; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overrunRiskScore = ((): number => { try { const __v = results.costOverrunPercent * 0.5 + Math.Math.max(0, -results.scheduleVariancePercent) * 0.3 + (1 - results.costPerformanceIndex) * 100 * 0.2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedOverrun = ((): number => { try { const __v = results.costOverrunPercent * (input.dataConfidence === 'high' ? 1 : input.dataConfidence === 'medium' ? 1.1 : 1.25); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateConstructionProjectOverrun(input: ConstructionProjectOverrunInput): ConstructionProjectOverrunOutput {
  const results = evaluateFormulas(input);
  const costOverrunPercent = results.costOverrunPercent ?? 0;
  const breakdown = {
    costVariance: results.costVariance,
    scheduleVariancePercent: results.scheduleVariancePercent,
    costPerformanceIndex: results.costPerformanceIndex,
    schedulePerformanceIndex: results.schedulePerformanceIndex,
    estimateAtCompletion: results.estimateAtCompletion,
    overrunRiskScore: results.overrunRiskScore,
  };

  // rule: actualCost >= 0
  // rule: originalBudget > 0
  // rule: plannedProgress between 0 and 100
  // rule: actualProgress between 0 and 100
  // rule: projectDuration > 0
  // rule: elapsedTime >= 0
  // rule: elapsedTime <= projectDuration
  // rule: contingencyReserve >= 0
  // rule: if actualProgress > 0 then actualCost > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Warning: Cost overrun exceeds 10% of original budget.
  // threshold skipped (non-JS): Warning: Schedule delay exceeds 10%.
  // threshold skipped (non-JS): Critical: CPI below 0.8 indicates severe cost inefficiency.
  // threshold skipped (non-JS): Critical: SPI below 0.8 indicates severe schedule delay.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedOverrun; } catch { return costOverrunPercent; } })();

  return {
    costOverrunPercent,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
