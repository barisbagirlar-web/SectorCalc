// Auto-generated from cop-atik-konteyner-hacim-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CopAtikKonteynerHacimHesabiInput {
  atikMiktari: number;
  atikYogunlugu: number;
  toplamaPeriyodu: number;
  dolumFaktoru: number;
  konteynerTipi: 'standart' | 'sikistirmali' | 'yeralti';
}

export const CopAtikKonteynerHacimHesabiInputSchema = z.object({
  atikMiktari: z.number().min(0).default(100),
  atikYogunlugu: z.number().min(10).max(1000).default(200),
  toplamaPeriyodu: z.number().min(1).max(30).default(7),
  dolumFaktoru: z.number().min(0.5).max(1).default(0.8),
  konteynerTipi: z.enum(['standart', 'sikistirmali', 'yeralti']).default('standart'),
});

export interface CopAtikKonteynerHacimHesabiOutput {
  gerekliHacim: number;
  breakdown: {
    gunlukHacim: number;
    periyotHacim: number;
    dolumAyari: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CopAtikKonteynerHacimHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.gerekliHacim = ((): number => { try { const __v = ((input.atikMiktari * input.toplamaPeriyodu) / input.atikYogunlugu) / input.dolumFaktoru; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.oneriHacim = ((): number => { try { const __v = results.gerekliHacim * 1.1; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateCopAtikKonteynerHacimHesabi(input: CopAtikKonteynerHacimHesabiInput): CopAtikKonteynerHacimHesabiOutput {
  const results = evaluateFormulas(input);
  const gerekliHacim = results.gerekliHacim ?? 0;
  const breakdown = {
    gunlukHacim: results.gunlukHacim,
    periyotHacim: results.periyotHacim,
    dolumAyari: results.dolumAyari,
  };

  // rule: atikMiktari > 0
  // rule: atikYogunlugu >= 10 && atikYogunlugu <= 1000
  // rule: toplamaPeriyodu >= 1 && toplamaPeriyodu <= 30
  // rule: dolumFaktoru >= 0.5 && dolumFaktoru <= 1
  // rule: if konteynerTipi == 'sikistirmali' then dolumFaktoru >= 0.7
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Dusuk dolum faktoru, konteyner verimsiz kullaniliyor olabilir.
  // threshold skipped (non-JS): Yuksek atik miktari, daha buyuk konteyner veya sik toplama gerekebilir.

  const dataConfidenceAdjusted = (() => { try { return results.gerekliHacim * (1 - (1 - dataConfidence) * 0.1); } catch { return gerekliHacim; } })();

  return {
    gerekliHacim,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
