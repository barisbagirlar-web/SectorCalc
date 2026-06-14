// Auto-generated from agirlikli-ortalama-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AgirlikliOrtalamaHesaplamaInput {
  values: number;
  weights: number;
}

export const AgirlikliOrtalamaHesaplamaInputSchema = z.object({
  values: z.number().default(null),
  weights: z.number().min(0).default(null),
});

export interface AgirlikliOrtalamaHesaplamaOutput {
  weightedAverage: number;
  breakdown: {
    weightedSum: number;
    totalWeight: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AgirlikliOrtalamaHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.weightedAverage = sum(input.values[i] * input.weights[i]) / sum(input.weights);
  return results;
}

export function calculateAgirlikliOrtalamaHesaplama(input: AgirlikliOrtalamaHesaplamaInput): AgirlikliOrtalamaHesaplamaOutput {
  const results = evaluateFormulas(input);
  const weightedAverage = results.weightedAverage;
  const breakdown = {
    weightedSum: results.weightedSum,
    totalWeight: results.totalWeight,
  };

  // rule: values ve weights dizileri aynı uzunlukta olmalıdır.
  // rule: Tüm ağırlıklar pozitif olmalıdır.
  // rule: Toplam ağırlık sıfırdan büyük olmalıdır.
  // rule: Tüm değerler sayısal olmalıdır.
  // threshold totalWeightZero: Toplam ağırlık sıfır ise hesaplama yapılamaz.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted = results.weightedAverage;

  return {
    weightedAverage,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF/CSV export","Detaylı rapor","Trend analizi"],
  };
}
