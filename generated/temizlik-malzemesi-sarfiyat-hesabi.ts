// Auto-generated from temizlik-malzemesi-sarfiyat-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TemizlikMalzemesiSarfiyatHesabiInput {
  alan: number;
  temizlikSikligi: number;
  urunTipi: 'genel' | 'dezenfektan' | 'cam' | 'hali';
  birimSarfiyat: number;
  calismaGunu: number;
  birimFiyat: number;
  israfOrani: number;
}

export const TemizlikMalzemesiSarfiyatHesabiInputSchema = z.object({
  alan: z.number().min(1).max(100000).default(100),
  temizlikSikligi: z.number().min(0.5).max(10).default(1),
  urunTipi: z.enum(['genel', 'dezenfektan', 'cam', 'hali']).default('genel'),
  birimSarfiyat: z.number().min(1).max(100).default(10),
  calismaGunu: z.number().min(1).max(31).default(22),
  birimFiyat: z.number().min(0.001).max(10).default(0.05),
  israfOrani: z.number().min(0).max(50).default(5),
});

export interface TemizlikMalzemesiSarfiyatHesabiOutput {
  yillikMaliyet: number;
  breakdown: {
    aylikSarfiyatMl: number;
    aylikMaliyet: number;
    yillikMaliyet: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TemizlikMalzemesiSarfiyatHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.aylikSarfiyatMl = ((): number => { try { const __v = input.alan * input.temizlikSikligi * input.birimSarfiyat * input.calismaGunu * (1 + input.israfOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikMaliyet = ((): number => { try { const __v = results.aylikSarfiyatMl * input.birimFiyat; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikMaliyet = ((): number => { try { const __v = results.aylikMaliyet * 12; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTemizlikMalzemesiSarfiyatHesabi(input: TemizlikMalzemesiSarfiyatHesabiInput): TemizlikMalzemesiSarfiyatHesabiOutput {
  const results = evaluateFormulas(input);
  const yillikMaliyet = results.yillikMaliyet ?? 0;
  const breakdown = {
    aylikSarfiyatMl: results.aylikSarfiyatMl,
    aylikMaliyet: results.aylikMaliyet,
    yillikMaliyet: results.yillikMaliyet,
  };

  // rule: alan > 0
  // rule: temizlikSikligi > 0
  // rule: birimSarfiyat > 0
  // rule: calismaGunu >= 1 && calismaGunu <= 31
  // rule: birimFiyat > 0
  // rule: israfOrani >= 0 && israfOrani <= 50
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yuksek israf orani, surec iyilestirme onerilir.
  // threshold skipped (non-JS): Birim sarfiyat cok yuksek, urun degisikligi dusunulmeli.

  const dataConfidenceAdjusted = (() => { try { return yillikMaliyet; } catch { return yillikMaliyet; } })();

  return {
    yillikMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (farkli senaryolar)","Detayli rapor"],
  };
}
