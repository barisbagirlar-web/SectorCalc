// Auto-generated from isi-degistirici-esanjor-kapasite-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IsiDegistiriciEsanjorKapasiteHesabiInput {
  sicakAkiskanDebisi: number;
  sicakAkiskanGirisSicakligi: number;
  sicakAkiskanCikisSicakligi: number;
  sogukAkiskanDebisi: number;
  sogukAkiskanGirisSicakligi: number;
  sogukAkiskanCikisSicakligi: number;
  sicakAkiskanOzgulIsi: number;
  sogukAkiskanOzgulIsi: number;
  isTransferKatsayisi: number;
  akisDuzeni: 'parallel' | 'counter' | 'cross';
}

export const IsiDegistiriciEsanjorKapasiteHesabiInputSchema = z.object({
  sicakAkiskanDebisi: z.number().min(0.1).max(1000).default(10),
  sicakAkiskanGirisSicakligi: z.number().min(-50).max(500).default(90),
  sicakAkiskanCikisSicakligi: z.number().min(-50).max(500).default(50),
  sogukAkiskanDebisi: z.number().min(0.1).max(1000).default(10),
  sogukAkiskanGirisSicakligi: z.number().min(-50).max(500).default(20),
  sogukAkiskanCikisSicakligi: z.number().min(-50).max(500).default(40),
  sicakAkiskanOzgulIsi: z.number().min(0.1).max(10).default(4.18),
  sogukAkiskanOzgulIsi: z.number().min(0.1).max(10).default(4.18),
  isTransferKatsayisi: z.number().min(10).max(5000).default(500),
  akisDuzeni: z.enum(['parallel', 'counter', 'cross']).default('parallel'),
});

export interface IsiDegistiriciEsanjorKapasiteHesabiOutput {
  gerekliIsiTransferAlani: number;
  breakdown: {
    sicakAkiskanIsiTransferi: number;
    sogukAkiskanIsiTransferi: number;
    ortalamaSicaklikFarki: number;
    kapasiteOrani: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IsiDegistiriciEsanjorKapasiteHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.sicakAkiskanIsiTransferi = ((): number => { try { const __v = input.sicakAkiskanDebisi * input.sicakAkiskanOzgulIsi * (input.sicakAkiskanGirisSicakligi - input.sicakAkiskanCikisSicakligi) * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sogukAkiskanIsiTransferi = ((): number => { try { const __v = input.sogukAkiskanDebisi * input.sogukAkiskanOzgulIsi * (input.sogukAkiskanCikisSicakligi - input.sogukAkiskanGirisSicakligi) * 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ortalamaSicaklikFarki = ((): number => { try { const __v = input.akisDuzeni == 'counter' ? ((input.sicakAkiskanGirisSicakligi - input.sogukAkiskanCikisSicakligi) - (input.sicakAkiskanCikisSicakligi - input.sogukAkiskanGirisSicakligi)) / Math.log((input.sicakAkiskanGirisSicakligi - input.sogukAkiskanCikisSicakligi) / (input.sicakAkiskanCikisSicakligi - input.sogukAkiskanGirisSicakligi)) : input.akisDuzeni == 'parallel' ? ((input.sicakAkiskanGirisSicakligi - input.sogukAkiskanGirisSicakligi) - (input.sicakAkiskanCikisSicakligi - input.sogukAkiskanCikisSicakligi)) / Math.log((input.sicakAkiskanGirisSicakligi - input.sogukAkiskanGirisSicakligi) / (input.sicakAkiskanCikisSicakligi - input.sogukAkiskanCikisSicakligi)) : ((input.sicakAkiskanGirisSicakligi - input.sogukAkiskanCikisSicakligi) - (input.sicakAkiskanCikisSicakligi - input.sogukAkiskanGirisSicakligi)) / Math.log((input.sicakAkiskanGirisSicakligi - input.sogukAkiskanCikisSicakligi) / (input.sicakAkiskanCikisSicakligi - input.sogukAkiskanGirisSicakligi)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gerekliIsiTransferAlani = ((): number => { try { const __v = results.ortalamaSicaklikFarki > 0 ? (results.sicakAkiskanIsiTransferi / (input.isTransferKatsayisi * results.ortalamaSicaklikFarki)) : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.kapasiteOrani = ((): number => { try { const __v = results.sogukAkiskanIsiTransferi > 0 ? (results.sicakAkiskanIsiTransferi / results.sogukAkiskanIsiTransferi) : 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIsiDegistiriciEsanjorKapasiteHesabi(input: IsiDegistiriciEsanjorKapasiteHesabiInput): IsiDegistiriciEsanjorKapasiteHesabiOutput {
  const results = evaluateFormulas(input);
  const gerekliIsiTransferAlani = results.gerekliIsiTransferAlani ?? 0;
  const breakdown = {
    sicakAkiskanIsiTransferi: results.sicakAkiskanIsiTransferi,
    sogukAkiskanIsiTransferi: results.sogukAkiskanIsiTransferi,
    ortalamaSicaklikFarki: results.ortalamaSicaklikFarki,
    kapasiteOrani: results.kapasiteOrani,
  };

  // rule: sicakAkiskanGirisSicakligi > sicakAkiskanCikisSicakligi
  // rule: sogukAkiskanCikisSicakligi > sogukAkiskanGirisSicakligi
  // rule: sicakAkiskanCikisSicakligi > sogukAkiskanGirisSicakligi
  // rule: sicakAkiskanDebisi > 0
  // rule: sogukAkiskanDebisi > 0
  // rule: isTransferKatsayisi > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.sicakAkiskanCikisSicakligi < input.sogukAkiskanGirisSicakligi) hiddenLossDrivers.push("sicakAkiskanCikisSicakligi");
  if (input.sogukAkiskanCikisSicakligi > input.sicakAkiskanGirisSicakligi) hiddenLossDrivers.push("sogukAkiskanCikisSicakligi");

  const dataConfidenceAdjusted = (() => { try { return dataConfidenceAdjusted; } catch { return gerekliIsiTransferAlani; } })();

  return {
    gerekliIsiTransferAlani,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
