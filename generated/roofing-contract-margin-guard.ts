// Auto-generated from roofing-contract-margin-guard-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RoofingContractMarginGuardInput {
  contractValue: number;
  materialCost: number;
  laborCost: number;
  overheadPercent: number;
  contingencyPercent: number;
  marginTarget: number;
  dataConfidence: 'low' | 'medium' | 'high';
  roofArea: number;
  complexityFactor: 'low' | 'medium' | 'high';
}

export const RoofingContractMarginGuardInputSchema = z.object({
  contractValue: z.number().min(0).default(100000),
  materialCost: z.number().min(0).default(40000),
  laborCost: z.number().min(0).default(30000),
  overheadPercent: z.number().min(0).max(100).default(15),
  contingencyPercent: z.number().min(0).max(50).default(10),
  marginTarget: z.number().min(0).max(100).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
  roofArea: z.number().min(0).default(2000),
  complexityFactor: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface RoofingContractMarginGuardOutput {
  marginPercent: number;
  breakdown: {
    totalDirectCost: number;
    overheadCost: number;
    contingencyCost: number;
    totalCost: number;
    marginDollars: number;
    unitCostPerSqFt: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RoofingContractMarginGuardInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalDirectCost = ((): number => { try { const __v = input.materialCost + input.laborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.totalDirectCost * (input.overheadPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.contingencyCost = ((): number => { try { const __v = results.totalDirectCost * (input.contingencyPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDirectCost + results.overheadCost + results.contingencyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginPercent = ((): number => { try { const __v = ((input.contractValue - results.totalCost) / input.contractValue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginDollars = ((): number => { try { const __v = input.contractValue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.unitCostPerSqFt = ((): number => { try { const __v = results.totalCost / input.roofArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedMargin = ((): number => { try { const __v = results.marginPercent * (input.dataConfidence == 'high' ? 1.0 : input.dataConfidence == 'medium' ? 0.9 : 0.8); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRoofingContractMarginGuard(input: RoofingContractMarginGuardInput): RoofingContractMarginGuardOutput {
  const results = evaluateFormulas(input);
  const marginPercent = results.marginPercent ?? 0;
  const breakdown = {
    totalDirectCost: results.totalDirectCost,
    overheadCost: results.overheadCost,
    contingencyCost: results.contingencyCost,
    totalCost: results.totalCost,
    marginDollars: results.marginDollars,
    unitCostPerSqFt: results.unitCostPerSqFt,
  };

  // rule: contractValue > 0
  // rule: materialCost >= 0
  // rule: laborCost >= 0
  // rule: overheadPercent >= 0 && overheadPercent <= 100
  // rule: contingencyPercent >= 0 && contingencyPercent <= 50
  // rule: marginTarget >= 0 && marginTarget <= 100
  // rule: roofArea > 0
  // rule: if dataConfidence == 'low' then contingencyPercent >= 10
  // rule: if complexityFactor == 'high' then laborCost > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Warning: Margin below 10% - high risk of loss
  // threshold skipped (non-JS): Alert: Margin below target
  // threshold skipped (non-JS): Warning: High contingency indicates poor cost estimation

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedMargin; } catch { return marginPercent; } })();

  return {
    marginPercent,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
