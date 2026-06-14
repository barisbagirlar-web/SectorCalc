// Auto-generated from gelir-vergisi-dilimleri-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface GelirVergisiDilimleriHesaplamaInput {
  yillikGelir: number;
  vergiYili: '2024' | '2025' | '2026';
  medeniDurum: 'bekar' | 'evliEsCalismiyor' | 'evliEsCalisiyor';
  cocukSayisi: number;
  engellilikDurumu: 'yok' | 'birinciDerece' | 'ikinciDerece' | 'ucuncuDerece';
}

export const GelirVergisiDilimleriHesaplamaInputSchema = z.object({
  yillikGelir: z.number().min(0).default(0),
  vergiYili: z.enum(['2024', '2025', '2026']).default('2025'),
  medeniDurum: z.enum(['bekar', 'evliEsCalismiyor', 'evliEsCalisiyor']).default('bekar'),
  cocukSayisi: z.number().min(0).max(10).default(0),
  engellilikDurumu: z.enum(['yok', 'birinciDerece', 'ikinciDerece', 'ucuncuDerece']).default('yok'),
});

export interface GelirVergisiDilimleriHesaplamaOutput {
  netGelir: number;
  breakdown: {
    vergiMatrahi: number;
    vergi: number;
    vergiOrani: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: GelirVergisiDilimleriHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.vergiMatrahi = ((): number => { try { const __v = input.yillikGelir - engellilikIndirimi(input.engellilikDurumu) - agi(input.medeniDurum, input.cocukSayisi); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.vergi = ((): number => { try { const __v = vergiMatrahi * vergiOrani(vergiMatrahi, (Number(input.vergiYili) || 0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.netGelir = ((): number => { try { const __v = input.yillikGelir - results.vergi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateGelirVergisiDilimleriHesaplama(input: GelirVergisiDilimleriHesaplamaInput): GelirVergisiDilimleriHesaplamaOutput {
  const results = evaluateFormulas(input);
  const netGelir = results.netGelir ?? 0;
  const breakdown = {
    vergiMatrahi: results.vergiMatrahi,
    vergi: results.vergi,
    vergiOrani: results.vergiOrani,
  };

  // rule: yillikGelir >= 0
  // rule: cocukSayisi >= 0 ve <= 10
  // rule: Eger medeniDurum 'bekar' ise cocukSayisi 0 olmali
  // rule: Eger medeniDurum 'evliEsCalismiyor' ise cocukSayisi >= 0
  // rule: Eger medeniDurum 'evliEsCalisiyor' ise cocukSayisi >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.yillikGelir > 1000000) hiddenLossDrivers.push("Yuksek gelir dilimi, vergi orani %40");

  const dataConfidenceAdjusted = (() => { try { return results.netGelir; } catch { return netGelir; } })();

  return {
    netGelir,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (gecmis yillar karsilastirmasi)","Detayli rapor (vergi dilimleri grafigi)"],
  };
}
