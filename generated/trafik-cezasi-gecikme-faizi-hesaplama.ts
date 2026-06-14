// Auto-generated from trafik-cezasi-gecikme-faizi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface TrafikCezasiGecikmeFaiziHesaplamaInput {
  cezaTutari: number;
  gecikmeGunSayisi: number;
  gecikmeZamaniOrani: number;
}

export const TrafikCezasiGecikmeFaiziHesaplamaInputSchema = z.object({
  cezaTutari: z.number().min(0).default(1000),
  gecikmeGunSayisi: z.number().min(0).default(30),
  gecikmeZamaniOrani: z.number().min(0).max(100).default(1.6),
});

export interface TrafikCezasiGecikmeFaiziHesaplamaOutput {
  toplamOdenecek: number;
  breakdown: {
    cezaTutari: number;
    gecikmeFaizi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: TrafikCezasiGecikmeFaiziHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.gecikmeFaizi = ((): number => { try { const __v = input.cezaTutari * (input.gecikmeZamaniOrani / 100) * (input.gecikmeGunSayisi / 30); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.toplamOdenecek = ((): number => { try { const __v = input.cezaTutari + results.gecikmeFaizi; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateTrafikCezasiGecikmeFaiziHesaplama(input: TrafikCezasiGecikmeFaiziHesaplamaInput): TrafikCezasiGecikmeFaiziHesaplamaOutput {
  const results = evaluateFormulas(input);
  const toplamOdenecek = results.toplamOdenecek ?? 0;
  const breakdown = {
    cezaTutari: results.cezaTutari,
    gecikmeFaizi: results.gecikmeFaizi,
  };

  // rule: cezaTutari >= 0
  // rule: gecikmeGunSayisi >= 0
  // rule: gecikmeZamaniOrani >= 0
  // rule: gecikmeZamaniOrani <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): UYARI: Gecikme 1 yili asmistir, yasal takip baslatilabilir.
  // threshold skipped (non-JS): UYARI: Gecikme zammi orani yuksek, guncel orani kontrol edin.

  const dataConfidenceAdjusted = (() => { try { return results.toplamOdenecek; } catch { return toplamOdenecek; } })();

  return {
    toplamOdenecek,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (gecmis hesaplamalar)","Karsilastirma (farkli oran senaryolari)","Detayli rapor (yasal dayanaklar)"],
  };
}
