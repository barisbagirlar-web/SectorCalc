// Auto-generated from painting-job-profit-verdict-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PaintingJobProfitVerdictInput {
  jobRevenue: number;
  materialCost: number;
  laborHours: number;
  hourlyRate: number;
  equipmentCost: number;
  overheadPercent: number;
  defectRate: number;
  reworkCostPerUnit: number;
  area: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PaintingJobProfitVerdictInputSchema = z.object({
  jobRevenue: z.number().min(0).default(0),
  materialCost: z.number().min(0).default(0),
  laborHours: z.number().min(0).default(0),
  hourlyRate: z.number().min(0).default(25),
  equipmentCost: z.number().min(0).default(0),
  overheadPercent: z.number().min(0).max(100).default(15),
  defectRate: z.number().min(0).max(100).default(2),
  reworkCostPerUnit: z.number().min(0).default(0.5),
  area: z.number().min(0).default(1000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PaintingJobProfitVerdictOutput {
  profitMargin: number;
  breakdown: {
    directLaborCost: number;
    directCost: number;
    overheadCost: number;
    totalCostBeforeRework: number;
    reworkCost: number;
    totalCost: number;
    profit: number;
    profitMargin: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PaintingJobProfitVerdictInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.directLaborCost = ((): number => { try { const __v = input.laborHours * input.hourlyRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directCost = ((): number => { try { const __v = input.materialCost + results.directLaborCost + input.equipmentCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.directCost * (input.overheadPercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostBeforeRework = ((): number => { try { const __v = results.directCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkCost = ((): number => { try { const __v = input.area * (input.defectRate / 100) * input.reworkCostPerUnit; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalCostBeforeRework + results.reworkCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profit = ((): number => { try { const __v = input.jobRevenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitMargin = ((): number => { try { const __v = (results.profit / input.jobRevenue) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustment = ((): number => { try { const __v = input.dataConfidence == 'low' ? 0.9 : (input.dataConfidence == 'medium' ? 1.0 : 1.05); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedProfit = ((): number => { try { const __v = results.profit * results.dataConfidenceAdjustment; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePaintingJobProfitVerdict(input: PaintingJobProfitVerdictInput): PaintingJobProfitVerdictOutput {
  const results = evaluateFormulas(input);
  const profitMargin = results.profitMargin ?? 0;
  const breakdown = {
    directLaborCost: results.directLaborCost,
    directCost: results.directCost,
    overheadCost: results.overheadCost,
    totalCostBeforeRework: results.totalCostBeforeRework,
    reworkCost: results.reworkCost,
    totalCost: results.totalCost,
    profit: results.profit,
    profitMargin: results.profitMargin,
  };

  // rule: jobRevenue >= 0
  // rule: materialCost >= 0
  // rule: laborHours >= 0
  // rule: hourlyRate > 0
  // rule: equipmentCost >= 0
  // rule: overheadPercent >= 0 and overheadPercent <= 100
  // rule: defectRate >= 0 and defectRate <= 100
  // rule: reworkCostPerUnit >= 0
  // rule: area > 0
  // rule: if defectRate > 0 then reworkCostPerUnit > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): defectRate > 5 -> 'High defect rate: consider process improvement'
  // threshold skipped (non-JS): profitMargin < 10 -> 'Low profit margin: review costs or pricing'
  // threshold skipped (non-JS): overheadPercent > 20 -> 'Overhead above typical range: investigate indirect costs'

  const dataConfidenceAdjusted = (() => { try { return results.adjustedProfit; } catch { return profitMargin; } })();

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
