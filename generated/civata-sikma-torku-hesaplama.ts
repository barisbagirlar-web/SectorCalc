// Auto-generated from civata-sikma-torku-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CivataSikmaTorkuHesaplamaInput {
  civataCapi: number;
  adim: number;
  surtunmeKatsayisi: number;
  onYuklemeKuvveti: number;
  malzemeSinifi: '4.6' | '5.8' | '6.8' | '8.8' | '10.9' | '12.9';
  yaglamali: boolean;
}

export const CivataSikmaTorkuHesaplamaInputSchema = z.object({
  civataCapi: z.number().min(3).max(100).default(12),
  adim: z.number().min(0.5).max(6).default(1.75),
  surtunmeKatsayisi: z.number().min(0.05).max(0.5).default(0.15),
  onYuklemeKuvveti: z.number().min(1).max(1000).default(50),
  malzemeSinifi: z.enum(['4.6', '5.8', '6.8', '8.8', '10.9', '12.9']).default('8.8'),
  yaglamali: z.boolean().default(false),
});

export interface CivataSikmaTorkuHesaplamaOutput {
  sikmaTorku: number;
  breakdown: {
    sikmaTorku: number;
    maksimumOnYuk: number;
    kullanilanOnYukOrani: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CivataSikmaTorkuHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.sikmaTorku = ((): number => { try { const __v = input.onYuklemeKuvveti * 1000 * (0.16 * input.adim + 0.577 * input.surtunmeKatsayisi * input.civataCapi / 1000) / (1 - 0.577 * input.surtunmeKatsayisi * input.adim / (Math.PI * input.civataCapi / 1000)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maksimumOnYuk = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.torkDegeri = ((): number => { try { const __v = results.sikmaTorku; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateCivataSikmaTorkuHesaplama(input: CivataSikmaTorkuHesaplamaInput): CivataSikmaTorkuHesaplamaOutput {
  const results = evaluateFormulas(input);
  const sikmaTorku = results.sikmaTorku ?? 0;
  const breakdown = {
    sikmaTorku: results.sikmaTorku,
    maksimumOnYuk: results.maksimumOnYuk,
    kullanilanOnYukOrani: results.kullanilanOnYukOrani,
  };

  // rule: civataCapi >= 3 && civataCapi <= 100
  // rule: adim >= 0.5 && adim <= 6
  // rule: surtunmeKatsayisi >= 0.05 && surtunmeKatsayisi <= 0.5
  // rule: onYuklemeKuvveti >= 1 && onYuklemeKuvveti <= 1000
  // rule: Eger yaglamali ise surtunmeKatsayisi <= 0.12
  // rule: onYuklemeKuvveti, malzemeSinifi ve civataCapi'na gore izin verilen maksimum on yuku asmamalidir (akma dayaniminin %90'i)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (input.surtunmeKatsayisi > 0.2) hiddenLossDrivers.push("surtunmeKatsayisiYuksek");
  // threshold skipped (non-JS): onYuklemeKuvveti > (malzemeSinifi'na gore hesaplanan maksimum on yuk)

  const dataConfidenceAdjusted = (() => { try { return dataConfidenceAdjusted; } catch { return sikmaTorku; } })();

  return {
    sikmaTorku,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
