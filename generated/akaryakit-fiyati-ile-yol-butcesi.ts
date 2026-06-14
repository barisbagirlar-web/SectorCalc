// Auto-generated from akaryakit-fiyati-ile-yol-butcesi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AkaryakitFiyatiIleYolButcesiInput {
  fuelPricePerLiter: number;
  fuelConsumptionPer100km: number;
  distanceKm: number;
  fuelType: 'benzin' | 'motorin' | 'lpg';
}

export const AkaryakitFiyatiIleYolButcesiInputSchema = z.object({
  fuelPricePerLiter: z.number().min(0).max(100).default(30),
  fuelConsumptionPer100km: z.number().min(0).max(50).default(8),
  distanceKm: z.number().min(0).max(10000).default(100),
  fuelType: z.enum(['benzin', 'motorin', 'lpg']).default('benzin'),
});

export interface AkaryakitFiyatiIleYolButcesiOutput {
  totalFuelCost: number;
  breakdown: {
    fuelNeededLiters: number;
    costPerKm: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AkaryakitFiyatiIleYolButcesiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalFuelCost = input.fuelPricePerLiter * input.fuelConsumptionPer100km * input.distanceKm / 100;
  results.fuelNeededLiters = input.fuelConsumptionPer100km * input.distanceKm / 100;
  results.costPerKm = input.fuelPricePerLiter * input.fuelConsumptionPer100km / 100;
  return results;
}

export function calculateAkaryakitFiyatiIleYolButcesi(input: AkaryakitFiyatiIleYolButcesiInput): AkaryakitFiyatiIleYolButcesiOutput {
  const results = evaluateFormulas(input);
  const totalFuelCost = results.totalFuelCost;
  const breakdown = {
    fuelNeededLiters: results.fuelNeededLiters,
    costPerKm: results.costPerKm,
  };

  // rule: fuelPricePerLiter > 0
  // rule: fuelConsumptionPer100km > 0
  // rule: distanceKm > 0
  // rule: fuelType must be one of: benzin, motorin, lpg
  // threshold fuelPricePerLiter > 40: Yakıt fiyatı ortalamanın üzerinde, bütçeyi artırabilir.
  // threshold fuelConsumptionPer100km > 10: Araç yüksek yakıt tüketiyor, daha ekonomik sürüş önerilir.
  // threshold distanceKm > 500: Uzun mesafe, mola ve konaklama planlaması gerekebilir.
  const hiddenLossDrivers: string[] = ["Yakıt fiyatı ortalamanın üzerinde ise: 'Yüksek yakıt fiyatı'","Yakıt tüketimi yüksek ise: 'Yüksek tüketim'","Mesafe çok uzunsa: 'Uzun mesafe'"];
  const suggestedActions: string[] = ["Yakıt fiyatı yüksekse: Daha ucuz istasyon araştırın.","Tüketim yüksekse: Lastik basıncını kontrol edin, ani hızlanmalardan kaçının.","Mesafe uzunsa: Alternatif rotaları değerlendirin."];
  const dataConfidenceAdjusted = results.totalFuelCost * (1 - 0.05) (varsayılan güven düzeltmesi);

  return {
    totalFuelCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF raporu","CSV export","Trend analizi (geçmiş fiyat karşılaştırması)","Detaylı rota maliyet analizi"],
  };
}
