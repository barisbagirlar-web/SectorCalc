// Auto-generated from prefabrik-konteyner-ofis-m-maliyeti-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PrefabrikKonteynerOfisMMaliyetiInput {
  konteynerBoyutu: number;
  birimMaliyet: number;
  ekipmanMaliyeti: number;
  nakliyeMaliyeti: number;
  montajMaliyeti: number;
  ekstraDonanim: number;
  iskontoOrani: number;
}

export const PrefabrikKonteynerOfisMMaliyetiInputSchema = z.object({
  konteynerBoyutu: z.number().min(10).max(100).default(20),
  birimMaliyet: z.number().min(2000).max(15000).default(5000),
  ekipmanMaliyeti: z.number().min(0).max(50000).default(10000),
  nakliyeMaliyeti: z.number().min(0).max(20000).default(5000),
  montajMaliyeti: z.number().min(0).max(10000).default(3000),
  ekstraDonanim: z.number().min(0).max(20000).default(2000),
  iskontoOrani: z.number().min(0).max(30).default(0),
});

export interface PrefabrikKonteynerOfisMMaliyetiOutput {
  toplamMaliyet: number;
  breakdown: {
    konteynerMaliyeti: number;
    ekipmanMaliyeti: number;
    nakliyeMaliyeti: number;
    montajMaliyeti: number;
    ekstraDonanim: number;
    iskontoTutari: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PrefabrikKonteynerOfisMMaliyetiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.toplamMaliyet = ((): number => { try { const __v = ((input.konteynerBoyutu * input.birimMaliyet) + input.ekipmanMaliyeti + input.nakliyeMaliyeti + input.montajMaliyeti + input.ekstraDonanim) * (1 - input.iskontoOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.birimMetrekareMaliyeti = ((): number => { try { const __v = results.toplamMaliyet / input.konteynerBoyutu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePrefabrikKonteynerOfisMMaliyeti(input: PrefabrikKonteynerOfisMMaliyetiInput): PrefabrikKonteynerOfisMMaliyetiOutput {
  const results = evaluateFormulas(input);
  const toplamMaliyet = results.toplamMaliyet ?? 0;
  const breakdown = {
    konteynerMaliyeti: results.konteynerMaliyeti,
    ekipmanMaliyeti: results.ekipmanMaliyeti,
    nakliyeMaliyeti: results.nakliyeMaliyeti,
    montajMaliyeti: results.montajMaliyeti,
    ekstraDonanim: results.ekstraDonanim,
    iskontoTutari: results.iskontoTutari,
  };

  // rule: konteynerBoyutu >= 10 ve <= 100
  // rule: birimMaliyet >= 2000 ve <= 15000
  // rule: ekipmanMaliyeti >= 0
  // rule: nakliyeMaliyeti >= 0
  // rule: montajMaliyeti >= 0
  // rule: ekstraDonanim >= 0
  // rule: iskontoOrani >= 0 ve <= 30
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Birim maliyet yuksek, alternatif tedarikciler degerlendirilmeli.
  // threshold skipped (non-JS): Toplam maliyet butceyi asabilir, gozden gecirin.

  const dataConfidenceAdjusted = (() => { try { return results.toplamMaliyet * 1.1; } catch { return toplamMaliyet; } })();

  return {
    toplamMaliyet,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
