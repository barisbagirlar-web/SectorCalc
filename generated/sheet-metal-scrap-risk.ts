// Auto-generated from sheet-metal-scrap-risk-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SheetMetalScrapRiskInput {
  materialCostPerKg: number;
  scrapRate: number;
  productionVolume: number;
  partWeight: number;
  laborCostPerHour: number;
  cycleTimePerPart: number;
  disposalCostPerKg: number;
  reworkRate: number;
  reworkCostPerPart: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const SheetMetalScrapRiskInputSchema = z.object({
  materialCostPerKg: z.number().min(0).max(100).default(2.5),
  scrapRate: z.number().min(0).max(100).default(15),
  productionVolume: z.number().min(0).max(10000000).default(100000),
  partWeight: z.number().min(0).max(100).default(0.5),
  laborCostPerHour: z.number().min(0).max(200).default(25),
  cycleTimePerPart: z.number().min(0).max(60).default(2),
  disposalCostPerKg: z.number().min(0).max(10).default(0.1),
  reworkRate: z.number().min(0).max(100).default(5),
  reworkCostPerPart: z.number().min(0).max(100).default(1),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface SheetMetalScrapRiskOutput {
  totalScrapRisk: number;
  breakdown: {
    materialScrapCost: number;
    disposalCost: number;
    laborScrapCost: number;
    reworkCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SheetMetalScrapRiskInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualScrapWeight = ((): number => { try { const __v = input.productionVolume * input.partWeight * (input.scrapRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualReworkParts = ((): number => { try { const __v = input.productionVolume * (input.reworkRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialScrapCost = ((): number => { try { const __v = results.annualScrapWeight * input.materialCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.disposalCost = ((): number => { try { const __v = results.annualScrapWeight * input.disposalCostPerKg; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborScrapCost = ((): number => { try { const __v = results.annualScrapWeight * (input.cycleTimePerPart / 60) * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkCost = ((): number => { try { const __v = results.annualReworkParts * input.reworkCostPerPart; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalScrapRisk = ((): number => { try { const __v = results.materialScrapCost + results.disposalCost + results.laborScrapCost + results.reworkCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalScrapRisk * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSheetMetalScrapRisk(input: SheetMetalScrapRiskInput): SheetMetalScrapRiskOutput {
  const results = evaluateFormulas(input);
  const totalScrapRisk = results.totalScrapRisk ?? 0;
  const breakdown = {
    materialScrapCost: results.materialScrapCost,
    disposalCost: results.disposalCost,
    laborScrapCost: results.laborScrapCost,
    reworkCost: results.reworkCost,
  };

  // rule: scrapRate >= 0 AND scrapRate <= 100
  // rule: reworkRate >= 0 AND reworkRate <= 100
  // rule: materialCostPerKg > 0
  // rule: productionVolume > 0
  // rule: partWeight > 0
  // rule: cycleTimePerPart > 0
  // rule: laborCostPerHour > 0
  // rule: disposalCostPerKg >= 0
  // rule: reworkCostPerPart >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High scrap rate warning: consider process improvement.
  // threshold skipped (non-JS): High rework rate warning: investigate root causes.
  // threshold skipped (non-JS): Material cost above typical range; review supplier pricing.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalScrapRisk; } })();

  return {
    totalScrapRisk,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Benchmark Comparison","Detailed Report with Charts"],
  };
}
