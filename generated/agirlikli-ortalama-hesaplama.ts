// Auto-generated from agirlikli-ortalama-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AgirlikliOrtalamaHesaplamaInput {
  values: number;
  weights: number;
  dataConfidence: number;
}

export const AgirlikliOrtalamaHesaplamaInputSchema = z.object({
  values: z.number().default(0),
  weights: z.number().min(0).default(0),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface AgirlikliOrtalamaHesaplamaOutput {
  weightedAverage: number;
  breakdown: {
    weightedSum: number;
    totalWeight: number;
    normalizedWeights: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AgirlikliOrtalamaHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.weightedAverage = ((): number => { try { const __v = sum(input.values[i] * input.weights[i]) / sum(input.weights); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.normalizedWeights = ((): number => { try { const __v = input.weights / sum(input.weights); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.weightedAverage * (input.dataConfidence / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateAgirlikliOrtalamaHesaplama(input: AgirlikliOrtalamaHesaplamaInput): AgirlikliOrtalamaHesaplamaOutput {
  const results = evaluateFormulas(input);
  const weightedAverage = results.weightedAverage ?? 0;
  const breakdown = {
    weightedSum: results.weightedSum,
    totalWeight: results.totalWeight,
    normalizedWeights: results.normalizedWeights,
  };

  // rule: weights dizisindeki tum degerler >= 0 olmalidir.
  // rule: values ve weights dizileri ayni uzunlukta olmalidir.
  // rule: weights toplami > 0 olmalidir.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk veri guveni: sonuclar yaniltici olabilir.
  // threshold skipped (non-JS): Agirliklar toplami 1 veya 100 degil, normalizasyon uygulanacak.

  const dataConfidenceAdjusted = (() => { try { return results.weightedAverage * (input.dataConfidence / 100); } catch { return weightedAverage; } })();

  return {
    weightedAverage,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
