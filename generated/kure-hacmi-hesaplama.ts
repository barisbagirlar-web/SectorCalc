// Auto-generated from kure-hacmi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KureHacmiHesaplamaInput {
  yaricap: number;
  birim: 'm³' | 'cm³' | 'L' | 'ft³';
}

export const KureHacmiHesaplamaInputSchema = z.object({
  yaricap: z.number().min(0).default(1),
  birim: z.enum(['m³', 'cm³', 'L', 'ft³']).default('m³'),
});

export interface KureHacmiHesaplamaOutput {
  sonuc: number;
  breakdown: {
    hacimM3: number;
    hacimCm3: number;
    hacimL: number;
    hacimFt3: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KureHacmiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.hacimM3 = ((): number => { try { const __v = 4/3 * Math.PI * Math.Math.pow(input.yaricap, 3); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hacimCm3 = ((): number => { try { const __v = results.hacimM3 * 1e6; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hacimL = ((): number => { try { const __v = results.hacimM3 * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hacimFt3 = ((): number => { try { const __v = results.hacimM3 * 35.3147; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sonuc = ((): number => { try { const __v = input.birim === 'm³' ? results.hacimM3 : input.birim === 'cm³' ? results.hacimCm3 : input.birim === 'L' ? results.hacimL : results.hacimFt3; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKureHacmiHesaplama(input: KureHacmiHesaplamaInput): KureHacmiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const sonuc = results.sonuc ?? 0;
  const breakdown = {
    hacimM3: results.hacimM3,
    hacimCm3: results.hacimCm3,
    hacimL: results.hacimL,
    hacimFt3: results.hacimFt3,
  };

  // rule: yaricap > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.yaricap <= 0.01) hiddenLossDrivers.push("yaricap");

  const dataConfidenceAdjusted = (() => { try { return results.sonuc; } catch { return sonuc; } })();

  return {
    sonuc,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (zaman serisi)","Karsilastirma (farkli kureler)","Detayli rapor (belirsizlik analizi)"],
  };
}
