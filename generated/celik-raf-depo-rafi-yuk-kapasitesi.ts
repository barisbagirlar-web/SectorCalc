// Auto-generated from celik-raf-depo-rafi-yuk-kapasitesi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CelikRafDepoRafiYukKapasitesiInput {
  rafGenisligi: number;
  rafDerinligi: number;
  rafYuksekligi: number;
  malzemeTuru: 'sac' | 'aluminyum' | 'paslanmaz';
  sacKalinligi: number;
  katSayisi: number;
  yukDagilimi: 'uniform' | 'noktasal' | 'cephe';
  guvenlikFaktoru: number;
}

export const CelikRafDepoRafiYukKapasitesiInputSchema = z.object({
  rafGenisligi: z.number().min(500).max(3000).default(1000),
  rafDerinligi: z.number().min(300).max(1500).default(500),
  rafYuksekligi: z.number().min(1000).max(5000).default(2000),
  malzemeTuru: z.enum(['sac', 'aluminyum', 'paslanmaz']).default('sac'),
  sacKalinligi: z.number().min(0.5).max(5).default(1.5),
  katSayisi: z.number().min(1).max(10).default(4),
  yukDagilimi: z.enum(['uniform', 'noktasal', 'cephe']).default('uniform'),
  guvenlikFaktoru: z.number().min(1.2).max(3).default(1.5),
});

export interface CelikRafDepoRafiYukKapasitesiOutput {
  yukKapasitesi: number;
  breakdown: {
    katBasiYuk: number;
    toplamYuk: number;
    kesitAlani: number;
    ataletMomenti: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CelikRafDepoRafiYukKapasitesiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.kesitAlani = (() => { try { return sacKalinligi * (input.rafGenisligi + input.rafDerinligi) * 2; } catch { return 0; } })();
  results.malzemeMukavemeti = (() => { try { return 0; } catch { return 0; } })();
  results.izinVerilenGerilme = (() => { try { return results.malzemeMukavemeti / input.guvenlikFaktoru; } catch { return 0; } })();
  results.ataletMomenti = (() => { try { return (input.rafGenisligi * sacKalinligi^3) / 12; } catch { return 0; } })();
  results.katBasiYuk = (() => { try { return results.izinVerilenGerilme * results.ataletMomenti / (input.rafGenisligi / 2); } catch { return 0; } })();
  results.toplamYuk = (() => { try { return input.katSayisi * results.katBasiYuk; } catch { return 0; } })();
  results.yukKapasitesi = (() => { try { return results.toplamYuk; } catch { return 0; } })();
  results.maksimumEgilmeMomenti = (() => { try { return 0; } catch { return 0; } })();
  return results;
}

export function calculateCelikRafDepoRafiYukKapasitesi(input: CelikRafDepoRafiYukKapasitesiInput): CelikRafDepoRafiYukKapasitesiOutput {
  const results = evaluateFormulas(input);
  const yukKapasitesi = results.yukKapasitesi ?? 0;
  const breakdown = {
    katBasiYuk: results.katBasiYuk,
    toplamYuk: results.toplamYuk,
    kesitAlani: results.kesitAlani,
    ataletMomenti: results.ataletMomenti,
  };

  // rule: sacKalinligi >= 0.5
  // rule: guvenlikFaktoru >= 1.2
  // rule: rafGenisligi >= 500
  // rule: rafDerinligi >= 300
  // rule: rafYuksekligi >= 1000
  // rule: katSayisi >= 1
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Sac kalinligi cok dusuk, deformasyon riski yuksek.
  // threshold skipped (non-JS): Guvenlik faktoru onerilen minimum degerin altinda.
  // threshold skipped (non-JS): Yuksek raf, devrilme riski artar.

  const dataConfidenceAdjusted = (() => { try { return results.yukKapasitesi * 0.9; } catch { return yukKapasitesi; } })();

  return {
    yukKapasitesi,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
