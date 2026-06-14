// Auto-generated from hidrolik-pompa-gucu-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HidrolikPompaGucuHesaplamaInput {
  basinc: number;
  debi: number;
  verim: number;
  akiskanYogunlugu: number;
  calismaSuresi: number;
  elektrikBirimFiyati: number;
}

export const HidrolikPompaGucuHesaplamaInputSchema = z.object({
  basinc: z.number().min(0).max(1000).default(100),
  debi: z.number().min(0).max(10000).default(50),
  verim: z.number().min(0).max(100).default(85),
  akiskanYogunlugu: z.number().min(0).max(2000).default(1000),
  calismaSuresi: z.number().min(0).max(24).default(8),
  elektrikBirimFiyati: z.number().min(0).max(10).default(2),
});

export interface HidrolikPompaGucuHesaplamaOutput {
  milGucuKW: number;
  breakdown: {
    hidrolikGucKW: number;
    enerjiTuketimiKWhGun: number;
    gunlukEnerjiMaliyetiTL: number;
    aylikEnerjiMaliyetiTL: number;
    yillikEnerjiMaliyetiTL: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HidrolikPompaGucuHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.hidrolikGucKW = ((): number => { try { const __v = input.basinc * input.debi / (600 * input.verim / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.milGucuKW = ((): number => { try { const __v = results.hidrolikGucKW / (input.verim / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.enerjiTuketimiKWhGun = ((): number => { try { const __v = results.milGucuKW * input.calismaSuresi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gunlukEnerjiMaliyetiTL = ((): number => { try { const __v = results.enerjiTuketimiKWhGun * input.elektrikBirimFiyati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.aylikEnerjiMaliyetiTL = ((): number => { try { const __v = results.gunlukEnerjiMaliyetiTL * 30; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikEnerjiMaliyetiTL = ((): number => { try { const __v = results.gunlukEnerjiMaliyetiTL * 365; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHidrolikPompaGucuHesaplama(input: HidrolikPompaGucuHesaplamaInput): HidrolikPompaGucuHesaplamaOutput {
  const results = evaluateFormulas(input);
  const milGucuKW = results.milGucuKW ?? 0;
  const breakdown = {
    hidrolikGucKW: results.hidrolikGucKW,
    enerjiTuketimiKWhGun: results.enerjiTuketimiKWhGun,
    gunlukEnerjiMaliyetiTL: results.gunlukEnerjiMaliyetiTL,
    aylikEnerjiMaliyetiTL: results.aylikEnerjiMaliyetiTL,
    yillikEnerjiMaliyetiTL: results.yillikEnerjiMaliyetiTL,
  };

  // rule: basinc > 0
  // rule: debi > 0
  // rule: verim > 0 && verim <= 100
  // rule: akiskanYogunlugu > 0
  // rule: calismaSuresi >= 0 && calismaSuresi <= 24
  // rule: elektrikBirimFiyati >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk verim: pompa bakimi veya degisimi gerekebilir.
  // threshold skipped (non-JS): Yuksek basinc: sistem sizinti riski artar.

  const dataConfidenceAdjusted = (() => { try { return results.milGucuKW * (1 - (100 - input.verim) / 100 * 0.1); } catch { return milGucuKW; } })();

  return {
    milGucuKW,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
