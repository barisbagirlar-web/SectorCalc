// Auto-generated from andon-sistemi-durus-ve-tepki-suresi-maliyet-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInput {
  annualOperatingHours: number;
  hourlyBurdenRate: number;
  andonResponseTime: number;
  andonDowntimePerEvent: number;
  andonEventsPerYear: number;
  productionLossPerEvent: number;
  unitProfitMargin: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInputSchema = z.object({
  annualOperatingHours: z.number().min(0).max(8760).default(2000),
  hourlyBurdenRate: z.number().min(0).max(1000).default(50),
  andonResponseTime: z.number().min(0).max(60).default(5),
  andonDowntimePerEvent: z.number().min(0).max(480).default(10),
  andonEventsPerYear: z.number().min(0).max(10000).default(100),
  productionLossPerEvent: z.number().min(0).max(10000).default(50),
  unitProfitMargin: z.number().min(0).max(1000).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorOutput {
  totalExposure: number;
  breakdown: {
    laborCost: number;
    lostProfit: number;
    totalDowntimeHours: number;
    totalResponseTimeHours: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalDowntimeHours = input.andonEventsPerYear * input.andonDowntimePerEvent / 60;
  results.totalResponseTimeHours = input.andonEventsPerYear * input.andonResponseTime / 60;
  results.laborCost = results.totalDowntimeHours * input.hourlyBurdenRate;
  results.lostProductionUnits = input.andonEventsPerYear * input.productionLossPerEvent;
  results.lostProfit = results.lostProductionUnits * input.unitProfitMargin;
  results.totalExposure = results.laborCost + results.lostProfit;
  results.variancePercent = ((results.totalExposure - (input.annualOperatingHours * input.hourlyBurdenRate * 0.05)) / (input.annualOperatingHours * input.hourlyBurdenRate * 0.05)) * 100;
  results.summaryLevel = results.totalExposure < 10000 ? 'low' : results.totalExposure < 50000 ? 'medium' : 'high';
  results.primaryDriver = results.laborCost > results.lostProfit ? 'results.laborCost' : 'results.lostProfit';
  results.decisionVerdict = results.summaryLevel === 'high' ? 'action required' : 'monitor';
  results.dataConfidenceAdjusted = input.dataConfidence === 'low' ? results.totalExposure * 1.2 : input.dataConfidence === 'medium' ? results.totalExposure * 1.1 : results.totalExposure;
  return results;
}

export function calculateAndonSistemiDurusVeTepkiSuresiMaliyetCalculator(input: AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorInput): AndonSistemiDurusVeTepkiSuresiMaliyetCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalExposure = results.totalExposure;
  const breakdown = {
    laborCost: results.laborCost,
    lostProfit: results.lostProfit,
    totalDowntimeHours: results.totalDowntimeHours,
    totalResponseTimeHours: results.totalResponseTimeHours,
  };

  // rule: annualOperatingHours > 0
  // rule: hourlyBurdenRate > 0
  // rule: andonResponseTime >= 0
  // rule: andonDowntimePerEvent >= 0
  // rule: andonEventsPerYear >= 0
  // rule: productionLossPerEvent >= 0
  // rule: unitProfitMargin >= 0
  // rule: andonResponseTime <= andonDowntimePerEvent (tepki süresi durma süresinden büyük olamaz)
  // threshold andonResponseTime: [object Object]
  // threshold andonDowntimePerEvent: [object Object]
  // threshold andonEventsPerYear: [object Object]
  const hiddenLossDrivers: string[] = ["andonResponseTime > 10 ? 'Yüksek tepki süresi' : ''","andonDowntimePerEvent > 30 ? 'Uzun duruş süresi' : ''","andonEventsPerYear > 1000 ? 'Sık andon olayı' : ''"];
  const suggestedActions: string[] = ["Tepki süresini azaltmak için andon eğitimi ve görsel yönetim uygulayın.","Duruş sürelerini kısaltmak için kök neden analizi yapın.","Andon olay sıklığını azaltmak için önleyici bakım planı oluşturun."];
  const dataConfidenceAdjusted = results.dataConfidenceAdjusted;

  return {
    totalExposure,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF raporu","CSV veri indirme","Trend analizi (zaman serisi)","Karşılaştırma (benchmark)","Detaylı maliyet kırılımı"],
  };
}
