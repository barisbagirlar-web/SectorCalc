// Auto-generated from cpk-ppk-hata-maliyeti-ppm-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CpkPpkHataMaliyetiPpmCalculatorInput {
  usl: number;
  lsl: number;
  mean: number;
  stdDev: number;
  annualProductionVolume: number;
  costPerDefect: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const CpkPpkHataMaliyetiPpmCalculatorInputSchema = z.object({
  usl: z.number().min(0).default(10),
  lsl: z.number().min(0).default(0),
  mean: z.number().default(5),
  stdDev: z.number().min(0).default(1),
  annualProductionVolume: z.number().min(0).default(100000),
  costPerDefect: z.number().min(0).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface CpkPpkHataMaliyetiPpmCalculatorOutput {
  hataMaliyeti: number;
  breakdown: {
    cp: number;
    cpk: number;
    pp: number;
    ppk: number;
    ppm: number;
    hataMaliyeti: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CpkPpkHataMaliyetiPpmCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.cp = ((): number => { try { const __v = (input.usl - input.lsl) / (6 * input.stdDev); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cpk = ((): number => { try { const __v = Math.min((input.usl - input.mean) / (3 * input.stdDev), (input.mean - input.lsl) / (3 * input.stdDev)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.pp = ((): number => { try { const __v = (input.usl - input.lsl) / (6 * input.stdDev); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ppk = ((): number => { try { const __v = Math.min((input.usl - input.mean) / (3 * input.stdDev), (input.mean - input.lsl) / (3 * input.stdDev)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ppm = ((): number => { try { const __v = (1 - (cdfNormal(input.usl, input.mean, input.stdDev) - cdfNormal(input.lsl, input.mean, input.stdDev))) * 1e6; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hataMaliyeti = ((): number => { try { const __v = results.ppm / 1e6 * input.annualProductionVolume * input.costPerDefect; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.hataMaliyeti * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateCpkPpkHataMaliyetiPpmCalculator(input: CpkPpkHataMaliyetiPpmCalculatorInput): CpkPpkHataMaliyetiPpmCalculatorOutput {
  const results = evaluateFormulas(input);
  const hataMaliyeti = results.hataMaliyeti ?? 0;
  const breakdown = {
    cp: results.cp,
    cpk: results.cpk,
    pp: results.pp,
    ppk: results.ppk,
    ppm: results.ppm,
    hataMaliyeti: results.hataMaliyeti,
  };

  // rule: usl > lsl
  // rule: stdDev > 0
  // rule: annualProductionVolume >= 0
  // rule: costPerDefect >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Surec yetersiz, iyilestirme gerekli
  // threshold skipped (non-JS): Uzun donem performans yetersiz
  // threshold skipped (non-JS): Yuksek hata orani, acil aksiyon
  // threshold skipped (non-JS): Yuksek maliyet, oncelikli iyilestirme

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return hataMaliyeti; } })();

  return {
    hataMaliyeti,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (benchmark)","Detayli rapor"],
  };
}
