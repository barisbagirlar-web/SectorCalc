// Auto-generated from boya-kaplama-sarfiyati-m-basina-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoyaKaplamaSarfiyatiMBasinaHesabiInput {
  coverageRate: number;
  surfaceArea: number;
  numberOfCoats: number;
  wasteFactor: number;
  paintDensity: number;
  paintCostPerLiter: number;
  laborCostPerHour: number;
  applicationRate: number;
}

export const BoyaKaplamaSarfiyatiMBasinaHesabiInputSchema = z.object({
  coverageRate: z.number().min(1).max(50).default(10),
  surfaceArea: z.number().min(0.1).max(10000).default(100),
  numberOfCoats: z.number().min(1).max(5).default(2),
  wasteFactor: z.number().min(0).max(50).default(10),
  paintDensity: z.number().min(0.5).max(2.5).default(1.3),
  paintCostPerLiter: z.number().min(1).max(1000).default(50),
  laborCostPerHour: z.number().min(0).max(500).default(30),
  applicationRate: z.number().min(1).max(100).default(20),
});

export interface BoyaKaplamaSarfiyatiMBasinaHesabiOutput {
  costPerSquareMeter: number;
  breakdown: {
    totalPaintLiters: number;
    totalPaintKg: number;
    totalPaintCost: number;
    totalLaborHours: number;
    totalLaborCost: number;
    totalCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoyaKaplamaSarfiyatiMBasinaHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalPaintLiters = input.surfaceArea * input.numberOfCoats / input.coverageRate * (1 + input.wasteFactor / 100);
  results.totalPaintKg = results.totalPaintLiters * input.paintDensity;
  results.totalPaintCost = results.totalPaintLiters * input.paintCostPerLiter;
  results.totalLaborHours = input.surfaceArea * input.numberOfCoats / input.applicationRate;
  results.totalLaborCost = results.totalLaborHours * input.laborCostPerHour;
  results.totalCost = results.totalPaintCost + results.totalLaborCost;
  results.costPerSquareMeter = results.totalCost / input.surfaceArea;
  return results;
}

export function calculateBoyaKaplamaSarfiyatiMBasinaHesabi(input: BoyaKaplamaSarfiyatiMBasinaHesabiInput): BoyaKaplamaSarfiyatiMBasinaHesabiOutput {
  const results = evaluateFormulas(input);
  const costPerSquareMeter = results.costPerSquareMeter;
  const breakdown = {
    totalPaintLiters: results.totalPaintLiters,
    totalPaintKg: results.totalPaintKg,
    totalPaintCost: results.totalPaintCost,
    totalLaborHours: results.totalLaborHours,
    totalLaborCost: results.totalLaborCost,
    totalCost: results.totalCost,
  };

  // rule: coverageRate > 0
  // rule: surfaceArea > 0
  // rule: numberOfCoats >= 1
  // rule: wasteFactor >= 0
  // rule: paintDensity > 0
  // rule: paintCostPerLiter > 0
  // rule: laborCostPerHour >= 0
  // rule: applicationRate > 0
  // threshold wasteFactor > 20: Yüksek fire oranı; uygulama yöntemi gözden geçirilmeli.
  // threshold coverageRate < 5: Düşük kaplama oranı; yüzey hazırlığı veya boya kalitesi kontrol edilmeli.
  const hiddenLossDrivers: string[] = ["wasteFactor > 20","coverageRate < 5"];
  const suggestedActions: string[] = ["Fire oranını azaltmak için uygun uygulama ekipmanı kullanın.","Düşük kaplama oranı durumunda yüzey hazırlığını iyileştirin veya daha kaliteli boya tercih edin."];
  const dataConfidenceAdjusted = results.costPerSquareMeter * (1 - dataConfidence/100) (dataConfidence input varsayılan %80);

  return {
    costPerSquareMeter,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF/CSV raporu","Trend analizi (geçmiş projelerle karşılaştırma)","Detaylı maliyet kırılımı ve grafikler","Farklı boya türleri için karşılaştırma"],
  };
}
