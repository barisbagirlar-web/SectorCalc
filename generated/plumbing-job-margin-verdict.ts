// Auto-generated from plumbing-job-margin-verdict-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PlumbingJobMarginVerdictInput {
  jobRevenue: number;
  materialCost: number;
  laborHours: number;
  hourlyRate: number;
  overheadRate: number;
  equipmentCost: number;
  subcontractorCost: number;
  warrantyReserve: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PlumbingJobMarginVerdictInputSchema = z.object({
  jobRevenue: z.number().min(0).default(0),
  materialCost: z.number().min(0).default(0),
  laborHours: z.number().min(0).default(0),
  hourlyRate: z.number().min(0).default(50),
  overheadRate: z.number().min(0).max(100).default(20),
  equipmentCost: z.number().min(0).default(0),
  subcontractorCost: z.number().min(0).default(0),
  warrantyReserve: z.number().min(0).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PlumbingJobMarginVerdictOutput {
  marginPercent: number;
  breakdown: {
    totalCost: number;
    directLaborCost: number;
    overheadCost: number;
    grossProfit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PlumbingJobMarginVerdictInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.directLaborCost = ((): number => { try { const __v = input.laborHours * input.hourlyRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalDirectCost = ((): number => { try { const __v = input.materialCost + results.directLaborCost + input.equipmentCost + input.subcontractorCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.totalDirectCost * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalDirectCost + results.overheadCost + input.warrantyReserve; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.grossProfit = ((): number => { try { const __v = input.jobRevenue - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginPercent = ((): number => { try { const __v = input.jobRevenue > 0 ? (results.grossProfit / input.jobRevenue) * 100 : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedMargin = ((): number => { try { const __v = input.dataConfidence == 'high' ? results.marginPercent : (input.dataConfidence == 'medium' ? results.marginPercent * 0.95 : results.marginPercent * 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePlumbingJobMarginVerdict(input: PlumbingJobMarginVerdictInput): PlumbingJobMarginVerdictOutput {
  const results = evaluateFormulas(input);
  const marginPercent = results.marginPercent ?? 0;
  const breakdown = {
    totalCost: results.totalCost,
    directLaborCost: results.directLaborCost,
    overheadCost: results.overheadCost,
    grossProfit: results.grossProfit,
  };

  // rule: jobRevenue must be >= 0
  // rule: materialCost must be >= 0
  // rule: laborHours must be >= 0
  // rule: hourlyRate must be > 0
  // rule: overheadRate must be between 0 and 100
  // rule: equipmentCost must be >= 0
  // rule: subcontractorCost must be >= 0
  // rule: warrantyReserve must be >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): marginPercent

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
