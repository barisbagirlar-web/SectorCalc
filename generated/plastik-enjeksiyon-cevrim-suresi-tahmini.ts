// Auto-generated from plastik-enjeksiyon-cevrim-suresi-tahmini-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PlastikEnjeksiyonCevrimSuresiTahminiInput {
  enjeksiyonSuresi: number;
  sogutmaSuresi: number;
  kalipAcmaKapamaSuresi: number;
  parcaCikarmaSuresi: number;
  beklemeSuresi: number;
  calismaSuresi: number;
  durusSuresi: number;
  kaviteSayisi: number;
  fireOrani: number;
  makineKullanimOrani: number;
}

export const PlastikEnjeksiyonCevrimSuresiTahminiInputSchema = z.object({
  enjeksiyonSuresi: z.number().min(0.1).max(60).default(2),
  sogutmaSuresi: z.number().min(1).max(120).default(10),
  kalipAcmaKapamaSuresi: z.number().min(0.5).max(30).default(3),
  parcaCikarmaSuresi: z.number().min(0.5).max(20).default(2),
  beklemeSuresi: z.number().min(0).max(30).default(1),
  calismaSuresi: z.number().min(1).max(24).default(8),
  durusSuresi: z.number().min(0).max(8).default(0.5),
  kaviteSayisi: z.number().min(1).max(128).default(1),
  fireOrani: z.number().min(0).max(100).default(2),
  makineKullanimOrani: z.number().min(0).max(100).default(85),
});

export interface PlastikEnjeksiyonCevrimSuresiTahminiOutput {
  cevrimSuresi: number;
  breakdown: {
    cevrimSuresi: number;
    netCalismaSuresi: number;
    toplamCevrimSayisi: number;
    toplamUretim: number;
    efektifUretim: number;
    uretimHizi: number;
    oee: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PlastikEnjeksiyonCevrimSuresiTahminiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.cevrimSuresi = ((): number => { try { const __v = input.enjeksiyonSuresi + input.sogutmaSuresi + input.kalipAcmaKapamaSuresi + input.parcaCikarmaSuresi + input.beklemeSuresi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netCalismaSuresi = ((): number => { try { const __v = input.calismaSuresi - input.durusSuresi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamCevrimSayisi = ((): number => { try { const __v = results.netCalismaSuresi * 3600 / results.cevrimSuresi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamUretim = ((): number => { try { const __v = results.toplamCevrimSayisi * input.kaviteSayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.efektifUretim = ((): number => { try { const __v = results.toplamUretim * (1 - input.fireOrani / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.uretimHizi = ((): number => { try { const __v = results.efektifUretim / input.calismaSuresi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.oee = ((): number => { try { const __v = input.makineKullanimOrani / 100 * (1 - input.durusSuresi / input.calismaSuresi) * (1 - input.fireOrani / 100) * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePlastikEnjeksiyonCevrimSuresiTahmini(input: PlastikEnjeksiyonCevrimSuresiTahminiInput): PlastikEnjeksiyonCevrimSuresiTahminiOutput {
  const results = evaluateFormulas(input);
  const cevrimSuresi = results.cevrimSuresi ?? 0;
  const breakdown = {
    cevrimSuresi: results.cevrimSuresi,
    netCalismaSuresi: results.netCalismaSuresi,
    toplamCevrimSayisi: results.toplamCevrimSayisi,
    toplamUretim: results.toplamUretim,
    efektifUretim: results.efektifUretim,
    uretimHizi: results.uretimHizi,
    oee: results.oee,
  };

  // rule: enjeksiyonSuresi > 0
  // rule: sogutmaSuresi > 0
  // rule: kalipAcmaKapamaSuresi > 0
  // rule: parcaCikarmaSuresi > 0
  // rule: beklemeSuresi >= 0
  // rule: calismaSuresi > 0
  // rule: durusSuresi >= 0
  // rule: kaviteSayisi >= 1
  // rule: fireOrani >= 0
  // rule: makineKullanimOrani >= 0
  // rule: durusSuresi < calismaSuresi
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.fireOrani > 5) hiddenLossDrivers.push("Yuksek fire orani, kalite iyilestirme gerekli");
  if (input.makineKullanimOrani < 70) hiddenLossDrivers.push("Dusuk makine kullanimi, verimlilik artirilmali");
  if (input.beklemeSuresi > 5) hiddenLossDrivers.push("Yuksek bekleme suresi, surec iyilestirme onerilir");

  const dataConfidenceAdjusted = (() => { try { return results.oee * (1 - 0.1); } catch { return cevrimSuresi; } })();

  return {
    cevrimSuresi,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma (benchmark)","Detayli rapor"],
  };
}
