// Auto-generated from yay-helisel-kuvvet-uzama-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface YayHeliselKuvvetUzamaHesabiInput {
  telCap: number;
  disCap: number;
  sarimSayisi: number;
  malzeme: 'Celik' | 'Paslanmaz Celik' | 'Fosfor Bronz' | 'Berilyum Bakir';
  kuvvet: number;
}

export const YayHeliselKuvvetUzamaHesabiInputSchema = z.object({
  telCap: z.number().min(0.1).max(50).default(2),
  disCap: z.number().min(1).max(500).default(20),
  sarimSayisi: z.number().min(1).max(100).default(10),
  malzeme: z.enum(['Celik', 'Paslanmaz Celik', 'Fosfor Bronz', 'Berilyum Bakir']).default('Celik'),
  kuvvet: z.number().min(0).max(100000).default(100),
});

export interface YayHeliselKuvvetUzamaHesabiOutput {
  uzama: number;
  breakdown: {
    yaySabiti: number;
    gerilme: number;
    malzemeIzinVerilenGerilme: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: YayHeliselKuvvetUzamaHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.ortalamaCap = ((): number => { try { const __v = (input.disCap - input.telCap); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yayIndeksi = ((): number => { try { const __v = results.ortalamaCap / input.telCap; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kaymaModulu = ((): number => { try { const __v = input.malzeme === 'Celik' ? 80000 : input.malzeme === 'Paslanmaz Celik' ? 77000 : input.malzeme === 'Fosfor Bronz' ? 43000 : 48000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yaySabiti = ((): number => { try { const __v = (results.kaymaModulu * input.telCap^4) / (8 * input.sarimSayisi * results.ortalamaCap^3); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.uzama = ((): number => { try { const __v = input.kuvvet / results.yaySabiti; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gerilme = ((): number => { try { const __v = (8 * input.kuvvet * results.ortalamaCap * 1.2) / (Math.PI * input.telCap^3); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.malzemeIzinVerilenGerilme = ((): number => { try { const __v = input.malzeme === 'Celik' ? 800 : input.malzeme === 'Paslanmaz Celik' ? 700 : input.malzeme === 'Fosfor Bronz' ? 400 : 500; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateYayHeliselKuvvetUzamaHesabi(input: YayHeliselKuvvetUzamaHesabiInput): YayHeliselKuvvetUzamaHesabiOutput {
  const results = evaluateFormulas(input);
  const uzama = results.uzama ?? 0;
  const breakdown = {
    yaySabiti: results.yaySabiti,
    gerilme: results.gerilme,
    malzemeIzinVerilenGerilme: results.malzemeIzinVerilenGerilme,
  };

  // rule: disCap > telCap
  // rule: sarimSayisi >= 1
  // rule: kuvvet >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): malzemeIzinVerilenGerilme

  const dataConfidenceAdjusted = (() => { try { return results.uzama; } catch { return uzama; } })();

  return {
    uzama,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
