// Auto-generated from boru-capi-akis-hizi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoruCapiAkisHiziHesaplamaInput {
  debi: number;
  hiz: number;
  boruTipi: 'standart' | 'smooth' | 'rough';
  akiskanturu: 'su' | 'hava' | 'diger';
}

export const BoruCapiAkisHiziHesaplamaInputSchema = z.object({
  debi: z.number().min(0).default(0.1),
  hiz: z.number().min(0).default(2),
  boruTipi: z.enum(['standart', 'smooth', 'rough']).default('standart'),
  akiskanturu: z.enum(['su', 'hava', 'diger']).default('su'),
});

export interface BoruCapiAkisHiziHesaplamaOutput {
  cap: number;
  breakdown: {
    alan: number;
    reynoldsSayisi: number;
    basincKaybi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoruCapiAkisHiziHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.cap = ((): number => { try { const __v = Math.sqrt((4 * input.debi) / (PI * input.hiz)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.alan = ((): number => { try { const __v = PI * (results.cap / 2)^2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reynoldsSayisi = ((): number => { try { const __v = (input.akiskanturu == 'su' ? 1000 : 1.2) * input.hiz * results.cap / (input.akiskanturu == 'su' ? 0.001 : 1.8e-5); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.surtunmeFaktoru = ((): number => { try { const __v = input.boruTipi == 'smooth' ? 0.01 : (input.boruTipi == 'rough' ? 0.05 : 0.02); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.basincKaybi = ((): number => { try { const __v = results.surtunmeFaktoru * (1000 / results.cap) * (input.akiskanturu == 'su' ? 1000 : 1.2) * input.hiz^2 / 2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateBoruCapiAkisHiziHesaplama(input: BoruCapiAkisHiziHesaplamaInput): BoruCapiAkisHiziHesaplamaOutput {
  const results = evaluateFormulas(input);
  const cap = results.cap ?? 0;
  const breakdown = {
    alan: results.alan,
    reynoldsSayisi: results.reynoldsSayisi,
    basincKaybi: results.basincKaybi,
  };

  // rule: debi > 0
  // rule: hiz > 0
  // rule: Eger akiskanturu = 'diger' ise kullanicidan yogunluk ve viskozite bilgisi istenmeli (bu aracta sadece su ve hava icin standart degerler kullanilir)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.hiz > 10) hiddenLossDrivers.push("hiz");
  if (input.debi > 1) hiddenLossDrivers.push("debi");

  const dataConfidenceAdjusted = (() => { try { return results.cap * (1 - 0.05); } catch { return cap; } })();

  return {
    cap,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
