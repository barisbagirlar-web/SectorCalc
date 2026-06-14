// Auto-generated from basincli-kap-cidar-kalinligi-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BasincliKapCidarKalinligiHesabiInput {
  icBasinc: number;
  icCap: number;
  malzemeAkmaDayanimi: number;
  emniyetKatsayisi: number;
  kaynakFaktoru: number;
  korozyonPayi: number;
}

export const BasincliKapCidarKalinligiHesabiInputSchema = z.object({
  icBasinc: z.number().min(0.1).max(1000).default(10),
  icCap: z.number().min(100).max(10000).default(1000),
  malzemeAkmaDayanimi: z.number().min(100).max(1000).default(250),
  emniyetKatsayisi: z.number().min(1).max(4).default(1.5),
  kaynakFaktoru: z.number().min(0.6).max(1).default(0.85),
  korozyonPayi: z.number().min(0).max(10).default(2),
});

export interface BasincliKapCidarKalinligiHesabiOutput {
  gerekliEtKal: number;
  breakdown: {
    tasarimKalınlığı: number;
    izinVerilenBasinc: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BasincliKapCidarKalinligiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.gerekliEtKalınlığı = ((input.icBasinc * input.icCap) / (2 * (input.malzemeAkmaDayanimi / input.emniyetKatsayisi) * input.kaynakFaktoru + input.icBasinc)) + input.korozyonPayi;
  results.izinVerilenBasinc = (2 * (input.malzemeAkmaDayanimi / input.emniyetKatsayisi) * input.kaynakFaktoru * (gerekliEtKalınlığı - input.korozyonPayi)) / (input.icCap - (gerekliEtKalınlığı - input.korozyonPayi));
  return results;
}

export function calculateBasincliKapCidarKalinligiHesabi(input: BasincliKapCidarKalinligiHesabiInput): BasincliKapCidarKalinligiHesabiOutput {
  const results = evaluateFormulas(input);
  const gerekliEtKal = results.gerekliEtKal;
  const breakdown = {
    tasarimKalınlığı: results.tasarimKalınlığı,
    izinVerilenBasinc: results.izinVerilenBasinc,
  };

  // rule: icBasinc > 0
  // rule: icCap > 0
  // rule: malzemeAkmaDayanimi > 0
  // rule: emniyetKatsayisi >= 1.0
  // rule: kaynakFaktoru > 0 ve <= 1.0
  // rule: korozyonPayi >= 0
  // threshold icBasinc > 100: Yüksek basınç, özel tasarım gerektirebilir.
  // threshold emniyetKatsayisi < 1.5: Düşük emniyet katsayısı, riskli.
  // threshold kaynakFaktoru < 0.7: Kaynak kalitesi düşük, tahribatsız muayene önerilir.
  const hiddenLossDrivers: string[] = ["icBasinc > 100 ? 'Yüksek basınç' : null","emniyetKatsayisi < 1.5 ? 'Düşük emniyet katsayısı' : null"];
  const suggestedActions: string[] = ["icBasinc > 100 ? 'Yüksek basınç için özel malzeme veya takviye düşünün.' : null","kaynakFaktoru < 0.7 ? 'Kaynak kalitesini artırın veya radyografik muayene yapın.' : null"];
  const dataConfidenceAdjusted = gerekliEtKalınlığı * (1 + (1 - dataConfidence));

  return {
    gerekliEtKal,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF raporu","Detaylı malzeme seçimi","Farklı standartlarla karşılaştırma (ASME, EN, vb.)","Trend analizi","Excel/CSV export"],
  };
}
