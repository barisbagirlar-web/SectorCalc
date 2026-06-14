// Auto-generated from radyator-petek-boyu-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RadyatorPetekBoyuHesaplamaInput {
  odaHacmi: number;
  yalitimSeviyesi: 'iyi' | 'orta' | 'kotu';
  istenenSicaklik: number;
  disSicaklik: number;
  radyatorTipi: 'panel' | 'dilimli' | 'konvektor';
  sistemSicakligi: number;
}

export const RadyatorPetekBoyuHesaplamaInputSchema = z.object({
  odaHacmi: z.number().min(10).max(500).default(50),
  yalitimSeviyesi: z.enum(['iyi', 'orta', 'kotu']).default('orta'),
  istenenSicaklik: z.number().min(18).max(30).default(22),
  disSicaklik: z.number().min(-30).max(10).default(-5),
  radyatorTipi: z.enum(['panel', 'dilimli', 'konvektor']).default('panel'),
  sistemSicakligi: z.number().min(40).max(90).default(75),
});

export interface RadyatorPetekBoyuHesaplamaOutput {
  gerekliBoy: number;
  breakdown: {
    isiIhtiyaci: number;
    yalitimKatsayisi: number;
    radyatorGucu: number;
    sicaklikDuzeltme: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RadyatorPetekBoyuHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.yalitimKatsayisi = ((): number => { try { const __v = input.yalitimSeviyesi === 'iyi' ? 30 : (input.yalitimSeviyesi === 'orta' ? 45 : 60); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.radyatorGucu = ((): number => { try { const __v = input.radyatorTipi === 'panel' ? 1500 : (input.radyatorTipi === 'dilimli' ? 1200 : 1000); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sicaklikDuzeltme = ((): number => { try { const __v = (input.sistemSicakligi - 20) / 50; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.isiIhtiyaci = ((): number => { try { const __v = input.odaHacmi * (input.istenenSicaklik - input.disSicaklik) * results.yalitimKatsayisi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gerekliBoy = ((): number => { try { const __v = results.isiIhtiyaci / (results.radyatorGucu * results.sicaklikDuzeltme); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRadyatorPetekBoyuHesaplama(input: RadyatorPetekBoyuHesaplamaInput): RadyatorPetekBoyuHesaplamaOutput {
  const results = evaluateFormulas(input);
  const gerekliBoy = results.gerekliBoy ?? 0;
  const breakdown = {
    isiIhtiyaci: results.isiIhtiyaci,
    yalitimKatsayisi: results.yalitimKatsayisi,
    radyatorGucu: results.radyatorGucu,
    sicaklikDuzeltme: results.sicaklikDuzeltme,
  };

  // rule: istenenSicaklik > disSicaklik
  // rule: odaHacmi >= 10
  // rule: sistemSicakligi >= 40
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Yalitim seviyesi 'kotu' ise isi kaybi yuksek, radyator boyu buyuk olabilir.
  // threshold skipped (non-JS): Dis sicaklik -15°C altinda ise donma riski, yalitim kontrolu onerilir.

  const dataConfidenceAdjusted = (() => { try { return results.gerekliBoy * 1.1; } catch { return gerekliBoy; } })();

  return {
    gerekliBoy,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (mevsimsel karsilastirma)","Detayli rapor (isi kaybi bilesenleri)"],
  };
}
