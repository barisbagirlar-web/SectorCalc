// Auto-generated from hvac-project-margin-guard-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HvacProjectMarginGuardInput {
  projectRevenue: number;
  materialCost: number;
  laborCost: number;
  subcontractorCost: number;
  overheadPercent: number;
  contingencyPercent: number;
  marginTarget: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const HvacProjectMarginGuardInputSchema = z.object({
  projectRevenue: z.number().min(0).default(100000),
  materialCost: z.number().min(0).default(40000),
  laborCost: z.number().min(0).default(30000),
  subcontractorCost: z.number().min(0).default(10000),
  overheadPercent: z.number().min(0).max(100).default(10),
  contingencyPercent: z.number().min(0).max(100).default(5),
  marginTarget: z.number().min(0).max(100).default(15),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface HvacProjectMarginGuardOutput {
  marginPercent: number;
  breakdown: {
    totalDirectCost: number;
    overheadCost: number;
    contingencyCost: number;
    totalCost: number;
    marginAmount: number;
    marginGap: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HvacProjectMarginGuardInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalDirectCost = ((): number => { try { const __v = input.materialCost + input.laborCost + input.subcontractorCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.totalDirectCost * (input.overheadPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.contingencyCost = ((): number => { try { const __v = results.totalDirectCost * (input.contingencyPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDirectCost + results.overheadCost + results.contingencyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginAmount = ((): number => { try { const __v = input.projectRevenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginPercent = ((): number => { try { const __v = (results.marginAmount / input.projectRevenue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginGap = ((): number => { try { const __v = results.marginPercent - input.marginTarget; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedMargin = ((): number => { try { const __v = input.dataConfidence == 'low' ? results.marginPercent * 0.9 : (input.dataConfidence == 'medium' ? results.marginPercent * 0.95 : results.marginPercent); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHvacProjectMarginGuard(input: HvacProjectMarginGuardInput): HvacProjectMarginGuardOutput {
  const results = evaluateFormulas(input);
  const marginPercent = results.marginPercent ?? 0;
  const breakdown = {
    totalDirectCost: results.totalDirectCost,
    overheadCost: results.overheadCost,
    contingencyCost: results.contingencyCost,
    totalCost: results.totalCost,
    marginAmount: results.marginAmount,
    marginGap: results.marginGap,
  };

  // rule: projectRevenue > 0
  // rule: materialCost >= 0
  // rule: laborCost >= 0
  // rule: subcontractorCost >= 0
  // rule: overheadPercent >= 0 && overheadPercent <= 100
  // rule: contingencyPercent >= 0 && contingencyPercent <= 100
  // rule: marginTarget >= 0 && marginTarget <= 100
  // rule: materialCost + laborCost + subcontractorCost <= projectRevenue
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Critical: Margin below 5% - project at risk
  // threshold skipped (non-JS): Warning: Margin below target
  // threshold skipped (non-JS): Warning: High contingency may indicate poor estimation

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedMargin; } catch { return marginPercent; } })();

  return {
    marginPercent,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report"],
  };
}
