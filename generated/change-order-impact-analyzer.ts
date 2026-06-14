// Auto-generated from change-order-impact-analyzer-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ChangeOrderImpactAnalyzerInput {
  changeOrderCount: number;
  averageCostPerChangeOrder: number;
  scheduleDelayPerChangeOrder: number;
  dailyPenaltyRate: number;
  reworkLaborRate: number;
  reworkHoursPerChangeOrder: number;
  materialWastePercentage: number;
  totalMaterialCost: number;
  overheadRate: number;
  dataConfidence: number;
}

export const ChangeOrderImpactAnalyzerInputSchema = z.object({
  changeOrderCount: z.number().min(0).default(0),
  averageCostPerChangeOrder: z.number().min(0).default(5000),
  scheduleDelayPerChangeOrder: z.number().min(0).default(5),
  dailyPenaltyRate: z.number().min(0).default(1000),
  reworkLaborRate: z.number().min(0).default(75),
  reworkHoursPerChangeOrder: z.number().min(0).default(40),
  materialWastePercentage: z.number().min(0).max(100).default(5),
  totalMaterialCost: z.number().min(0).default(100000),
  overheadRate: z.number().min(0).max(100).default(20),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface ChangeOrderImpactAnalyzerOutput {
  totalImpact: number;
  breakdown: {
    directCost: number;
    reworkCost: number;
    materialWasteCost: number;
    penaltyCost: number;
    overheadCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ChangeOrderImpactAnalyzerInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.directCost = ((): number => { try { const __v = input.changeOrderCount * input.averageCostPerChangeOrder; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkCost = ((): number => { try { const __v = input.changeOrderCount * input.reworkHoursPerChangeOrder * input.reworkLaborRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialWasteCost = ((): number => { try { const __v = input.totalMaterialCost * (input.materialWastePercentage / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.penaltyCost = ((): number => { try { const __v = input.changeOrderCount * input.scheduleDelayPerChangeOrder * input.dailyPenaltyRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = (results.directCost + results.reworkCost + results.materialWasteCost + results.penaltyCost) * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalImpact = ((): number => { try { const __v = results.directCost + results.reworkCost + results.materialWasteCost + results.penaltyCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalImpact * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateChangeOrderImpactAnalyzer(input: ChangeOrderImpactAnalyzerInput): ChangeOrderImpactAnalyzerOutput {
  const results = evaluateFormulas(input);
  const totalImpact = results.totalImpact ?? 0;
  const breakdown = {
    directCost: results.directCost,
    reworkCost: results.reworkCost,
    materialWasteCost: results.materialWasteCost,
    penaltyCost: results.penaltyCost,
    overheadCost: results.overheadCost,
  };

  // rule: changeOrderCount >= 0
  // rule: averageCostPerChangeOrder >= 0
  // rule: scheduleDelayPerChangeOrder >= 0
  // rule: dailyPenaltyRate >= 0
  // rule: reworkLaborRate >= 0
  // rule: reworkHoursPerChangeOrder >= 0
  // rule: materialWastePercentage >= 0 and <= 100
  // rule: totalMaterialCost >= 0
  // rule: overheadRate >= 0 and <= 100
  // rule: dataConfidence >= 0 and <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if totalImpact > 0.1 * totalMaterialCost then 'High impact: change order costs exceed 10% of material budget'
  // threshold skipped (non-JS): if scheduleDelayPerChangeOrder * changeOrderCount > 30 then 'Critical: total delay exceeds 30 days'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalImpact; } })();

  return {
    totalImpact,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over multiple projects","Benchmarking against industry standards","Detailed breakdown report with charts"],
  };
}
