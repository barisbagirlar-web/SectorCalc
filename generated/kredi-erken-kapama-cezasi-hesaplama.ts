// Auto-generated from kredi-erken-kapama-cezasi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KrediErkenKapamaCezasiHesaplamaInput {
  kalanAnapara: number;
  kalanVade: number;
  faizOrani: number;
  krediTuru: 'konut' | 'arac' | 'ihtiyac' | 'ticari';
  erkenKapamaSuresi: number;
}

export const KrediErkenKapamaCezasiHesaplamaInputSchema = z.object({
  kalanAnapara: z.number().min(0).default(100000),
  kalanVade: z.number().min(1).max(360).default(12),
  faizOrani: z.number().min(0).max(100).default(1.5),
  krediTuru: z.enum(['konut', 'arac', 'ihtiyac', 'ticari']).default('konut'),
  erkenKapamaSuresi: z.number().min(0).max(100).default(50),
});

export interface KrediErkenKapamaCezasiHesaplamaOutput {
  cezaTutari: number;
  breakdown: {
    cezaOrani: number;
    cezaTutari: number;
    toplamGeriOdeme: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KrediErkenKapamaCezasiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.cezaOrani = ((): number => { try { const __v = input.krediTuru === 'konut' ? (input.erkenKapamaSuresi <= 50 ? 0.02 : 0.01) : (input.krediTuru === 'arac' ? 0.03 : (input.krediTuru === 'ihtiyac' ? 0.04 : 0.05)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cezaTutari = ((): number => { try { const __v = input.kalanAnapara * results.cezaOrani; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamGeriOdeme = ((): number => { try { const __v = input.kalanAnapara + results.cezaTutari; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKrediErkenKapamaCezasiHesaplama(input: KrediErkenKapamaCezasiHesaplamaInput): KrediErkenKapamaCezasiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const cezaTutari = results.cezaTutari ?? 0;
  const breakdown = {
    cezaOrani: results.cezaOrani,
    cezaTutari: results.cezaTutari,
    toplamGeriOdeme: results.toplamGeriOdeme,
  };

  // rule: kalanAnapara > 0
  // rule: kalanVade >= 1
  // rule: faizOrani >= 0
  // rule: erkenKapamaSuresi >= 0 && erkenKapamaSuresi <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Faiz orani yuksek, ceza tutari onemli olabilir.
  // threshold skipped (non-JS): Kalan vadenin buyuk kismi kalmis, ceza orani yuksek olabilir.

  const dataConfidenceAdjusted = (() => { try { return results.cezaTutari * (1 - 0.05); } catch { return cezaTutari; } })();

  return {
    cezaTutari,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (zaman icinde ceza degisimi)","Karsilastirma (farkli kredi turleri)","Detayli rapor (faiz, vade, ceza analizi)"],
  };
}
