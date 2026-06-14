// Auto-generated from alti-sigma-dpmo-sigma-seviyesi-cevirici-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AltiSigmaDpmoSigmaSeviyesiCeviriciInput {
  dpmo: number;
  sigmaShift: number;
}

export const AltiSigmaDpmoSigmaSeviyesiCeviriciInputSchema = z.object({
  dpmo: z.number().min(0).max(1000000).default(1000),
  sigmaShift: z.number().min(0).max(2).default(1.5),
});

export interface AltiSigmaDpmoSigmaSeviyesiCeviriciOutput {
  sigmaLevel: number;
  breakdown: {
    sigmaLevel: number;
    dpmo: number;
    yield: number;
    defectRate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AltiSigmaDpmoSigmaSeviyesiCeviriciInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dpmoToSigmaLevel = sigmaLevel = normsinv(1 - input.dpmo/1000000) + input.sigmaShift;
  results.sigmaLevelToDpmo = input.dpmo = (1 - normcdf(sigmaLevel - input.sigmaShift)) * 1000000;
  results.yield = results.yield = (1 - input.dpmo/1000000) * 100;
  results.defectRate = results.defectRate = input.dpmo / 1000000;
  return results;
}

export function calculateAltiSigmaDpmoSigmaSeviyesiCevirici(input: AltiSigmaDpmoSigmaSeviyesiCeviriciInput): AltiSigmaDpmoSigmaSeviyesiCeviriciOutput {
  const results = evaluateFormulas(input);
  const sigmaLevel = results.sigmaLevel;
  const breakdown = {
    sigmaLevel: results.dpmoToSigmaLevel,
    dpmo: results.dpmoToSigmaLevel,
    yield: results.yield,
    defectRate: results.defectRate,
  };

  // rule: dpmo must be a finite number between 0 and 1,000,000
  // rule: sigmaShift must be a finite number between 0 and 2
  // rule: If dpmo is 0, sigma level is theoretically infinite; output will be capped at 6 sigma for practical purposes
  // threshold dpmo: [object Object]
  const hiddenLossDrivers: string[] = ["dpmo > 100000: Kritik kalite seviyesi, acil iyileştirme gerekli","dpmo > 10000: Yüksek hata oranı, süreç iyileştirme önerilir"];
  const suggestedActions: string[] = ["dpmo > 100000: Kök neden analizi yapın ve süreci yeniden tasarlayın","dpmo between 10000 and 100000: DMAIC projesi başlatın","dpmo < 10000: Süreci kontrol altında tutun ve sürekli iyileştirme uygulayın"];
  const dataConfidenceAdjusted = dataConfidenceAdjusted;

  return {
    sigmaLevel,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["Detaylı rapor (PDF/CSV export)","Trend analizi (zaman içinde sigma seviyesi değişimi)","Karşılaştırma (farklı süreçlerin sigma seviyelerini karşılaştırma)","Simülasyon (farklı DPMO değerleri için sigma seviyesi tahmini)"],
  };
}
