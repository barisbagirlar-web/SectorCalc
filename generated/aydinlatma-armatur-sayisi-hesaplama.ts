// Auto-generated from aydinlatma-armatur-sayisi-hesaplama-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AydinlatmaArmaturSayisiHesaplamaInput {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  desiredIlluminance: number;
  luminousFluxPerFixture: number;
  maintenanceFactor: number;
  utilizationFactor: number;
  lightLossFactor: number;
}

export const AydinlatmaArmaturSayisiHesaplamaInputSchema = z.object({
  roomLength: z.number().min(1).max(100).default(10),
  roomWidth: z.number().min(1).max(100).default(8),
  roomHeight: z.number().min(2).max(20).default(3),
  desiredIlluminance: z.number().min(50).max(2000).default(500),
  luminousFluxPerFixture: z.number().min(500).max(50000).default(4000),
  maintenanceFactor: z.number().min(0.5).max(1).default(0.8),
  utilizationFactor: z.number().min(0.2).max(1).default(0.6),
  lightLossFactor: z.number().min(0.5).max(1).default(0.9),
});

export interface AydinlatmaArmaturSayisiHesaplamaOutput {
  fixtureCount: number;
  breakdown: {
    roomArea: number;
    totalLuminousFluxRequired: number;
    totalLuminousFluxWithLosses: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AydinlatmaArmaturSayisiHesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.roomArea = input.roomLength * input.roomWidth;
  results.totalLuminousFluxRequired = input.desiredIlluminance * results.roomArea;
  results.totalLuminousFluxWithLosses = results.totalLuminousFluxRequired / (input.maintenanceFactor * input.utilizationFactor * input.lightLossFactor);
  results.fixtureCount = Math.ceil(results.totalLuminousFluxWithLosses / input.luminousFluxPerFixture);
  return results;
}

export function calculateAydinlatmaArmaturSayisiHesaplama(input: AydinlatmaArmaturSayisiHesaplamaInput): AydinlatmaArmaturSayisiHesaplamaOutput {
  const results = evaluateFormulas(input);
  const fixtureCount = results.fixtureCount;
  const breakdown = {
    roomArea: results.roomArea,
    totalLuminousFluxRequired: results.totalLuminousFluxRequired,
    totalLuminousFluxWithLosses: results.totalLuminousFluxWithLosses,
  };

  // rule: roomLength > 0
  // rule: roomWidth > 0
  // rule: roomHeight > 0
  // rule: desiredIlluminance > 0
  // rule: luminousFluxPerFixture > 0
  // rule: maintenanceFactor between 0 and 1
  // rule: utilizationFactor between 0 and 1
  // rule: lightLossFactor between 0 and 1
  // threshold desiredIlluminance: Eğer desiredIlluminance > 1000 ise 'Yüksek aydınlık seviyesi, göz yorgunluğuna neden olabilir.'
  // threshold maintenanceFactor: Eğer maintenanceFactor < 0.7 ise 'Düşük bakım faktörü, sık temizlik gerektirir.'
  const hiddenLossDrivers: string[] = ["Eğer maintenanceFactor < 0.7 ise 'Düşük bakım faktörü'","Eğer utilizationFactor < 0.5 ise 'Düşük kullanım faktörü'"];
  const suggestedActions: string[] = ["Bakım faktörünü artırmak için düzenli temizlik planı oluşturun.","Kullanım faktörünü artırmak için açık renkli duvar ve tavan boyaları kullanın.","Yüksek tavanlar için daha yüksek ışık akılı armatürler seçin."];
  const dataConfidenceAdjusted = Eğer dataConfidence input'u varsa, results.fixtureCount * dataConfidenceFactor;

  return {
    fixtureCount,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (zaman içinde enerji tüketimi)","Karşılaştırma (farklı armatür tipleri)","Detaylı rapor (maliyet analizi dahil)"],
  };
}
