// Auto-generated from bulonlu-baglanti-kesme-ezilme-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BulonluBaglantiKesmeEzilmeHesabiInput {
  bulonCapi: number;
  bulonSayisi: number;
  levhaKalinligi: number;
  levhaAkmaDayanimi: number;
  bulonSinifi: '4.6' | '5.6' | '6.8' | '8.8' | '10.9' | '12.9';
  kesitSayisi: number;
  yukTuru: 'statik' | 'dinamik';
  guvenlikFaktoru: number;
  uygulananKuvvet: number;
}

export const BulonluBaglantiKesmeEzilmeHesabiInputSchema = z.object({
  bulonCapi: z.number().min(6).max(48).default(16),
  bulonSayisi: z.number().min(1).max(20).default(2),
  levhaKalinligi: z.number().min(3).max(50).default(10),
  levhaAkmaDayanimi: z.number().min(200).max(700).default(235),
  bulonSinifi: z.enum(['4.6', '5.6', '6.8', '8.8', '10.9', '12.9']).default('8.8'),
  kesitSayisi: z.number().min(1).max(2).default(1),
  yukTuru: z.enum(['statik', 'dinamik']).default('statik'),
  guvenlikFaktoru: z.number().min(1).max(3).default(1.5),
  uygulananKuvvet: z.number().min(0).max(10000).default(100),
});

export interface BulonluBaglantiKesmeEzilmeHesabiOutput {
  emniyetOrani: number;
  breakdown: {
    kesmeDirenci: number;
    ezilmeDirenci: number;
    bulonAkmaDayanimi: number;
    bulonKesmeDayanimi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BulonluBaglantiKesmeEzilmeHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.bulonAkmaDayanimi = (() => { try { return input.bulonSinifi == '4.6' ? 400 : input.bulonSinifi == '5.6' ? 500 : input.bulonSinifi == '6.8' ? 600 : input.bulonSinifi == '8.8' ? 800 : input.bulonSinifi == '10.9' ? 1000 : 1200; } catch { return 0; } })();
  results.bulonKesmeDayanimi = (() => { try { return 0.6 * results.bulonAkmaDayanimi; } catch { return 0; } })();
  results.kesmeDirenci = (() => { try { return results.bulonKesmeDayanimi * (Math.PI * input.bulonCapi * input.bulonCapi / 4) * input.kesitSayisi * input.bulonSayisi / (input.guvenlikFaktoru * 1000); } catch { return 0; } })();
  results.ezilmeDirenci = (() => { try { return input.levhaAkmaDayanimi * input.bulonCapi * levhaKalinligi * input.bulonSayisi / (input.guvenlikFaktoru * 1000); } catch { return 0; } })();
  results.emniyetOrani = (() => { try { return Math.Math.min(results.kesmeDirenci, results.ezilmeDirenci) / input.uygulananKuvvet; } catch { return 0; } })();
  results.durum = (() => { try { return results.emniyetOrani >= 1 ? 'Guvenli' : 'Guvensiz'; } catch { return 0; } })();
  return results;
}

export function calculateBulonluBaglantiKesmeEzilmeHesabi(input: BulonluBaglantiKesmeEzilmeHesabiInput): BulonluBaglantiKesmeEzilmeHesabiOutput {
  const results = evaluateFormulas(input);
  const emniyetOrani = results.emniyetOrani ?? 0;
  const breakdown = {
    kesmeDirenci: results.kesmeDirenci,
    ezilmeDirenci: results.ezilmeDirenci,
    bulonAkmaDayanimi: results.bulonAkmaDayanimi,
    bulonKesmeDayanimi: results.bulonKesmeDayanimi,
  };

  // rule: levhaKalinligi >= 3
  // rule: bulonCapi >= 6
  // rule: bulonSayisi >= 1
  // rule: guvenlikFaktoru >= 1.0
  // rule: uygulananKuvvet >= 0
  // rule: Eger yukTuru == 'dinamik' ise guvenlikFaktoru >= 2.0
  // rule: Eger bulonSinifi == '12.9' ise bulonCapi <= 36
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (kesmeDirenci < input.uygulananKuvvet) hiddenLossDrivers.push("Kesme dayanimi yetersiz");
  if (ezilmeDirenci < input.uygulananKuvvet) hiddenLossDrivers.push("Ezilme dayanimi yetersiz");
  if (input.guvenlikFaktoru < 1.5) hiddenLossDrivers.push("Guvenlik faktoru dusuk");

  const dataConfidenceAdjusted = (() => { try { return results.emniyetOrani * 0.9; } catch { return emniyetOrani; } })();

  return {
    emniyetOrani,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi","Karsilastirma (farkli bulon caplari/siniflari)"],
  };
}
