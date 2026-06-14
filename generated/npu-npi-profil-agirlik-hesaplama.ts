// Auto-generated from npu-npi-profil-agirlik-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface NpuNpiProfilAgirlikHesaplamaInput {
  profilTipi: 'NPU' | 'NPI';
  profilBoyutu: '80' | '100' | '120' | '140' | '160' | '180' | '200' | '220' | '240' | '260' | '280' | '300';
  profilKalitesi: 'S235JR' | 'S275JR' | 'S355JR' | 'S420N' | 'S460N';
  profilUzunlugu: number;
  adet: number;
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const NpuNpiProfilAgirlikHesaplamaInputSchema = z.object({
  profilTipi: z.enum(['NPU', 'NPI']).default('NPU'),
  profilBoyutu: z.enum(['80', '100', '120', '140', '160', '180', '200', '220', '240', '260', '280', '300']).default('100'),
  profilKalitesi: z.enum(['S235JR', 'S275JR', 'S355JR', 'S420N', 'S460N']).default('S235JR'),
  profilUzunlugu: z.number().min(1).max(18).default(6),
  adet: z.number().min(1).max(10000).default(1),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('yuksek'),
});

export interface NpuNpiProfilAgirlikHesaplamaOutput {
  toplamAgirlik: number;
  breakdown: {
    birimAgirlik: number;
    kesitAlani: number;
    toplamAgirlik: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: NpuNpiProfilAgirlikHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kesitAlani = ((): number => { try { const __v = input.profilTipi == 'NPU' ? ((Number(input.profilBoyutu) || 0) * 0.1 + 0.5) : ((Number(input.profilBoyutu) || 0) * 0.12 + 0.6); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimAgirlik = ((): number => { try { const __v = results.kesitAlani * 7850 / 1000000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamAgirlik = ((): number => { try { const __v = results.birimAgirlik * input.profilUzunlugu * input.adet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = input.dataConfidence == 'dusuk' ? results.toplamAgirlik * 1.1 : (input.dataConfidence == 'orta' ? results.toplamAgirlik * 1.05 : results.toplamAgirlik); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateNpuNpiProfilAgirlikHesaplama(input: NpuNpiProfilAgirlikHesaplamaInput): NpuNpiProfilAgirlikHesaplamaOutput {
  const results = evaluateFormulas(input);
  const toplamAgirlik = results.toplamAgirlik ?? 0;
  const breakdown = {
    birimAgirlik: results.birimAgirlik,
    kesitAlani: results.kesitAlani,
    toplamAgirlik: results.toplamAgirlik,
  };

  // rule: profilUzunlugu >= 1 ve <= 18
  // rule: adet >= 1
  // rule: profilBoyutu secili olmali
  // rule: profilTipi secili olmali
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Uzun profil tasima ve isleme maliyetlerini artirabilir.
  // threshold skipped (non-JS): Toplu siparislerde indirim uygulanabilir.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return toplamAgirlik; } })();

  return {
    toplamAgirlik,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
