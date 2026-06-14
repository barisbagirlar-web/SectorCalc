// Auto-generated from zaman-etudu-ve-standart-sure-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ZamanEtuduVeStandartSureCalculatorInput {
  observedTime: number;
  performanceRating: number;
  allowancePercent: number;
  cycleCount: number;
  workMethod: 'manual' | 'semi-automatic' | 'automatic';
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ZamanEtuduVeStandartSureCalculatorInputSchema = z.object({
  observedTime: z.number().min(0).default(0),
  performanceRating: z.number().min(50).max(150).default(100),
  allowancePercent: z.number().min(0).max(50).default(15),
  cycleCount: z.number().min(1).max(1000).default(10),
  workMethod: z.enum(['manual', 'semi-automatic', 'automatic']).default('manual'),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ZamanEtuduVeStandartSureCalculatorOutput {
  adjustedStandardTime: number;
  breakdown: {
    normalTime: number;
    standardTime: number;
    totalObservedTime: number;
    averageObservedTime: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ZamanEtuduVeStandartSureCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.normalTime = ((): number => { try { const __v = input.observedTime * (input.performanceRating / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.standardTime = ((): number => { try { const __v = results.normalTime * (1 + input.allowancePercent / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalObservedTime = ((): number => { try { const __v = input.observedTime * input.cycleCount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.averageObservedTime = ((): number => { try { const __v = input.observedTime; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceFactor = ((): number => { try { const __v = input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedStandardTime = ((): number => { try { const __v = results.standardTime * results.dataConfidenceFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateZamanEtuduVeStandartSureCalculator(input: ZamanEtuduVeStandartSureCalculatorInput): ZamanEtuduVeStandartSureCalculatorOutput {
  const results = evaluateFormulas(input);
  const adjustedStandardTime = results.adjustedStandardTime ?? 0;
  const breakdown = {
    normalTime: results.normalTime,
    standardTime: results.standardTime,
    totalObservedTime: results.totalObservedTime,
    averageObservedTime: results.averageObservedTime,
  };

  // rule: observedTime >= 0
  // rule: performanceRating >= 50 && performanceRating <= 150
  // rule: allowancePercent >= 0 && allowancePercent <= 50
  // rule: cycleCount >= 1 && cycleCount <= 1000
  // rule: if workMethod == 'manual' then performanceRating >= 80 && performanceRating <= 120
  // rule: if workMethod == 'automatic' then allowancePercent <= 10
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): UYARI: Gozlemlenen sure 60 dakikadan fazla, islem uzun sureli olabilir.
  // threshold skipped (non-JS): KRITIK: Performans degerlendirme orani dusuk, egitim veya iyilestirme gerekebilir.
  // threshold skipped (non-JS): UYARI: Izin payi orani yuksek, is kosullari gozden gecirilmeli.
  // threshold skipped (non-JS): UYARI: Gozlem sayisi az, istatistiksel guvenilirlik dusuk olabilir.

  const dataConfidenceAdjusted = (() => { try { return results.adjustedStandardTime; } catch { return adjustedStandardTime; } })();

  return {
    adjustedStandardTime,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (birden fazla etudu karsilastirma)","Detayli rapor (grafiklerle)"],
  };
}
