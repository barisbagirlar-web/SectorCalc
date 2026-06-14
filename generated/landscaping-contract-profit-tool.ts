// Auto-generated from landscaping-contract-profit-tool-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface LandscapingContractProfitToolInput {
  contractValue: number;
  materialCost: number;
  laborHours: number;
  hourlyRate: number;
  equipmentCost: number;
  subcontractorCost: number;
  overheadPercent: number;
  contingencyPercent: number;
  profitMarginTarget: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const LandscapingContractProfitToolInputSchema = z.object({
  contractValue: z.number().min(0).default(50000),
  materialCost: z.number().min(0).default(15000),
  laborHours: z.number().min(0).default(200),
  hourlyRate: z.number().min(0).default(35),
  equipmentCost: z.number().min(0).default(5000),
  subcontractorCost: z.number().min(0).default(0),
  overheadPercent: z.number().min(0).max(100).default(15),
  contingencyPercent: z.number().min(0).max(100).default(10),
  profitMarginTarget: z.number().min(0).max(100).default(20),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface LandscapingContractProfitToolOutput {
  profitMargin: number;
  breakdown: {
    totalDirectCost: number;
    overheadCost: number;
    contingencyCost: number;
    totalCost: number;
    profit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: LandscapingContractProfitToolInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalDirectCost = ((): number => { try { const __v = input.materialCost + (input.laborHours * input.hourlyRate) + input.equipmentCost + input.subcontractorCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.totalDirectCost * (input.overheadPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.contingencyCost = ((): number => { try { const __v = results.totalDirectCost * (input.contingencyPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDirectCost + results.overheadCost + results.contingencyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profit = ((): number => { try { const __v = input.contractValue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMargin = ((): number => { try { const __v = (results.profit / input.contractValue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isProfitable = ((): number => { try { const __v = results.profitMargin >= input.profitMarginTarget; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateLandscapingContractProfitTool(input: LandscapingContractProfitToolInput): LandscapingContractProfitToolOutput {
  const results = evaluateFormulas(input);
  const profitMargin = results.profitMargin ?? 0;
  const breakdown = {
    totalDirectCost: results.totalDirectCost,
    overheadCost: results.overheadCost,
    contingencyCost: results.contingencyCost,
    totalCost: results.totalCost,
    profit: results.profit,
  };

  // rule: materialCost >= 0
  // rule: laborHours >= 0
  // rule: hourlyRate >= 0
  // rule: equipmentCost >= 0
  // rule: subcontractorCost >= 0
  // rule: overheadPercent >= 0 && overheadPercent <= 100
  // rule: contingencyPercent >= 0 && contingencyPercent <= 100
  // rule: profitMarginTarget >= 0 && profitMarginTarget <= 100
  // rule: contractValue > 0
  // rule: if dataConfidence == 'low' then contingencyPercent >= 10
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if profitMargin < 10 then 'Low profit margin warning'
  // threshold skipped (non-JS): if overheadPercent > 25 then 'High overhead warning'
  // threshold skipped (non-JS): if contingencyPercent < 5 then 'Low contingency warning'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return profitMargin; } })();

  return {
    profitMargin,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
