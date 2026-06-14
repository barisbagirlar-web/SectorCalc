// Auto-generated from ambalaj-malzemesi-degisimi-ve-maliyet-etki-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInput {
  currentMaterialCost: number;
  newMaterialCost: number;
  annualUsage: number;
  changeoverCost: number;
  wasteRateCurrent: number;
  wasteRateNew: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInputSchema = z.object({
  currentMaterialCost: z.number().min(0).default(0),
  newMaterialCost: z.number().min(0).default(0),
  annualUsage: z.number().min(0).default(0),
  changeoverCost: z.number().min(0).default(0),
  wasteRateCurrent: z.number().min(0).max(100).default(2),
  wasteRateNew: z.number().min(0).max(100).default(2),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorOutput {
  totalExposure: number;
  breakdown: {
    currentAnnualCost: number;
    newAnnualCost: number;
    annualSavings: number;
    changeoverCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.currentAnnualCost = input.currentMaterialCost * input.annualUsage * (1 + input.wasteRateCurrent / 100);
  results.newAnnualCost = input.newMaterialCost * input.annualUsage * (1 + input.wasteRateNew / 100);
  results.annualSavings = results.currentAnnualCost - results.newAnnualCost;
  results.totalExposure = results.annualSavings - input.changeoverCost;
  results.variancePercent = ((results.newAnnualCost - results.currentAnnualCost) / results.currentAnnualCost) * 100;
  results.summaryLevel = results.totalExposure < 10000 ? 'low' : results.totalExposure < 50000 ? 'warning' : 'critical';
  results.primaryDriver = Math.abs(results.annualSavings) > Math.abs(input.changeoverCost) ? 'results.annualSavings' : 'input.changeoverCost';
  results.decisionVerdict = results.totalExposure > 0 ? 'positive' : results.totalExposure < 0 ? 'negative' : 'neutral';
  results.dataConfidenceAdjusted = input.dataConfidence === 'low' ? results.totalExposure * 0.8 : input.dataConfidence === 'high' ? results.totalExposure * 1.2 : results.totalExposure;
  return results;
}

export function calculateAmbalajMalzemesiDegisimiVeMaliyetEtkiCalculator(input: AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorInput): AmbalajMalzemesiDegisimiVeMaliyetEtkiCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalExposure = results.totalExposure;
  const breakdown = {
    currentAnnualCost: results.currentAnnualCost,
    newAnnualCost: results.newAnnualCost,
    annualSavings: results.annualSavings,
    changeoverCost: results.changeoverCost,
  };

  // rule: currentMaterialCost >= 0
  // rule: newMaterialCost >= 0
  // rule: annualUsage >= 0
  // rule: changeoverCost >= 0
  // rule: wasteRateCurrent between 0 and 100
  // rule: wasteRateNew between 0 and 100
  // rule: dataConfidence must be one of low, medium, high
  // threshold totalExposure: [object Object]
  const hiddenLossDrivers: string[] = ["wasteRateCurrent > 5 ? 'Yüksek mevcut fire oranı' : null","wasteRateNew > 5 ? 'Yeni malzeme fire oranı yüksek' : null","changeoverCost > annualSavings * 0.5 ? 'Geçiş maliyeti yıllık tasarrufa göre yüksek' : null"];
  const suggestedActions: string[] = ["totalExposure > 0 ? 'Malzeme değişimi önerilir' : 'Malzeme değişimi önerilmez'","wasteRateNew > wasteRateCurrent ? 'Yeni malzeme fire oranını düşürmek için iyileştirme yapın' : null"];
  const dataConfidenceAdjusted = results.dataConfidenceAdjusted;

  return {
    totalExposure,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario comparison","Detailed report with charts"],
  };
}
