// Auto-generated from koni-hacmi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KoniHacmiHesaplamaInput {
  yaricap: number;
  yukseklik: number;
  birim: 'm3' | 'cm3' | 'litre';
}

export const KoniHacmiHesaplamaInputSchema = z.object({
  yaricap: z.number().min(0).default(1),
  yukseklik: z.number().min(0).default(1),
  birim: z.enum(['m3', 'cm3', 'litre']).default('m3'),
});

export interface KoniHacmiHesaplamaOutput {
  sonuc: number;
  breakdown: {
    hacimM3: number;
    hacimCm3: number;
    hacimLitre: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KoniHacmiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.hacimM3 = ((): number => { try { const __v = (1/3) * Math.PI * input.yaricap * input.yaricap * input.yukseklik; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hacimCm3 = ((): number => { try { const __v = results.hacimM3 * 1000000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hacimLitre = ((): number => { try { const __v = results.hacimM3 * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sonuc = ((): number => { try { const __v = input.birim === 'm3' ? results.hacimM3 : (input.birim === 'cm3' ? results.hacimCm3 : results.hacimLitre); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKoniHacmiHesaplama(input: KoniHacmiHesaplamaInput): KoniHacmiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const sonuc = results.sonuc ?? 0;
  const breakdown = {
    hacimM3: results.hacimM3,
    hacimCm3: results.hacimCm3,
    hacimLitre: results.hacimLitre,
  };

  // rule: yaricap > 0
  // rule: yukseklik > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];


  const dataConfidenceAdjusted = (() => { try { return results.sonuc; } catch { return sonuc; } })();

  return {
    sonuc,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison"],
  };
}
