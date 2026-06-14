// Auto-generated from oto-servis-is-emri-ve-yedek-parca-teklif-tutarlilik-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInput {
  isEmriSayisi: number;
  tamamlananIsEmriSayisi: number;
  toplamTeklifTutari: number;
  onaylananTeklifTutari: number;
  yedekParcaMaliyeti: number;
  iscilikSaatUcreti: number;
  toplamIscilikSaati: number;
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInputSchema = z.object({
  isEmriSayisi: z.number().min(1).max(10000).default(100),
  tamamlananIsEmriSayisi: z.number().min(0).max(10000).default(90),
  toplamTeklifTutari: z.number().min(0).max(10000000).default(50000),
  onaylananTeklifTutari: z.number().min(0).max(10000000).default(40000),
  yedekParcaMaliyeti: z.number().min(0).max(10000000).default(20000),
  iscilikSaatUcreti: z.number().min(0).max(1000).default(150),
  toplamIscilikSaati: z.number().min(0).max(10000).default(200),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorOutput {
  tutarlilikSkoru: number;
  breakdown: {
    isEmriTamamlanmaOrani: number;
    teklifKabulOrani: number;
    karMarji: number;
    kar: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.isEmriTamamlanmaOrani = ((): number => { try { const __v = input.tamamlananIsEmriSayisi / input.isEmriSayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.teklifKabulOrani = ((): number => { try { const __v = input.onaylananTeklifTutari / input.toplamTeklifTutari; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamGelir = ((): number => { try { const __v = input.onaylananTeklifTutari; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamMaliyet = ((): number => { try { const __v = input.yedekParcaMaliyeti + (input.iscilikSaatUcreti * input.toplamIscilikSaati); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kar = ((): number => { try { const __v = results.toplamGelir - results.toplamMaliyet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.karMarji = ((): number => { try { const __v = results.kar / results.toplamGelir; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.tutarlilikSkoru = ((): number => { try { const __v = (results.isEmriTamamlanmaOrani * 0.4 + results.teklifKabulOrani * 0.3 + results.karMarji * 0.3) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.tutarlilikSkoru * (input.dataConfidence === 'yuksek' ? 1.0 : input.dataConfidence === 'orta' ? 0.9 : 0.8); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateOtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculator(input: OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorInput): OtoServisIsEmriVeYedekParcaTeklifTutarlilikCalculatorOutput {
  const results = evaluateFormulas(input);
  const tutarlilikSkoru = results.tutarlilikSkoru ?? 0;
  const breakdown = {
    isEmriTamamlanmaOrani: results.isEmriTamamlanmaOrani,
    teklifKabulOrani: results.teklifKabulOrani,
    karMarji: results.karMarji,
    kar: results.kar,
  };

  // rule: tamamlananIsEmriSayisi <= isEmriSayisi
  // rule: onaylananTeklifTutari <= toplamTeklifTutari
  // rule: toplamIscilikSaati > 0
  // rule: iscilikSaatUcreti > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk is emri tamamlanma orani, operasyonel verimsizlik gostergesi
  // threshold skipped (non-JS): Dusuk teklif kabul orani, fiyatlandirma veya hizmet kalitesi sorunu
  // threshold skipped (non-JS): Dusuk kar marji, maliyet kontrolu veya fiyatlandirma revizyonu gerekli

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return tutarlilikSkoru; } })();

  return {
    tutarlilikSkoru,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (zaman serisi)","Karsilastirma (benchmark)","Detayli rapor (breakdown ve oneriler)"],
  };
}
