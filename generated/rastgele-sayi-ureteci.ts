// Auto-generated from rastgele-sayi-ureteci-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RastgeleSayiUreteciInput {
  minValue: number;
  maxValue: number;
  count: number;
  distribution: 'uniform' | 'normal' | 'exponential';
  mean: number;
  stdDev: number;
  rate: number;
  seed: number;
  dataConfidence: number;
}

export const RastgeleSayiUreteciInputSchema = z.object({
  minValue: z.number().min(-1000000).max(1000000).default(0),
  maxValue: z.number().min(-1000000).max(1000000).default(100),
  count: z.number().min(1).max(10000).default(1),
  distribution: z.enum(['uniform', 'normal', 'exponential']).default('uniform'),
  mean: z.number().min(-1000000).max(1000000).default(50),
  stdDev: z.number().min(0.0001).max(1000000).default(10),
  rate: z.number().min(0.0001).max(1000000).default(0.1),
  seed: z.number().min(0).max(2147483647).default(42),
  dataConfidence: z.number().min(0).max(100).default(95),
});

export interface RastgeleSayiUreteciOutput {
  meanResult: number;
  breakdown: {
    mean: number;
    stdDev: number;
    min: number;
    max: number;
    count: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RastgeleSayiUreteciInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.boxMullerTransform = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.meanResult = ((): number => { try { const __v = randomNumbers.reduce((a,b) => a+b, 0) / input.count; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.stdDevResult = ((): number => { try { const __v = Math.Math.sqrt(randomNumbers.reduce((sum, x) => sum + (x - results.meanResult) ** 2, 0) / input.count); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.minResult = ((): number => { try { const __v = Math.Math.min(...randomNumbers); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maxResult = ((): number => { try { const __v = Math.Math.max(...randomNumbers); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.meanResult * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.generateRandomNumbers = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRastgeleSayiUreteci(input: RastgeleSayiUreteciInput): RastgeleSayiUreteciOutput {
  const results = evaluateFormulas(input);
  const meanResult = results.meanResult ?? 0;
  const breakdown = {
    mean: results.meanResult,
    stdDev: results.stdDevResult,
    min: results.minResult,
    max: results.maxResult,
    count: results.count,
  };

  // rule: minValue <= maxValue
  // rule: count >= 1
  // rule: if distribution == 'normal' then mean != null and stdDev > 0
  // rule: if distribution == 'exponential' then rate > 0
  // rule: seed >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek adet nedeniyle performans dusebilir.
  // threshold skipped (non-JS): Standart sapma cok yuksek, dagilim genis.
  // threshold skipped (non-JS): Veri guveni dusuk, sonuclar guvenilir olmayabilir.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return meanResult; } })();

  return {
    meanResult,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
