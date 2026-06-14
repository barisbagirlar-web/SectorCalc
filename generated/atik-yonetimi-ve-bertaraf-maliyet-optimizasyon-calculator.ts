// Auto-generated from atik-yonetimi-ve-bertaraf-maliyet-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInput {
  wasteVolume: number;
  wasteType: 'organic' | 'recyclable' | 'hazardous' | 'mixed' | 'construction' | 'electronic';
  disposalMethod: 'landfill' | 'incineration' | 'recycling' | 'composting' | 'anaerobic_digestion';
  unitDisposalCost: number;
  transportDistance: number;
  transportCostPerKm: number;
  laborCostPerHour: number;
  laborHoursPerTon: number;
  recyclingRevenuePerTon: number;
  penaltyRate: number;
  complianceScore: number;
  dataConfidence: number;
}

export const AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInputSchema = z.object({
  wasteVolume: z.number().min(0).max(100000).default(100),
  wasteType: z.enum(['organic', 'recyclable', 'hazardous', 'mixed', 'construction', 'electronic']).default('mixed'),
  disposalMethod: z.enum(['landfill', 'incineration', 'recycling', 'composting', 'anaerobic_digestion']).default('landfill'),
  unitDisposalCost: z.number().min(0).max(1000).default(50),
  transportDistance: z.number().min(0).max(1000).default(50),
  transportCostPerKm: z.number().min(0).max(10).default(2),
  laborCostPerHour: z.number().min(0).max(100).default(25),
  laborHoursPerTon: z.number().min(0).max(10).default(0.5),
  recyclingRevenuePerTon: z.number().min(0).max(500).default(0),
  penaltyRate: z.number().min(0).max(100).default(0),
  complianceScore: z.number().min(0).max(100).default(100),
  dataConfidence: z.number().min(0).max(100).default(80),
});

export interface AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorOutput {
  totalExposure: number;
  breakdown: {
    disposalCost: number;
    transportCost: number;
    laborCost: number;
    recyclingRevenue: number;
    penaltyCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.disposalCost = input.wasteVolume * input.unitDisposalCost;
  results.transportCost = input.wasteVolume * input.transportDistance * input.transportCostPerKm;
  results.laborCost = input.wasteVolume * input.laborHoursPerTon * input.laborCostPerHour;
  results.recyclingRevenue = input.disposalMethod == 'recycling' ? input.wasteVolume * input.recyclingRevenuePerTon : 0;
  results.penaltyCost = input.wasteVolume * input.unitDisposalCost * (input.penaltyRate / 100) * ((100 - input.complianceScore) / 100);
  results.totalExposure = results.disposalCost + results.transportCost + results.laborCost - results.recyclingRevenue + results.penaltyCost;
  results.variancePercent = abs((results.totalExposure - (results.disposalCost + results.transportCost + results.laborCost - results.recyclingRevenue)) / (results.disposalCost + results.transportCost + results.laborCost - results.recyclingRevenue)) * 100;
  results.summaryLevel = results.totalExposure > 100000 ? 'critical' : (results.totalExposure > 50000 ? 'warning' : 'normal');
  results.primaryDriver = max(results.disposalCost, results.transportCost, results.laborCost, results.penaltyCost) == results.disposalCost ? 'results.disposalCost' : (max(results.disposalCost, results.transportCost, results.laborCost, results.penaltyCost) == results.transportCost ? 'results.transportCost' : (max(results.disposalCost, results.transportCost, results.laborCost, results.penaltyCost) == results.laborCost ? 'results.laborCost' : 'results.penaltyCost'));
  results.decisionVerdict = results.totalExposure > 100000 ? 'RED' : (results.totalExposure > 50000 ? 'AMBER' : 'GREEN');
  results.dataConfidenceAdjusted = results.totalExposure * (input.dataConfidence / 100);
  return results;
}

export function calculateAtikYonetimiVeBertarafMaliyetOptimizasyonCalculator(input: AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorInput): AtikYonetimiVeBertarafMaliyetOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalExposure = results.totalExposure;
  const breakdown = {
    disposalCost: results.disposalCost,
    transportCost: results.transportCost,
    laborCost: results.laborCost,
    recyclingRevenue: results.recyclingRevenue,
    penaltyCost: results.penaltyCost,
  };

  // rule: wasteVolume >= 0
  // rule: unitDisposalCost >= 0
  // rule: transportDistance >= 0
  // rule: transportCostPerKm >= 0
  // rule: laborCostPerHour >= 0
  // rule: laborHoursPerTon >= 0
  // rule: recyclingRevenuePerTon >= 0
  // rule: penaltyRate between 0 and 100
  // rule: complianceScore between 0 and 100
  // rule: dataConfidence between 0 and 100
  // rule: if disposalMethod == 'recycling' then recyclingRevenuePerTon > 0 else recyclingRevenuePerTon == 0
  // rule: if wasteType == 'hazardous' then unitDisposalCost >= 100 (higher cost for hazardous)
  // rule: if complianceScore < 50 then penaltyRate > 0
  // threshold totalExposureCritical: totalExposure > 100000
  // threshold totalExposureWarning: totalExposure > 50000
  // threshold variancePercentCritical: variancePercent > 20
  // threshold variancePercentWarning: variancePercent > 10
  // threshold complianceScoreLow: complianceScore < 60
  const hiddenLossDrivers: string[] = ["penaltyCost > 0 ? 'Yüksek ceza maliyeti: uyum skorunu artırın' : null","variancePercent > 20 ? 'Yüksek varyans: veri güvenini kontrol edin' : null","complianceScore < 60 ? 'Düşük uyum skoru: düzenleyici risk' : null"];
  const suggestedActions: string[] = ["Atık hacmini azaltmak için kaynak azaltma stratejileri uygulayın","Daha düşük maliyetli bertaraf yöntemlerini değerlendirin (ör. geri dönüşüm)","Taşıma mesafesini optimize edin veya yerel tesisler kullanın","İşçilik verimliliğini artırın (eğitim, otomasyon)","Uyum skorunu iyileştirmek için çevre yönetim sistemine yatırım yapın"];
  const dataConfidenceAdjusted = results.totalExposure * (input.dataConfidence / 100);

  return {
    totalExposure,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV veri dışa aktarımı","Trend analizi (geçmiş verilerle karşılaştırma)","Senaryo karşılaştırma (farklı atık türleri/yöntemleri)","Detaylı maliyet kırılımı grafikleri","Özelleştirilebilir uyarı eşikleri"],
  };
}
