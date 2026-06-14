// Auto-generated from yangin-tupu-dolap-debisi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface YanginTupuDolapDebisiHesaplamaInput {
  boruCapi: number;
  basinc: number;
  akisKatsayisi: number;
  dolapSayisi: number;
}

export const YanginTupuDolapDebisiHesaplamaInputSchema = z.object({
  boruCapi: z.number().min(20).max(200).default(50),
  basinc: z.number().min(2).max(12).default(6),
  akisKatsayisi: z.number().min(0.5).max(1).default(0.8),
  dolapSayisi: z.number().min(1).max(100).default(1),
});

export interface YanginTupuDolapDebisiHesaplamaOutput {
  toplamDebi: number;
  breakdown: {
    kesitAlani: number;
    hiz: number;
    debi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: YanginTupuDolapDebisiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kesitAlani = ((): number => { try { const __v = Math.PI * Math.Math.pow(input.boruCapi / 1000, 2) / 4; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hiz = ((): number => { try { const __v = input.akisKatsayisi * Math.Math.sqrt(2 * input.basinc * 1e5 / 1000); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.debi = ((): number => { try { const __v = results.kesitAlani * results.hiz * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamDebi = ((): number => { try { const __v = results.debi * input.dolapSayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateYanginTupuDolapDebisiHesaplama(input: YanginTupuDolapDebisiHesaplamaInput): YanginTupuDolapDebisiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const toplamDebi = results.toplamDebi ?? 0;
  const breakdown = {
    kesitAlani: results.kesitAlani,
    hiz: results.hiz,
    debi: results.debi,
  };

  // rule: boruCapi >= 20 && boruCapi <= 200
  // rule: basinc >= 2 && basinc <= 12
  // rule: akisKatsayisi >= 0.5 && akisKatsayisi <= 1
  // rule: dolapSayisi >= 1 && dolapSayisi <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Boru capi cok kucuk, yetersiz debi riski
  // threshold skipped (non-JS): Basinc dusuk, yangin sondurme performansi dusebilir
  // threshold skipped (non-JS): Akis katsayisi dusuk, boru ic yuzeyi puruzlu olabilir

  const dataConfidenceAdjusted = (() => { try { return results.toplamDebi * (1 - (1 - input.akisKatsayisi) * 0.1); } catch { return toplamDebi; } })();

  return {
    toplamDebi,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
