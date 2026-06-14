// Auto-generated from kritik-yol-cpm-gecikme-cezasi-ve-hizlandirma-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInput {
  projectDuration: number;
  criticalPathDuration: number;
  delayDays: number;
  penaltyPerDay: number;
  crashCostPerDay: number;
  maxCrashDays: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInputSchema = z.object({
  projectDuration: z.number().min(1).max(10000).default(100),
  criticalPathDuration: z.number().min(1).max(10000).default(80),
  delayDays: z.number().min(0).max(1000).default(10),
  penaltyPerDay: z.number().min(0).max(1000000).default(1000),
  crashCostPerDay: z.number().min(0).max(1000000).default(1500),
  maxCrashDays: z.number().min(0).max(1000).default(5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorOutput {
  totalCost: number;
  breakdown: {
    totalPenalty: number;
    crashCost: number;
    remainingPenalty: number;
    savings: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalPenalty = ((): number => { try { const __v = input.delayDays * input.penaltyPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.crashDays = ((): number => { try { const __v = Math.min(input.delayDays, input.maxCrashDays); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.crashCost = ((): number => { try { const __v = results.crashDays * input.crashCostPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.remainingDelay = ((): number => { try { const __v = input.delayDays - results.crashDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.remainingPenalty = ((): number => { try { const __v = results.remainingDelay * input.penaltyPerDay; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.crashCost + results.remainingPenalty; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.savings = ((): number => { try { const __v = results.totalPenalty - results.totalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.savings * (input.dataConfidence == 'high' ? 1.0 : (input.dataConfidence == 'medium' ? 0.9 : 0.8)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculator(input: KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorInput): KritikYolCpmGecikmeCezasiVeHizlandirmaOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    totalPenalty: results.totalPenalty,
    crashCost: results.crashCost,
    remainingPenalty: results.remainingPenalty,
    savings: results.savings,
  };

  // rule: criticalPathDuration <= projectDuration
  // rule: delayDays >= 0
  // rule: penaltyPerDay >= 0
  // rule: crashCostPerDay >= 0
  // rule: maxCrashDays >= 0
  // rule: maxCrashDays <= criticalPathDuration
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Proje gecikmis durumda. Hizlandirma optimizasyonu yapilmali.
  // threshold skipped (non-JS): Hizlandirma maliyeti cezadan yuksek, hizlandirma ekonomik degil.
  // threshold skipped (non-JS): Maksimum hizlandirma gunu gecikmeyi tamamen kapatamiyor.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
