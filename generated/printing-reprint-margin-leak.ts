// Auto-generated from printing-reprint-margin-leak-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PrintingReprintMarginLeakInput {
  totalPrintVolume: number;
  reprintVolume: number;
  unitPrice: number;
  unitCost: number;
  reprintCostFactor: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PrintingReprintMarginLeakInputSchema = z.object({
  totalPrintVolume: z.number().min(0).default(100000),
  reprintVolume: z.number().min(0).default(5000),
  unitPrice: z.number().min(0).default(10),
  unitCost: z.number().min(0).default(6),
  reprintCostFactor: z.number().min(1).max(3).default(1.5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PrintingReprintMarginLeakOutput {
  totalMarginLeak: number;
  breakdown: {
    reprintRate: number;
    originalMargin: number;
    reprintCost: number;
    reprintMargin: number;
    marginLeakPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PrintingReprintMarginLeakInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.reprintRate = ((): number => { try { const __v = input.reprintVolume / input.totalPrintVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.originalMargin = ((): number => { try { const __v = input.unitPrice - input.unitCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reprintCost = ((): number => { try { const __v = input.unitCost * input.reprintCostFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reprintMargin = ((): number => { try { const __v = input.unitPrice - results.reprintCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.marginLeakPerUnit = ((): number => { try { const __v = results.originalMargin - results.reprintMargin; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalMarginLeak = ((): number => { try { const __v = results.marginLeakPerUnit * input.reprintVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalMarginLeak * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePrintingReprintMarginLeak(input: PrintingReprintMarginLeakInput): PrintingReprintMarginLeakOutput {
  const results = evaluateFormulas(input);
  const totalMarginLeak = results.totalMarginLeak ?? 0;
  const breakdown = {
    reprintRate: results.reprintRate,
    originalMargin: results.originalMargin,
    reprintCost: results.reprintCost,
    reprintMargin: results.reprintMargin,
    marginLeakPerUnit: results.marginLeakPerUnit,
  };

  // rule: reprintVolume <= totalPrintVolume
  // rule: unitCost > 0
  // rule: unitPrice > 0
  // rule: reprintCostFactor >= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): 0.05
  // threshold skipped (non-JS): 0.1

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalMarginLeak; } })();

  return {
    totalMarginLeak,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmark comparison with industry standards","Detailed breakdown report with visualizations"],
  };
}
