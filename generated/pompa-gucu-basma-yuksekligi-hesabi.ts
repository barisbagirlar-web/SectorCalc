// Auto-generated from pompa-gucu-basma-yuksekligi-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PompaGucuBasmaYuksekligiHesabiInput {
  debi: number;
  basmaYuksekligi: number;
  akiskanYogunlugu: number;
  verim: number;
  elektrikBirimFiyati: number;
  calismaSuresi: number;
  calismaGunu: number;
}

export const PompaGucuBasmaYuksekligiHesabiInputSchema = z.object({
  debi: z.number().min(0).default(0.1),
  basmaYuksekligi: z.number().min(0).default(20),
  akiskanYogunlugu: z.number().min(0).default(1000),
  verim: z.number().min(0).max(100).default(75),
  elektrikBirimFiyati: z.number().min(0).default(1.5),
  calismaSuresi: z.number().min(0).max(24).default(8),
  calismaGunu: z.number().min(0).max(365).default(300),
});

export interface PompaGucuBasmaYuksekligiHesabiOutput {
  guc: number;
  breakdown: {
    guc: number;
    enerjiTuketimiGunluk: number;
    enerjiTuketimiYillik: number;
    yillikEnerjiMaliyeti: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PompaGucuBasmaYuksekligiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.guc = ((): number => { try { const __v = input.debi * input.basmaYuksekligi * input.akiskanYogunlugu * 9.81 / (input.verim / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.enerjiTuketimiGunluk = ((): number => { try { const __v = results.guc * input.calismaSuresi / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.enerjiTuketimiYillik = ((): number => { try { const __v = results.enerjiTuketimiGunluk * input.calismaGunu; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.yillikEnerjiMaliyeti = ((): number => { try { const __v = results.enerjiTuketimiYillik * input.elektrikBirimFiyati; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePompaGucuBasmaYuksekligiHesabi(input: PompaGucuBasmaYuksekligiHesabiInput): PompaGucuBasmaYuksekligiHesabiOutput {
  const results = evaluateFormulas(input);
  const guc = results.guc ?? 0;
  const breakdown = {
    guc: results.guc,
    enerjiTuketimiGunluk: results.enerjiTuketimiGunluk,
    enerjiTuketimiYillik: results.enerjiTuketimiYillik,
    yillikEnerjiMaliyeti: results.yillikEnerjiMaliyeti,
  };

  // rule: debi > 0
  // rule: basmaYuksekligi > 0
  // rule: akiskanYogunlugu > 0
  // rule: verim > 0 && verim <= 100
  // rule: elektrikBirimFiyati >= 0
  // rule: calismaSuresi >= 0 && calismaSuresi <= 24
  // rule: calismaGunu >= 0 && calismaGunu <= 365
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk verim: pompa verimi %50'nin altinda, bakim veya degisim gerekebilir.
  // threshold skipped (non-JS): Yuksek guc: pompa gucu 100 kW uzerinde, enerji maliyeti yuksek.

  const dataConfidenceAdjusted = (() => { try { return results.guc * (1 - 0.1); } catch { return guc; } })();

  return {
    guc,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
